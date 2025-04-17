import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { gapi } from "gapi-script";

const EventDetails = () => {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventAttendees, setEventAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("authToken");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [addToCalendarButtonClicked, setAddToCalendarButtonClicked] =
    useState(false);
  const [popup, setPopup] = useState(null);
  const [userGmail, setUserGmail] = useState(null);

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

  async function addToGoogleCalendar() {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = authInstance.currentUser.get();

      const isAuthorized = user.hasGrantedScopes(
        "https://www.googleapis.com/auth/calendar.events"
      );
      if (!isAuthorized) {
        await user.grant({
          scope: "https://www.googleapis.com/auth/calendar.events",
        });
      }

      const accessToken = user.getAuthResponse().access_token;
      if (!accessToken) throw new Error("Access token not available");

      const {
        event_title,
        event_description,
        event_date,
        event_location,
        event_date_end,
      } = event;

      const startDateTime = new Date(event_date).toISOString();
      const endDateTime = event_date_end
        ? new Date(event_date_end).toISOString()
        : new Date(
            new Date(event_date).getTime() + 2 * 60 * 60 * 1000
          ).toISOString();
      // Default to 2 hours later if no end date is provided
      const calendarEvent = {
        summary: event_title,
        description: event_description,
        start: {
          dateTime: startDateTime,
          timeZone: "UTC",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "UTC",
        },
        location: event_location,
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(calendarEvent),
        }
      );

      if (response.ok) {
        setPopup("Event added to Google Calendar!");
        setAddedToCalendar(true);
      } else {
        const error = await response.json();
        console.error("Calendar error:", error);
        setPopup("Error adding to Google Calendar.");
      }

      const profile = user.getBasicProfile();
      setUserGmail(profile.getEmail());
    } catch (err) {
      console.error("Error adding to Google Calendar:", err);
      setPopup("Error adding to Google Calendar.");
    } finally {
      setTimeout(() => setPopup(null), 3000);
    }
  }

  const handleSignOut = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signOut().then(() => {
        setUserGmail(null);
        setAddedToCalendar(false);
        setPopup(null);
        setPopup("Signed out of Google");
        setTimeout(() => setPopup(null), 3000);
      });
    }
  };

  useEffect(() => {
    const CLIENT_ID =
      "327814106325-vfsjfg49508c930r09n2djv2mvstk5bu.apps.googleusercontent.com";
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";
    const DISCOVERY_DOCS = [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ];

    const initClient = () => {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: DISCOVERY_DOCS,
          });

          const authInstance = gapi.auth2.getAuthInstance();

          // if (!authInstance.isSignedIn.get()) {
          //   await authInstance.signIn(); // Prompt user to sign in
          // }

          const user = authInstance.currentUser.get();
          const profile = user.getBasicProfile();

          if (profile) {
            setUserGmail(profile.getEmail());
          }
        } catch (err) {
          console.error("Google API init error:", err);
          setPopup("Failed to initialize Google Calendar access.");
          setTimeout(() => setPopup(null), 3000);
        }
      });
    };

    initClient();
  }, []);

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
        const response2 = await axios.get(
          `https://events-platform-backend-production.up.railway.app/events/${event_id}/attendees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEventAttendees(response2.data);
      } catch (error) {
        if (error.status === 404) {
          setEventAttendees([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id, isSignedUp]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div>
      <button
        onClick={() => {
          window.history.back();
        }}
      >
        Back
      </button>
      <>{popup && <Popup message={popup} onClose={() => setPopup(null)} />}</>
      <h1>{event.event_title}</h1>
      <p>{event.event_description}</p>
      <p>Start Date: {new Date(event.event_date).toLocaleString()}</p>
      {event.event_date_end && (
        <p>End Date: {new Date(event.event_date_end).toLocaleString()}</p>
      )}
      <p>Location: {event.event_location}</p>
      <p>Organized by: {event.event_organizer}</p>
      <a href={event.event_organizer_website} target="_blank" rel="noreferrer">
        {event.event_organizer_website}
      </a>
      <p>Google Email: {userGmail}</p>
      {event.is_signed_up ? (
        <>
          <p>You are signed up for this event!</p>
          <button onClick={unsign}>Remove Event</button>
          {addedToCalendar ? (
            <button disabled>Added to Google Calendar</button>
          ) : (
            <button
              onClick={() => {
                setAddToCalendarButtonClicked(true);
                addToGoogleCalendar();
              }}
            >
              Add Event to Google Calendar
            </button>
          )}

          <button onClick={handleSignOut}>Sign Out from Google Calendar</button>
        </>
      ) : (
        <button onClick={signup}>Sign Up For Event</button>
      )}
      {eventAttendees.length > 0 && (
        <div>
          <h2>Event Attendees:</h2>
          <ul>
            {eventAttendees.map((attendee) => (
              <>
                <li key={attendee.id}>
                  {attendee.first_name +
                    " " +
                    attendee.last_name +
                    " (" +
                    attendee.email +
                    ")"}
                </li>
                <button>Remove Attendee from Event</button>
              </>
            ))}
          </ul>
        </div>
      )}
      {eventAttendees.length === 0 && (
        <p>No attendees yet. Be the first to sign up!</p>
      )}
    </div>
  );
};

export default EventDetails;
