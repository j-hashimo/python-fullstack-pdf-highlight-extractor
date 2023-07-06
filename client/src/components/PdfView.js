import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PdfList() {
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        const fetchPdfs = async () => {
            const response = await axios.get('http://localhost:8000/pdf/all/');
            setPdfs(response.data.pdfs);
        };

        fetchPdfs();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 m-8">
            {pdfs.map((pdf, index) => (
                <div 
                    key={index}
                    className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white" 
                >
                    <div className="font-bold text-xl mb-2 break-words">{pdf.name}</div>
                    <div className="text-gray-700 text-base">{pdf.date}</div>
                    <p className="text-gray-700 text-base mt-2">
                        <a href={pdf.url} className="text-blue-500">
                            Download PDF
                        </a>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default PdfList;
