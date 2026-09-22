import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Services.css";

const categories = [
  "All",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Vehicle Repair",
  "Appliance Repair",
  "Other",
];

function Services() {
  const [services, setServices] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "All";

  const [search, setSearch] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/services");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch services");
        }

        setServices(data.services || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const updateFilters = (newSearch, newCategory) => {
    const params = {};

    if (newSearch.trim()) {
      params.search = newSearch.trim();
    }

    if (newCategory !== "All") {
      params.category = newCategory;
    }

    setSearchParams(params);
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "All" ||
        service.category?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        service.name?.toLowerCase().includes(searchText) ||
        service.category?.toLowerCase().includes(searchText) ||
        service.description?.toLowerCase().includes(searchText) ||
        service.provider?.name?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [services, search, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateFilters(search, category);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    updateFilters(value, selectedCategory);
  };

  const getProviderId = (service) => {
    if (!service.provider) return null;

    return typeof service.provider === "object"
      ? service.provider._id
      : service.provider;
  };

  return (
    <div className="services-page">

      {/* HEADER */}
      <section className="services-hero">
        <div className="services-hero-content">
          <span className="services-badge">
            LOCAL SERVICES
          </span>

          <h1>
            Find the right
            <span> service for you</span>
          </h1>

          <p>
            Explore local professionals and choose a service
            that matches your requirements.
          </p>

          <div className="services-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search for a service..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {search && (
              <button
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="services-main">

        {/* CATEGORY FILTER */}
        <div className="category-filter">
          <div className="filter-heading">
            <span className="section-label">
              BROWSE CATEGORIES
            </span>

            <span className="result-count">
              {filteredServices.length} services
            </span>
          </div>

          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "category-pill active"
                    : "category-pill"
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="services-error">
            <span>⚠️</span>

            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>

            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="services-loading">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="service-skeleton" key={index}>
                <div className="skeleton-icon"></div>
                <div className="skeleton-line large"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredServices.length === 0 && (
            <div className="services-empty">
              <div className="empty-icon">🔎</div>

              <h2>No services found</h2>

              <p>
                Try another search term or select a different
                category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSearchParams({});
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* SERVICE GRID */}
        {!loading &&
          !error &&
          filteredServices.length > 0 && (
            <div className="services-grid">
              {filteredServices.map((service) => {
                const providerId = getProviderId(service);

                return (
                  <article
                    className="service-card"
                    key={service._id}
                  >
                    <div className="service-card-top">
                      <div className="service-icon">
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
                          : service.category ===
                            "Vehicle Repair"
                          ? "🚗"
                          : service.category ===
                            "Appliance Repair"
                          ? "🔌"
                          : "🛠️"}
                      </div>

                      <span className="service-category">
                        {service.category}
                      </span>
                    </div>

                    <h2>{service.name}</h2>

                    <p className="service-description">
                      {service.description ||
                        "Professional local service available through LocalServe."}
                    </p>

                    <div className="provider-info">
                      <div className="provider-avatar">
                        {service.provider?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </div>

                      <div>
                        <span>Provided by</span>

                        <strong>
                          {service.provider?.name ||
                            "Local Provider"}
                        </strong>
                      </div>
                    </div>

                    <div className="service-bottom">
                      <div>
                        <span className="price-label">
                          Starting from
                        </span>

                        <strong className="service-price">
                          ₹{service.price}
                        </strong>
                      </div>

                      {providerId ? (
                        <Link
                          to={`/providers/${providerId}`}
                          className="service-button"
                        >
                          View Provider →
                        </Link>
                      ) : (
                        <button
                          className="service-button disabled"
                          disabled
                        >
                          Provider unavailable
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}

export default Services;