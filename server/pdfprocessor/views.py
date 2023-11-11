import logging
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .utils import extract_highlights, extract_images_from_pdf
from .firebase_init import bucket
import datetime
import os
import tempfile
from firebase_admin import storage
from urllib.parse import unquote
from django.contrib.auth.models import User
import json
from datetime import timedelta
from dotenv import load_dotenv
from django.http import JsonResponse
from django.utils.datastructures import MultiValueDictKeyError
import datetime
import tempfile
import fitz  # PyMuPDF

from PIL import Image
import io

from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)

from .firebase_utils import verify_firebase_token
from google.cloud.storage import Blob



@csrf_exempt
def upload_pdf(request):
    # Get the ID token from the request header
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header:
        # Split the header into 'Bearer' and the token
        parts = auth_header.split()
        if parts[0].lower() != 'bearer':
            return JsonResponse({'error': 'Authorization header must start with Bearer'}, status=401)
        elif len(parts) == 1:
            return JsonResponse({'error': 'Token not found'}, status=401)
        elif len(parts) > 2:
            return JsonResponse({'error': 'Authorization header must be Bearer token'}, status=401)

        id_token = parts[1]
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    try:
        # Verify the token
        decoded_token = verify_firebase_token(id_token)
        if not decoded_token:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        # Correctly using the decoded token to get the user ID
        user_id = decoded_token['uid']
    except Exception as e:
        # Handle any other exceptions
        return JsonResponse({'error': f'Error verifying Firebase token: {str(e)}'}, status=401)

    if request.method == 'POST':
        try:
            pdf_file = request.FILES['file']
        except MultiValueDictKeyError:
            return JsonResponse({'error': 'No file included in request'}, status=400)

        # Temporary save input file to disk to perform pdf extraction
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            for chunk in pdf_file.chunks():
                tmp.write(chunk)
            tmp.flush()
            os.fsync(tmp.fileno())  # Ensure file is written to disk

        # This calls the function from utils.py
        highlights = extract_highlights(tmp.name)

        os.unlink(tmp.name)  # Ensure the temporary file is deleted

        formatted_now = datetime.datetime.now().strftime('%Y-%m-%d')
        blob = bucket.blob(f"{user_id}/{pdf_file.name}_{formatted_now}.pdf")

        # Go back to the beginning of the in-memory file
        pdf_file.seek(0)

        blob.upload_from_file(pdf_file, content_type=pdf_file.content_type)
        print(blob.public_url)

        return JsonResponse({'highlights': highlights})

    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_highlights(request, pdf_id):  # Renamed the function
    # This function should be updated to fetch PDFs from Firebase
    # Get the ID token from the request header
    id_token = request.headers.get('Authorization')
    if not id_token or not verify_firebase_token(id_token):
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    pass


def get_all_pdfs(request):
    # Get the ID token from the request header
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header:
        # Split the header into 'Bearer' and the token
        parts = auth_header.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return JsonResponse({'error': 'Invalid Authorization header format'}, status=401)
        id_token = parts[1]
    else:
        return JsonResponse({'error': 'No Authorization header'}, status=401)

    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    user_id = user_info['uid']
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=f"{user_id}/")

    pdfs = []
    for blob in blobs:
        # Add a condition to skip non-PDF files
        if not blob.name.endswith('.pdf'):
            continue
        # Extract the filename without the user_id from the blob's name
        _, filename = blob.name.rsplit('/', 1)
        if '_' in filename:
            name, date = filename.rsplit('_', 1)
            formatted_date = date.rstrip('.pdf')
            try:
                parsed_date = datetime.datetime.strptime(formatted_date, '%Y-%m-%d')
                date = parsed_date.strftime('%B %d, %Y')
            except ValueError:
                date = "Date not available"
        else:
            name = filename
            date = "Date not available"

        # Append only the filename to the pdfs list, without the user_id
        pdfs.append({
            "name": name,
            "date": date,
            "original_name": filename,  # This now has only the filename without the user_id
            "url": blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET')
        })

    return JsonResponse({"pdfs": pdfs})





@csrf_exempt
def delete_pdf(request, pdf_name):
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'OK'})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response
    
    # Handle DELETE requests
    if request.method == 'DELETE':
        # Extract the ID token from the Authorization header
        id_token = request.headers.get('Authorization')
        if not id_token or not id_token.startswith('Bearer '):
            
            return JsonResponse({'error': 'Unauthorized - No token provided'}, status=401)

        _, id_token = id_token.split(' ', 1)
        user_info = verify_firebase_token(id_token)
        if not user_info:
            
            return JsonResponse({'error': 'Unauthorized - Token invalid'}, status=401)

        user_id = user_info['uid']
        pdf_name = unquote(pdf_name)

        # Construct the full blob path including the user ID
        blob_path = f"{user_id}/{pdf_name}"
        

        # Ensure the blob path includes the user ID
        bucket = storage.bucket()
        blob = bucket.blob(blob_path)
        if blob.exists():
            blob.delete()
            
            return JsonResponse({"message": f"'{pdf_name}' successfully deleted"})
        else:
            
            return JsonResponse({"error": f"No such PDF '{pdf_name}' found"}, status=404)

    # If the method is not DELETE or OPTIONS
    
    return JsonResponse({'error': 'Invalid method'}, status=405)



def get_all_highlights(request):
    # Authentication check
    id_token = request.headers.get('Authorization')
    if not id_token or not id_token.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    _, id_token = id_token.split(' ', 1)
    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    user_id = user_info['uid']
    bucket = storage.bucket()
    # Only list blobs that represent highlight files
    blobs = bucket.list_blobs(prefix=f"{user_id}/highlights/")

    highlight_files = []
    for blob in blobs:
        # Assuming the highlight files are stored with a .txt extension
        if blob.name.endswith('.txt'):
            # Get just the file name, not the full path
            _, highlight_name = blob.name.rsplit('/', 1)
            highlight_files.append({
                'name': highlight_name,
                'url': blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET')
            })

    return JsonResponse({'highlights': highlight_files})


@csrf_exempt
def delete_highlight(request, highlight_name):
    # Authentication check
    id_token = request.headers.get('Authorization')
    if not id_token or not id_token.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    _, id_token = id_token.split(' ', 1)
    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    user_id = user_info['uid']
    highlight_name = unquote(highlight_name)
    bucket = storage.bucket()
    blob = bucket.blob(f"{user_id}/highlights/{highlight_name}")

    if request.method == 'DELETE':
        if blob.exists():
            blob.delete()
            return JsonResponse({"message": f"'{highlight_name}' successfully deleted"})
        else:
            return JsonResponse({"error": f"No such highlight file '{highlight_name}' found"}, status=404)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def upload_highlights(request):
    # Authentication check
    id_token = request.headers.get('Authorization')
    if not id_token or not id_token.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized - No token provided'}, status=401)

    _, id_token = id_token.split(' ', 1)
    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Unauthorized - Token invalid'}, status=401)

    user_id = user_info['uid']

    if request.method == 'POST':
        try:
            # Get the uploaded text file and the title
            text_file = request.FILES.get('file')
            title = request.POST.get('title', 'highlights')  # Fallback to 'highlights' if title is not provided
            

            if not text_file:
                return JsonResponse({'error': 'No file provided'}, status=400)
            
            # Use the title in the file path
            file_path = f"{user_id}/highlights/{title}.txt"
            bucket = storage.bucket()
            blob = bucket.blob(file_path)
            blob.upload_from_file(text_file, content_type='text/plain')

            # Respond with the URL to access the uploaded file
            return JsonResponse({
                'message': 'Highlight file uploaded successfully',
                'url': blob.public_url
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def get_user_images(request):
    auth_header = request.headers.get('Authorization')
    print(f"Auth Header: {auth_header}")  # Log the header to debug
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized - Token missing or invalid'}, status=401)

    id_token = auth_header.split('Bearer ')[1]
    print(f"ID Token: {id_token}")  # Log the token to debug
    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    user_id = user_info['uid']
    bucket = storage.bucket()

    prefix = f"{user_id}/"
    blobs = bucket.list_blobs(prefix=prefix)
    images = []

    try:
        for blob in blobs:
            if isinstance(blob, Blob) and '_combined_images.pdf' in blob.name:
                signed_url = blob.generate_signed_url(
                    # This URL will be valid for 1 day
                    expiration=timedelta(days=1),
                    # Assuming you want to allow GET requests
                    method='GET'
                )
                images.append({
                    'name': blob.name[len(prefix):],
                    'url': signed_url
                })
            else:
                print(f"Ignored file: {blob.name}")
    except Exception as e:
        print(f"Error fetching images: {e}")
        return JsonResponse({'error': str(e)}, status=500)

    print(f"Images fetched: {images}")
    return JsonResponse({'images': images})


@csrf_exempt
def delete_user_image(request, image_name):
    id_token = request.headers.get('Authorization')
    if not id_token or not id_token.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized - No token provided'}, status=401)

    # Split the header into 'Bearer' and the token
    _, id_token = id_token.split(' ', 1)
    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Unauthorized - Token invalid'}, status=401)

    user_id = user_info['uid']
    bucket = storage.bucket()
    blob_path = f"{user_id}/{image_name}"
    blob = bucket.blob(blob_path)

    if blob.exists():
        blob.delete()
        return JsonResponse({"message": f"Image '{image_name}' deleted successfully"})
    else:
        return JsonResponse({"error": f"Image '{image_name}' not found"}, status=404)

@csrf_exempt
def upload_pdf_for_images(request):
    # Get the ID token from the request header
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Unauthorized - Token missing or invalid'}, status=401)

    # Extract the ID token and verify it
    id_token = auth_header.split('Bearer ')[1]
    user_info = verify_firebase_token(id_token)
    if not user_info:
        return JsonResponse({'error': 'Invalid token - Verification failed'}, status=401)
    
    user_id = user_info['uid']

    if request.method == 'POST':
        try:
            pdf_file = request.FILES.get('file')
            if not pdf_file:
                return JsonResponse({'error': 'No file provided'}, status=400)

            # Save the uploaded PDF to a temporary file
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                for chunk in pdf_file.chunks():
                    tmp.write(chunk)
                tmp.flush()

                # Extract images and combine them into a single PDF
                doc = fitz.open(tmp.name)
                images = []
                for page_num, page in enumerate(doc):
                    image_list = page.get_images(full=True)
                    for img_index, img in enumerate(image_list):
                        xref = img[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        image = Image.open(io.BytesIO(image_bytes))
                        images.append(image)

                # Combine images into a single PDF
                combined_pdf_bytes = io.BytesIO()
                images[0].save(combined_pdf_bytes, format="PDF", save_all=True, append_images=images[1:])
                combined_pdf_bytes.seek(0)  # Move to the start of the StringIO buffer
                combined_pdf_name = f"{user_id}/{pdf_file.name}_combined_images.pdf"
                bucket = storage.bucket()
                blob = bucket.blob(combined_pdf_name)
                blob.upload_from_file(combined_pdf_bytes, content_type='application/pdf')

                doc.close()  # Make sure to close the document

            return JsonResponse({
                'combined_pdf_url': blob.generate_signed_url(timedelta(seconds=300), method='GET')
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        finally:
            # Cleanup the temporary file
            if 'tmp' in locals() and os.path.exists(tmp.name):  # Check if tmp is defined and file exists
                os.unlink(tmp.name)  # Delete the temp file

    return JsonResponse({'error': 'Invalid method'}, status=405)