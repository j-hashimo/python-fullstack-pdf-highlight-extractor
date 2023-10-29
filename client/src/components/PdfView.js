import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PdfList() {
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        fetchPdfs();
    }, []);

    const fetchPdfs = async () => {
        const response = await axios.get('http://localhost:8000/pdf/all/');
        setPdfs(response.data.pdfs);
    };

    const deletePdf = async (pdf_name) => {
        await axios.delete(`http://localhost:8000/pdf/delete/${encodeURIComponent(pdf_name)}/`);
        fetchPdfs();
    };

    return (
        <div className="grid grid-cols-3 gap-4 m-8">
            {pdfs.map((pdf, index) => (
                <div 
                    key={index}
                    className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white" 
                >
                    <div className="font-bold text-xl mb-2 break-words">{pdf.name}</div>
                    <div className="text-gray-700 text-base">{pdf.date}</div>
                    <p className="text-gray-700 text-base">
                        <a href={pdf.url} className="text-blue-500 mr-3">
                            Download PDF
                        </a>
                        <button onClick={() => deletePdf(pdf.original_name)} className="text-red-500 bg-white hover:bg-red-500 hover:text-white border border-red-500 font-bold py-2 px-4 rounded">
                            Delete PDF
                        </button>

                    </p>
                </div>
            ))}
        </div>
    );
}

export default PdfList;