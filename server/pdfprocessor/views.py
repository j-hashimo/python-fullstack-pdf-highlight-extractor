from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PDFDocument
from .utils import extract_highlights


@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST':
        try:
            pdf_file = request.FILES['file']
        except MultiValueDictKeyError:
            return JsonResponse({'error': 'No file included in request'}, status=400)

        document = PDFDocument.objects.create(file=pdf_file)

        # This calls the function from utils.py
        highlights = extract_highlights(document.file.path)

        document.highlights = highlights
        document.save()

        return JsonResponse({'id': document.id, 'highlights': highlights})

    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_highlights(request, pdf_id):  # Renamed the function
    document = PDFDocument.objects.get(pk=pdf_id)
    # This calls the function from utils.py
    highlights = extract_highlights(document.file.path)
    return JsonResponse({'highlights': highlights})
