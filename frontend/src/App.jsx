import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ProviderDetails from "./pages/ProviderDetails";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import ProvidersMap from "./pages/ProvidersMap";
import JoinProvider from "./pages/JoinProvider";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderRegistration from "./pages/ProviderRegistration";
import ProviderWorkspace from "./pages/ProviderWorkspace";

import Booking from "./pages/Booking";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/providers-map" element={<ProvidersMap />} />

          {/* Provider */}
          <Route path="/join-provider" element={<JoinProvider />} />
          <Route path="/provider-login" element={<ProviderLogin />} />
          <Route
            path="/provider-registration"
            element={<ProviderRegistration />}
          />
          <Route
            path="/provider-workspace"
            element={<ProviderWorkspace />}
          />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;