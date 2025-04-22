import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;

    if (diffMs <= 0) return "Invalid duration";

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const days = diffDays;
    const hours = diffHours % 24;
    const minutes = diffMinutes % 60;

    let result = "";
    if (days) result += `${days} day${days > 1 ? "s" : ""} `;
    if (hours) result += `${hours} hour${hours > 1 ? "s" : ""} `;
    if (minutes) result += `${minutes} minute${minutes > 1 ? "s" : ""}`;

    return result.trim();
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://events-platform-backend-production.up.railway.app/events"
      );
      console.log("Fetched events:", response.data);
      setEvents(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  // Fetch events when the component mounts
  // if (loading) return <p>Loading events...</p>;
  // if (error) return <p>Error fetching events: {error.message}</p>;
  // if (!events.length) return <p>No events available.</p>;
  // if (events.length) {
  //   console.log("Fetched events:", events);
  // }
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Browse Events</h1>
      {/* Add your event browsing logic here */}
      <p>Here you can browse all the events available.</p>
      {/* Example: Fetch and display events */}
      {loading && <p>Loading events...</p>}
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <h2>{event.event_title}</h2>
          {event.event_image_url ? (
            <img
              src={event.event_image_url}
              alt={event.event_title}
              style={{ width: "300px" }}
            />
          ) : (
            <img
              src="/assets/default-event-image.png"
              alt="Default Event"
              style={{ width: "300px" }}
            />
          )}
          <p>{event.event_description}</p>
          <p>Start Time: {new Date(event.event_date).toLocaleString()}</p>
          <p>Duration: {getDuration(event.event_date, event.event_date_end)}</p>
          <p>Location: {event.event_location}</p>
          <p>By {event.event_organizer}</p>
          <Link to={event.event_organizer_website} target="_blank">
            {event.event_organizer_website}
          </Link>
          <br />
          <button
            onClick={() => {
              navigate(`/browse-events/${event.id}`);
            }}
          >
            View More Details
          </button>
        </div>
      ))}
    </div>
  );
};
export default BrowseEvents;
