"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@utils/api";
import EventUpdateForm from "@components/EventUpdateForm";
import RSVPList from "@components/RSVPList";

const ManageEvent = () => {
    const params = useParams();
    const id = params.id;
    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");

    const router = useRouter();

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

    const handleEventPage = () => {
        router.push(`/events/${id}`);
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    if (!event) {
        return <p>Loading...</p>
    }

    return (
        <section>
            <h1>Manage Event: {event.title}</h1>
            <><br /></>
            <div className="button-holder">
                <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/events/${id}`)} className="margin-right">
                    Copy Event Link
                </button>
                <button onClick={handleEventPage}>
                    View Event Page
                </button>
            </div>
            <><br /></>
            <h2>RSVP Responses</h2>
            <RSVPList eventId={event.id}/>            
            <><br /></>
            <h2>Update Event</h2>
            <EventUpdateForm event={event}/>
            <><br /></>
        </section>
    )
}

export default ManageEvent