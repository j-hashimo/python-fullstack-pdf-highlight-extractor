from firebase_admin import credentials, initialize_app, storage
import os
from decouple import config

# Get the path to the Firebase private key json from .env
FIREBASE_PRIVATE_KEY_PATH = config('FIREBASE_PRIVATE_KEY_PATH')

# Initialize Firebase
cred = credentials.Certificate(FIREBASE_PRIVATE_KEY_PATH)
firebase_app = initialize_app(cred, {
    'storageBucket': config('FIREBASE_BUCKET_URL'),
})

# Get a reference to the storage service
bucket = storage.bucket(app=firebase_app)
