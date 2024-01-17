First start up the server by cd to the server folder and run: python manage.py runserver

Then start up the client by cd to the client folder and run: npm run start

```
```
python-fullstack-pdf-highlight-extractor
├─ client
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ App.js
│  │  ├─ App.test.js
│  │  ├─ Auth.js
│  │  ├─ components
│  │  │  ├─ DownloadHighlights.js
│  │  │  ├─ firebase.js
│  │  │  ├─ HighlightViewComponent.js
│  │  │  ├─ HomePage.js
│  │  │  ├─ PdfView.js
│  │  │  ├─ UploadComponent.js
│  │  │  └─ UploadForImages.js
│  │  ├─ index.css
│  │  └─ index.js
│  └─ tailwind.config.js
├─ README.md
└─ server
   ├─ .env
   ├─ db.sqlite3
   ├─ debug.log
   ├─ manage.py
   ├─ pdf-extractor-firebase-key.json
   ├─ pdfprocessor
   │  ├─ admin.py
   │  ├─ apps.py
   │  ├─ firebase_init.py
   │  ├─ migrations
   │  │  ├─ 0001_initial.py
   │  │  ├─ 0002_pdf_delete_pdfdocument.py
   │  │  ├─ 0003_pdf_user_userprofile.py
   │  │  ├─ 0004_alter_pdf_user_alter_userprofile_user.py
   │  │  ├─ __init__.py
   │  │  └─ __pycache__
   │  │     ├─ 0001_initial.cpython-310.pyc
   │  │     ├─ 0002_pdf_delete_pdfdocument.cpython-310.pyc
   │  │     ├─ 0003_pdf_user_userprofile.cpython-310.pyc
   │  │     ├─ 0003_pdf_user_userprofile_highlight.cpython-310.pyc
   │  │     ├─ 0004_alter_pdf_user_alter_userprofile_user.cpython-310.pyc
   │  │     └─ __init__.cpython-310.pyc
   │  ├─ models.py
   │  ├─ tests.py
   │  ├─ urls.py
   │  ├─ utils.py
   │  ├─ views.py
   │  ├─ __init__.py
   │  └─ __pycache__
   │     ├─ admin.cpython-310.pyc
   │     ├─ apps.cpython-310.pyc
   │     ├─ decorators.cpython-310.pyc
   │     ├─ firebase_init.cpython-310.pyc
   │     ├─ firebase_middleware.cpython-310.pyc
   │     ├─ firebase_utils.cpython-310.pyc
   │     ├─ models.cpython-310.pyc
   │     ├─ urls.cpython-310.pyc
   │     ├─ utils.cpython-310.pyc
   │     ├─ views.cpython-310.pyc
   │     └─ __init__.cpython-310.pyc
   └─ pdf_highlight_extractor
      ├─ asgi.py
      ├─ settings.py
      ├─ urls.py
      ├─ wsgi.py
      ├─ __init__.py
      └─ __pycache__
         ├─ firebase_setup.cpython-310.pyc
         ├─ settings.cpython-310.pyc
         ├─ urls.cpython-310.pyc
         ├─ wsgi.cpython-310.pyc
         └─ __init__.cpython-310.pyc

```