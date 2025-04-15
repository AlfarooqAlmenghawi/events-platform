import "./Header.css";

const Header = () => {
  return (
    <>
      <header className="header">
        <h1>Events Platform</h1>
        <section className="header-buttons">
          <button>Browse Events</button>
          <button>My Events</button>
          <button>Login</button>
          <button>Sign Up</button>
        </section>
      </header>
    </>
  );
};

export default Header;
