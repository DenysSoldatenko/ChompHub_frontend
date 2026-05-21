import {Outlet} from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = () => {
  return (
      <div className="admin-layout">
        <AdminSidebar/>

        <div className="admin-main">
          <AdminTopbar/>

          <main className="admin-content">
            <Outlet/>
          </main>
        </div>
      </div>
  );
};

export default AdminLayout;