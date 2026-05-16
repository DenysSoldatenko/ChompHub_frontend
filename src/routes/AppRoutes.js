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


export const AppRoutes = () => {
  return (
      <Routes>
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
        <Route path="/leave-review" element={<LeaveReviewPage />} />
        <Route path="/cart" element={<CartPage />} />



      </Routes>
  );
};