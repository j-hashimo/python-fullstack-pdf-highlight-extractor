from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError
from .utils import extract_highlights
from .firebase_init import bucket
import datetime
import os
import tempfile
from firebase_admin import storage
from urllib.parse import unquote


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
            date = datetime.datetime.strptime(
                formatted_date, '%Y-%m-%d').strftime('%B %d, %Y')
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
