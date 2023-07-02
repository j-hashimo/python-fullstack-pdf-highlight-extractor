import { Routes, Route, Link } from "react-router-dom";
import React from 'react';
import HomePage from './components/HomePage';
import UploadComponent from './components/UploadComponent';
import HighlightViewComponent from './components/HighlightViewComponent';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/upload" element={<UploadComponent/>} />
      <Route path="/view" element={<HighlightViewComponent/>} />
    </Routes>
  );
}

export default App;
