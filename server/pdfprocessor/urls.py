from django.urls import path
# make sure you have get_all_pdfs in your views
from .views import upload_pdf, get_highlights, get_all_pdfs
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload/', upload_pdf, name='upload-pdf'),
    path('highlights/<int:pdf_id>/', get_highlights, name='get-highlights'),
    path('all/', get_all_pdfs, name='get_all_pdfs'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
