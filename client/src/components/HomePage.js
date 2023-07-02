import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center">
                <h1 className="text-4xl mb-4 text-white">PDF Highlight Extractor</h1>
                <p className="text-xl text-gray-200">Upload a highlighted PDF and extract all the highlighted texts</p>
                <Link to="/upload" className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Get Started</Link>
            </div>
        </div>
    )
}

export default HomePage;
