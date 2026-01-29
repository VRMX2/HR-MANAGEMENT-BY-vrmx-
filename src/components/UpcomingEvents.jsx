import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useToast } from '../context/ToastContext';
import { Users, FileText, Calendar, Cake, GraduationCap, Plus, Edit2, Trash2 } from 'lucide-react';
import EventModal from './EventModal';

export default function UpcomingEvents() {
    const { upcomingEvents, addEvent, updateEvent, deleteEvent, loading } = useEvents();
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Map event types to icons and colors
    const getEventStyle = (type) => {
        const styles = {
            meeting: { icon: Users, color: 'text-orange-500 bg-orange-500/10' },
            review: { icon: FileText, color: 'text-teal-500 bg-teal-500/10' },
            training: { icon: GraduationCap, color: 'text-purple-500 bg-purple-500/10' },
            celebration: { icon: Cake, color: 'text-pink-500 bg-pink-500/10' },
            other: { icon: Calendar, color: 'text-blue-500 bg-blue-500/10' }
        };
        return styles[type] || styles.other;
    };

    const handleAddEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDeleteEvent = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);
                showToast('Event deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete event', 'error');
            }
        }
    };

    const handleSubmit = async (eventData) => {
        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, eventData);
                showToast('Event updated successfully', 'success');
            } else {
                await addEvent(eventData);
                showToast('Event added successfully', 'success');
            }
        } catch (error) {
            showToast('Operation failed', 'error');
        }
    };

    const formatEventDate = (date) => {
        const eventDate = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Reset time for comparison
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (eventDate.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    if (loading) {
        return (
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
                <h2 className="text-lg font-bold text-white mb-6">Upcoming Events</h2>
                <p className="text-gray-500 text-sm">Loading events...</p>
            </div>
        );
    }

    return (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
                <button
                    onClick={handleAddEvent}
                    className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    title="Add Event"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 5).map((event) => {
                        const style = getEventStyle(event.type);
                        const Icon = style.icon;

                        return (
                            <div
                                key={event.id}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-700/50 transition-colors group relative"
                            >
                                <div className={`w-10 h-10 rounded-lg ${style.color} flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-white truncate">{event.title}</h4>
                                    <p className="text-xs text-gray-500 truncate">
                                        {event.description || 'No description'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs font-medium text-gray-400">
                                        {formatEventDate(event.date)}
                                        {event.time && <span className="ml-1">{event.time}</span>}
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={() => handleEditEvent(event)}
                                            className="p-1 text-gray-400 hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteEvent(event.id, e)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <Calendar className="mx-auto text-gray-600 mb-3" size={32} />
                        <p className="text-gray-500 text-sm mb-2">No upcoming events</p>
                        <button
                            onClick={handleAddEvent}
                            className="text-primary-500 hover:text-primary-400 text-sm font-medium"
                        >
                            Add your first event
                        </button>
                    </div>
                )}
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingEvent}
            />
        </div>
    );
}
