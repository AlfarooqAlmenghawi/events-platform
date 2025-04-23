import "./MyEvents.css";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [userCreatedEvents, setUserCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageStatus, setPageStatus] = useState("my-signed-up-events");
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

  useEffect(() => {
    const fetchUserEvents = async () => {
      const token = Cookies.get("authToken");

      console.log("Fetching user's events...");
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://events-platform-backend-production.up.railway.app/my-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched events:", response.data);
        setUserEvents(response.data.events);
      } catch (error) {
        console.warn(error);
        if (error.response.data === "Invalid or expired token") {
          setError(
            "Please login or create an account to view/ create your events."
          );
        } else if (error.response.data === "No events found for this user") {
          // setError("No events found. Create one!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  useEffect(() => {
    const fetchUserCreatedEvents = async () => {
      const token = Cookies.get("authToken");

      console.log("Fetching user's created events...");
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://events-platform-backend-production.up.railway.app/my-created-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched created events:", response.data);
        setUserCreatedEvents(response.data.events);
      } catch (error) {
        console.warn(error);
        if (error.response.data === "Invalid or expired token") {
          setError(
            "Please login or create an account to view/ create your events."
          );
        } else if (error.response.data === "No events found for this user") {
          // setError("No events found. Create one!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserCreatedEvents();
  }, []);

  return (
    <div className="my-events">
      <h1 className="my-events-page-title">My Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      {!loading && (
        <main className="main-events-container">
          <section>
            <button
              onClick={() => {
                setPageStatus("my-signed-up-events");
              }}
              className={
                pageStatus === "my-signed-up-events"
                  ? "button-active"
                  : "button-inactive"
              }
            >
              My Signed Up Events
            </button>
            <button
              onClick={() => {
                setPageStatus("my-created-events");
              }}
              className={
                pageStatus === "my-created-events"
                  ? "button-active"
                  : "button-inactive"
              }
            >
              My Created Events
            </button>
          </section>
          {pageStatus === "my-signed-up-events" && (
            <div className="my-signed-up-events">
              <h2 className="my-events-page-subheading">My Signed Up Events</h2>
              <p className="my-events-page-description">
                Here you can view the events you have signed up for.
              </p>
              {userEvents?.length === 0 && !loading && (
                <p>It seems that you have'nt signed up for any events yet!</p>
              )}
              <section className="my-events-list">
                {userEvents?.map((event) => (
                  <div key={event.id} className="my-event-card">
                    <h2>{event.event_title}</h2>
                    {event.event_image_url ? (
                      <img
                        src={event.event_image_url}
                        alt={event.event_title}
                      />
                    ) : (
                      <img
                        src="https://hoqphugtdxjwawlawpzm.supabase.co/storage/v1/object/public/event-banners/1745446438551-b170870007dfa419295d949814474ab2_t.jpeg"
                        alt="Default Event"
                      />
                    )}
                    <div className="my-event-info">
                      <p>{event.event_description}</p>
                      <p>
                        Start Time:{" "}
                        {new Date(event.event_date).toLocaleString()}
                      </p>
                      <p>
                        Duration:{" "}
                        {getDuration(event.event_date, event.event_date_end)}
                      </p>
                      <p>Location: {event.event_location}</p>
                      <p>By {event.event_organizer}</p>
                    </div>
                    <a href={event.event_organizer_website} target="_blank">
                      {event.event_organizer_website}
                    </a>
                    <br />
                    <button
                      onClick={() => {
                        navigate(`/browse-events/${event.id}`);
                      }}
                      style={{ fontFamily: "SpecialGothic" }}
                    >
                      View More Details
                    </button>
                  </div>
                ))}{" "}
              </section>
            </div>
          )}
          {pageStatus === "my-created-events" && (
            <div className="my-created-events">
              <h2 className="my-events-page-subheading">My Created Events</h2>
              <p className="my-events-page-description">
                Here you can view the events you have created.
              </p>
              <button
                onClick={() => {
                  navigate("/create-event");
                }}
                className="create-event-button"
              >
                Create New Event
              </button>
              {userCreatedEvents?.length === 0 && !loading && (
                <p>It seems that you haven't created any events yet!</p>
              )}
              <section className="my-events-list">
                {userCreatedEvents?.map((event) => (
                  <div key={event.id} className="my-event-card">
                    <h2>{event.event_title}</h2>
                    {event.event_image_url ? (
                      <img
                        src={event.event_image_url}
                        alt={event.event_title}
                      />
                    ) : (
                      <img
                        src="https://hoqphugtdxjwawlawpzm.supabase.co/storage/v1/object/public/event-banners/1745446438551-b170870007dfa419295d949814474ab2_t.jpeg"
                        alt="Default Event"
                      />
                    )}
                    <div className="my-event-info">
                      <p>{event.event_description}</p>
                      <p>
                        Start Time:{" "}
                        {new Date(event.event_date).toLocaleString()}
                      </p>
                      <p>
                        Duration:{" "}
                        {getDuration(event.event_date, event.event_date_end)}
                      </p>
                      <p>Location: {event.event_location}</p>
                      <p>By {event.event_organizer}</p>
                    </div>
                    <a href={event.event_organizer_website} target="_blank">
                      {event.event_organizer_website}
                    </a>
                    <br />
                    <button
                      onClick={() => {
                        navigate(`/browse-events/${event.id}`);
                      }}
                      style={{ fontFamily: "SpecialGothic" }}
                    >
                      View and Manage Event
                    </button>
                  </div>
                ))}
              </section>
            </div>
          )}
        </main>
      )}
    </div>
  );
};
export default MyEvents;
