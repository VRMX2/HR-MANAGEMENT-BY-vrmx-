import SHA1 from 'crypto-js/sha1';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file) => {
    // 1. Try Secure Unsigned Upload (Preferred)
    if (UPLOAD_PRESET) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
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
            console.error('Cloudinary Unsigned Upload Error:', error);
            throw error;
        }
    }

    // 2. Fallback to Legacy Client-Side Signing (Warning: Exposes Secret)
    // Only use if API_SECRET is provided and UPLOAD_PRESET is missing
    if (API_SECRET && API_KEY) {
        console.warn('Security Warning: Using client-side signature generation. Please configure VITE_CLOUDINARY_UPLOAD_PRESET for production security.');

        const timestamp = Math.round((new Date()).getTime() / 1000);
        const paramsToSign = `timestamp=${timestamp}${API_SECRET}`;
        const signature = SHA1(paramsToSign).toString();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', API_KEY);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
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
    }

    throw new Error('Cloudinary not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET (Recommended) or VITE_CLOUDINARY_API_SECRET in .env');
};
