import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    let navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:8000/pdf/upload/', formData);
        const data = await response.data;

        navigate('/view', { state: { highlights: data.highlights } });
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