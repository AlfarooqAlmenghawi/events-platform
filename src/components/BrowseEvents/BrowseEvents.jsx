import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <p>{event.event_description}</p>
          <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
          <p>Location: {event.event_location}</p>
          <p>By {event.event_organizer}</p>
          <Link to={event.event_organizer_website} target="_blank">
            {event.event_organizer_website}
          </Link>
          <br />
          <button>View More Details</button>
        </div>
      ))}
    </div>
  );
};
export default BrowseEvents;
