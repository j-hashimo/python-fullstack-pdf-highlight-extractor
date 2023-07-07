from django.urls import path
from .views import upload_pdf, get_highlights, get_all_pdfs, delete_pdf
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload/', upload_pdf, name='upload-pdf'),
    path('highlights/<int:pdf_id>/', get_highlights, name='get-highlights'),
    path('all/', get_all_pdfs, name='get_all_pdfs'),
    path('delete/<str:pdf_name>/', delete_pdf, name='delete-pdf'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
