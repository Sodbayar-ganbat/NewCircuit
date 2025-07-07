import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../../../pages/firebaseConfig';
import { IoPersonCircle } from 'react-icons/io5';

const AdminHeader = (props) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [adminData, setAdminData] = useState();

  useEffect(() => {
    async function getAdminData() {
      if (user) {
        const adminDocRef = doc(db, "adminUsers", user.uid);
        const adminDocSnap = await getDoc(adminDocRef);
        if (adminDocSnap.exists()) {
          setAdminData(adminDocSnap);
        }
      }
    }
    getAdminData();
  }, [user]);

  const PathTitleMappings = {
    "/admin-dashboard": "Coupons",
    "/admin-dashboard/coupons": "Coupons",
    "/admin-dashboard/users": "User Management",
    "/admin-dashboard/businesses": "Business Management",
    "/admin-dashboard/events": "Events Management",
    "/admin-dashboard/analytics": "Analytics",
    "/admin-dashboard/settings": "Settings"
  };
  
  const { path } = props;

  return (
    <div className="flex justify-between items-center px-10 py-7 bg-white rounded-xl max-sm:flex-col max-sm:gap-5 max-sm:p-5">
      <div className="text-4xl font-semibold text-indigo-950 max-sm:text-2xl">
        {PathTitleMappings[path]}
      </div>
      <div className="flex gap-5 items-center">
        <div className="flex justify-center items-center h-[66px] w-[62px]">
          <i className="ti ti-bell text-2xl text-slate-500" />
        </div>
        <div className="flex items-center justify-center rounded-2xl h-[60px] w-[60px] bg-gray-200">
          <IoPersonCircle className="w-full h-full text-gray-400" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-base font-medium text-indigo-950">
            Admin
          </div>
          <div className="text-sm text-slate-500">
            {user ? user.email : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader; 