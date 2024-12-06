"use client"

import "@styles/forms.css";
import { useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router= useRouter();

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title || ! dateTime){
          setError("Title and Date are required");
          return;
      }
          
      try{
        const body = {
          title,
          description,
          dateTime: new Date(dateTime).toISOString(),
          location,
          rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : null,
          maxGuests: maxGuests ? parseInt(maxGuests, 10) : null
        };

        const res = await api.post("/events", body);

        if(res.error){
          throw new Error(res.eror);
        }

        setSuccess(true);
        setError("");
        const id = res.id;
        router.push(`/events/${id}/manage`);//change to redirect to the page for the event
      } catch(error){
          setError(error.message || "Something went wrong");
      }
  }
  
  return (
    <form onSubmit={handleSubmit} className="login-form">
        <p className="text-center">Please enter the event information:</p>
        <p className="text-center">* indicates a required field</p>
        <div className="login-field">
            <label>*Event Title:</label>
            <input
              type="title"
              autoComplete="title"
              placeholder="Name of the event"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className="login-field">
            <label>Description:</label>
            <textarea
              placeholder="Brief description of event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
        </div>
        <div className="login-field">
            <label>*Date and Time:</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
        </div>
        <div className="text-center login-field">
            <label>Location:</label>
            <input
              type="text"
              placeholder="123 Main st"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
        </div>
        <div className="text-center login-field">
            <label>RSVP Deadline:</label>
            <input
              type="datetime-local"
              value={rsvpDeadline}
              onChange={(e) => setRsvpDeadline(e.target.value)}
            />
        </div>
        <div className="text-center login-field">
            <label>Max Guests:</label>
            <input
              type="number"
              placeholder="42"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
        </div>
        {success && <p className="text-center succes-text">Event created successfully</p>}
        {error && <p className="text-center success-text">{error}</p>}
        <div className="text-center">
            <button className="form-button" type="submit">Create Event</button>
        </div>
    </form>
  )
}

export default CreateEventForm