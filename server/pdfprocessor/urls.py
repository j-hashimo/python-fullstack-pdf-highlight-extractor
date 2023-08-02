from django.urls import path
from .views import upload_pdf, get_highlights, get_all_pdfs, delete_pdf, delete_highlight, register, login
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('upload/', upload_pdf, name='upload-pdf'),
    path('highlights/<int:pdf_id>/', get_highlights, name='get-highlights'),
    path('all/', get_all_pdfs, name='get_all_pdfs'),
    path('delete/<str:pdf_name>/', delete_pdf, name='delete-pdf'),
    path('delete_highlight/<str:highlight_name>/',
         delete_highlight, name='delete-highlight'),
    path('register/', register, name="register"),
    path('login/', login, name='login'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
