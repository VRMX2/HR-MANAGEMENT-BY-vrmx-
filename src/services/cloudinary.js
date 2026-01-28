import { sha1 } from 'crypto-js'; // We might need crypto-js or similar if we do signing, but pure JS implementation is better for browser without heavy libs if possible.
// Actually, let's just use a direct fetch to the upload endpoint. 
// Since we don't have an upload preset, we MUST use signed uploads which requires the API SECRET.
// WARNING: Exposing API Secret on frontend is insecure. Doing this only per user request.

const CLOUD_NAME = 'dmck7lqxj';
const API_KEY = '554968932483438';
const API_SECRET = 'JQNYFswEzWz_Ku0rIFS7PYXbkX4';

export const uploadToCloudinary = async (file) => {
    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Generate signature
    // Signature is a SHA-1 hash of the params (sorted) + api_secret
    const paramsToSign = `timestamp=${timestamp}${API_SECRET}`;

    // simple SHA1 implementation or use a library. 
    // For simplicity solely in this environment without installing crypto-js, 
    // I will assume good faith usage. 
    // WAIT: I cannot use crypto-js without installing it. 
    // I will check if I can use a minimal implementation or request 'crypto-js' installation.
    // Actually, I can use the Web Crypto API.

    const msgUint8 = new TextEncoder().encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

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
