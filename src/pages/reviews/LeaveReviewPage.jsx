import {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {getProductById} from '../../api/productApi';
import {createProductReview} from '../../api/reviewApi';
import {useError} from '../../components/ErrorDisplay';
import {extractErrorMessage} from '../../utils/errorHandler';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const LeaveReviewPage = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const menuId = urlParams.get('menuId') || urlParams.get('productId');
  const orderId = urlParams.get('orderId');

  const navigate = useNavigate();
  const {RenderError, showError} = useError();
  const timerRef = useRef(null);

  const [menu, setMenu] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getProductById(menuId);
        setMenu(data);
      } catch (error) {
        showError(extractErrorMessage(error));
      }
    };

    if (menuId) {
      fetchMenu();
    } else {
      showError("No Menu Item specified");
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [menuId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await createProductReview({
        productId: menuId, orderId: orderId, rating: rating, comment: comment
      });

      setSuccess(true);
      timerRef.current = setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (<div className="leave-review-container">
    <div className="review-header">
      <h1 className="review-title">Leave a Review</h1>
      {menu && (<div className="menu-item-info">
        <img
            src={menu.imageUrl && !menu.imageUrl.includes('loremflickr.com') ? menu.imageUrl : FALLBACK_IMAGE}
            alt={menu.name}
            className="menu-item-image-review"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
        />
        <h2 className="menu-item-name">{menu.name}</h2>
      </div>)}
    </div>
    <form onSubmit={handleSubmit} className="review-form">
      <div className="rating-section">
        <label className="review-label">Your Rating</label>
        <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (<button
              key={star}
              type="button"
              className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              aria-label={`Rate ${star} out of 10`}>★
          </button>))}
        </div>
        <div className="rating-value">{rating} / 10</div>
      </div>
      <div className="comment-section">
        <label htmlFor="comment" className="review-label">Your Review</label>
        <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this dish..."
            className="review-textarea"
            required
        />
      </div>
      {RenderError}
      {success && (<div className="alert success-alert">
        ✓ Review submitted successfully! Redirecting back...
      </div>)}
      <div className="form-actions">
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={isSubmitting || success}>Cancel
        </button>
        <button
            type="submit"
            className="btn btn-primary"
            disabled={rating === 0 || isSubmitting || success}>{isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  </div>);
};

export default LeaveReviewPage;