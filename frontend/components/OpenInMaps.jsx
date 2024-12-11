import "@styles/OpenInMaps.css";

const OpenInMaps = ({ location }) => {
    const handleOpenMaps = () => {
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
        window.open(mapsUrl, "_blank", "noopener noreferrer")
    }
        
    return (
        <button onClick={handleOpenMaps} className="maps-button">
            Open in Maps
        </button>
    )
}

export default OpenInMaps