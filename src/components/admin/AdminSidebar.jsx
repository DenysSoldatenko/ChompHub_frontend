import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faChartLine, faList, faUtensils, faShoppingBag, faCreditCard
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
  return (<aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li>
              <NavLink
                  to="/admin"
                  className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                  end>
                <FontAwesomeIcon icon={faChartLine} className="sidebar-icon"/>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/admin/categories"
                  className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faList} className="sidebar-icon"/>
                <span>Categories</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/admin/menu-items"
                  className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faUtensils} className="sidebar-icon"/>
                <span>Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/admin/orders"
                  className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faShoppingBag} className="sidebar-icon"/>
                <span>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="/admin/payments"
                  className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <FontAwesomeIcon icon={faCreditCard} className="sidebar-icon"/>
                <span>Payments</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>);
};

export default AdminSidebar;