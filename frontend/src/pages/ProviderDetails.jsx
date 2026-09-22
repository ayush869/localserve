import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProviderDetails.css";

function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [error, setError] = useState("");

  const [booking, setBooking] = useState({
    bookingDate: "",
    bookingTime: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all providers because your current backend
        // already has GET /api/providers.
        const providerResponse = await fetch("/api/providers");
        const providerData = await providerResponse.json();

        if (!providerResponse.ok) {
          throw new Error("Unable to load provider");
        }

        const foundProvider = providerData.providers?.find(
          (item) => item._id === id
        );

        if (!foundProvider) {
          throw new Error("Provider not found");
        }

        setProvider(foundProvider);

        const serviceResponse = await fetch(
          `/api/services/provider/${id}`
        );

        const serviceData = await serviceResponse.json();

        if (serviceResponse.ok) {
          setServices(serviceData.services || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load provider details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [id]);
  
const openBooking = (service) => {
  navigate("/booking", {
    state: {
      provider,
      service,
    },
  });
};

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login before booking.");
      return;
    }

    if (!selectedService) return;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: user.id,
          provider: provider._id,
          service: selectedService._id,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          location: {
            address: booking.address,
            latitude: null,
            longitude: null,
          },
          description: booking.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create booking"
        );
      }

      alert("Booking request sent successfully!");

      setBookingOpen(false);

      setBooking({
        bookingDate: "",
        bookingTime: "",
        address: "",
        description: "",
      });

      navigate("/bookings");
    } catch (err) {
      console.error(err);
      alert(err.message || "Booking failed.");
    }
  };

  if (loading) {
    return (
      <div className="provider-details-loading">
        <div className="details-loader"></div>
        <p>Loading provider...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="provider-details-error">
        <div>⚠️</div>
        <h2>Provider unavailable</h2>
        <p>{error || "Provider could not be found."}</p>
        <Link to="/services">← Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="provider-details-page">

      {/* BACK */}
      <div className="provider-topbar">
        <Link to="/services">
          ← Back to Services
        </Link>
      </div>

      {/* PROVIDER HERO */}
      <section className="provider-profile-hero">

        <div className="provider-profile-card">

          <div className="provider-avatar-large">
            {provider.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="provider-main-info">
            <div className="provider-title-row">
              <h1>{provider.name}</h1>

              {provider.isAvailable && (
                <span className="available-badge">
                  <span></span>
                  Available
                </span>
              )}
            </div>

            <p className="provider-category">
              {provider.category} Service Provider
            </p>

            <div className="provider-location">
              📍 {provider.city || "Local Area"}
              {provider.address &&
                ` • ${provider.address}`}
            </div>
          </div>

          <div className="provider-contact">
            <a href={`tel:${provider.phone}`}>
              📞 Contact
            </a>
          </div>

        </div>

        {/* QUICK INFO */}
        <div className="provider-stats">

          <div>
            <span>Experience</span>
            <strong>
              {provider.experience || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Category</span>
            <strong>{provider.category}</strong>
          </div>

          <div>
            <span>Availability</span>
            <strong>
              {provider.isAvailable
                ? "Currently Available"
                : "Unavailable"}
            </strong>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <main className="provider-details-content">

        <section className="provider-about">

          <div className="section-heading">
            <span>ABOUT PROVIDER</span>
            <h2>Professional service you can request</h2>
          </div>

          <p>
            {provider.description ||
              `${provider.name} provides ${provider.category?.toLowerCase()} services in the local area.`}
          </p>

        </section>

        {/* SERVICES */}
        <section className="provider-services">

          <div className="section-heading">
            <span>AVAILABLE SERVICES</span>
            <h2>Choose a service</h2>
          </div>

          {services.length === 0 ? (
            <div className="no-provider-services">
              <span>🛠️</span>
              <h3>No services listed yet</h3>
              <p>
                This provider has not added individual services yet.
              </p>
            </div>
          ) : (
            <div className="provider-service-grid">

              {services.map((service) => (
                <div
                  className="provider-service-card"
                  key={service._id}
                >
                  <div className="service-card-icon">
                    {service.category === "Plumbing"
                      ? "🔧"
                      : service.category === "Electrical"
                      ? "⚡"
                      : service.category === "Carpentry"
                      ? "🪚"
                      : service.category === "Cleaning"
                      ? "🧹"
                      : service.category === "Painting"
                      ? "🎨"
                      : "🛠️"}
                  </div>

                  <span className="mini-category">
                    {service.category}
                  </span>

                  <h3>{service.name}</h3>

                  <p>
                    {service.description ||
                      "Professional local service."}
                  </p>

                  <div className="provider-service-bottom">

                    <div>
                      <span>Starting from</span>
                      <strong>₹{service.price}</strong>
                    </div>

                    <button
                      onClick={() => openBooking(service)}
                      disabled={!provider.isAvailable}
                    >
                      {provider.isAvailable
                        ? "Book Now"
                        : "Unavailable"}
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

      </main>


    </div>
  );
}

export default ProviderDetails;