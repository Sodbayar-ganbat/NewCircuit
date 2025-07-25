import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderBar = ({ 
    showBack = false, 
    title = '', 
    logo,
    logoHeight = 'h-32',
    titleSize = 'text-6xl',
    onBack
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#211F20] py-4 px-4 relative">
  {/* FULL WIDTH CONTAINER for positioning */}
  <div className="relative w-full flex items-center">
    
    {/* Left Side: Back Button + Logo */}
    <div className="flex justify-start items-center">
      {showBack && (
        <button 
          onClick={onBack ? onBack : () => navigate(-1)}
          className="flex items-center text-[#F3F3F3] hover:text-[#F3F3F3] transition-colors mr-4 ml-0"
        >
          <svg 
            className="w-6 h-6 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back
        </button>
      )}
      
      {logo && (
        <img 
          src={logo} 
          alt="Logo" 
          className={`${logoHeight} ml-0`}
        />
      )}
    </div>

    {/* Title — absolutely centered in full header */}
    {title && (
      <h1 className={`absolute left-1/2 transform -translate-x-1/2 text-[#F3F3F3] ${titleSize} font-bold`}>
        {title}
      </h1>
    )}

    {/* Right side spacer to push content left if needed */}
    <div className="flex-1" />
  </div>
</div>
    );
};

export default HeaderBar;
