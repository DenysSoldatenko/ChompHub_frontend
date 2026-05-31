import {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getProductById} from '../../api/productApi';
import {getReviewsByProductId} from '../../api/reviewApi';
import {addItemToCart} from '../../api/cartApi';
import {isAuthenticated} from '../../utils/authStorage';
import {extractErrorMessage} from '../../utils/errorHandler';

const ProductPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const timerRef = useRef(null);
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productData, reviewsData] = await Promise.allSettled([getProductById(id), getReviewsByProductId(id)]);

        if (productData.status === 'fulfilled') setMenu(productData.value); else throw productData.reason;

        if (reviewsData.status === 'fulfilled') {
          const list = Array.isArray(reviewsData.value) ? reviewsData.value : reviewsData.value?.content || [];
          setReviews(list);
        }
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id]);

  const handleBackToMenu = () => navigate(-1);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      showError('Please login to add items to your cart.');
      timerRef.current = setTimeout(() => {
        navigate('/login', {state: {from: location}});
      }, 1500);
      return;
    }

    setIsAdding(true);
    setCartSuccess(false);

    try {
      await addItemToCart({productId: menu.id, quantity});
      setCartSuccess(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCartSuccess(false), 3000);
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (<div className="menu-details-container">
      <div className="menu-item-header skeleton-wrapper">
        <div className="skeleton-image skeleton-pulse"></div>
        <div className="menu-item-info">
          <div className="skeleton-text skeleton-title skeleton-pulse"></div>
          <div className="skeleton-text skeleton-desc skeleton-pulse"></div>
          <div className="skeleton-text skeleton-desc skeleton-pulse" style={{width: '60%'}}></div>
          <div className="skeleton-button skeleton-pulse mt-4"></div>
        </div>
      </div>
    </div>);
  }

  if (!menu) return <div className="menu-details-not-found">{RenderError}<h2>Dish not found</h2></div>;

  return (<div className="menu-details-container">
    {RenderError}
    <button onClick={handleBackToMenu} className="back-button">&larr; Back to Menu</button>
    <div className="menu-item-header">
      <div className="menu-item-image-container">
        <img
            src={menu.imageUrl || `https://picsum.photos/seed/${menu.id}/600/400`}
            alt={menu.name}
            className="menu-item-image-detail"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
        />
      </div>
      <div className="menu-item-info">
        <h1 className="menu-item-name">{menu.name}</h1>
        <p className="menu-item-description">{menu.description}</p>
        <div className="menu-item-price-rating">
          <span className="price">${Number(menu.basePrice || 0).toFixed(2)}</span>
          <div className="rating">
            <span className="rating-value">{Number(menu.averageRating || 0).toFixed(1)}</span>
            <span className="rating-star">★</span>
            <span className="rating-count">({menu.totalReviews || 0} reviews)</span>
          </div>
        </div>
        <div className="add-to-cart-section">
          <div className="quantity-selector">
            <button onClick={() => setQuantity(q => Math.max(q - 1, 1))} className="quantity-btn"
                    disabled={quantity <= 1 || isAdding}>-
            </button>
            <span className="quantity">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="quantity-btn" disabled={isAdding}>+</button>
          </div>
          <button onClick={handleAddToCart} className="add-to-cart-btn" disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
          {cartSuccess && <div className="cart-success-message">✓ Added to cart!</div>}
        </div>
      </div>
    </div>
    <div className="reviews-section">
      <h2 className="reviews-title">Customer Reviews</h2>
      {reviews.length > 0 ? (<div className="reviews-list">
        {reviews.map((review) => (<div key={review.id} className="review-card">
          <div className="review-header">
            <span className="review-user">{review.userName || 'Anonymous'}</span>
            <span className="review-date">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
          </div>
          <div className="review-rating">
            {'★'.repeat(Math.round(Math.min(review.rating, 5)))}
            {'☆'.repeat(Math.max(5 - Math.round(review.rating), 0))}
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>))}
      </div>) : (<p className="no-reviews">No reviews yet. Be the first to review!</p>)}
    </div>
  </div>);
};

export default ProductPage;