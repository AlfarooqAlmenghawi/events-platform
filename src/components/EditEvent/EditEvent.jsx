import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { event_id } = useParams();

  const [eventDetails, setEventDetails] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    event_location: "",
    event_organizer_phone: "",
    event_organizer_website: "",
    event_date_end: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const token = Cookies.get("authToken");

  if (!token) {
    console.error("No token found in local storage");
    return <p>Please log in to edit an event or yours.</p>;
  }

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const isEndDateValid = () => {
    const start = new Date(eventDetails.event_date);
    const end = new Date(eventDetails.event_date_end);
    return end > start;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "https://events-platform-backend-production.up.railway.app/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser({
          name: response.data.first_name + " " + response.data.last_name,
          email: response.data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        // Format date fields for input[type=datetime-local]
        const formatDateTimeLocal = (datetime) =>
          datetime ? datetime.slice(0, 16) : "";

        setEventDetails({
          ...data,
          event_date: formatDateTimeLocal(data.event_date),
          event_date_end: formatDateTimeLocal(data.event_date_end),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchEventDetails();
  }, [event_id, token]);

  return (
    <div>
      {eventDetails.is_owner ? (
        <>
          <h1>Edit Event</h1>
          <section className="edit-event-form">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!isEndDateValid()) {
                  setError("End date/time must be after start date/time.");
                  return;
                }

                setLoading(true);
                try {
                  const response = await axios.put(
                    `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
                    {
                      ...eventDetails,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    const data = response.data;
                    console.log("Event created:", data);
                    navigate(`/browse-events/${event_id}`);
                  }
                } catch (error) {
                  if (error.status === 401) {
                    setError("You are not signed in.");
                    return;
                  }
                  setError(error.response?.data?.error || "An error occurred");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Event Title"
                value={eventDetails.event_title}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_title: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Event Description"
                value={eventDetails.event_description}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_description: e.target.value,
                  })
                }
                required
              ></textarea>
              <input
                type="datetime-local"
                value={eventDetails.event_date}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_date: e.target.value,
                  })
                }
                required
              />
              <input
                type="datetime-local"
                value={eventDetails.event_date_end}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_date_end: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Event Location"
                value={eventDetails.event_location}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_location: e.target.value,
                  })
                }
                required
              />
              <input type="text" placeholder={user.name} disabled />
              <input type="text" placeholder={user.email} disabled />
              <input
                type="text"
                placeholder="Organizer Phone"
                value={eventDetails.event_organizer_phone}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_organizer_phone: e.target.value,
                  })
                }
                required
              />
              <input
                type="url"
                placeholder="Organizer Website"
                value={eventDetails.event_organizer_website}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    event_organizer_website: e.target.value,
                  })
                }
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Editing..." : "Edit Event"}
              </button>
              {error && <p>{error}</p>}
            </form>
          </section>
          <h1>Delete Event</h1>
          <section className="delete-event-form">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const response = await axios.delete(
                    `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    console.log("Event deleted:", response.data);
                    navigate("/my-events");
                  }
                } catch (error) {
                  if (error.status === 401) {
                    setError("You are not signed in.");
                    return;
                  }
                  setError(error.response?.data?.error || "An error occurred");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <button type="submit" disabled={loading}>
                {loading ? "Deleting..." : "Delete Event"}
              </button>
            </form>
            {error && <p>{error}</p>}
          </section>{" "}
        </>
      ) : (
        <p>You are not the owner of this event.</p>
      )}
    </div>
  );
};

export default EditEvent;
