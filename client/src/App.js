import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import HomePage from './components/HomePage';
import UploadComponent from './components/UploadComponent';
import HighlightViewComponent from './components/HighlightViewComponent';
import PDFList from './components/PdfView';

import UploadForImages from './components/UploadForImages';
import { ToastProvider } from 'react-toast-notifications';
import DownloadHighlights from './components/DownloadHighlights';
import { useState, useEffect } from 'react';
import { auth } from './components/firebase';

import FirebaseUIAuth from './components/FirebaseUIAuth';
import { onAuthStateChanged } from 'firebase/auth';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);
  return (


    <ToastProvider>
      <Routes>
        <Route path="/login" element={<FirebaseUIAuth />} />
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        
        
        <Route path="/upload" element={<UploadComponent />} />
        <Route path="/view" element={<HighlightViewComponent />} />
        <Route path="/pdfview" element={<PDFList />} />
        <Route path="/upload_for_images" element={<UploadForImages />} />
        <Route path="/download/:token" element={<DownloadHighlights />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
