import React from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { ReactComponent as SendIcon } from "../../../images/send-2.svg";

const ConnectionsTable = ({ connections, onMessageClick }) => {
  const navigate = useNavigate();

  if (!connections.length)
    return <div className="p-4 text-gray-600">No connections yet.</div>;

  const handleMessageClick = (connection) => {
    if (onMessageClick) {
      onMessageClick(connection);
    } else {
      // Default behavior: navigate to My Sparks page with the selected connection
      navigate('/dashboard/dashMyConnections', { 
        state: { selectedConnectionId: connection.userId } 
      });
    }
  };

  const badgeBackgrounds = [
    {
      style: {
        background:
          "radial-gradient(50% 50% at 50% 50%, #E2FF6580 0%, #D2FFD780 100%)",
      },
      className: "border border-[rgba(33,31,32,0.10)]",
    },
    {
      style: {
        background:
          "radial-gradient(50% 50% at 50% 50%, #B4FFF280 0%, #E1FFD680 100%)",
      },
      className: "border border-[rgba(33,31,32,0.10)]",
    },
    {
      style: {
        background:
          "radial-gradient(50% 50% at 50% 50%, #B0EEFF80 0%, #E7E9FF80 100%)",
      },
      className: "border border-[rgba(33,31,32,0.10)]",
    },
    {
      style: {
        background:
          "radial-gradient(50% 50% at 50% 50%, #8EFF7A80 0%, #D7FFF880 100%)",
      },
      className: "border border-[rgba(33,31,32,0.10)]",
    },
    {
      style: {
        background:
          "radial-gradient(50% 50% at 50% 50%, #79FFC780 0%, #FFF9A180 100%)",
      },
      className: "border border-[rgba(33,31,32,0.10)]",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {connections.slice(0, 5).map((conn, index) => {
        const compatibility = typeof conn.compatibility === "number" ? conn.compatibility : 0;
        return (
          <div
            key={conn.userId}
            className="relative flex flex-col md:flex-row items-start md:items-center gap-y-3 md:gap-y-0 md:gap-x-6 w-full bg-white rounded-2xl border border-gray-200 p-[24px] xl:p-[20px] md:p-[16px] sm:p-[12px] shadow-sm"
          >
            {/* 1. Profile picture + name/age */}
            <div className="flex items-center gap-x-2 min-w-[200px]">
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: conn.isNewSpark ? '#FF4848' : '#FFF',
                  display: 'inline-block',
                  border: '1px solid #E5E7EB', // subtle border for white dot
                }}
              />
              {conn.image ? (
                <img
                  src={conn.image}
                  alt={conn.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <IoPersonCircle className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {/* Gap-xs on right side of image */}
              <span style={{ width: '8px', display: 'inline-block' }} />
              <span className="text-[14px] md:text-[16px] xl:text-[20px] leading-[110%] font-poppins font-medium text-[#211F20]">
                {conn.name}, {conn.age}
              </span>
            </div>

            {/* 2. Compatibility badge */}
            <div>
              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-[100px] font-bricolage font-medium text-[16px] leading-[130%] text-[#211F20] uppercase ${badgeBackgrounds[index % badgeBackgrounds.length].className}`}
                style={badgeBackgrounds[index % badgeBackgrounds.length].style}
              >
                {compatibility}% COMPATIBILITY
              </span>
            </div>

            {/* 3. Progress bar */}
            <div className="flex-1 min-w-0 w-full">
              <div className="h-1 bg-[rgba(33,31,32,0.10)] rounded-full relative overflow-hidden" style={{ height: '4px' }}>
                <div
                  className="absolute left-0 top-0 rounded-full"
                  style={{
                    width: `${compatibility}%`,
                    height: '4px',
                    background: '#211F20',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            {/* 4. Message Button */}
            <div>
              <button
                onClick={() => handleMessageClick(conn)}
                className="ml-auto flex items-center gap-2 bg-black rounded-lg px-6 py-3 sm:px-5 sm:py-2.5 xs:px-5 xs:py-2 transition-colors hover:bg-[#333]"
              >
                <SendIcon className="w-5 h-5" />
                <span className="font-poppins text-[12px] md:text-[14px] xl:text-[16px] font-medium leading-normal text-white">
                  Message
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectionsTable;

