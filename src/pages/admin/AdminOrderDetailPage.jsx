import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getOrderById, updateOrderStatusAdmin} from '../../api/orderApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const ORDER_STATUSES = [{value: 'PENDING', label: 'Pending'}, {
  value: 'CONFIRMED', label: 'Confirmed'
}, {value: 'PREPARING', label: 'Preparing'}, {value: 'IN_TRANSIT', label: 'In Transit'}, {
  value: 'DELIVERED', label: 'Delivered'
}, {value: 'CANCELLED', label: 'Cancelled'}];

const AdminOrderDetailPage = () => {
  const {id} = useParams();
  const [order, setOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {RenderError, showError} = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id);
      if (response) {
        setOrder(response.data || response);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!newStatus || newStatus === order.status) return;
    setIsUpdating(true);
    try {
      await updateOrderStatusAdmin(id, newStatus);
      await fetchOrder();
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) {
    return (<div className="admin-detail-wrapper">
      {RenderError}
      <div className="admin-loading-state">Loading order details...</div>
    </div>);
  }

  return (<div className="admin-detail-wrapper">
    {RenderError}
    <div className="admin-detail-header">
      <div>
        <span className="admin-breadcrumb">Orders / Management</span>
        <h1 className="admin-order-title">Order Details #{order.id}</h1>
      </div>
      <button
          type="button"
          className="admin-back-btn"
          onClick={() => navigate('/admin/orders')}>&larr; Back to Orders
      </button>
    </div>
    <div className="order-detail-grid">
      <div className="order-info-column">
        <div className="detail-card">
          <h3 className="card-heading">Order Summary</h3>
          <div className="info-row">
            <span className="info-label">Order Date:</span>
            <span className="info-value">
                {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB') : 'N/A'}
              </span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Amount:</span>
            <span className="info-value highlight-value">
                ${Number(order.totalAmount || 0).toFixed(2)}
              </span>
          </div>
          <div className="info-row">
            <span className="info-label">Customer Email:</span>
            <span className="info-value email-value" title={order.userEmail}>
                {order.userEmail || 'Unknown Customer'}
              </span>
          </div>
        </div>
        <div className="detail-card">
          <h3 className="card-heading">Status Management</h3>
          <div className="info-row status-row">
            <span className="info-label">Current Status:</span>
            <span className={`status-badge status-${(order.status || 'unknown').toLowerCase()}`}>
                {order.status || 'UNKNOWN'}
              </span>
          </div>
          <div className="update-status-group">
            <label htmlFor="statusSelect" className="info-label">
              Update Status To:
            </label>
            <select
                id="statusSelect"
                value={order.status || ''}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="admin-status-select"
                disabled={isUpdating}>
              {ORDER_STATUSES.map((st) => (<option key={st.value} value={st.value}>
                {st.label}
              </option>))}
            </select>
          </div>
        </div>
      </div>
      <div className="order-items-column">
        <div className="detail-card items-card">
          <h3 className="card-heading">Order Items</h3>
          <div className="table-responsive">
            <table className="order-items-table">
              <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Subtotal</th>
              </tr>
              </thead>
              <tbody>
              {order.orderItems && order.orderItems.length > 0 ? (order.orderItems.map((item, index) => {
                const itemName = item.productName || item.name || 'Unknown Item';
                const itemImage = item.productImageUrl || item.imageUrl || FALLBACK_IMAGE;
                const itemPrice = Number(item.unitPriceSnapshot ?? item.unitPrice ?? item.price ?? 0);
                const itemQty = Number(item.quantity || 1);
                const itemSubtotal = itemPrice * itemQty;
                return (<tr key={item.id || index}>
                  <td>
                    <div className="item-cell-wrapper">
                      <img
                          src={itemImage}
                          alt={itemName}
                          className="item-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                      />
                      <span className="item-name-text">{itemName}</span>
                    </div>
                  </td>
                  <td className="price-col">${itemPrice.toFixed(2)}</td>
                  <td className="qty-col text-center">x{itemQty}</td>
                  <td className="text-right fw-bold">
                    ${itemSubtotal.toFixed(2)}
                  </td>
                </tr>);
              })) : (<tr>
                <td colSpan="4" className="empty-state">
                  No items found in this order.
                </td>
              </tr>)}
              </tbody>
              {order.orderItems && order.orderItems.length > 0 && (<tfoot>
              <tr className="tfoot-total-row">
                <td colSpan="3" className="text-right">Grand Total:</td>
                <td className="text-right grand-total-amount">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </td>
              </tr>
              </tfoot>)}
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>);
};

export default AdminOrderDetailPage;