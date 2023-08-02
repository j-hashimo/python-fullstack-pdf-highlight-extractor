from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .utils import extract_highlights
from .firebase_init import bucket
import datetime
import os
import tempfile
from firebase_admin import storage
from urllib.parse import unquote
from django.contrib.auth.models import User
import json


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

        # new code: save highlights to txt and upload to Firebase
        highlights_file_name = f"{pdf_file.name}_{formatted_now}_highlights.txt"
        highlights_blob = bucket.blob(highlights_file_name)
        highlights_blob.upload_from_string('\n'.join(highlights))

        # added 'pdf_name': pdf_file.name to the JsonResponse
        return JsonResponse({
            'highlights': highlights,
            'pdf_name': pdf_file.name,
            'pdf_url': blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'),
            'highlights_file_name': highlights_file_name,
            'highlights_url': highlights_blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET')
        })

    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_highlights(request, pdf_id):  # Renamed the function
    # This function should be updated to fetch PDFs from Firebase
    pass


def get_all_pdfs(request):
    bucket = storage.bucket()
    blobs = bucket.list_blobs()

    pdfs = []
    highlights = []
    for blob in blobs:
        file_name, file_extension = os.path.splitext(blob.name)
        if file_extension == '.pdf':
            if '_' in file_name:
                name, date = file_name.rsplit('_', 1)
                date = date.rstrip('.pdf')
                date = datetime.datetime.strptime(
                    date, '%Y-%m-%d').strftime('%B %d, %Y')
            else:
                name = file_name
                date = "Date not available"
            pdfs.append({
                "name": name,
                "date": date,
                "url": blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'),
                "original_name": blob.name,
            })
        elif file_extension == '.txt':
            highlights.append({
                "highlights_file_name": blob.name,
                "highlights_url": blob.generate_signed_url(datetime.timedelta(seconds=300), method='GET'),
                # strip the _highlights.txt part from the name
                "pdf_name": blob.name.replace("_highlights.txt", ""),
            })

    return JsonResponse({"pdfs": pdfs, "highlights": highlights})


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
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'message': 'User already exists'}, status=400)

        User.objects.create_user(username=username, password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)

    return JsonResponse({'error': 'Invalid method'}, status=405)
