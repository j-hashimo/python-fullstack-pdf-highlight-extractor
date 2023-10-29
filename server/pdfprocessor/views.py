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

import os
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


@csrf_exempt
def upload_pdf(request):
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

        formatted_now = datetime.datetime.now().strftime(
            '%Y-%m-%d')  # changed date format
        blob = bucket.blob(f"{pdf_file.name}_{formatted_now}.pdf")

        # Go back to the beginning of the in-memory file
        pdf_file.seek(0)

        blob.upload_from_file(pdf_file, content_type=pdf_file.content_type)
        print(blob.public_url)

        return JsonResponse({'highlights': highlights})

    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_highlights(request, pdf_id):  # Renamed the function
    # This function should be updated to fetch PDFs from Firebase
    pass


def get_all_pdfs(request):
    bucket = storage.bucket()
    blobs = bucket.list_blobs()

    pdfs = []
    for blob in blobs:
        if '_' in blob.name:
            name, date = blob.name.rsplit('_', 1)
            formatted_date = date.rstrip('.pdf')
            # Check if the formatted_date is actually in '%Y-%m-%d' format
            try:
                parsed_date = datetime.datetime.strptime(
                    formatted_date, '%Y-%m-%d')
                date = parsed_date.strftime('%B %d, %Y')
            except ValueError:
                # If the date isn't in the expected format, handle accordingly
                date = "Date not available"
        else:
            name = blob.name
            date = "Date not available"

        pdfs.append({
            "name": name,
            "date": date,
            "original_name": blob.name,
            "url": blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET')
        })

    return JsonResponse({"pdfs": pdfs})


@csrf_exempt
def delete_pdf(request, pdf_name):
    if request.method == 'DELETE':
        bucket = storage.bucket()
        pdf_name = unquote(pdf_name)
        blob = bucket.blob(pdf_name)
        if blob.exists():
            blob.delete()
            return JsonResponse({"message": f"'{pdf_name}' successfully deleted"})
        else:
            return JsonResponse({"error": f"No such PDF '{pdf_name}' found"}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def delete_highlight(request, highlight_name):
    if request.method == 'DELETE':
        bucket = storage.bucket()
        highlight_name = unquote(highlight_name)
        blob = bucket.blob(highlight_name)
        if blob.exists():
            blob.delete()
            return JsonResponse({"message": f"'{highlight_name}' successfully deleted"})
        else:
            return JsonResponse({"error": f"No such highlight '{highlight_name}' found"}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def upload_pdf_for_images(request):
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

        # Extract images from the PDF and save them into a list
        with fitz.open(tmp.name) as doc:  # Using a context manager here
            images = []
            for page_num, page in enumerate(doc):
                image_list = page.get_images(full=True)
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]

                    # Convert image bytes to an Image object (from PIL)
                    image = Image.open(io.BytesIO(image_bytes))
                    images.append(image)

        # Validate if there are images inside the PDF
        if not images:
            os.unlink(tmp.name)  # Ensure the temporary file is deleted
            return JsonResponse({'error': 'No images found in the provided PDF.'}, status=400)

        # Combine all images into a single PDF
        combined_pdf_name = f"{pdf_file.name}_combined_images.pdf"
        with io.BytesIO() as output:
            images[0].save(output, format="PDF", save_all=True,
                           append_images=images[1:])
            combined_pdf_blob = bucket.blob(combined_pdf_name)
            combined_pdf_blob.upload_from_string(
                output.getvalue(), content_type='application/pdf')

        os.unlink(tmp.name)  # Ensure the temporary file is deleted

        return JsonResponse({
            'pdf_name': pdf_file.name,
            'combined_pdf_url': combined_pdf_blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET')
        })

    return JsonResponse({'error': 'Invalid method'}, status=405)
