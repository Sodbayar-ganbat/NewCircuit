import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../pages/firebaseConfig';
import { IoPersonCircle } from 'react-icons/io5';
import { ReactComponent as VectorIcon } from '../../../images/Vector 6.svg';


const Header = (props) => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(() => {
    const cached = localStorage.getItem("userData");
    return cached ? JSON.parse(cached) : null;
  });
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function getUserData() {
      if (!user) return;
      const userTable = collection(db, "users");
      const userQuery = query(userTable, where("email", "==", user.email));
      const loggedInUserQuery = await getDocs(userQuery);
      const loggedInUserData = loggedInUserQuery.docs.at(0);
      setUserData(loggedInUserData);
      localStorage.setItem("userData", JSON.stringify(loggedInUserData.data()));
      setIsLoading(false);
    }
    getUserData();
  }, [user]);


  const PathTitleMappings = {"/dashboard": "Home", "/dashboard/dashMyConnections": "My Sparks", 
    "/dashboard/dashDateCalendar": "Date Calendar", "/dashboard/DashCheckout": "Checkout", "/dashboard/dashMyCoupons": "My Coupons", 
    "/dashboard/dashMyProfile": "My Profile", "/dashboard/dashSettings": "Settings", "/dashboard/dashSignOut": "Sign Out"}
  const { path } = props;

  if (isLoading) {
    return (
      <div className="flex justify-between items-center p-6 bg-white rounded-xl">
        <div className="text-4xl font-semibold text-indigo-950">Loading...</div>
        <div className="flex gap-5 items-center animate-pulse">
          <div className="h-[60px] w-[60px] bg-gray-200 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="hidden md:flex justify-between items-center p-6 bg-white max-sm:flex-col max-sm:gap-5 max-sm:p-6 border border-[rgba(33,31,32,0.10)]">
      <div className="        
        font-medium
        text-[#211F20]
        font-bricolage
        text-base
        font-normal
        leading-[130%]
        uppercase
        tracking-wide">
        {PathTitleMappings[path]}
      </div>
      <div className="flex gap-5 items-center">
        <div className="flex justify-center items-center h-[66px] w-[62px]">
          <i className="ti ti-bell text-2xl text-slate-500" />
        </div>
        {userData ? (
          userData.get("image") ? (
            <div className="flex items-center gap-2">
              {/* Profile Picture - Direct image */}
              <img
                src={userData.get("image")}
                alt="User Profile"
                className="w-[48px] h-[48px] object-cover rounded-full"
              />
              
              {/* User Info */}
              <div className="flex flex-col">
                {/* Name - Body-S-Med */}
                <div className="text-[#211F20] font-poppins text-base font-medium leading-normal">
                  {userData.get("firstName")} {userData.get("lastName")}
                </div>
                {/* Email - Body-S-Reg */}
                <div className="text-[rgba(33,31,32,0.75)] font-poppins text-base font-normal leading-normal">
                  {userData.get("email")}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Profile Picture - Fallback icon */}
              <div className="w-[48px] h-[48px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <IoPersonCircle className="text-[52px] text-gray-400 -m-1" />
              </div>
              
              {/* User Info */}
              <div className="flex flex-col">
                {/* Name - Body-S-Med */}
                <div className="text-[#211F20] font-poppins text-base font-medium leading-normal">
                  {userData.get("firstName")} {userData.get("lastName")}
                </div>
                {/* Email - Body-S-Reg */}
                <div className="text-[rgba(33,31,32,0.75)] font-poppins text-base font-normal leading-normal">
                  {userData.get("email")}
                </div>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Header;
