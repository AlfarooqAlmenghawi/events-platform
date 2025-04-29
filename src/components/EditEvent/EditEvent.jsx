import "../CreateEvent/CreateEvent.css";

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

  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const navigate = useNavigate();

  const token = Cookies.get("authToken");

  if (!token) {
    console.error("No token found in local storage");
    return <p className="event">Please log in to edit an event or yours.</p>;
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

    console.log("📸 Uploaded image URL:", response.data.url);

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
    <div className="event">
      {eventDetails.is_owner ? (
        <>
          <h1 className="browse-events-page-title">Edit Event</h1>
          <section className="create-event-form">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!isEndDateValid()) {
                  setError("End date/time must be after start date/time.");
                  return;
                }

                setLoading(true);
                try {
                  // Upload the image first
                  const uploadedImageURL = await uploadImage();
                  const finalImageURL =
                    uploadedImageURL || eventDetails.event_image_url;

                  const response = await axios.put(
                    `https://events-platform-backend-production.up.railway.app/events/${event_id}`,
                    {
                      ...eventDetails,
                      event_image_url: finalImageURL, // include image URL
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    const data = response.data;
                    console.log("Event edited:", data);
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
              {" "}
              <div className="title-and-input">
                <label htmlFor="eventTitle">Event Title:</label>
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
              </div>
              <div className="title-and-input">
                <p>Event Description:</p>
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
              </div>
              <div className="title-and-input">
                <p>Event Date:</p>
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
              </div>
              <div className="title-and-input">
                <p>Event End Date:</p>
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
              </div>
              <div className="title-and-input">
                <p>Event Location:</p>
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
              </div>
              <h2>
                Note: Your Account Name and Email will be used as the event
                organizer.
              </h2>
              <div className="title-and-input">
                <p>Organizer Name:</p>
                <input type="text" placeholder={user.name} disabled />
              </div>
              <div className="title-and-input">
                <p>Organizer Email:</p>
                <input type="text" placeholder={user.email} disabled />
              </div>
              <div className="title-and-input">
                <p>Organizer Phone:</p>
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
              </div>
              <div className="title-and-input">
                <p>Organizer Website:</p>
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
              </div>{" "}
              <div className="title-and-input">
                <p>Event Banner: (Choose File or Drag and Drop)</p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) {
                      setImageURL(URL.createObjectURL(file)); // For preview
                    }
                  }}
                />
              </div>
              {imageURL && (
                <>
                  <p>Banner Preview:</p>
                  <img
                    src={imageURL}
                    alt="Event Banner Preview"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                </>
              )}
              <div className="create-event-form-button-div">
                <button
                  type="submit"
                  disabled={loading}
                  className="create-event-form-button"
                >
                  {loading ? "Editing..." : "Edit Event"}
                </button>
              </div>
              {error && <p>{error}</p>}
            </form>
          </section>
          <h1 className="browse-events-page-title">Delete Event</h1>
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
