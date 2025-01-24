Extractify PDF: Smart PDF Analysis Platform 📄✨
Extractify PDF is a full-stack web platform designed to simplify PDF analysis and data extraction. Built using Django and React, the application allows users to upload PDFs and extract key highlights and embedded images effortlessly, significantly reducing manual processing time.

Features 🚀
Upload & Analyze PDFs: Seamlessly upload PDF files and analyze their content in seconds.
Extract Highlights: Identify and extract key text highlights, enabling quick access to important information.
Embedded Image Extraction: Automatically detect and extract embedded images from PDFs.

Tech Stack 🛠️
Frontend: React.js
Backend: Django
Database: Firebase (Firestore)
Other Tools:
PyPDF2 and PDFPlumber for PDF processing
Axios for API communication


Getting Started 🚀
Follow these steps to set up Extractify PDF locally:

Prerequisites
Make sure you have the following installed:

Python (>= 3.8)
Node.js
Git
Firebase CLI
Installation


First start up the server by cd to the server folder and run: python manage.py runserver

Then start up the client by cd to the client folder and run: npm run start

Highlight limitations:
- if there are containers that have text, that text may not be highlighted
- if there are various fonts, the text may not be highlighted



