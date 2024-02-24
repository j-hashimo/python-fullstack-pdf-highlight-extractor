import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const HighlightViewComponent = () => {
    const location = useLocation();
    const { highlights, pdfTitle } = location.state; // Destructure pdfTitle from state
    const auth = getAuth();
    console.log("PDF Title: ", pdfTitle); // Add this line to check the value of pdfTitle
    const saveHighlightsToFile = async () => {
        const title = pdfTitle || 'default_title'; // Provide a default value if pdfTitle is not set
        // Convert highlights to a string with a double newline character for separation
        const highlightsText = highlights.join('\n\n');
        
        // Convert text to a Blob
        const blob = new Blob([highlightsText], { type: 'text/plain' });
    
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('title', title); // Use the title variable
    
        try {
            const idToken = await auth.currentUser.getIdToken(true);
            const response = await axios.post('http://localhost:8000/pdf/highlights/upload/', formData, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Handle the response from the server
            console.log(response.data);
            alert('Highlights saved successfully!');
        } catch (error) {
            console.error("Error saving highlights: ", error);
            alert('Failed to save highlights.');
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h2 className="text-2xl mb-4">Extracted Highlights</h2>
            <div>
                {highlights.map((highlight, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                        {highlight}
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button onClick={saveHighlightsToFile} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                    Save Highlights
                </button>
                <Link to="/pdfview" className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                    View and Download PDFs
                </Link>
            </div>
        </div>
    );
};

export default HighlightViewComponent;
