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



function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        
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
