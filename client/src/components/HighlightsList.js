import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function HighlightsList() {
    const [highlights, setHighlights] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        fetchHighlights();
    }, []);

    const fetchHighlights = async () => {
      try {
          const idToken = await auth.currentUser.getIdToken(true);
          const response = await axios.get('http://localhost:8000/pdf/highlights/all/', {
              headers: {
                  'Authorization': `Bearer ${idToken}`,
              }
          });
          console.log(response.data.highlights); // Add this line to log the fetched highlights
          setHighlights(response.data.highlights);
      } catch (error) {
          console.error("Error fetching highlights: ", error);
      }
  };

  const deleteHighlight = async (highlightName) => {
    if (!highlightName) {
        console.error("Highlight name is undefined, cannot delete.");
        return;
    }

    try {
        const idToken = await auth.currentUser.getIdToken(true);
        await axios.delete(`http://localhost:8000/pdf/highlights/delete/${encodeURIComponent(highlightName)}/`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            }
        });
        fetchHighlights(); // Refresh the list after deleting
    } catch (error) {
        console.error("Error deleting highlight: ", error);
    }
};

    return (
        <div className="grid grid-cols-3 gap-4 m-8">
            {highlights.map((highlightFile, index) => (
                <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-black">
                    <div className="font-bold text-xl mb-2 break-words">{highlightFile.name}</div>
                    <div className="text-gray-700 text-base">{highlightFile.date}</div>
                    <p className="text-gray-700 text-base">
                        <a href={highlightFile.url} className="text-blue-500 mr-3" target="_blank" rel="noopener noreferrer">
                            Download Highlights
                        </a>
                        <button onClick={() => deleteHighlight(highlightFile.name)} className="text-red-500 bg-white hover:bg-red-500 hover:text-white border border-red-500 font-bold py-2 px-4 rounded">
                            Delete Highlights
                        </button>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default HighlightsList;
