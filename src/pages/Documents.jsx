import React, { useState, useRef } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { FileText, Upload, Trash2, File, Image as ImageIcon, FileSpreadsheet, MoreVertical, Download } from 'lucide-react';

export default function Documents() {
    const { documents, uploadDocument, deleteDocument, loading } = useDocuments();
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadDocument(file);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            await deleteDocument(id);
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'PDF': return <FileText className="text-red-500" size={24} />;
            case 'JPG':
            case 'PNG': return <ImageIcon className="text-blue-500" size={24} />;
            case 'XLSX':
            case 'CSV': return <FileSpreadsheet className="text-green-500" size={24} />;
            default: return <File className="text-gray-500" size={24} />;
        }
    };

    if (loading) return <div className="text-white">Loading documents...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Documents</h1>
                    <p className="text-gray-400">Manage and organize company files.</p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-primary-500/20"
                    >
                        <Upload size={20} />
                        <span>Upload Document</span>
                    </button>
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-500 border-b border-dark-700/50 bg-dark-900/30">
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Size</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Uploaded By</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700/50">
                            {documents.length > 0 ? (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="group hover:bg-dark-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-center">
                                                    {getFileIcon(doc.type)}
                                                </div>
                                                <span className="text-sm font-medium text-white">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-dark-700 text-gray-300 border border-dark-600">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{doc.size}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{doc.uploadedBy}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {doc.uploadedAt?.seconds ? new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                                                    <Download size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center text-dark-600">
                                                <FileText size={32} />
                                            </div>
                                            <p>No documents uploaded yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
