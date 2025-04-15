import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>Events Platform</h1>
      <section className="header-buttons">
        <Link to="/browse-events">
          <button>Browse Events</button>
        </Link>
        <Link to="/my-events">
          <button>My Events</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </section>
    </header>
  );
};

export default Header;
