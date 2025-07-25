import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import secondaryLogo from "../../../images/Cir_Secondary_RGB_Mixed Black.svg";
import circuitLogo from "../../../images/Cir_Primary_RGB_Mixed Black.png";
import { ReactComponent as HomeIcon } from "../../../images/home.svg";
import { ReactComponent as CardIcon } from "../../../images/card.svg";
import { ReactComponent as FlashIcon } from "../../../images/flash.svg";
import { ReactComponent as TicketIcon } from "../../../images/ticket.svg";
import { ReactComponent as LogoutIcon } from "../../../images/logout.svg";
import { ReactComponent as ProfileCircleIcon } from "../../../images/profile-circle.svg";
import { ReactComponent as VectorIcon } from "../../../images/Vector 6.svg";
import xIcon from "../../../images/x.svg";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../../../firebaseConfig';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showTabletMenu, setShowTabletMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasNewSpark, setHasNewSpark] = useState(false);

  // Duplicate new sparks logic from DashHome.js
  useEffect(() => {
    const fetchConnections = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const connsSnap = await getDocs(collection(db, 'users', user.uid, 'connections'));
        const uids = connsSnap.docs.map(d => d.id);
        const profiles = await Promise.all(
          uids.map(async (uid) => {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (!userDoc.exists()) return null;
            const data = userDoc.data();
            const connectionDoc = await getDoc(doc(db, 'users', user.uid, 'connections', uid));
            const connectionData = connectionDoc.exists() ? connectionDoc.data() : {};
            if (connectionData.status !== 'mutual') return null;
            return { userId: uid, ...data };
          })
        );
        const filteredProfiles = profiles.filter(Boolean);
        const userId = user.uid;
        const newSparks = await Promise.all(
          filteredProfiles.map(async (conn) => {
            const convoId = userId < conn.userId ? `${userId}${conn.userId}` : `${conn.userId}${userId}`;
            const convoDoc = await getDoc(doc(db, "conversations", convoId));
            if (!convoDoc.exists()) return true;
            const messages = convoDoc.data().messages || [];
            const hasMessaged = messages.some(msg => msg.senderId === userId);
            return !hasMessaged;
          })
        );
        setHasNewSpark(newSparks.some(isNew => isNew));
      } catch (err) {
        setHasNewSpark(false);
      }
    };
    fetchConnections();
  }, [auth.currentUser]);

  const navItems = [
    { icon: "ti ti-home", text: "Home", active: true },
    { icon: "ti ti-users", text: "My Sparks" },
    { icon: "ti ti-calendar", text: "Date Calendar" },
    { icon: "ti ti-ticket", text: "My Coupons" },
    { icon: "ti ti-user", text: "My Profile" },
    { icon: "ti ti-settings", text: "Settings" },
    { icon: "ti ti-logout", text: "Sign Out" },
  ];

  const handleSignOut = (e) => {
    e.preventDefault();
    setShowSignOutModal(true);
    setShowSettingsDropdown(false);
  };

  const handleSignOutConfirm = async () => {
    try {
      await signOut(auth);
      setShowSignOutModal(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleTabletMenuToggle = () => {
    setShowTabletMenu(!showTabletMenu);
  };

  const SidebarData = [
    {
      title: "Home",
      path: "/dashboard",
      icon: (
        <HomeIcon
          className="w-5 h-5"
          style={{
            color: location.pathname === "/dashboard" ? "#1C50D8" : "#211f20"
          }}
        />
      ),
      cName: "nav-text",
    },
    {
      title: "Sparks",
      path: "/dashboard/dashMyConnections",
      icon: (
        <FlashIcon
          className="w-5 h-5"
          style={{
            color: location.pathname === "/dashboard/dashMyConnections" ? "#1C50D8" : "#211f20"
          }}
        />
      ),
      cName: "nav-text",
    },
    {
      title: "Shop",
      path: "/dashboard/dashDateCalendar",
      icon: (
        <CardIcon
          className="w-5 h-5"
          style={{
            color: location.pathname === "/dashboard/dashDateCalendar" ? "#1C50D8" : "#211f20"
          }}
        />
      ),
      cName: "nav-text",
    },
    //{
    //  title: "My Coupons",
    //  path: "/dashboard/dashMyCoupons",
    //  icon: (
        //<TicketIcon
          //className="w-5 h-5"
          //style={{
            //color: location.pathname === "/dashboard/dashMyCoupons" ? "#1C50D8" : "#211f20"
          //}}
        ///>
    //  ),
    //  cName: "nav-text",
    //},
    {
      title: "My Profile",
      path: "/dashboard/DashMyProfile",
      icon: (
        <ProfileCircleIcon
          className="w-5 h-5"
          style={{
            color: location.pathname === "/dashboard/DashMyProfile" ? "#1C50D8" : "#211f20"
          }}
        />
      ),
      cName: "nav-text",
    },
    {
      title: "Settings",
      path: "/dashboard/dashSettings",
      icon: <RiIcons.RiSettings4Line />,
      cName: "nav-text",
    },
    {
      title: "Log out",
      path: "#",
      icon: <LogoutIcon className="w-5 h-5" />,
      cName: "nav-text",
      onClick: handleSignOut
    },
  ];

  return (
    <>
      {/* Desktop Sidebar (1280px and above) */}
      <div className="hidden md:flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-4 px-5 py-10 bg-white rounded-xl w-[280px] max-md:p-5 max-md:w-full border border-[rgba(33,31,32,0.10)]">  
        <Link to="/dashboard" className="p-6 sm:p-6 md:p-6 lg:p-6">
          <img
            loading="lazy"
            src={secondaryLogo}
            alt="SecondaryLogo"
            className="object-contain"
          />
        </Link>

        {/* Main navigation items with top padding */}
        <div className="pt-6">
          <div className="flex flex-col gap-2"> {/* Add vertical gap between options */}
            {SidebarData.slice(0, -2).map((item, index) => (
              <Link key={item.path} to={item.path} className="w-full">
                <div className={`flex items-center justify-between w-full px-4 py-3 text-lg rounded-xl transition-all cursor-pointer duration-200 text-slate-500 border
                  ${location.pathname === item.path
                    ? "bg-[#1C50D81A] border-[#1C50D840] text-[#1C50D8]"
                    : "border-transparent hover:bg-[#F5F7FB] hover:text-[#1C50D8] hover:border-[#1C50D840]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {/* Only for Sparks */}
                  {item.title === "Sparks" && hasNewSpark && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '100px',
                        background: '#FF4848',
                        display: 'inline-block',
                        border: '1px solid #E5E7EB',
                        marginLeft: '8px',
                      }}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Spacer to push Settings and Sign Out to bottom */}
        <div className="flex-1"></div>

        {/* Settings and Sign Out at bottom with bottom padding */}
        <div className="pb-6 flex flex-col gap-2"> {/* Add vertical gap between settings and logout */}
          {SidebarData.slice(-2).map((item, index) => (
            <div key={index}>
              {item.onClick ? (
                // Sign Out button with onClick handler
                <div
                  className={`flex gap-2 sm:gap-2 md:gap-3 lg:gap-4 items-center px-5 py-3 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-6 lg:py-4 text-lg rounded-2xl transition-all cursor-pointer duration-[0.2s] border
                    ${item.title === "Log out" 
                      ? "text-[#FF4848] bg-[rgba(255,72,72,0.10)] border-[rgba(255,72,72,0.20)] hover:bg-[rgba(255,72,72,0.15)]"
                      : location.pathname === item.path
                      ? "bg-[#1C50D81A] border-[#1C50D840] text-[#1C50D8]"
                      : "text-slate-500 border-transparent hover:bg-gray-50 hover:border-[#1C50D840]"
                    }`}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              ) : (
                // Settings link
                <Link to={item.path}>
                  <div
                    className={`flex gap-2 sm:gap-2 md:gap-3 lg:gap-4 items-center px-5 py-3 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-6 lg:py-4 text-lg rounded-2xl transition-all cursor-pointer duration-[0.2s] text-slate-500 border
                      ${location.pathname === item.path
                        ? "bg-[#1C50D81A] border-[#1C50D840] text-[#1C50D8]"
                        : "border-transparent hover:bg-gray-50 hover:border-[#1C50D840]"
                      }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tablet Header Bar (under 1280px) */}
      <div className="flex md:hidden justify-between items-center px-6 py-4 bg-white border-b border-[rgba(33,31,32,0.10)] w-full">
        {/* Left side - Circuit logo */}
        <div className="flex items-center">
          <Link to="/dashboard">
            <img
              loading="lazy"
              src={circuitLogo}
              alt="Circuit Logo"
              className="object-contain h-8"
            />
          </Link>
        </div>

        {/* Right side - Vectors (clickable) */}
        <div 
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={handleTabletMenuToggle}
        >
          <VectorIcon className="w-6 h-1" />
          <VectorIcon className="w-6 h-1" />
        </div>
      </div>

      {/* Tablet Menu Overlay (full screen) */}
      {showTabletMenu && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 md:hidden">
          <div className="flex flex-col h-full bg-white w-[744px] max-w-full">
            {/* Tablet Menu Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(33,31,32,0.10)]">
              <Link to="/dashboard" onClick={() => setShowTabletMenu(false)}>
                <img
                  loading="lazy"
                  src={circuitLogo}
                  alt="Circuit Logo"
                  className="object-contain h-8"
                />
              </Link>
              <button 
                onClick={handleTabletMenuToggle}
                className="text-2xl font-bold text-gray-600 hover:text-gray-800"
              >
                <img src={xIcon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Tablet Menu Items */}
            <div className="flex-1 px-6 py-4">
              {SidebarData.map((item, index) => (
                <div key={index} className="mb-2">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <div
                        className={`flex gap-4 items-center px-4 py-3 text-lg rounded-xl transition-all cursor-pointer duration-[0.2s] text-slate-500 border
                          ${location.pathname === item.path
                            ? "bg-[#1C50D81A] border-[#1C50D840] text-[#1C50D8]"
                            : "border-transparent hover:bg-gray-50 hover:border-[#1C50D840]"
                          }`}
                        onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    
                      {showSettingsDropdown && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.dropdownItems.map((dropdownItem, dropIndex) => (
                            <Link 
                              to={dropdownItem.path} 
                              key={dropIndex}
                              className="flex gap-4 items-center px-4 py-2 text-base hover:bg-[#0043F1] hover:text-white text-slate-500 rounded-lg transition-colors duration-200"
                              onClick={() => {
                                dropdownItem.onClick && dropdownItem.onClick();
                                setShowTabletMenu(false);
                                setShowSettingsDropdown(false);
                              }}
                            >
                              {dropdownItem.icon}
                              <span>{dropdownItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={item.path} onClick={() => setShowTabletMenu(false)}>
                      <div
                        className={`flex gap-4 items-center px-4 py-3 text-lg rounded-xl transition-all cursor-pointer duration-[0.2s] text-slate-500 border
                          ${location.pathname === item.path
                            ? "bg-[#1C50D81A] border-[#1C50D840] text-[#1C50D8]"
                            : "border-transparent hover:bg-gray-50 hover:border-[#1C50D840]"
                          }`}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Tablet Menu Footer - Log Out Button */}
            <div className="px-6 py-4 border-t border-[rgba(33,31,32,0.10)]">
              <button
                onClick={() => {
                  handleSignOut();
                  setShowTabletMenu(false);
                }}
                className="flex gap-4 items-center px-4 py-3 text-lg text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 w-full"
              >
                <LogoutIcon className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Sign Out</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowSignOutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#0043F1] text-white rounded-lg hover:bg-[#0034BD] transition-colors"
                onClick={handleSignOutConfirm}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
