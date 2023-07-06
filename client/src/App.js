import { Routes, Route, Link } from "react-router-dom";
import React from 'react';
import HomePage from './components/HomePage';
import UploadComponent from './components/UploadComponent';
import HighlightViewComponent from './components/HighlightViewComponent';
import PDFList from './components/PdfView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/upload" element={<UploadComponent/>} />
      <Route path="/view" element={<HighlightViewComponent/>} />
      <Route path="/pdfview" element={<PDFList/>} />
    </Routes>
  );
}

export default App;
