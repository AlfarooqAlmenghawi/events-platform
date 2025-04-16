import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EventDetails = () => {
  const { event_id } = useParams();
  console.log("Event ID from URL:", event_id);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://events-platform-backend-production.up.railway.app/events/${event_id}`
        );
        setEvent(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div>
      <h1>{event.event_title}</h1>
      <p>{event.event_description}</p>
      <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
      <p>Location: {event.event_location}</p>
      <p>Organized by: {event.event_organizer}</p>
      <a href={event.event_organizer_website} target="_blank" rel="noreferrer">
        {event.event_organizer_website}
      </a>
    </div>
  );
};

export default EventDetails;
