import React, { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../pages/firebaseConfig';
import {DashMessages} from './DashMessages';

const DashMyConnections = () => {
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const connectionsCol = collection(db, 'users', user.uid, 'connections');
        const snapshot = await getDocs(connectionsCol);
        const connectionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConnections(connectionsList);
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };
    fetchConnections();
  }, []);

  const ConnectionList = () => (
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
              className="w-12 h-12 rounded-full border border-gray-300"
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

  return (
    <div className="p-7 bg-white rounded-3xl border border-gray-50 border-solid shadow-[0_4px_20px_rgba(238,238,238,0.502)] max-md:p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-7">
        <div className="text-xl font-semibold text-indigo-950">
          Current Connections
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

