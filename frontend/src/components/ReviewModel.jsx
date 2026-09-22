import { useState } from "react";
import "./ReviewModal.css";

function ReviewModal({ booking, customerId, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: booking._id,
          customer: customerId,
          provider:
            booking.provider?._id ||
            booking.provider?.id ||
            booking.provider,
          service:
            booking.service?._id ||
            booking.service?.id ||
            booking.service,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit review."
        );
      }

      onSubmitted(data.review);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-overlay" onClick={onClose}>
      <div
        className="review-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="review-close"
          onClick={onClose}
        >
          ×
        </button>

        <span className="review-eyebrow">
          SERVICE COMPLETED
        </span>

        <h2>How was your experience?</h2>

        <p className="review-subtitle">
          Your feedback helps other customers choose
          reliable local service providers.
        </p>

        <div className="review-service">
          <strong>
            {booking.service?.name || "Service"}
          </strong>

          <span>
            with {booking.provider?.name || "Provider"}
          </span>
        </div>

        <form onSubmit={submitReview}>
          <div className="rating-section">
            <label>Your Rating</label>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={
                    star <=
                    (hoverRating || rating)
                      ? "star active"
                      : "star"
                  }
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            {rating > 0 && (
              <span className="rating-text">
                {rating === 1 && "Poor"}
                {rating === 2 && "Below Average"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>

          <label className="review-label">
            Your Review
          </label>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Tell us about your experience..."
            maxLength={500}
            rows={5}
          />

          <div className="review-character-count">
            {comment.length}/500
          </div>

          {error && (
            <div className="review-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-review"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;