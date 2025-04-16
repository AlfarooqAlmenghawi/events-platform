import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const EventDetails = () => {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("authToken");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const [popup, setPopup] = useState(null);

  const Popup = ({ message, onClose }) => (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "black",
        color: "white",
        padding: "1rem",
        borderRadius: "5px",
      }}
    >
      {message}
      <button onClick={onClose} style={{ marginLeft: "10px" }}>
        X
      </button>
    </div>
  );

  async function unsign() {
    try {
      const response = await axios.delete(
        `https://events-platform-backend-production.up.railway.app/events/${event_id}/signup`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setPopup(null);
        setPopup("Opted out of event!");
        setTimeout(() => setPopup(null), 3000); // auto-close after 3 seconds
        setIsSignedUp(false);
      }
    } catch (err) {
      setPopup(null);
      setPopup("Error unsigning!");
      setTimeout(() => setPopup(null), 3000); // auto-close after 3 seconds
    }
  }

  async function signup() {
    try {
      const response = await axios.post(
        `https://events-platform-backend-production.up.railway.app/events/${event_id}/signup`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setPopup(null);
        setPopup("Signed up!");
        setTimeout(() => setPopup(null), 3000); // auto-close after 3 seconds
        setIsSignedUp(true);
      }
    } catch (err) {
      setPopup(null);
      setPopup("Error signing up. Please try again.");
      setTimeout(() => setPopup(null), 3000); // auto-close after 3 seconds
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvent(response.data);
        setIsSignedUp(response.data.is_signed_up);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id, isSignedUp]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div>
      <>{popup && <Popup message={popup} onClose={() => setPopup(null)} />}</>
      <h1>{event.event_title}</h1>
      <p>{event.event_description}</p>
      <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
      <p>Location: {event.event_location}</p>
      <p>Organized by: {event.event_organizer}</p>
      <a href={event.event_organizer_website} target="_blank" rel="noreferrer">
        {event.event_organizer_website}
      </a>
      {event.is_signed_up ? (
        <button onClick={unsign}>Unsign</button>
      ) : (
        <button onClick={signup}>Sign Up</button>
      )}
    </div>
  );
};

export default EventDetails;
