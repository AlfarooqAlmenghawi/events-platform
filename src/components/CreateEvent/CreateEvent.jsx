import "./CreateEvent.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
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
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  if (!token) {
    console.error("No token found in local storage");
    return <p className="event">Please log in to create an event.</p>;
  }

  const [user, setUser] = useState({ name: "", email: "" });

  const isEndDateValid = () => {
    const start = new Date(eventDetails.event_date);
    const end = new Date(eventDetails.event_date_end);
    return end > start;
  };

  const uploadImage = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await axios.post(
      "https://events-platform-backend-production.up.railway.app/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.url;
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

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setAnnouncement(
      "You are now on the Create Event page where you can create a new event."
    );
  }, []);

  return (
    <main className="event" id="main-content" tabIndex="-1">
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

      <h1 className="browse-events-page-title">Create Event</h1>

      <section className="create-event-form" aria-labelledby="form-heading">
        <form
          aria-describedby={error ? "form-error" : undefined}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isEndDateValid()) {
              setError("End date/time must be after start date/time.");
              return;
            }
            setLoading(true);
            try {
              const uploadedImageURL = await uploadImage();
              const response = await axios.post(
                "https://events-platform-backend-production.up.railway.app/events",
                { ...eventDetails, event_image_url: uploadedImageURL },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (response.status === 201) {
                navigate(`/browse-events/${response.data.id}`);
              }
            } catch (error) {
              if (error?.response?.status === 401) {
                setError("You are not signed in.");
              } else {
                setError(error.response?.data?.error || "An error occurred");
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          <fieldset>
            <legend>Event Details</legend>

            <div className="title-and-input">
              <label htmlFor="eventTitle">Event Title</label>
              <input
                id="eventTitle"
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
            </div>

            <div className="title-and-input">
              <label htmlFor="eventDescription">Event Description</label>
              <textarea
                id="eventDescription"
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
            </div>

            <div className="title-and-input">
              <label htmlFor="eventDate">Start Date and Time</label>
              <input
                id="eventDate"
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
            </div>

            <div className="title-and-input">
              <label htmlFor="eventDateEnd">End Date and Time</label>
              <input
                id="eventDateEnd"
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
            </div>

            <div className="title-and-input">
              <label htmlFor="eventLocation">Event Location</label>
              <input
                id="eventLocation"
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
            </div>
          </fieldset>

          <fieldset>
            <legend>Organizer Info</legend>
            <p>
              Your account name and email will be used as the event organizer.
            </p>

            <div className="title-and-input">
              <label htmlFor="organizerName">Organizer Name</label>
              <input
                id="organizerName"
                type="text"
                value={user.name}
                readOnly
              />
            </div>

            <div className="title-and-input">
              <label htmlFor="organizerEmail">Organizer Email</label>
              <input
                id="organizerEmail"
                type="text"
                value={user.email}
                readOnly
              />
            </div>

            <div className="title-and-input">
              <label htmlFor="organizerPhone">Organizer Phone</label>
              <input
                id="organizerPhone"
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
            </div>

            <div className="title-and-input">
              <label htmlFor="organizerWebsite">Organizer Website</label>
              <input
                id="organizerWebsite"
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
            </div>
          </fieldset>

          <fieldset>
            <legend>Event Banner</legend>
            <div className="title-and-input">
              <label htmlFor="eventBanner">
                Upload Event Banner (choose a file or drag & drop)
              </label>
              <input
                id="eventBanner"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  if (file) setImageURL(URL.createObjectURL(file));
                }}
                className="file-input"
                required
              />
            </div>

            {imageURL && (
              <>
                <p>Banner Preview:</p>
                <img
                  src={imageURL}
                  alt="Preview of uploaded event banner"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              </>
            )}
          </fieldset>

          <div className="create-event-form-button-div">
            <button
              type="submit"
              disabled={loading}
              className="create-event-form-button"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>

          <div aria-live="assertive">
            {error && (
              <p id="form-error" role="alert" style={{ color: "red" }}>
                {error}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateEvent;
