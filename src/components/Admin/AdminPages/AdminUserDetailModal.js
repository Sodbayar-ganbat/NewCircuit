import React, { useEffect, useState } from 'react';
import { db } from '../../../pages/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaSearchPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminUserDetailModal = ({ isOpen, onClose, user }) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedImg, setExpandedImg] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [selected, setSelected] = useState([]); // index array

  useEffect(() => {
    if (!user || !isOpen) return;
    setLoading(true);
    setSelected([]);
    const fetchDates = async () => {
      // Find all conversations where user is a participant
      const q = query(collection(db, 'conversations'), where('userIds', 'array-contains', user.id));
      const snap = await getDocs(q);
      let allDates = [];
      for (const docSnap of snap.docs) {
        const convo = docSnap.data();
        const convoId = docSnap.id;
        if (Array.isArray(convo.dates)) {
          convo.dates.forEach(date => {
            // Always show the date, photo is optional
            let userPhoto = null;
            if (date.photos && date.photos[user.id] && date.photos[user.id].uploaded && date.photos[user.id].url) {
              userPhoto = date.photos[user.id].url;
            }
            allDates.push({
              ...date,
              convoId,
              userPhoto,
              partnerId: Array.isArray(convo.userIds) ? convo.userIds.find(uid => uid !== user.id) : null,
            });
          });
        }
      }
      // Optionally fetch partner names
      for (const d of allDates) {
        if (d.partnerId) {
          try {
            const partnerDoc = await getDoc(doc(db, 'users', d.partnerId));
            d.partnerName = partnerDoc.exists() ? `${partnerDoc.data().firstName || ''} ${partnerDoc.data().lastName || ''}`.trim() : d.partnerId;
          } catch (e) {
            d.partnerName = d.partnerId;
          }
        }
      }
      setDates(allDates);
      setLoading(false);
    };
    fetchDates();
  }, [user, isOpen]);

  // Approve selected
  const handleApproveSelected = async () => {
    for (const idx of selected) {
      const date = dates[idx];
      if (!date || date.adminApproved || date.adminRejected) continue;
      const convoRef = doc(db, 'conversations', date.convoId);
      const snap = await getDoc(convoRef);
      if (!snap.exists()) continue;
      const data = snap.data();
      const updatedDates = (data.dates || []).map(d =>
        d.id === date.id
          ? { ...d, adminApproved: true, adminRejected: false, rejectionReason: null }
          : d
      );
      await updateDoc(convoRef, { dates: updatedDates });
    }
    setSelected([]);
    await refreshDates();
  };

  // Reject selected
  const handleRejectSelected = () => {
    setRejecting(true);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const confirmRejectSelected = async () => {
    for (const idx of selected) {
      const date = dates[idx];
      if (!date || date.adminApproved || date.adminRejected) continue;
      const convoRef = doc(db, 'conversations', date.convoId);
      const snap = await getDoc(convoRef);
      if (!snap.exists()) continue;
      const data = snap.data();
      const updatedDates = (data.dates || []).map(d => {
        if (d.id === date.id) {
          // Do NOT delete the user's photo, just update status and reason
          return { ...d, adminRejected: true, adminApproved: false, rejectionReason: rejectReason };
        }
        return d;
      });
      await updateDoc(convoRef, { dates: updatedDates });
    }
    setShowRejectModal(false);
    setRejecting(false);
    setRejectReason('');
    setSelected([]);
    await refreshDates();
  };

  // Helper: get pending, approved, rejected
  const pendingDates = dates.filter(date => !date.adminApproved && !date.adminRejected);
  const approvedDates = dates.filter(date => date.adminApproved);
  // const rejectedDates = dates.filter(date => date.adminRejected); // Not shown

  // Checkbox handler
  const handleCheckbox = idx => {
    setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const refreshDates = async () => {
    const q = query(collection(db, 'conversations'), where('userIds', 'array-contains', user.id));
    const snap = await getDocs(q);
    let allDates = [];
    for (const docSnap of snap.docs) {
      const convo = docSnap.data();
      const convoId = docSnap.id;
      if (Array.isArray(convo.dates)) {
        convo.dates.forEach(date => {
          let userPhoto = null;
          if (date.photos && date.photos[user.id] && date.photos[user.id].uploaded && date.photos[user.id].url) {
            userPhoto = date.photos[user.id].url;
          }
          allDates.push({
            ...date,
            convoId,
            userPhoto,
            partnerId: Array.isArray(convo.userIds) ? convo.userIds.find(uid => uid !== user.id) : null,
          });
        });
      }
    }
    for (const d of allDates) {
      if (d.partnerId) {
        try {
          const partnerDoc = await getDoc(doc(db, 'users', d.partnerId));
          d.partnerName = partnerDoc.exists() ? `${partnerDoc.data().firstName || ''} ${partnerDoc.data().lastName || ''}`.trim() : d.partnerId;
        } catch (e) {
          d.partnerName = d.partnerId;
        }
      }
    }
    setDates(allDates);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">{user.firstName} {user.lastName}'s Submitted Dates</h2>
        {loading ? (
          <div className="text-center py-8">Loading…</div>
        ) : (
          <>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Show all cards, with checkboxes for pending */}
              {dates.map((date, idx) => (
                <div key={date.id || idx} className="border rounded-lg p-4 flex gap-6 items-center bg-white">
                  {/* Checkbox for pending only */}
                  {!date.adminApproved && !date.adminRejected && (
                    <input
                      type="checkbox"
                      checked={selected.includes(idx)}
                      onChange={() => handleCheckbox(idx)}
                      className="w-5 h-5 mr-2 accent-blue-600"
                    />
                  )}
                  <div className="relative">
                    {date.userPhoto ? (
                      <>
                        <img
                          src={date.userPhoto}
                          alt="User submission"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100"
                          onClick={() => setExpandedImg(date.userPhoto)}
                          type="button"
                          title="View full size"
                        >
                          <FaSearchPlus className="text-xl text-gray-700" />
                        </button>
                      </>
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-400 border rounded-lg">No photo submitted</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">Date: {date.timestamp && date.timestamp.toDate ? date.timestamp.toDate().toLocaleString() : ''}</div>
                    <div className="text-gray-600 mb-1">Location: {date.location || 'N/A'}</div>
                    <div className="text-gray-600 mb-1">Partner: {date.partnerName || date.partnerId || 'N/A'}</div>
                    {date.adminApproved ? (
                      <div className="font-semibold mb-1 text-green-600">Status: Approved</div>
                    ) : date.adminRejected ? (
                      <div className="font-semibold mb-1 text-red-600">Status: Rejected</div>
                    ) : (
                      <div className="font-semibold mb-1 text-gray-500">Status: Pending</div>
                    )}
                  </div>
                </div>
              ))}
              {dates.length === 0 && (
                <div className="text-center py-8 text-gray-500">No submitted dates.</div>
              )}
            </div>
            {/* Approve/Reject Selected Buttons */}
            {pendingDates.length > 0 && (
              <div className="mt-6 flex items-center gap-4 justify-center">
                <button
                  className={`px-6 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleApproveSelected}
                  disabled={selected.length === 0}
                >
                  Approve
                </button>
                <button
                  className={`px-6 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleRejectSelected}
                  disabled={selected.length === 0}
                >
                  Reject
                </button>
              </div>
            )}
            {pendingDates.length === 0 && approvedDates.length > 0 && (
              <div className="mt-6 text-center text-green-600 font-semibold">All dates approved.</div>
            )}
          </>
        )}
      </div>
      {/* Expanded Image Modal */}
      {expandedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setExpandedImg(null)}
        >
          <div className="relative max-w-3xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
              onClick={() => setExpandedImg(null)}
              title="Close"
            >
              &times;
            </button>
            <img src={expandedImg} alt="Full size" className="max-h-[80vh] max-w-full rounded-xl shadow-lg" />
          </div>
        </div>
      )}
      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowRejectModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Reject Dates</h2>
            <p className="mb-2 text-gray-700">Please provide a reason for rejection:</p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 min-h-[80px]"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${!rejectReason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={confirmRejectSelected}
                disabled={!rejectReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetailModal; 