import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import BrowseEvents from "./components/BrowseEvents/BrowseEvents.jsx";
import EventDetails from "./components/EventDetails/EventDetails.jsx";
import MyEvents from "./components/MyEvents/MyEvents.jsx";
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/browse-events" element={<BrowseEvents />} />
          <Route path="/browse-events/:event_id" element={<EventDetails />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
