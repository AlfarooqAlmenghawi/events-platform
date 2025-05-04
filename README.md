# 🗓️ Events Platform – Frontend (React on Netlify)

This is a responsive web app built for small communities or businesses to create, manage and browse events, supporting sign-ups and google calendar integration. This is the frontend (React) repository of the full-stack project.

🔗 Live site: https://alfarooq-events-platform.netlify.app/

⚙️ Backend API repo: https://github.com/AlfarooqAlmenghawi/events-platform-backend

## Features (MVP)

1. Users browse a list of community events
2. Users sign up for events (JWT-authenticated)
3. Add events to your Google Calendar (Google Calendar API)
4. Staff can use the same login & registration page to create, edit and delete events and the option to kick out attendees
5. Event can contain banners with image uploads via Supabase
6. Fully navigatable by keyboard
7. Screen reader support & semantic HTML

## 🧪 Test Account Details

Test Account Access Details (to browse events as a user or create and manage events as a staff member):

```
Email: test@eventsplatform.com
Password: Eventsplatform8
```

## Here's How to Run This Project Locally

Copy, paste and run the following commands in your terminal (it will download the repository into the current directory in your terminal):

```

git clone https://github.com/AlfarooqAlmenghawi/events-platform.git
cd events-platform
npm install
npm run dev

```

Then hold the Crtl key (or cmd on Mac) and click on the link provided by Vite (Usually http://localhost:5173, exact host link may vary.)

## 🧠 Tech Stacks

**React & Vite** - frameworks used for the layout of the entire project

**Axios & JS Cookies** - frameworks used for communicating with the backend for various tasks e.g. sending login data to the backend, and recieving the JWT token to store in the browser as a cookie (which keeps the user logged in for up to 7 days.)

**Supabase Storage** - Used for implementing image uploads and storing images (event banners)

**Google Calendar API** - Used for **Calendar Integration** to register events on the user's Google Calendar and includes OAuth for sign in with the user's gmail account that they prefer to use to save said event.

**Netlify** - Used for hosting the project for public access on a web browser and on mobile phones which contains layout responsiveness across devices

## 🔒 Accessibility

Tab navigation is enabled for all major elements. Form fields use proper labels to signal what it is for. ARIA labels added to buttons/links where necessary

# _🛠️ Known Issues / Work in Progress_

Some screen reader feedback (e.g., password inputs) is imperfect. More refinement could be made to keyboard tab order and ARIA live regions, however some screen readers may pick up feedback better than others.

📂 Backend Setup (API)
The backend Express API is available here. Follow its README to run the server locally.

```
https://events-platform-backend-production.up.railway.app/
```
