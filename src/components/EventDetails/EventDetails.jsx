import "./EventDetails.css";

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { gapi } from "gapi-script";
import { AuthContext } from "../../context/AuthContext.jsx";

const EventDetails = () => {
  const { user, logout } = useContext(AuthContext);
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
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonAttendeeIdStatus, setButtonAttendeeIdStatus] = useState(null);

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
      setButtonLoading(true);
      const response = await axios.delete(
        `https://events-platform-backend-5pjx.onrender.com/events/${event_id}/signup`,
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
    } finally {
      setButtonLoading(false);
    }
  }

  async function signup() {
    try {
      setButtonLoading(true);
      const response = await axios.post(
        `https://events-platform-backend-5pjx.onrender.com/events/${event_id}/signup`,
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
    } finally {
      setButtonLoading(false);
    }
  }

  async function addToGoogleCalendar() {
    try {
      setButtonLoading(true);
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
        setPopup("Error adding to Google Calendar.");
      }

      const profile = user.getBasicProfile();
      setUserGmail(profile.getEmail());
    } catch (err) {
      setPopup("Error adding to Google Calendar.");
    } finally {
      setButtonLoading(false);
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

  async function removeAttendee(attendee_id) {
    try {
      setButtonLoading(true);
      setButtonAttendeeIdStatus(attendee_id);
      const response = await axios.delete(
        `https://events-platform-backend-5pjx.onrender.com/events/${event_id}/attendees/${attendee_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setPopup("Attendee removed from event!");
        setTimeout(() => setPopup(null), 3000); // auto-close after 3 seconds
      }
      const response2 = await axios.get(
        `https://events-platform-backend-5pjx.onrender.com/events/${event_id}/attendees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEventAttendees(response2.data);
    } catch (error) {
      setPopup(null);
      if (error.status === 403) {
        setPopup("You are not authorized to remove this attendee.");
      } else if (error.status === 404) {
        setPopup("Attendee not found.");
      } else {
        setPopup("Error removing attendee.");
      }
      setTimeout(() => setPopup(null), 3000); // auto-close after 3 seconds
    } finally {
      setButtonLoading(false);
    }
  }

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
          `https://events-platform-backend-5pjx.onrender.com/events/${event_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvent(response.data);
        setIsSignedUp(response.data.is_signed_up);
        const response2 = await axios.get(
          `https://events-platform-backend-5pjx.onrender.com/events/${event_id}/attendees`,
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

  if (loading) return <p className="event">Loading event details...</p>;
  if (error) return <p className="event">Error: {error.message}</p>;
  if (!event) return <p className="event">Event not found.</p>;

  return (
    <main className="event">
      <header className="event-header">
        <button
          onClick={() => {
            window.history.back();
          }}
          className="back-button"
        >
          Back
        </button>
        <>{popup && <Popup message={popup} onClose={() => setPopup(null)} />}</>
        {event.is_owner && (
          <button
            onClick={() => {
              navigate(`/edit-event/${event.id}`);
            }}
            className="edit-button"
          >
            Edit Event
          </button>
        )}
        <h1 className="event-title">{event.event_title}</h1>
      </header>
      <section className="event-content">
        <main className="event-main">
          <img
            className="event-image"
            src={event.event_image_url}
            alt={event.event_title}
          />
          <div className="event-data">
            <h4>Event Information</h4>
            <p>Start Time: {new Date(event.event_date).toLocaleString()}</p>
            {event.event_date_end && (
              <>
                <p>
                  End Time: {new Date(event.event_date_end).toLocaleString()}
                </p>
                <p>
                  Duration:{" "}
                  {getDuration(event.event_date, event.event_date_end)}
                </p>
              </>
            )}
            <p>Location: {event.event_location}</p>
            <p>Organized by: {event.event_organizer}</p>
            <a
              href={event.event_organizer_website}
              target="_blank"
              rel="noreferrer"
            >
              {event.event_organizer_website}
            </a>
          </div>
        </main>
        <h4>Description</h4>
        <p className="event-description">{event.event_description}</p>
      </section>
      <h4>Register</h4>
      {user ? (
        <>
          {event.is_signed_up ? (
            <>
              <p>
                You are currently signed up for this event. The event organiser
                can see that you have done so.
              </p>
              <button onClick={unsign} className="header-button">
                Remove me from this Event
              </button>
              {userGmail ? (
                <p>
                  You are currently signed in with Google account: {userGmail}{" "}
                  Click 'Add Event to Google Calendar' to add this event to your
                  calendar on Google.
                </p>
              ) : (
                <p>
                  You are not currently signed in with a Google account. Click
                  the 'Add Event to Google Calendar' button below to sign in and
                  add the event to Google Calendar.
                </p>
              )}
              {addedToCalendar ? (
                <button disabled className="header-button">
                  Added to Google Calendar
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAddToCalendarButtonClicked(true);
                    addToGoogleCalendar();
                  }}
                  className="header-button"
                >
                  Add Event to Google Calendar
                </button>
              )}
              {userGmail && (
                <button onClick={handleSignOut} className="header-button">
                  Sign Out from Google Calendar
                </button>
              )}
            </>
          ) : (
            <button onClick={signup} className="header-button">
              Sign Up For Event
            </button>
          )}
          {eventAttendees.length > 0 && (
            <div>
              <h4>Event Attendees</h4>
              {event.is_owner && (
                <p className="no-margin">
                  Since you are the event owner, you can see email addresses of
                  attendees for contacting purposes and you can also remove
                  attendees from this event at your own discretion.
                </p>
              )}
              {event.is_owner ? (
                <ul className="attendees">
                  {eventAttendees.map((attendee) => (
                    <li key={attendee.id} className="attendee-list">
                      {event.is_owner
                        ? attendee.first_name +
                          " " +
                          attendee.last_name +
                          " (" +
                          attendee.email +
                          ")"
                        : attendee.first_name + " " + attendee.last_name}{" "}
                      {event.is_owner && (
                        <button
                          onClick={() => removeAttendee(attendee.id)}
                          disabled={
                            buttonLoading &&
                            attendee.id === buttonAttendeeIdStatus
                          }
                          className="event-button"
                        >
                          {buttonLoading &&
                          attendee.id === buttonAttendeeIdStatus
                            ? "Removing..."
                            : "Remove Attendee from Event"}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  {eventAttendees.map((attendee, index, array) => {
                    return (
                      <span key={attendee.id}>
                        {attendee.first_name + " " + attendee.last_name}
                        {index === array.length - 1
                          ? ""
                          : index === array.length - 2
                          ? " and "
                          : ", "}
                      </span>
                    );
                  })}{" "}
                </p>
              )}
            </div>
          )}
          {eventAttendees.length === 0 && (
            <p>No attendees yet. Be the first to sign up!</p>
          )}
        </>
      ) : (
        <div>
          <aside>
            <p>Please log in or sign up to register for the event.</p>
          </aside>
          <div className="sign-in-div">
            <button
              onClick={() => navigate("/login")}
              className="header-button"
            >
              Login
            </button>
            <h1>Or</h1>
            <button
              onClick={() => navigate("/signup")}
              className="header-button"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default EventDetails;
