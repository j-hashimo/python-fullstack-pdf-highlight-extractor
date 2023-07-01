from django.urls import path
from .views import upload_pdf, get_highlights  # updated here

urlpatterns = [
    path('upload/', upload_pdf, name='upload-pdf'),
    path('highlights/<int:pdf_id>/', get_highlights,
         name='get-highlights')  # updated here
]
