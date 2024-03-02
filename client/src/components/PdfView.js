import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import HighlightsList from './HighlightsList';
import ImagesList from './ImagesList';

function PdfList() {
    const [pdfs, setPdfs] = useState([]);
    const auth = getAuth();
    const [showPdfs, setShowPdfs] = useState(false);
    const [showHighlights, setShowHighlights] = useState(false);
    const [showImages, setShowImages] = useState(false);
    useEffect(() => {
        fetchPdfs();
    }, []);

    const fetchPdfs = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken(true); // Get the ID token
            const response = await axios.get('http://localhost:8000/pdf/all/', {
                headers: {
                    'Authorization': `Bearer ${idToken}`, // Send the token in the Authorization header
                }
            });
            setPdfs(response.data.pdfs);
        } catch (error) {
            console.error("Error fetching PDFs: ", error);
            // Handle the error, e.g., redirect to login if unauthorized
        }
    };

    const deletePdf = async (pdf_name) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const idToken = await user.getIdToken(true); // Get the ID token
            try {
                await axios.delete(`http://localhost:8000/pdf/delete/${encodeURIComponent(pdf_name)}/`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`, // Include the token in the Authorization header
                    }
                });
                fetchPdfs(); // Refresh the list after deleting
            } catch (error) {
                console.error("Error deleting PDF: ", error);
                // Handle the error, e.g., show an error message to the user
            }
        } else {
            console.error("User not authenticated");
            // Redirect to login or handle accordingly
        }
    };


    const toggleAccordion = (accordion) => {
        if (accordion === 'pdfs') {
          setShowPdfs(!showPdfs);
        } else if (accordion === 'highlights') {
          setShowHighlights(!showHighlights);
        } else if (accordion === 'images') {
          setShowImages(!showImages);
        }
      };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10">
          <div className="space-y-6">
            {/* PDFs Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('pdfs')}
                className="text-left w-full text-2xl py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg focus:outline-none"
              >
                Your PDFs
              </button>
              {showPdfs && (
                <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                        {pdfs.map((pdf, index) => (
                            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white text-gray-900">
                                <div className="font-bold text-xl mb-2">{pdf.name}</div>
                                <div className="text-gray-700 text-base">{pdf.date}</div>
                                <p className="text-gray-700 text-base">
                                    <a href={pdf.url} className="text-blue-500 hover:text-blue-700 mr-3" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>

                                    <button onClick={() => deletePdf(pdf.original_name)} className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 font-bold py-2 px-4 rounded">
                                        Delete PDF
                                    </button>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
    
            {/* Highlights Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('highlights')}
                className="text-left w-full text-2xl py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg focus:outline-none"
              >
                Highlight Files
              </button>
              {showHighlights && (
                <div className="mt-4">
                  <HighlightsList />
                </div>
              )}
            </div>
    
            {/* Images Accordion */}
            <div>
              <button
                onClick={() => toggleAccordion('images')}
                className="text-left w-full text-2xl py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg focus:outline-none"
              >
                Your Images
              </button>
              {showImages && (
                <div className="mt-4">
                  <ImagesList />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    
export default PdfList;
