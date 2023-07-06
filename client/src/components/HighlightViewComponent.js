import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HighlightViewComponent = () => {
    const location = useLocation();
    const highlights = location.state.highlights;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h2 className="text-2xl mb-4">Extracted Highlights</h2>
            <div>
                {highlights.map((highlight, index) => (
                    <p key={index}>{highlight}</p>
                ))}
            </div>
            <Link to="/pdfview" className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">View and Download PDFs</Link>
        </div>
    );
};

export default HighlightViewComponent;
