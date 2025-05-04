import "./BrowseEvents.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("event_title");
  const [sortOrder, setSortOrder] = useState("asc");
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
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (sortBy) params.append("sort_by", sortBy);
      if (sortOrder) params.append("order", sortOrder);

      const response = await axios.get(
        `https://events-platform-backend-production.up.railway.app/events?${params.toString()}`
      );
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setAnnouncement("You are now on the Browse Events page.");
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="browse-events" id="main-content" tabIndex="-1">
      {/* Accessible live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-9999px",
          height: "1px",
          width: "1px",
          overflow: "hidden",
        }}
      >
        {announcement}
      </div>

      <h1 className="browse-events-page-title" tabIndex="1">
        Browse Events
      </h1>
      <p className="browse-events-page-description" tabIndex="2">
        Here you can browse all the events available. Click on 'View More
        Details' to see more information about each event, sign up and add to
        your Google Calendar.
      </p>
      <section className="browse-events-filters">
        <div className="browse-events-filter">
          {/* <p htmlFor="search">Search:</p> */}
          <input
            className="browse-events-search"
            type="text"
            placeholder="Search Events Here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="browse-events-filter">
          <p htmlFor="sort-by">Sort By:</p>
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="event_date">Date</option>
            <option value="event_title">Alphabetical</option>
          </select>
        </div>
        <div className="browse-events-filter">
          <p htmlFor="sort-order">Sort Order:</p>
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button onClick={fetchEvents}>Search Events</button>
      </section>
      {loading && <p>Loading events...</p>}
      {error && <p>Error fetching events: {error.message}</p>}
      {events.length === 0 && !loading && (
        <p className="browse-events-results">
          No events found matching your criteria.
        </p>
      )}
      {events.length > 0 && (
        <p className="browse-events-results">
          Found {events.length} event
          {events.length > 1 ? "s" : ""} matching current criteria
        </p>
      )}
      <section className="browse-events-list" tabIndex="3">
        {!loading &&
          events.map((event) => (
            <article key={event.id} className="browse-event-card">
              <h2>{event.event_title}</h2>
              {event.event_image_url ? (
                <img src={event.event_image_url} alt={event.event_title} />
              ) : (
                <img
                  src="https://hoqphugtdxjwawlawpzm.supabase.co/storage/v1/object/public/event-banners/1745446438551-b170870007dfa419295d949814474ab2_t.jpeg"
                  alt="Default Event"
                />
              )}
              <section className="browse-event-info">
                {/* <p>{event.event_description}</p> */}
                <p>Start Time: {new Date(event.event_date).toLocaleString()}</p>
                <p>
                  Duration:{" "}
                  {getDuration(event.event_date, event.event_date_end)}
                </p>
                <p className="browse-event-location">
                  Location: {event.event_location}
                </p>
                <p>By {event.event_organizer}</p>
              </section>
              <Link to={event.event_organizer_website} target="_blank">
                Website ({event.event_organizer_website})
              </Link>
              <br />
              <button
                onClick={() => {
                  navigate(`/browse-events/${event.id}`);
                }}
                style={{ fontFamily: "SpecialGothic" }}
                aria-label={`View more details about ${event.event_title}`}
              >
                View More Details
              </button>
            </article>
          ))}
      </section>
    </main>
  );
};
export default BrowseEvents;
