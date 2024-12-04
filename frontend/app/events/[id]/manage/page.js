"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useParams } from "next/navigation";
import { api } from "@utils/api";
import UpdateEventForm from "@components/UpdateEventForm";
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
            <h1 className="text-center">Manage Event: {event.title}</h1>
            <><br /></>
            <h2 className="text-center">RSVP Responses</h2>
            <RSVPList eventId={event.id}/>
            <><br /></>
            <div className="text-center">
                <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/events/${id}`)}>
                    Copy Event Link
                </button>
            </div>
            <><br /></>
            <div className="text-center">
                <Link href={`/events/${id}`}>
                    View Event Page
                </Link>
            </div>
            <><br /></>
            <h2 className="text-center">Update Event</h2>
            <UpdateEventForm event={event}/>
        </section>
    )
}

export default ManageEvent