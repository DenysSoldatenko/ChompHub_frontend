import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getMyOrders} from '../../api/orderApi';
import {extractErrorMessage} from '../../utils/errorHandler';
import {useError} from '../../components/ErrorDisplay';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {RenderError, showError} = useError();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getMyOrders();
        const ordersList = Array.isArray(data) ? data : data?.content || [];
        setOrders(ordersList);
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
        <div className="order-history-container">
          <div className="order-loading">Loading order history...</div>
        </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
        <div className="order-history-container">
          {RenderError}
          <div className="no-orders-message">
            <p>You have no previous orders.</p>
          </div>
        </div>
    );
  }

  return (
      <div className="order-history-container">
        {RenderError}
        <h1 className="order-history-title">Your Order History</h1>
        <div className="order-list">
          {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order ID: {order.id}</span>
                  <span className="order-date">Date: {formatDate(order.createdAt)}</span>
                  <span className="order-status">
                Status: <span className={`status-${(order.status || '').toLowerCase()}`}>{order.status}</span>
              </span>
                  <span className="order-total">
                Total: ${Number(order.totalAmount || 0).toFixed(2)}
              </span>
                </div>
                <div className="order-items">
                  <h2 className="order-items-title">Order Items:</h2>
                  {order.orderItems?.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-details">
                          {item.productId ? (
                              <Link to={`/menu/${item.productId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                <span className="item-name">{item.productName}</span>
                              </Link>
                          ) : (
                              <span className="item-name">{item.productName}</span>
                          )}
                          <span className="item-description">{item.description}</span>
                          <span className="item-quantity">Quantity: {item.quantity}</span>
                          <span className="item-price">
                      Price: ${Number(item.unitPriceSnapshot || 0).toFixed(2)}
                    </span>
                          <span className="subtotal">
                      Subtotal: ${Number(item.totalPrice || 0).toFixed(2)}
                    </span>
                        </div>
                        <div className="item-image-container">
                          {item.productId ? (
                              <Link to={`/menu/${item.productId}`}>
                                <img
                                    src={
                                      item.imageUrl && !item.imageUrl.includes('loremflickr.com')
                                          ? item.imageUrl
                                          : FALLBACK_IMAGE
                                    }
                                    alt={item.productName}
                                    className="item-image"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = FALLBACK_IMAGE;
                                    }}
                                />
                              </Link>
                          ) : (
                              <img
                                  src={
                                    item.imageUrl && !item.imageUrl.includes('loremflickr.com')
                                        ? item.imageUrl
                                        : FALLBACK_IMAGE
                                  }
                                  alt={item.productName}
                                  className="item-image"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = FALLBACK_IMAGE;
                                  }}
                              />
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default OrderHistoryPage;