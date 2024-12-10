import React, { useState } from "react";
import "@styles/modals.css";

const AddToCalendar = ({ title, start, end, details, location}) => {
    const [showModal, setShowModal] = useState(false);

    const formatDateForCalendar = (date) => {
        return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatDateForCalendar(start);
    const endDate = formatDateForCalendar(end);

    const googleCalendarUrl = 
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
        )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
            details
        )}&location=${encodeURIComponent(location)}`;

    const outlookCalendarUrl = 
        `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(
            title
        )}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(
            details
        )}&location=${encodeURIComponent(location)}`;

    const icsContent = 
        `BEGIN:VCALENDAR
        VERSION:2.0
        BEGIN:VEVENT
        DTSTART:${startDate}
        DTEND:${endDate}
        SUMMARY:${title}
        DESCRIPTION:${details}
        LOCATION:${location}
        END:VEVENT
        END:VCALENDAR`;

    const downloadIcsFile = () => {
        const blob = new Blob([icsContent], {type: 'text/calendar'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'event.ics';
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="text-center">
            <button onClick={() => setShowModal(true)} className="calendar-button">
                Add to Calendar
            </button>

            {showModal && (
                <div className="modal">
                    <div onClick={() => setShowModal(false)} className="modal-overlay">
                        <div className="modal-content">
                            <h2>Pick Calendar</h2>
                            <div className="modal-options">
                                <a className="calender-card" href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src="/logo.png"
                                        alt="Google Calendar logo"
                                    />
                                    <p>Google Calendar</p>
                                </a>
                                <a className="calender-card" href={outlookCalendarUrl} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src="/logo.png"
                                        alt="Outlook Calendar logo"
                                    />
                                    <p>Outlook Calendar</p>
                                </a>
                                <a className="calender-card" onClick={downloadIcsFile} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src="/logo.png"
                                        alt="iCalendar logo"
                                    />
                                    <p>iCalendar</p>
                                </a>
                            </div>
                            <button onClick={() => setShowModal(false)} className="modal-close">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddToCalendar