import React from "react";
import 'antd/dist/antd.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ProtectedRoute from "./Components/protectedRoutes";
import PublicRoute from "./Components/publicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notifications from "./pages/Notifications";
import UsersList from './pages/Admin/UsersList'
import DoctorsList from './pages/Admin/DoctorsList'
import Profile from "./pages/Doctor/Profile";
import BookAppointment from "./pages/BookAppointment";

function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <BrowserRouter>
      {loading && (<div className="spinner-parent">
        <div className="spinner-border" role="status">
        </div>
      </div>)}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} />
        <Route path="/register" element={<PublicRoute> <Register /> </PublicRoute>} />
        <Route path="/" element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>} />
        <Route path="/apply-doctor" element={<ProtectedRoute>
          <ApplyDoctor />
        </ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute>
          <Notifications />
        </ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute>
          <UsersList />
        </ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute>
          <DoctorsList />
        </ProtectedRoute>} />
        <Route path="/doctor/profile/:userId" element={<ProtectedRoute>
          <Profile />
        </ProtectedRoute>} />
        <Route path="/book-appointment/:doctorId" element={<ProtectedRoute>
          <BookAppointment />
        </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
