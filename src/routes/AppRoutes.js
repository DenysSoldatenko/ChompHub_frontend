import {Routes, Route} from 'react-router-dom';
import UserRegistration from '../pages/auth/RegisterPage';
import UserLogin from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/menu/CategoryPage";
import MenuPage from "../pages/menu/MenuPage";
import ProductPage from "../pages/menu/ProductPage";


export const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/register" element={<UserRegistration/>}/>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/categories" element={<CategoryPage/>}/>
        <Route path="/menu" element={<MenuPage/>}/>
        <Route path="/menu/:id" element={<ProductPage/>}/>


      </Routes>
  );
};