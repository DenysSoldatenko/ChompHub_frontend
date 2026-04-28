import {Routes, Route} from 'react-router-dom';
import UserRegistration from '../pages/auth/RegisterPage';
import UserLogin from "../pages/auth/LoginPage";


export const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/register" element={<UserRegistration/>}/>
        <Route path="/login" element={<UserLogin/>}/>



      </Routes>
  );
};