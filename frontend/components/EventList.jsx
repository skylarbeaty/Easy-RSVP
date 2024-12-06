"use client"

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
        <ul>
            {events.map((event) => (
                <li key={event.id}>
                    {event.title}, {event.dateTime}
                </li>
            ))}
        </ul>
    )
}

export default EventList