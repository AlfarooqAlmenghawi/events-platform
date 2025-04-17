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
    <div>
      <h1>My Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      {!loading && (
        <main className="main-events-container">
          <section>
            <button
              onClick={() => {
                setPageStatus("my-signed-up-events");
              }}
            >
              My Signed Up Events
            </button>
            <button
              onClick={() => {
                setPageStatus("my-created-events");
              }}
            >
              My Created Events
            </button>
          </section>
          {pageStatus === "my-signed-up-events" && (
            <div className="my-signed-up-events">
              <h2>My Signed Up Events</h2>
              <p>Here you can view the events you have signed up for.</p>
              {userEvents?.length === 0 && !loading && (
                <p>It seems that you have'nt signed up for any events yet!</p>
              )}
              {userEvents?.map((event) => (
                <div key={event.id} className="event-card">
                  <h2>{event.event_title}</h2>
                  <p>{event.event_description}</p>
                  <p>Date: {new Date(event.event_date).toLocaleString()}</p>
                  <p>Location: {event.event_location}</p>
                  <p>By {event.event_organizer}</p>
                  <a href={event.event_organizer_website} target="_blank">
                    {event.event_organizer_website}
                  </a>
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
          )}
          {pageStatus === "my-created-events" && (
            <div className="my-created-events">
              <h2>My Created Events</h2>
              <button
                onClick={() => {
                  navigate("/create-event");
                }}
              >
                Create New Event
              </button>
              <p>Here you can view the events you have created.</p>
              {userCreatedEvents?.length === 0 && !loading && (
                <p>It seems that you have'nt created any events yet!</p>
              )}
              {userCreatedEvents?.map((event) => (
                <div key={event.id} className="event-card">
                  <h2>{event.event_title}</h2>
                  <p>{event.event_description}</p>
                  <p>Date: {new Date(event.event_date).toLocaleString()}</p>
                  <p>Location: {event.event_location}</p>
                  <p>By {event.event_organizer}</p>
                  <a href={event.event_organizer_website} target="_blank">
                    {event.event_organizer_website}
                  </a>
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
          )}
        </main>
      )}
    </div>
  );
};
export default MyEvents;
