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

    // Seed data if empty (run once)
    useEffect(() => {
        if (!loading && events.length === 0 && currentUser) {
            const seedData = async () => {
                const today = new Date();

                // Event 1: Team Meeting (Tomorrow)
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                // Event 2: Project Review (In 2 days)
                const inTwoDays = new Date(today);
                inTwoDays.setDate(today.getDate() + 2);

                // Event 3: HR Training (In 5 days)
                const inFiveDays = new Date(today);
                inFiveDays.setDate(today.getDate() + 5);

                const sampleEvents = [
                    {
                        title: 'Weekly Team Sync',
                        description: 'Engineering team weekly sync to discuss progress and blockers.',
                        date: tomorrow,
                        time: '10:00',
                        type: 'meeting',
                        createdAt: new Date()
                    },
                    {
                        title: 'Project Alpha Review',
                        description: 'Reviewing Q1 milestones and deliverables.',
                        date: inTwoDays,
                        time: '14:00',
                        type: 'review',
                        createdAt: new Date()
                    },
                    {
                        title: 'HR Policy Training',
                        description: 'Mandatory training session for all new department heads.',
                        date: inFiveDays,
                        time: '11:30',
                        type: 'training',
                        createdAt: new Date()
                    }
                ];

                try {
                    // Add all samples
                    for (const event of sampleEvents) {
                        await addDoc(collection(db, 'events'), event);
                    }
                    // Events seeded successfully
                } catch (error) {
                    console.error('Error seeding events:', error);
                }
            };

            seedData();
        }
    }, [loading, events.length, currentUser]);

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
