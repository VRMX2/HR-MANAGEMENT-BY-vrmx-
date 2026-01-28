import SHA1 from 'crypto-js/sha1';

const CLOUD_NAME = 'dmck7lqxj';
const API_KEY = '554968932483438';
const API_SECRET = 'JQNYFswEzWz_Ku0rIFS7PYXbkX4';

export const uploadToCloudinary = async (file) => {
    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Generate signature
    // Signature is a SHA-1 hash of the params (sorted) + api_secret
    const paramsToSign = `timestamp=${timestamp}${API_SECRET}`;

    const signature = SHA1(paramsToSign).toString();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
