"use client"

import "@styles/forms.css";
import { useState } from "react"
import { api } from "@utils/api"

const RSVPForm = ({ eventId, onRSVP = () => {} }) => {
  const [guestName, setGeustName] = useState("");
  const [response, setResponse] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      api.post(`/rsvps`,{eventId, guestName, response, comment});
      onRSVP();
    }catch (error){
      setError(error.message || "Failed to submit RSVP");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <p className="text-center">Respond, if you please:</p>
      <div className="form-group">
        <input
          type="name"
          autoComplete="name"
          value={guestName}
          onChange={(e) => setGeustName(e.target.value)}
        />
        <label>Name</label>
      </div>
      <div className="form-group">
        <select value={response} onChange={(e) => setResponse(e.target.value)}>
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
        <label>RSVP</label>
      </div>
      <div className="form-group">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <label>Comment</label>
      </div>
      {error && <p className="error">{error}</p>} 
      <div className="text-center">
        <button className="form-button" type="submit">Submit RSVP</button>
      </div>
    </form>
  )
}

export default RSVPForm