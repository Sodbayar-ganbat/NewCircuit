import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../pages/firebaseConfig';
import {DashMessages} from './DashMessages';
import { calculateAge } from '../../../utils/ageCalculator';

const DashMyConnections = () => {
  const location = useLocation();
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle navigation state from Current Sparks section
  useEffect(() => {
    if (location.state?.selectedConnectionId && connections.length > 0) {
      const connectionToSelect = connections.find(conn => conn.id === location.state.selectedConnectionId);
      if (connectionToSelect) {
        setSelectedConnection(connectionToSelect);
        // Clear the state to prevent auto-selection on subsequent renders
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, connections]);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!auth.currentUser) {
        // console.error('[CONNECTIONS] No authenticated user found');
        return;
      }
      
      try {
        setLoading(true);
        // Fetch connections from user's connections subcollection
        const connectionsSnap = await getDocs(collection(db, 'users', auth.currentUser.uid, 'connections'));
        const connectionIds = connectionsSnap.docs.map(doc => doc.id);
        
        // Fetch profile data for each connection and check for mutual status
        const connectionProfiles = await Promise.all(
          connectionIds.map(async (connectionId) => {
            try {
              
              const userDoc = await getDoc(doc(db, 'users', connectionId));
              if (!userDoc.exists()) {
                return null;
              }
              
              // Get the connection document to retrieve the match score and status
              const connectionDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'connections', connectionId));
              const connectionData = connectionDoc.exists() ? connectionDoc.data() : {};
              
              
              // Only include mutual connections
              if (connectionData.status !== 'mutual') {
                return null;
              }
              
              const userData = userDoc.data();
              const profile = {
                id: connectionId,
                name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : userData.displayName || 'Unknown',
                img: userData.image || '/default-profile.png',
                age: calculateAge(userData.birthDate),
                // Use the actual AI match score stored when connection was created, rounded
                compatibility: Math.round(connectionData.matchScore || 0)
              };
              
              return profile;
            } catch (err) {
              return null;
            }
          })
        );
        
        const validProfiles = connectionProfiles.filter(Boolean);
        
        setConnections(validProfiles);
      } catch (err) {
        setConnections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const ConnectionList = () => {
    if (loading) {
      return <div className="flex flex-col px-7 w-full max-md:px-5">
        <div className="text-center py-8 text-gray-600">Loading Sparks...</div>
      </div>;
    }

    if (connections.length === 0) {
      return <div className="flex flex-col px-7 w-full max-md:px-5">
        <div className="text-center py-8 text-gray-600">
        No sparks yet. When both you and someone from your connections select one another, they’ll appear here! 
        </div>
      </div>;
    }

    return (
      <div className="flex flex-col px-7 w-full max-md:px-5">
        {connections.map(connection => (
          <div
            key={connection.id}
            className="flex items-center py-4 px-6 bg-gray-100 rounded-xl my-2 shadow-sm"
          >
            {/* Profile Image & Name */}
            <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
              <img
                src={connection.img}
                alt={connection.name}
                className="w-12 h-12 rounded-full border border-gray-300 object-cover"
              />
              <div className="text-lg font-semibold">{connection.name}</div>
            </div>

            {/* Compatibility Bar */}
            <div className="flex-1 px-4">
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${connection.compatibility}%`,
                    backgroundColor: getCompatibilityColor(connection.compatibility),
                  }}
                />
              </div>
            </div>

            {/* Compatibility Percentage & Icon */}
            <div className="flex items-center justify-end w-1/3 min-w-[120px] gap-3">
              <span
                className="px-3 py-1 text-sm font-semibold text-gray-900 rounded-lg shadow-sm border border-gray-300"
                style={{ backgroundColor: getCompatibilityColor(connection.compatibility) }}
              >
                {connection.compatibility}%
              </span>
              <button onClick={() => setSelectedConnection(connection)}>
                <FaPaperPlane className="text-indigo-600 cursor-pointer hover:text-indigo-800" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-7 bg-white rounded-3xl border border-gray-50 border-solid shadow-[0_4px_20px_rgba(238,238,238,0.502)] max-md:p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-7">
        <div className="text-xl font-semibold text-indigo-950">
          Current Sparks
        </div>
      </div>

      {selectedConnection == null ? (
        <ConnectionList />
      ) : (
        <div>
          <div className="flex items-center gap-4 px-7 mb-6">
            <button onClick={() => setSelectedConnection(null)}>
              <IoChevronBackCircleOutline size={50} />
            </button>
            <div className="text-4xl font-semibold">
              {selectedConnection.name}
            </div>
          </div>
          <DashMessages connection={selectedConnection} />
        </div>
      )}
    </div>
  );
};

// Helper: compatibility color
const getCompatibilityColor = score => {
  if (score >= 80) return '#00E096';
  if (score >= 60) return '#0095FF';
  return '#C5A8FF';
};

export default DashMyConnections;

