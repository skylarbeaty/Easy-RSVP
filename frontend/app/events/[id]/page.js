"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@utils/api";
import RSVPForm from "@components/RSVPForm";
import AddToCalendar from "@components/AddToCalendar";

const Event = () => {
    const params = useParams();
    const id = params.id;
    const [event, setEvent] = useState(null);
    const [stats, setStats] = useState({});
    const [error, setError] = useState("");

    const fetchEventDetails = async () => {
        try{//fetch event
            const data = await api.get(`/events/${id}`);
            setEvent(data);
            setError("");
        } catch (error){
            setError(error.message || "Something went wrong");
        }
        try{//fetch event rsvp summary
            const data = await api.get(`/rsvps/event/${id}/summary`);
            setStats(data);
        } catch (error){
            setError(error.message || "Failed to load RSVP summary");
        }
    }

    const handleRSVP = () => {
        fetchEventDetails();
    }

    useEffect(() => {
        if (id) fetchEventDetails();
    }, [id]);

    if (error) {
        return <p>Error: {error}</p>
    }

    if (!event) {
        return <p>Loading...</p>
    }

    return (
        <section>
            <h1 className="text-center">{event.title}</h1>
            <p className="text-center">{event.description}</p>
            <p className="text-center">Date and Time: {event.dateTime}</p>
            <p className="text-center">Location: {event.location}</p>
            <AddToCalendar
                title={event.title}
                start={event.dateTime}
                end={event.dateTime}
                details={event.description}
                location={event.location}
            />
            <h4 className="text-center">RSVP Stats</h4>
            <p className="text-center">Yes: {stats.yes}</p>
            <p className="text-center">No: {stats.no}</p>
            <p className="text-center">Maybe: {stats.maybe}</p>
            <div className="justify-center">
                <RSVPForm eventId={event.id} onRSVP={handleRSVP}/>
            </div>
        </section>
    )
}

export default Event