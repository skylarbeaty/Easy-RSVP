import "@styles/Footer.css";

const Footer = () => {
  return (
    <footer className='footer'>
        <p>© 2024 Skylar Liz Beaty</p>
        <a
            className="footer-link"
            href="https://github.com"
            rel="noopener noreferrer"
            target="_blank"
        >
            <img 
                src="/logo.png"
                alt="Github"
                className="footer-logo"
            />
        </a>
    </footer>
  )
}

export default Footer