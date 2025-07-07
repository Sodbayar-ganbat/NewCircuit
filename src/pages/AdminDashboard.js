import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AdminCoupons from "../components/Admin/AdminPages/AdminCoupons";
import AdminUserManagement from "../components/Admin/AdminPages/AdminUserManagement";
import AdminBusinessManagement from "../components/Admin/AdminPages/AdminBusinessManagement";
import AdminAnalytics from "../components/Admin/AdminPages/AdminAnalytics";
import AdminEvents from "../components/Admin/AdminPages/AdminEvents";
import AdminHeader from "../components/Admin/AdminHelperComponents/AdminHeader";
import AdminSidebar from "../components/Admin/AdminHelperComponents/AdminSidebar";
// Import other admin components as needed

const AdminDashboard = () => {
  const [currPath, setCurrPath] = useState("/");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      const adminDoc = await getDoc(doc(db, 'adminUsers', auth.currentUser.uid));
      if (!adminDoc.exists()) {
        navigate('/login');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  useEffect(() => {
    const path = location.pathname;
    if (path !== currPath) {
      setCurrPath(path);
    }
  }, [location, currPath]);

  return (
    <div className="flex gap-5 p-5 min-h-screen bg-gray-50 max-md:flex-col">
      <AdminSidebar />
      <div className="flex flex-col flex-1 gap-8">
        <AdminHeader path={currPath} />
        <Routes>
          <Route path="/" element={<AdminCoupons />} />
          <Route path="/coupons/*" element={<AdminCoupons />} />
          <Route path="/users/*" element={<AdminUserManagement />} />
          <Route path="/businesses/*" element={<AdminBusinessManagement />} />
          <Route path="/events/*" element={<AdminEvents />} />
          <Route path="/analytics/*" element={<AdminAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard; 