import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {extractErrorMessage} from '../../utils/errorHandler';
import {getCart, incrementItem, decrementItem, removeItem} from '../../api/cartApi';
import {placeOrder} from '../../api/orderApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const {RenderError, showError} = useError();

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await getCart();
      if (response) {
        setCart(response.data || response);
      } else {
        showError("Failed to load cart");
      }
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAction = async (actionFn, id) => {
    setIsProcessing(true);
    try {
      const response = await actionFn(id);
      if (!response?.statusCode || response.statusCode === 200) {
        await fetchCart();
      }
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await placeOrder();
      if (!response?.statusCode || response.statusCode === 200) {
        const newOrder = response.data || response;
        setMessage("Order created! Redirecting to secure payment...");
        setTimeout(() => {
          setMessage(null);
          navigate(`/payment?orderid=${newOrder.id}&amount=${cart.totalAmount}`);
        }, 1500);
      }
    } catch (error) {
      showError(extractErrorMessage(error));
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (<div className="cart-container">
      <div className="cart-loading">Loading your cart...</div>
    </div>);
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (<div className="cart-container">
      {RenderError}
      <div className="empty-cart-message">
        <h2>Your Cart is Empty</h2>
        <p>Browse our menu to add items to your order.</p>
        <button onClick={() => navigate('/menu')} className="btn-primary">
          Browse Menu
        </button>
      </div>
    </div>);
  }

  return (<div className="cart-container">
    {RenderError}
    {message && (<div className="alert success-alert">✓ {message} Redirecting to your orders...
    </div>)}
    <h1 className="cart-title">Your Shopping Cart</h1>
    <div className="cart-layout">
      <div className="cart-items-list">
        {cart.items.map((item) => (<div key={item.id} className="cart-item-card">
          <div className="cart-item-image-wrapper">
            <Link to={`/menu/${item.productId}`}>
              <img
                  src={item.productImageUrl && !item.productImageUrl.includes('loremflickr.com') ? item.productImageUrl : FALLBACK_IMAGE}
                  alt={item.productName}
                  className="cart-item-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
              />
            </Link>
          </div>
          <div className="cart-item-details">
            <Link to={`/menu/${item.productId}`} className="cart-item-link">
              <h3 className="cart-item-name">{item.productName}</h3>
            </Link>
            <p className="cart-item-description">{item.description}</p>
            <p className="cart-item-unit-price">
              ${Number(item.pricePerUnit || item.unitPrice || 0).toFixed(2)} each
            </p>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                    onClick={() => handleAction(decrementItem, item.productId)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1 || isProcessing}>−
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                    onClick={() => handleAction(incrementItem, item.productId)}
                    className="quantity-btn"
                    disabled={isProcessing}>+
                </button>
              </div>
              <button
                  onClick={() => handleAction(removeItem, item.id)}
                  className="remove-btn"
                  disabled={isProcessing}>Remove
              </button>
            </div>
          </div>
          <div className="cart-item-subtotal">
            <span className="subtotal-label">Subtotal</span>
            <span className="subtotal-amount">${Number(item.subtotal || item.totalPrice || 0).toFixed(2)}</span>
          </div>
        </div>))}
      </div>
      <div className="cart-sidebar">
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${Number(cart.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${Number(cart.totalAmount || 0).toFixed(2)}</span>
          </div>
          <button
              onClick={handleCheckout}
              className="btn-primary checkout-btn"
              disabled={isProcessing || message}>{isProcessing ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  </div>);
};

export default CartPage;