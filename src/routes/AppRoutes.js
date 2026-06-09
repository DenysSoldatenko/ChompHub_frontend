import {Routes, Route} from 'react-router-dom';
import UserRegistration from '../pages/auth/RegisterPage';
import UserLogin from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/menu/CategoryPage";
import MenuPage from "../pages/menu/MenuPage";
import ProductPage from "../pages/menu/ProductPage";
import ProfilePage from "../pages/profile/ProfilePage";
import UpdateProfilePage from "../pages/profile/UpdateProfilePage";
import OrderHistoryPage from "../pages/orders/OrderHistoryPage";
import LeaveReviewPage from "../pages/reviews/LeaveReviewPage";
import CartPage from "../pages/cart/CartPage";
import ProcessPaymentPage from "../pages/payment/ProcessPaymentPage";
import AdminLayout from "../components/admin/AdminLayout";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminCategoryFormPage from "../pages/admin/AdminCategoryFormPage";
import AdminMenuPage from "../pages/admin/AdminMenuPage";
import AdminMenuFormPage from "../pages/admin/AdminMenuFormPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminPaymentsPage from "../pages/admin/AdminPaymentsPage";
import AdminPaymentDetailPage from "../pages/admin/AdminPaymentDetailPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

export const AppRoutes = () => {
  return (<Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/home" element={<HomePage/>}/>
    <Route path="/register" element={<UserRegistration/>}/>
    <Route path="/login" element={<UserLogin/>}/>
    <Route path="/categories" element={<CategoryPage/>}/>
    <Route path="/menu" element={<MenuPage/>}/>
    <Route path="/menu/:id" element={<ProductPage/>}/>
    <Route path="/profile" element={<ProfilePage/>}/>
    <Route path="/profile/update" element={<UpdateProfilePage/>}/>
    <Route path="/orders" element={<OrderHistoryPage/>}/>
    <Route path="/leave-review" element={<LeaveReviewPage/>}/>
    <Route path="/cart" element={<CartPage/>}/>
    <Route path="/payment" element={<ProcessPaymentPage/>}/>

    <Route path="/admin" element={<AdminLayout/>}>
      <Route index element={<AdminDashboardPage/>}/>
      <Route path="dashboard" element={<AdminDashboardPage/>}/>
      <Route path="categories" element={<AdminCategoriesPage/>}/>
      <Route path="categories/new" element={<AdminCategoryFormPage/>}/>
      <Route path="categories/edit/:id" element={<AdminCategoryFormPage/>}/>
      <Route path="menu-items" element={<AdminMenuPage/>}/>
      <Route path="menu-items/new" element={<AdminMenuFormPage/>}/>
      <Route path="menu-items/edit/:id" element={<AdminMenuFormPage/>}/>
      <Route path="orders" element={<AdminOrdersPage/>}/>
      <Route path="orders/:id" element={<AdminOrderDetailPage/>}/>
      <Route path="payments" element={<AdminPaymentsPage/>}/>
      <Route path="payments/:id" element={<AdminPaymentDetailPage/>}/>
    </Route>
  </Routes>);
};