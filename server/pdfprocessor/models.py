from django.db import models


class PDF(models.Model):
    file = models.FileField(upload_to='pdfs/')
    highlights = models.JSONField(default=list, blank=True)


# this class is used instead of PostgreSQL if you want to store the uploaded pdfs in the local machine
# class PDFDocument(models.Model):
#     uploaded_at = models.DateTimeField(auto_now_add=True)
#     file = models.FileField(upload_to='documents/')
