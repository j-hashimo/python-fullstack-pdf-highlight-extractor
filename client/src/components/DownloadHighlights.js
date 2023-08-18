import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DownloadHighlights(props) {
    const token = props.match.params.token; // Assuming you're using react-router
    const [highlight, setHighlight] = useState(null);

    useEffect(() => {
        // Fetch the highlight using the token
        axios.get(`http://localhost:8000/pdf/download/${token}/`)
            .then(response => {
                setHighlight(response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching highlights:', error);
            });
    }, [token]);

    const deleteHighlight = () => {
        axios.delete(`http://localhost:8000/pdf/delete/${token}/`)
            .then(() => {
                // Redirect to home or show a success message
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting highlights:', error);
            });
    };

    if (!highlight) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white border border-gray-300">
            <div className="font-bold text-xl mb-2 break-words">Highlights</div>
            <div className="text-gray-700 text-base whitespace-pre-wrap">
                {highlight.highlight_text}
            </div>
            <p className="text-gray-700 text-base">
                <a href={highlight.highlights_url} className="text-blue-500 mr-3">
                    Download Highlights
                </a>
                <button onClick={deleteHighlight} className="text-red-500 bg-white hover:bg-red-500 hover:text-white border border-red-500 font-bold py-2 px-4 rounded">
                    Delete Highlights
                </button>
            </p>
        </div>
    );
}

export default DownloadHighlights;
