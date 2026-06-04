import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faFilter} from '@fortawesome/free-solid-svg-icons';
import {getAllOrdersAdmin} from '../../api/orderApi';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const {RenderError, showError} = useError();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage]);

  const fetchOrders = async () => {
    try {
      const statusParam = filter === 'all' ? null : filter;
      const response = await getAllOrdersAdmin(statusParam, currentPage, 10);

      if (response) {
        setOrders(response.content || response.data || response || []);
        setTotalPages(response.totalPages || 0);
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        setOrders([]);
        setTotalPages(0);
      } else {
        showError(error.response?.data?.message || error.message);
      }
    }
  };

  const handleViewOrder = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  return (<div className="admin-management-container">
    {RenderError}
    <div className="admin-content-header">
      <h1 className="admin-page-title">Orders Management</h1>
      <div className="header-actions">
        <div className="filter-wrapper">
          <FontAwesomeIcon icon={faFilter} className="filter-icon"/>
          <select
              className="form-input filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="INITIALIZED">Initialized</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ON_THE_WAY">On the Way</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>
    </div>

    <div className="admin-table-card">
      <table className="admin-table">
        <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th className="actions-header">Actions</th>
        </tr>
        </thead>
        <tbody>
        {orders.length > 0 ? (orders.map(order => (<tr key={order.id}>
          <td className="id-col">#{order.id}</td>
          <td className="date-col">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
          </td>
          <td className="customer-col">
            {order.userEmail || 'Unknown'}
          </td>
          <td className="items-col">
            {order.orderItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0}
          </td>
          <td className="total-col">
            ${Number(order.totalAmount || 0).toFixed(2)}
          </td>
          <td>
            <span
                className={`status-badge status-${(order.status || 'unknown').toLowerCase()}`}>{order.status || 'UNKNOWN'}</span>
          </td>
          <td className="actions-col">
            <button
                className="btn-action view-btn"
                onClick={() => handleViewOrder(order.id)}
                title="View Details"><FontAwesomeIcon icon={faEye}/> View
            </button>
          </td>
        </tr>))) : (<tr>
          <td colSpan="7" className="empty-state">
            No orders found for the selected filter.
          </td>
        </tr>)}
        </tbody>
      </table>
    </div>

    {totalPages > 1 && (<div className="admin-pagination">
      <button
          className="btn-secondary"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}>Previous
      </button>
      <span className="pagination-info">Page {currentPage + 1} of {totalPages}</span>
      <button
          className="btn-secondary"
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(prev => prev + 1)}>Next
      </button>
    </div>)}
  </div>);
};

export default AdminOrdersPage;