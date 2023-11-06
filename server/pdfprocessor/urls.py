from django.urls import path
from .views import upload_pdf, get_highlights, get_all_pdfs, delete_pdf, delete_highlight, upload_pdf_for_images, get_all_highlights, upload_highlights
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('upload/', upload_pdf, name='upload-pdf'),
    path('highlights/<int:pdf_id>/', get_highlights, name='get-highlights'),
    path('all/', get_all_pdfs, name='get_all_pdfs'),
    path('delete/<path:pdf_name>/', delete_pdf, name='delete-pdf'),  # Change 'str' to 'path'
    path('delete_highlight/<str:highlight_name>/',
         delete_highlight, name='delete-highlight'),
    path('upload_for_images/', upload_pdf_for_images,
         name='upload_pdf_for_images'),
    path('highlights/all/', get_all_highlights, name='get-all-highlights'),
    path('highlights/delete/<str:highlight_name>/', delete_highlight, name='delete-highlight'),
    path('highlights/upload/', upload_highlights, name='upload-highlights'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
