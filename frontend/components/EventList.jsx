"use client"

import "@styles/tables.css";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { api } from "@/utils/api";
import { useUser, useUserLoading } from "@components/AppWrapper";
import Skeleton from "./Skeleton";

const EventList = () => {
    const user = useUser();
    const userLoading = useUserLoading();

    const [error, setError] = useState("");
    const [events, setEvents] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getEvents = async (e) => {
            try{
                const res = await api.get(`/events/user/${user.id}`);
                setEvents(res);
            }catch (error){
                setError(error.toString());
            }
            setLoaded(true);
        }
        if (user)
            getEvents();

        if (!userLoading && user == null)
            setLoaded(true);
    }, [user])
    
    if (!loaded){
        return(
            <Skeleton type="spinner" leftJustify={true}/>
        )
    }

    return (
        <>
        {events.length > 0 ? (
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
                        <td><Link href={"/events/" + event.id + "/manage"}>Manage</Link></td>
                        <td><Link href={"/events/" + event.id}>View</Link></td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : (
            <p>Events you create will show up here ^.^</p>
        )}
        </>
    )
}

export default EventList