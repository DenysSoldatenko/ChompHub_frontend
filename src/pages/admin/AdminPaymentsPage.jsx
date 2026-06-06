import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faFilter, faChartLine, faCheckCircle, faGlobe} from '@fortawesome/free-solid-svg-icons';
import {getAllPaymentsAdmin} from "../../api/paymentApi";

const ITEMS_PER_PAGE = 10;

const AdminPaymentsPage = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {RenderError, showError} = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilterAndPagination(allPayments, filter);
  }, [filter, allPayments]);

  const fetchPayments = async () => {
    try {
      const response = await getAllPaymentsAdmin();
      const data = response.content || response.data || response || [];

      if (Array.isArray(data)) {
        setAllPayments(data);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const applyFilterAndPagination = (data, currentFilter) => {
    let result = data;

    if (currentFilter !== 'all') {
      result = data.filter(p => {
        const status = (p.paymentStatus || p.status || '').toUpperCase();
        if (currentFilter === 'completed') return status === 'COMPLETED' || status === 'PAID';
        if (currentFilter === 'pending') return status === 'PENDING';
        if (currentFilter === 'failed') return status === 'FAILED';
        return true;
      });
    }

    setFilteredPayments(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    setCurrentPage(0);
  };

  const handleViewPayment = (id) => {
    navigate(`/admin/payments/${id}`);
  };

  const currentPayments = filteredPayments.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const totalRevenue = allPayments
      .filter(p => (p.paymentStatus || p.status || '').toUpperCase() === 'COMPLETED' || (p.paymentStatus || p.status || '').toUpperCase() === 'PAID')
      .reduce((sum, p) => sum + Number(p.amount || p.totalAmount || 0), 0);

  const onlineTransactions = allPayments.filter(p => (p.paymentGateway || p.method || '').toUpperCase() !== 'CASH').length;
  const successRate = allPayments.length > 0 ? Math.round((allPayments.filter(p => (p.paymentStatus || p.status || '').toUpperCase() === 'COMPLETED' || (p.paymentStatus || p.status || '').toUpperCase() === 'PAID').length / allPayments.length) * 100) : 0;

  return (<div className="admin-management-container">
    {RenderError}
    <div className="admin-content-header">
      <h1 className="admin-page-title">Payments Management</h1>
      <div className="header-actions">
        <div className="filter-wrapper">
          <FontAwesomeIcon icon={faFilter} className="filter-icon"/>
          <select
              className="form-input filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
    </div>
    <div className="payment-stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper revenue-icon">
          <FontAwesomeIcon icon={faChartLine}/>
        </div>
        <div className="stat-content">
          <h3 className="stat-heading">Total Revenue</h3>
          <p className="stat-value">${totalRevenue.toFixed(2)}</p>
          <p className="stat-period">All Time</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon-wrapper online-icon">
          <FontAwesomeIcon icon={faGlobe}/>
        </div>
        <div className="stat-content">
          <h3 className="stat-heading">Online Payments</h3>
          <p className="stat-value">{onlineTransactions}</p>
          <p className="stat-period">Digital Transactions</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon-wrapper success-icon">
          <FontAwesomeIcon icon={faCheckCircle}/>
        </div>
        <div className="stat-content">
          <h3 className="stat-heading">Success Rate</h3>
          <p className="stat-value">{successRate}%</p>
          <p className="stat-period">Completed Transactions</p>
        </div>
      </div>
    </div>
    <div className="admin-table-card">
      <table className="admin-table">
        <thead>
        <tr>
          <th>Payment ID</th>
          <th>Order ID</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th className="actions-header">Actions</th>
        </tr>
        </thead>
        <tbody>
        {currentPayments.length > 0 ? (currentPayments.map(payment => {
          const status = (payment.paymentStatus || payment.status || 'UNKNOWN').toUpperCase();
          const date = payment.paymentDate || payment.createdAt;
          return (<tr key={payment.id}>
            <td className="id-col">#{payment.id}</td>
            <td className="order-id-col">#{payment.orderId || payment.order?.id || 'N/A'}</td>
            <td className="date-col">
              {date ? new Date(date).toLocaleDateString() : 'N/A'}
            </td>
            <td className="total-col">
              ${Number(payment.amount || payment.totalAmount || 0).toFixed(2)}
            </td>
            <td>
            <span className={`status-badge status-${status.toLowerCase()}`}>
              {status}
            </span>
            </td>
            <td className="actions-col">
              <button
                  className="btn-action view-btn"
                  onClick={() => handleViewPayment(payment.id)}
                  title="View Details"><FontAwesomeIcon icon={faEye}/> View
              </button>
            </td>
          </tr>);
        })) : (<tr>
          <td colSpan="7" className="empty-state">
            No payments found for the selected filter.
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
      <span className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </span>
      <button
          className="btn-secondary"
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(prev => prev + 1)}>Next
      </button>
    </div>)}
  </div>);
};

export default AdminPaymentsPage;