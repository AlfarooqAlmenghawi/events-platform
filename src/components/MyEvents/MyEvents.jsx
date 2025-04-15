import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const MyEvents = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageStatus, setPageStatus] = useState("my-signed-up-events");

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
        if ((error.status = 403)) {
          setError(
            "Please login or create an account to view/create your events."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  return (
    <div>
      <h1>My Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p>Error fetching events: {error}</p>}
      {!(userEvents.length === 0) && (
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
                <p>You have no events. Create one!</p>
              )}
              {userEvents?.map((event) => (
                <div key={event.id} className="event-card">
                  <h2>{event.event_title}</h2>
                  <p>{event.event_description}</p>
                  <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
                  <p>Location: {event.event_location}</p>
                  <p>By {event.event_organizer}</p>
                  <a href={event.event_organizer_website} target="_blank">
                    {event.event_organizer_website}
                  </a>
                  <br />
                  <button>View More Details</button>
                </div>
              ))}
            </div>
          )}
          {pageStatus === "my-created-events" && (
            <div className="my-created-events">
              <h2>My Created Events</h2>
              <button>Create New Event</button>
            </div>
          )}
        </main>
      )}
    </div>
  );
};
export default MyEvents;
