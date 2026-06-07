import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {getPaymentById} from '../../api/paymentApi';
import {getOrderById} from '../../api/orderApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const AdminPaymentDetailPage = () => {
  const {id} = useParams();
  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);
  const {RenderError, showError} = useError();
  const navigate = useNavigate();
  useEffect(() => {
    const loadPaymentAndOrder = async () => {
      try {
        const payResponse = await getPaymentById(id);
        const paymentData = payResponse.data || payResponse;
        setPayment(paymentData);
        if (paymentData && paymentData.orderId) {
          const ordResponse = await getOrderById(paymentData.orderId);
          setOrder(ordResponse.data || ordResponse);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };
    loadPaymentAndOrder();
  }, [id]);
  if (!payment) {
    return (<div className="admin-detail-wrapper">
      {RenderError}
      <div className="admin-loading-state">Loading payment details...</div>
    </div>);
  }
  const date = payment.createdAt;
  const status = (payment.status || 'UNKNOWN').toUpperCase();
  const amount = Number(payment.amount || 0);
  const isSuccessful = status === 'COMPLETED' || status === 'PAID';
  const gateway = 'STRIPE';
  const transactionId = payment.clientSecret ? payment.clientSecret.split('_secret')[0] : 'N/A';
  const orderDate = order?.createdAt;
  const orderStatus = (order?.status || 'UNKNOWN').toUpperCase();
  const customerEmail = order?.userEmail;
  return (<div className="admin-detail-wrapper">
    {RenderError}
    <div className="admin-detail-header">
      <div>
        <span className="admin-breadcrumb">Payments / Management</span>
        <h1 className="admin-order-title">Payment Details #{payment.id}</h1>
      </div>
      <button type="button" className="admin-back-btn" onClick={() => navigate('/admin/payments')}>
        &larr; Back to Payments
      </button>
    </div>
    <div className="order-detail-grid">
      <div className="order-info-column">
        <div className="detail-card">
          <h3 className="card-heading">Transaction Summary</h3>
          <div className="info-row">
            <span className="info-label">Payment Date:</span>
            <span className="info-value">{date ? new Date(date).toLocaleString('en-GB') : 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Amount:</span>
            <span className="info-value highlight-value">${amount.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Gateway:</span>
            <span className="info-value fw-bold">{gateway}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Successful:</span>
            <span className="info-value" style={{
              color: isSuccessful ? '#15803d' : '#b91c1c', fontWeight: '800'
            }}>{isSuccessful ? 'YES' : 'NO'}</span>
          </div>
        </div>
        <div className="detail-card">
          <h3 className="card-heading">Customer Information</h3>
          {customerEmail ? (<div className="customer-detail-section">
            <div className="customer-data-rows">
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value email-value fw-bold">{customerEmail}</span>
              </div>
            </div>
          </div>) : (<p className="empty-state" style={{padding: '1rem'}}>No customer data linked to this order.</p>)}
        </div>
      </div>
      <div className="order-items-column">
        <div className="detail-card items-card" style={{marginBottom: '1.5rem'}}>
          <h3 className="card-heading">Linked Order Information</h3>
          {order || payment.orderId ? (<>
            <div className="info-row">
              <span className="info-label">Order ID:</span>
              <span className="info-value fw-bold">#{order?.id || payment.orderId}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Date:</span>
              <span
                  className="info-value">{orderDate ? new Date(orderDate).toLocaleString('en-GB') : 'Loading...'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Status:</span>
              <span
                  className={`status-badge status-${orderStatus.toLowerCase()}`}>{orderStatus.replace('_', ' ')}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Total:</span>
              <span className="info-value fw-bold">${Number(order?.totalAmount || 0).toFixed(2)}</span>
            </div>
          </>) : (<p className="empty-state" style={{padding: '1rem'}}>No specific order linked to this payment.</p>)}
        </div>
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
              {order?.orderItems && order.orderItems.length > 0 ? (order.orderItems.map((item, index) => {
                const itemName = item.menu?.name || item.productName || item.name || 'Unknown Item';
                const itemImage = item.menu?.imageUrl || item.productImageUrl || item.imageUrl || FALLBACK_IMAGE;
                const itemPrice = Number(item.pricePerUnit ?? item.unitPriceSnapshot ?? item.unitPrice ?? item.price ?? 0);
                const itemQty = Number(item.quantity || 1);
                const itemSubtotal = Number(item.subtotal || (itemPrice * itemQty));
                return (<tr key={item.id || index}>
                  <td>
                    <div className="item-cell-wrapper">
                      <img src={itemImage} alt={itemName} className="item-thumbnail" onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}/>
                      <span className="item-name-text">{itemName}</span>
                    </div>
                  </td>
                  <td className="price-col">${itemPrice.toFixed(2)}</td>
                  <td className="qty-col text-center">x{itemQty}</td>
                  <td className="text-right fw-bold">${itemSubtotal.toFixed(2)}</td>
                </tr>);
              })) : (<tr>
                <td colSpan="4"
                    className="empty-state">{order ? 'No items found in this order.' : 'Loading order items...'}</td>
              </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>);
};
export default AdminPaymentDetailPage;