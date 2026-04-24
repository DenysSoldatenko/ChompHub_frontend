import {Routes, Route} from 'react-router-dom';
import UserRegistration from '../pages/auth/RegisterPage';


export const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/register" element={<UserRegistration/>}/>



      </Routes>
  );
};