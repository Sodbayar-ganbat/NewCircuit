import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaBell, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

const BusinessSettings = () => {
  const navigate = useNavigate();

  const SettingItem = ({ icon: Icon, title, description, path, clickable = true }) => (
    <div
      className={`w-full py-8 px-6 bg-white rounded-lg shadow-md ${
        clickable ? 'cursor-pointer hover:shadow-lg hover:bg-blue-50' : ''
      } flex justify-between items-center font-[poppins]`}
      onClick={() => clickable && path && navigate(path)}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-[#0043F1]" />
        </div>
        <div>
          <h3 className="text-gray-800 text-xl font-light">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      {clickable && (
        <span className="text-gray-500 text-3xl">{'>'}</span>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-50 border-solid shadow-[0_4px_20px_rgba(238,238,238,0.502)] max-sm:p-5 p-7 min-h-screen">
      <h1 className="text-3xl font-semibold text-indigo-950 mb-8">Settings</h1>

        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-indigo-950 mb-4">Account Management</h2>
          
          <SettingItem
            icon={FaShieldAlt}
            title="Deactivate Account"
            description="Temporarily disable your account"
            path="/enterprise-dash/settings/deactivate"
          />
          
          <SettingItem
            icon={FaShieldAlt}
            title="Delete Account"
            description="Permanently delete your account"
            path="/enterprise-dash/settings/delete"
          />
        </div>
      </div>
  );
};

export default BusinessSettings;
