import "@styles/Skeleton.css";

const Skeleton = ({ type, itemCount = 1, buttonCount = 1, leftJustify = false }) => {
    if (type === "page-header"){
        return (
            <div className={`skeleton-base ${leftJustify ? "skeleton-left" : ""}`}>
                <div className={`skeleton-title ${leftJustify ? "skeleton-left" : ""}`}></div>
                {[...Array(itemCount)].map((_,index) => (
                    <div key={`line-${index}`} className={`skeleton-line ${leftJustify ? "skeleton-left" : ""}`}></div>
                ))}
                <div className="skeleton-button-group">
                    {[...Array(buttonCount)].map((_,index) => (
                        <div key={`line-${index}`} className={`skeleton-button ${leftJustify ? "skeleton-left" : ""}`}></div>
                    ))}
                </div>
            </div>
    )}
    if (type === "form"){
        return(
            <div className={`skeleton-base ${leftJustify ? "skeleton-left" : ""}`}>
                <div className={`skeleton-form-title ${leftJustify ? "skeleton-left" : ""}`}></div>
                {[...Array(itemCount)].map((_,index) => (
                    <div key={`line-${index}`} className={`skeleton-form-box ${leftJustify ? "skeleton-left" : ""}`}></div>
                ))}
                <div className={`skeleton-button-group ${leftJustify ? "skeleton-left" : ""}`}>
                    {[...Array(buttonCount)].map((_,index) => (
                        <div key={`line-${index}`} className={`skeleton-button ${leftJustify ? "skeleton-left" : ""}`}></div>
                    ))}
                </div>
            </div>
    )}
    if (type === "spinner"){
        return(
            <div className={`skeleton-base ${leftJustify ? "skeleton-left" : ""}`}>
                <div className="skeleton-spinner"></div>
            </div>
        )
    }
}

export default Skeleton