import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../pages/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { deleteUser, getAuth, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { FaSearch, FaTrash, FaUserShield } from 'react-icons/fa';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { getFunctions, httpsCallable } from 'firebase/functions';
import AdminUserDetailModal from './AdminUserDetailModal';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  // Events modal state
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const adminSnapshot = await getDocs(collection(db, 'adminUsers'));
      const adminIds = adminSnapshot.docs.map(doc => doc.id);
      setAdminUsers(adminIds);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleMakeAdmin = (user) => {
    setSelectedUser(user);
    setShowAdminModal(true);
  };

  const confirmMakeAdmin = async () => {
    try {
      setLoading(true);
      // Add to adminUsers collection
      await setDoc(doc(db, 'adminUsers', selectedUser.id), {
        email: selectedUser.email,
        addedAt: new Date()
      });

      // Update local state
      setAdminUsers([...adminUsers, selectedUser.id]);
      setShowAdminModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error making user admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      
      const functions = getFunctions();
      const deleteUserFunction = httpsCallable(functions, 'deleteUserAsAdmin');
      
      await deleteUserFunction({ userId: selectedUser.id });

      // Update local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);

    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show events for a user
  const handleShowEvents = async (user) => {
    setSelectedUser(user);
    setShowEventsModal(true);
    setLoadingEvents(true);
    try {
      const eventsSnap = await getDocs(collection(db, 'users', user.id, 'signedUpEvents'));
      const eventsList = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUserEvents(eventsList);
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-7 bg-white rounded-3xl border border-gray-50 border-solid shadow-[0_4px_20px_rgba(238,238,238,0.502)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className={user.id === auth.currentUser?.uid ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer text-blue-700 hover:underline" onClick={() => { setSelectedUserDetail(user); setShowUserDetailModal(true); }}>
                  {user.firstName} {user.lastName}
                  {user.id === auth.currentUser?.uid && (
                    <span className="ml-2 text-xs text-blue-600">(Me)</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? <IoMdCheckmark className="mr-1" /> : <IoMdClose className="mr-1" />}
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    adminUsers.includes(user.id) ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <FaUserShield className="mr-1" />
                    {adminUsers.includes(user.id) ? 'Admin' : 'User'}
                  </span>
                </td>
                {/* Events column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleShowEvents(user)}
                    className="px-3 py-1 bg-[#0043F1] text-white text-sm rounded-lg hover:bg-[#0034BD] transition-colors"
                  >
                    Events
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {!adminUsers.includes(user.id) && (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Make Admin"
                      >
                        <FaUserShield />
                      </button>
                    )}
                    {user.id !== auth.currentUser?.uid && (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Delete User</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Make User Admin</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to make {selectedUser?.firstName} {selectedUser?.lastName} an admin? 
              They will have full administrative access.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowAdminModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                onClick={confirmMakeAdmin}
              >
                Make Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetailModal && selectedUserDetail && (
        <AdminUserDetailModal
          isOpen={showUserDetailModal}
          onClose={() => setShowUserDetailModal(false)}
          user={selectedUserDetail}
        />
      )}

      {/* User Events Modal */}
      {showEventsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Events for {selectedUser?.firstName} {selectedUser?.lastName}</h2>
            {loadingEvents ? (
              <div className="text-center py-8">Loading...</div>
            ) : userEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No events found.</div>
            ) : (
              <table className="min-w-full text-sm table-fixed">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/4">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/4">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/4">Time</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/4">Event ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userEvents.map(ev => (
                    <tr key={ev.id}>
                      <td className="px-4 py-2 whitespace-nowrap w-1/4 truncate">{ev.eventTitle || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap w-1/4 truncate">{ev.eventDate || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap w-1/4 truncate">{ev.eventTime || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap w-1/4 truncate">{ev.eventID || ev.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowEventsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement; 