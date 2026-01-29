import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const EventContext = createContext();

export function EventProvider({ children }) {
    const [events, setEvents] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setEvents([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'events'), orderBy('date', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const evts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore timestamp to Date object
                date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
            }));
            setEvents(evts);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const addEvent = async (eventData) => {
        await addDoc(collection(db, 'events'), {
            ...eventData,
            date: new Date(eventData.date),
            createdAt: new Date()
        });
    };

    const updateEvent = async (id, updatedData) => {
        const eventRef = doc(db, 'events', id);
        await updateDoc(eventRef, {
            ...updatedData,
            date: new Date(updatedData.date)
        });
    };

    const deleteEvent = async (id) => {
        await deleteDoc(doc(db, 'events', id));
    };

    // Get only upcoming events (future dates)
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
    });

    return (
        <EventContext.Provider value={{
            events,
            upcomingEvents,
            addEvent,
            updateEvent,
            deleteEvent,
            loading
        }}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvents() {
    return useContext(EventContext);
}
