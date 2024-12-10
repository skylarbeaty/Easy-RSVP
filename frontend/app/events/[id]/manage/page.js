"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from 'next/link';
import { api } from "@utils/api";
import EventUpdateForm from "@components/EventUpdateForm";
import RSVPList from "@components/RSVPList";

const ManageEvent = () => {
    const params = useParams();
    const id = params.id;
    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");

    const fetchEvent = async () => {
        try{
            const data = await api.get(`/events/${id}`);
            setEvent(data);
            setError("");
        } catch (err){
            setError(err.message || "Something went wrong");
        }
    }

    useEffect(() => {
        if (id) fetchEvent();
    }, [id]);

    if (error) {
        return <p>Error: {error}</p>
    }

    if (!event) {
        return <p>Loading...</p>
    }

    return (
        <section>
            <h1>Manage Event: {event.title}</h1>
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/events/${id}`)}>
                Copy Event Link
            </button>
            <><br /></>
            <><br /></>
            <Link href={`/events/${id}`}>
                View Event Page
            </Link>
            <><br /></>
            <><br /></>
            <h2>RSVP Responses</h2>
            <RSVPList eventId={event.id}/>            
            <><br /></>
            <h2>Update Event</h2>
            <EventUpdateForm event={event}/>
        </section>
    )
}

export default ManageEvent