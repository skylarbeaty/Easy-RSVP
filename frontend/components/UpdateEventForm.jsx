"use client"

import "@styles/forms.css";
import { useState } from "react";
import { api } from "@utils/api";

const UpdateEventForm = ({ event }) => {
    const[title, setTitle] = useState(event.title);
    const[description, setDescription] = useState(event.description || "");
    const[dateTime, setDateTime] = useState(formatDateToInput(event.dateTime));
    const[location, setLocation] = useState(event.location || "");
    const[rsvpDeadline, setRsvpDeadline] = useState(formatDateToInput(event.rsvpDeadline) || "");
    const[maxGuests, setMaxGuests] = useState(event.maxGuests || "");
    const[error,setError] = useState("");
    const[success, setSuccess] = useState(false);

    function formatDateToInput(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString); 
        return date.toISOString().slice(0, 16);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const body = {
                title,
                description,
                dateTime: new Date(dateTime).toISOString(),
                location,
                rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : null,
                maxGuests: maxGuests ? parseInt(maxGuests, 10) : null
            }
            await api.patch(`/events/${event.id}`, body);
            setSuccess(true);
            setError("");
        }catch(error){
            setError(error.message || "Failed to update event.")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <p className="text-center">Change or add any event information:</p>
            <div className="login-field">
                <label>Title:</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="login-field">
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div className="login-field">
                <label>Date and Time:</label>
                <input type="dateTime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)}/>
            </div>
            <div className="login-field">
                <label>Location:</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)}/>
            </div>
            <div className="login-field">
                <label>RSVP Deadline:</label>
                <input type="dateTime-local" value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)}/>
            </div>
            <div className="login-field">
                <label>Max Guests:</label>
                <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)}/>
            </div>
            {success && <p className="text-center succes-text">Event updated successfully</p>}
            {error && <p className="error text-center">{error}</p>}
            <div className="text-center">
                <button className="form-button" type="submit">Update Event</button>
            </div>
        </form>
    )
}

export default UpdateEventForm