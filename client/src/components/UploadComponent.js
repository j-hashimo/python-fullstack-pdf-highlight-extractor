import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    let navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const auth = getAuth(); // Get the authentication instance
        const user = auth.currentUser;

        if (user) {
            user.getIdToken().then(async (idToken) => {
                // Got the ID token, now send it along with the form data
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await axios.post('http://localhost:8000/pdf/upload/', formData, {
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                        },
                    });
                    const data = await response.data;
                    const pdfName = file.name; // Get the name of the file being uploaded
                    navigate('/view', { state: { highlights: data.highlights, pdfTitle: pdfName } }); // Pass the PDF name here
                } catch (error) {
                    console.error('Error uploading file:', error);
                    // Handle errors here, such as by displaying a notification to the user
                }
            });
        } else {
            // If the user is not logged in, handle accordingly
            console.log('User is not logged in.');
            // Redirect to login or show an error
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h2 className="text-2xl mb-4">Upload a PDF</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-2 text-white" type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white" type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadForm;