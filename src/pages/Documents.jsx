import React, { useState, useRef } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useSearch } from '../context/SearchContext';
import { FileText, Upload, Trash2, File, Image as ImageIcon, FileSpreadsheet, MoreVertical, Download, Search } from 'lucide-react';

export default function Documents() {
    const { documents, uploadDocument, deleteDocument, loading } = useDocuments();
    const { searchTerm, setSearchTerm } = useSearch();
    const fileInputRef = useRef(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const dummyDownload = (doc) => {
        // In a real app with Firebase Storage, 'doc.url' would be valid.
        // If we have a Cloudinary URL or similar from the metadata, use it.
        // For now, if we simulated local storage or have a URL, open it.
        if (doc.url) {
            window.open(doc.url, '_blank');
        } else {
            alert(`Simulating download for: ${doc.name}\n(In a full implementation, this would trigger a file download)`);
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

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

            {/* Inner Search Bar synced with global */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                />
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col">
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
                            {currentDocuments.length > 0 ? (
                                currentDocuments.map((doc) => (
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
                                                <button
                                                    onClick={() => dummyDownload(doc)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
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
                                            {searchTerm ? (
                                                <p>No documents found matching "{searchTerm}".</p>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center text-dark-600">
                                                        <FileText size={32} />
                                                    </div>
                                                    <p>No documents uploaded yet.</p>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-dark-700 bg-dark-800/50 text-xs text-gray-500 flex justify-between items-center mt-auto">
                    <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDocuments.length)} of {filteredDocuments.length} documents</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-dark-600 hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 rounded border border-dark-600 hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
