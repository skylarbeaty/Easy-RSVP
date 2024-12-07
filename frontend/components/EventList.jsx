"use client"

import "@styles/tables.css";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useUser } from "@components/AppWrapper";

const EventList = () => {
    const user = useUser();

    const [error, setError] = useState("");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getEvents = async (e) => {
            try{
                const res = await api.get(`/events/user/${user.id}`);
                setEvents(res);
            }catch (error){
                setError(error.toString());
            }
        }
        if (user)
            getEvents();
    }, [user])

    return (
        <table className="event-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Summary</th>
                    <th>Manage Event</th>
                    <th>Event Page</th>
                </tr>
            </thead>
            <tbody>
            {events.map((event) => (
                <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.dateTime}</td>
                    <td>
                        Yes: {event.rsvpSummary.yes}, 
                        No: {event.rsvpSummary.no}, 
                        Maybe: {event.rsvpSummary.maybe}
                    </td>
                    <td><a>Manage</a></td>
                    <td><a>View</a></td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default EventList