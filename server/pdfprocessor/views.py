from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PDF
from .utils import extract_highlights
from django.utils.datastructures import MultiValueDictKeyError


@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST':
        try:
            pdf_file = request.FILES['file']
        except MultiValueDictKeyError:
            return JsonResponse({'error': 'No file included in request'}, status=400)

        pdf = PDF.objects.create(file=pdf_file)

        # This calls the function from utils.py
        highlights = extract_highlights(pdf.file.path)

        pdf.highlights = highlights
        pdf.save()
        print(PDF.objects.get(id=pdf.id).highlights)

        return JsonResponse({'id': pdf.id, 'highlights': highlights})

    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_highlights(request, pdf_id):  # Renamed the function
    pdf = PDF.objects.get(pk=pdf_id)
    # This calls the function from utils.py
    highlights = extract_highlights(pdf.file.path)
    return JsonResponse({'highlights': highlights})
