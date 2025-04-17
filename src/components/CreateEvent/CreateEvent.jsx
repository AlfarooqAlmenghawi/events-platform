import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CreateEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    event_location: "",
    event_organizer_phone: "",
    event_organizer_website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookies.get("authToken");

  if (!token) {
    console.error("No token found in local storage");
    return <p>Please log in to create an event.</p>;
  }

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

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

  return (
    <div>
      <h1>Create Event</h1>
      {/* Add your form and logic here */}
      <section>
        // Form to create an event
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const response = await axios.post(
                "https://events-platform-backend-production.up.railway.app/events",
                {
                  ...eventDetails,
                }
              );
              if (response.status === 201) {
                console.log("Event created successfully");
                const data = response.data;
                console.log("Event created:", data);
              }
            } catch (error) {
              if (error.status === 401) {
                setError("You are not signed in.");
                return;
              }
              setError(error.response.data.error);
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
              setEventDetails({ ...eventDetails, event_title: e.target.value })
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
              setEventDetails({ ...eventDetails, event_date: e.target.value })
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
            {loading ? "Creating..." : "Create Event"}
          </button>
          {error && <p>{error}</p>}
        </form>
      </section>
    </div>
  );
};

export default CreateEvent;
