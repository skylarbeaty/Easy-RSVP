const AddToCalendar = ({ title, start, end, details, location}) => {
    const formatDateForCalendar = (date) => {
        return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatDateForCalendar(start);
    const endDate = formatDateForCalendar(end);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
        )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
            details
        )}&location=${encodeURIComponent(location)}`;

    const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(
            title
        )}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(
            details
        )}&location=${encodeURIComponent(location)}`;

    const icsContent = `BEGIN:VCALENDAR
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
            <p>Add to Calendar</p>
            <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                Google Calendar
            </a>
            <a href={outlookCalendarUrl} target="_blank" rel="noopener noreferrer">
                Outlook Calendar
            </a>
            <button onClick={downloadIcsFile}>iCalendar</button>
        </div>
    )
}

export default AddToCalendar