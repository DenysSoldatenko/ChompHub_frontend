import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useError} from '../../components/ErrorDisplay';
import {Pie, Line} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
import {getAllOrdersAdmin, countUniqueCustomers} from '../../api/orderApi';
import {getAllProducts} from '../../api/productApi';
import {getAllCategories} from '../../api/categoryApi';
import {getAllPaymentsAdmin} from "../../api/paymentApi";
Chart.register(...registerables);

const AdminDashboardPage = () => {
  const {RenderError, showError} = useError();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    menu: 0,
    categories: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    recentOrders: [],
    orderStatusDistribution: {},
    revenueData: [],
    popularItems: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, menuRes, paymentsRes, customersRes, catRes] = await Promise.all([getAllOrdersAdmin(null, 0, 1000), getAllProducts(), getAllPaymentsAdmin(), countUniqueCustomers(), getAllCategories()]);
      const orders = ordersRes?.content || ordersRes?.data || ordersRes || [];
      const menu = menuRes?.content || menuRes?.data || menuRes || [];
      const payments = paymentsRes?.content || paymentsRes?.data || paymentsRes || [];
      const categories = catRes?.content || catRes?.data || catRes || [];
      const activeCustomers = customersRes?.data ?? customersRes ?? 0;
      const totalOrders = orders.length;
      const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      let pendingCount = 0;

      const statusCounts = orders.reduce((acc, order) => {
        const status = (order.status || 'UNKNOWN').toUpperCase();
        if (status === 'PENDING' || status === 'INITIALIZED') pendingCount++;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const itemCounts = {};
      orders.forEach(order => {
        order.orderItems?.forEach(item => {
          const name = item.productName || item.name || item.menu?.name || 'Unknown';
          itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
        });
      });

      const popularItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const totalRevenue = payments.reduce((sum, payment) => {
        const status = (payment.status || payment.paymentStatus || '').toUpperCase();
        return (status === 'COMPLETED' || status === 'PAID') ? sum + Number(payment.amount || payment.totalAmount || 0) : sum;
      }, 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const revenueByMonth = Array(12).fill(0);

      payments.forEach(payment => {
        const status = (payment.status || payment.paymentStatus || '').toUpperCase();
        if (status === 'COMPLETED' || status === 'PAID') {
          const date = payment.createdAt || payment.paymentDate;
          if (date) revenueByMonth[new Date(date).getMonth()] += Number(payment.amount || payment.totalAmount || 0);
        }
      });

      setStats({
        totalOrders,
        totalRevenue,
        activeCustomers,
        menu: menu.length,
        categories: categories.length,
        avgOrderValue,
        pendingOrders: pendingCount,
        recentOrders,
        orderStatusDistribution: statusCounts,
        revenueData: revenueByMonth,
        popularItems
      });
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], datasets: [{
      label: 'Monthly Revenue ($)',
      data: stats.revenueData,
      backgroundColor: 'rgba(37,99,235,0.2)',
      borderColor: '#2563eb',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }]
  };

  const statusChartData = {
    labels: Object.keys(stats.orderStatusDistribution), datasets: [{
      data: Object.values(stats.orderStatusDistribution),
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
      borderWidth: 0
    }]
  };

  return (<div className="admin-management-container">
    {RenderError}
    <div className="admin-content-header">
      <h1 className="admin-page-title">Dashboard Overview</h1>
      <button className="btn-secondary" onClick={fetchDashboardData}>Refresh Data</button>
    </div>
    <div className="dashboard-stats-grid">
      <div className="detail-card stat-card"><h3 className="stat-heading">Total Orders</h3><p
          className="stat-value">{stats.totalOrders}</p><p className="stat-period">All time</p></div>
      <div className="detail-card stat-card"><h3 className="stat-heading">Total Revenue</h3><p
          className="stat-value">${stats.totalRevenue.toFixed(2)}</p><p className="stat-period">All time</p></div>
      <div className="detail-card stat-card"><h3 className="stat-heading">Avg Order Value</h3><p
          className="stat-value">${stats.avgOrderValue.toFixed(2)}</p><p className="stat-period">Per order</p></div>
      <div className="detail-card stat-card"><h3 className="stat-heading">Pending Orders</h3><p
          className="stat-value">{stats.pendingOrders}</p><p className="stat-period">Requires action</p></div>
      <div className="detail-card stat-card"><h3 className="stat-heading">Active Customers</h3><p
          className="stat-value">{stats.activeCustomers}</p><p className="stat-period">Unique buyers</p></div>
      <div className="detail-card stat-card"><h3 className="stat-heading">Menu Items</h3><p
          className="stat-value">{stats.menu}</p><p className="stat-period">Across {stats.categories} categories</p>
      </div>
    </div>
    <div className="dashboard-charts-grid">
      <div className="detail-card chart-card"><h3 className="card-heading">Monthly Revenue</h3>
        <div className="chart-container"><Line data={revenueChartData} options={{
          responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'top'}}
        }}/></div>
      </div>
      <div className="detail-card chart-card pie-chart-card"><h3 className="card-heading">Order Status</h3>
        <div className="chart-container"><Pie data={statusChartData} options={{
          responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'right'}}
        }}/></div>
      </div>
    </div>
    <div className="dashboard-tables-grid">
      <div className="detail-card table-card-wrapper">
        <h3 className="card-heading">Recent Orders</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
            </thead>
            <tbody>
            {stats.recentOrders.map(order => {
              const status = (order.status || 'UNKNOWN').toUpperCase();
              return (<tr key={order.id}>
                <td className="fw-bold">#{order.id}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>{order.userEmail || 'Guest'}</td>
                <td className="fw-bold">${Number(order.totalAmount || 0).toFixed(2)}</td>
                <td><span className={`status-badge status-${status.toLowerCase()}`}>{status}</span></td>
                <td className="text-right">
                  <button className="btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem'}}
                          onClick={() => navigate(`/admin/orders/${order.id}`)}>View
                  </button>
                </td>
              </tr>);
            })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="detail-card table-card-wrapper">
        <h3 className="card-heading">Top Items</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Sold</th>
            </tr>
            </thead>
            <tbody>{stats.popularItems.map(([name, count]) => <tr key={name}>
              <td className="fw-bold">{name}</td>
              <td className="text-right">{count}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  </div>);
};
export default AdminDashboardPage;