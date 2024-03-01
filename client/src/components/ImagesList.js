import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function ImagesList() {
    const [images, setImages] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken(true);
            console.log('Fetching images with ID token:', idToken); // Log the ID token
            const response = await axios.get('http://localhost:8000/pdf/images/all/', {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            console.log('Images fetched:', response.data.images); // Log the response
            setImages(response.data.images);
        } catch (error) {
            console.error("Error fetching images:", error);
            // Add more detailed error handling here
        }
    };

    const downloadImage = (imageUrl, imageName) => {
        // Use the `download` attribute in the anchor tag to download the image
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = '_blank'; // Open in a new tab
        link.download = imageName; // Set the download attribute with the image name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteImage = async (imageName) => {
        const idToken = await auth.currentUser.getIdToken(true);
        try {
            await axios.delete(`http://localhost:8000/pdf/images/delete/${encodeURIComponent(imageName)}/`, {
                headers: { 'Authorization': `Bearer ${idToken}` },
            });
            fetchImages(); // Refresh the list after deleting
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {images.map((image, index) => (
                <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                    <img className="w-full" src={image.url} alt={image.name} />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-black">{image.name}</div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => downloadImage(image.url, image.name)}
                        >
                            Download Image
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded"
                            onClick={() => deleteImage(image.name)}
                        >
                            Delete Image
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ImagesList;
