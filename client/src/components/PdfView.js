import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PdfList() {
    const [pdfs, setPdfs] = useState([]);
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        fetchPdfsAndHighlights();
    }, []);

    const fetchPdfsAndHighlights = async () => {
        const response = await axios.get('http://localhost:8000/pdf/all/');
        setPdfs(response.data.pdfs);
        setHighlights(response.data.highlights);
    };

    const deletePdf = async (pdf_name) => {
        await axios.delete(`http://localhost:8000/pdf/delete/${encodeURIComponent(pdf_name)}/`);
        fetchPdfsAndHighlights();
    };

    const deleteHighlight = async (highlight_name) => {
        await axios.delete(`http://localhost:8000/pdf/delete_highlight/${encodeURIComponent(highlight_name)}/`);
        fetchPdfsAndHighlights();
    };

    return (
        <>
            <div className="grid grid-cols-3 gap-4 m-8">
                {pdfs.map((pdf, index) => (
                    <div 
                        key={index}
                        className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white border border-gray-300" 
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
            <div className="grid grid-cols-3 gap-4 m-8">
                {highlights.map((highlight, index) => (
                    <div 
                        key={index}
                        className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white border border-gray-300" 
                    >
                        <div className="font-bold text-xl mb-2 break-words">Highlights for {highlight.pdf_name}</div>
                        <div className="text-gray-700 text-base whitespace-pre-wrap">
                            {highlight.highlight_text}
                        </div>
                        <p className="text-gray-700 text-base">
                            <a href={highlight.highlights_url} className="text-blue-500 mr-3">
                                Download Highlights
                            </a>
                            <button onClick={() => deleteHighlight(highlight.highlights_file_name)} className="text-red-500 bg-white hover:bg-red-500 hover:text-white border border-red-500 font-bold py-2 px-4 rounded">
                                Delete Highlights
                            </button>
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default PdfList;
