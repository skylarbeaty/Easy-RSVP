import "@styles/Footer.css";

const Footer = () => {
  return (
    <footer className='footer'>
        <p>© 2024</p>
        <a
            className="footer-link"
            href="https://github.com/skylarbeaty/Easy-RSVP"
            rel="noopener noreferrer"
            target="_blank"
        >
            <img 
                src="/github.svg"
                alt="Github"
                className="footer-logo"
            />
        </a>
    </footer>
  )
}

export default Footer