"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@utils/api";
import EventUpdateForm from "@components/EventUpdateForm";
import RSVPList from "@components/RSVPList";
import Skeleton from "@components/Skeleton";

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
        return (
            <section>
                <Skeleton type="page-header" itemCount={0} buttonCount={2} leftJustify={true}/>
                <><br /></>
                <h2>Update Event</h2>
                <Skeleton type="form" itemCount={6} buttonCount={1} leftJustify={true} />
                <><br /></>
                <h2>RSVP Responses</h2>
                <RSVPList eventId={null}/>
            </section>
        )
    }

    return (
        <section>
            <h1>Manage Event: {event.title}</h1>
            <><br /></>
            <div className="button-holder">
                <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/events/${id}`)} className="margin-right manage-event-button">
                    <img 
                        src="/copy.svg"
                        alt="Copy Icon"
                        className="button-icon"
                    />
                    Copy Event Link
                </button>
                <button onClick={handleEventPage} className="manage-event-button">
                    <img 
                        src="/view.svg"
                        alt="View Icon"
                        className="button-icon"
                    />
                    View Event Page
                </button>
            </div>
            <><br /></>
            <h2>Update Event</h2>
            <EventUpdateForm event={event}/>
            <><br /></>
            <h2>RSVP Responses</h2>
            <RSVPList eventId={event.id}/>
            <><br /></>
            <><br /></>
        </section>
    )
}

export default ManageEvent