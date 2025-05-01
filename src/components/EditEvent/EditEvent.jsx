import "../CreateEvent/CreateEvent.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { event_id } = useParams();
  const [eventTitle, setEventTitle] = useState("");
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
  const [user, setUser] = useState({ name: "", email: "" });
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const [dataLoaded, setDataLoaded] = useState(false);

  const [announcement, setAnnouncement] = useState("");

  if (!token) {
    console.error("No token found in local storage");
    return <p className="event">Please log in to edit an event.</p>;
  }

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
    document.title = "Edit Event | Events Platform";
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          "https://events-platform-backend-production.up.railway.app/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser({
          name: res.data.first_name + " " + res.data.last_name,
          email: res.data.email,
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        const formatDateTime = (dt) => (dt ? dt.slice(0, 16) : "");
        setEventDetails({
          ...data,
          event_date: formatDateTime(data.event_date),
          event_date_end: formatDateTime(data.event_date_end),
        });
        setDataLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEventDetails();
  }, [event_id, token]);

  useEffect(() => {
    if (dataLoaded) {
      setAnnouncement(
        `You are now on the Edit Event page. You are currently editing the event: ${eventDetails.event_title}`
      );
    }
  }, [dataLoaded, eventDetails.event_title]);

  return (
    <div className="event">
      {/* Accessible live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          border: "0",
          padding: "0",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        {announcement}
      </div>

      {eventDetails.is_owner ? (
        <>
          <h1 className="browse-events-page-title">Edit Event</h1>
          <section
            className="create-event-form"
            aria-labelledby="edit-form-heading"
          >
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
                  const finalImageURL =
                    uploadedImageURL || eventDetails.event_image_url;
                  const res = await axios.put(
                    `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
                    { ...eventDetails, event_image_url: finalImageURL },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (res.status === 200)
                    navigate(`/browse-events/${event_id}`);
                } catch (err) {
                  if (err.status === 401) {
                    setError("You are not signed in.");
                  } else {
                    setError(err.response?.data?.error || "An error occurred");
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
                  <label htmlFor="eventEndDate">End Date and Time</label>
                  <input
                    id="eventEndDate"
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
                  <label htmlFor="eventLocation">Location</label>
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
                  Your account name and email will be used as the organizer
                  details.
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
                  {loading ? "Editing..." : "Edit Event"}
                </button>
              </div>

              <div aria-live="assertive">
                {error && (
                  <p id="form-error" className="error-text">
                    {error}
                  </p>
                )}
              </div>
            </form>
          </section>

          <h1 className="browse-events-page-title">Delete Event</h1>
          <section className="delete-event-form">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const res = await axios.delete(
                    `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (res.status === 200) navigate("/my-events");
                } catch (err) {
                  if (err.status === 401) {
                    setError("You are not signed in.");
                  } else {
                    setError(err.response?.data?.error || "An error occurred");
                  }
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="create-event-form-button-div">
                <button
                  type="submit"
                  disabled={loading}
                  className="create-event-form-button"
                >
                  {loading ? "Deleting..." : "Delete Event"}
                </button>
              </div>
            </form>
            <div aria-live="assertive">
              {error && <p className="error-text">{error}</p>}
            </div>
          </section>
        </>
      ) : (
        <p>You are not the owner of this event.</p>
      )}
    </div>
  );
};

export default EditEvent;
