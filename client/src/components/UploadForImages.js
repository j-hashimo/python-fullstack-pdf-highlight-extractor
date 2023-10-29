import React, { useState } from 'react';
import axios from 'axios';

function UploadForImages() {
    const [file, setFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post("http://localhost:8000/pdf/upload_for_images/", formData);
            setPdfUrl(response.data.combined_pdf_url);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="w-96 p-6 rounded-lg bg-gray-800 shadow-xl">
                <div className="flex flex-col items-center">
                    <label className="mb-4 text-lg">Upload a PDF:</label>
                    <input className="mb-4 p-2 rounded-lg" type="file" onChange={onFileChange} />
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg w-48 text-center" 
                        onClick={onUpload}
                    >
                        Upload and Extract Images
                    </button>
                    {pdfUrl && 
                        <a 
                            className="mt-4 block bg-green-500 hover:bg-green-600 p-2 rounded-lg w-48 text-center" 
                            href={pdfUrl} 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            Download Combined PDF
                        </a>
                    }
                </div>
            </div>
        </div>
    );
}

export default UploadForImages;