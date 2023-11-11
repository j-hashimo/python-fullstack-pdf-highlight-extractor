import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth'; // Import getAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function UploadForImages() {
    const [file, setFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const auth = getAuth(); // Get the authentication instance
    const [imagesUploaded, setImagesUploaded] = useState(false); // New state to track if images have been uploaded
    const navigate = useNavigate(); // Hook for navigation
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        const user = auth.currentUser;

        if (user) {
            const idToken = await user.getIdToken(true); // Get the ID token

            try {
                const response = await axios.post("http://localhost:8000/pdf/upload_for_images/", formData, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`, // Include the token in the Authorization header
                    }
                });
                setPdfUrl(response.data.combined_pdf_url);
            } catch (error) {
                console.error("Error uploading file:", error);
                // You may want to handle errors differently here
            }
        } else {
            console.error("User not authenticated");
            // Redirect to login or handle accordingly
        }
        // After successfully uploading the images, set imagesUploaded to true
        setImagesUploaded(true);
    };

    const goToImagesList = () => {
        navigate('/images'); // This should be the URL path you set for ImagesList in App.js
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
            {imagesUploaded && // Show this button only after images have been uploaded
                <button
                    className="mt-4 bg-purple-500 hover:bg-purple-600 p-2 rounded-lg w-48 text-center"
                    onClick={goToImagesList}
                >
                    View Uploaded Images
                </button>
            }
        </div>
    );
}

export default UploadForImages;