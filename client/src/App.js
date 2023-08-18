import { Routes, Route} from "react-router-dom";
import React from 'react';
import HomePage from './components/HomePage';
import UploadComponent from './components/UploadComponent';
import HighlightViewComponent from './components/HighlightViewComponent';
import PDFList from './components/PdfView';
import Register from './components/Register';
import Login from './components/Login';
import UploadForImages from './components/UploadForImages';
import { ToastProvider } from 'react-toast-notifications';
import DownloadHighlights from './components/DownloadHighlights';
function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/upload" element={<UploadComponent/>} />
        <Route path="/view" element={<HighlightViewComponent/>} />
        <Route path="/pdfview" element={<PDFList/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/upload_for_images" element={<UploadForImages/>} />
      </Routes>
    </ToastProvider>
    
  );
}

export default App;