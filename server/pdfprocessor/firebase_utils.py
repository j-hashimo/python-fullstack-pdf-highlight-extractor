# firebase_utils.py
import firebase_admin
from firebase_admin import credentials, auth
import os

# Load environment variables
FIREBASE_PRIVATE_KEY_PATH = os.getenv('FIREBASE_PRIVATE_KEY_PATH')

# Initialize Firebase Admin SDK (only once)
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_PRIVATE_KEY_PATH)
    firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        # Log the error or handle it as per your requirement
        print(f"Error verifying Firebase token: {e}")
        return None
