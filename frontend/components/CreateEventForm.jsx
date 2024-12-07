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
    <form onSubmit={handleSubmit}>
        <p className="text-center">Please enter the event information:</p>
        <div className="form-group">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of event"
            />
            <label htmlFor="title">Event Title*</label>
        </div>

        <div className="form-group">
            <textarea
              id="description"
              placeholder="Brief description of event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="description">Description</label>
        </div>

        <div className="form-group">
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <label htmlFor="dateTime">Date and Time*</label>
        </div>

        <div className="form-group">
            <input
              type="text"
              id="location"
              placeholder="123 Main st, Anywhere, OH 45678"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <label htmlFor="location">Location</label>
        </div>

        <div className="form-group">
            <input
              type="datetime-local"
              id="deadline"
              value={rsvpDeadline}
              onChange={(e) => setRsvpDeadline(e.target.value)}
            />
            <label htmlFor="deadline">RSVP Deadline</label>
        </div>

        <div className="form-group">
            <input
              type="number"
              id="maxGuests"
              placeholder="42"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
            <label htmlFor="maxGuests">Max Guests</label>
        </div>
        
        <p className="text-center">* indicates a required field</p>
        {success && <p className="text-center succes-text">Event created successfully</p>}
        {error && <p className="text-center success-text">{error}</p>}
        <div className="text-center">
            <button className="form-button" type="submit">Create Event</button>
        </div>
    </form>
  )
}

export default CreateEventForm