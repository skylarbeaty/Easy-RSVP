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
      <div className="login-field">
        <label>Name:</label>
        <input
          type="name"
          autoComplete="name"
          value={guestName}
          onChange={(e) => setGeustName(e.target.value)}
        />
      </div>
      <div className="login-field">
        <label>RSVP:</label>
        <select value={response} onChange={(e) => setResponse(e.target.value)}>
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>
      <div className="login-field">
        <label>Coment:</label>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>} 
      <div className="text-center">
        <button className="form-button" type="submit">Submit RSVP</button>
      </div>
    </form>
  )
}

export default RSVPForm