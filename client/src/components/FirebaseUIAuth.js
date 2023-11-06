// FirebaseUIAuth.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import * as firebaseui from 'firebaseui'; // Use * as to import all exports under the firebaseui namespace
import { getAuth, EmailAuthProvider } from 'firebase/auth';
import { app } from './firebase'; // Make sure this import path is correct

const FirebaseUIAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const uiConfig = {
      signInSuccessUrl: '/', // This will be used if signInSuccessWithAuthResult is not defined or does not return false
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          navigate('/');
          // Return false to prevent the redirect set in signInSuccessUrl
          return false;
        },
      },
    };

    const auth = getAuth(app); // Use the imported 'app'
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);
  }, [navigate]);

  return <div id="firebaseui-auth-container" />;
};

export default FirebaseUIAuth;
