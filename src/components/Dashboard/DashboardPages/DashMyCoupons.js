import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../../pages/firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

export default function DashMyCoupons() {
  const me = auth.currentUser.uid;

  const [conversations, setConversations] = useState([]);
  const [acceptedDates, setAcceptedDates] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [rejectedDates, setRejectedDates] = useState([]); // NEW
  const [showRejectedPopup, setShowRejectedPopup] = useState(false); // NEW
  const [showCouponModal, setShowCouponModal] = useState(false); // NEW
  const [selectedCoupon, setSelectedCoupon] = useState(null); // NEW
  const coupons = [
    { id: 'c1', name: 'Free Dessert', desc: 'Get a free dessert at participating restaurants.' },
    { id: 'c2', name: '2-for-1 Appetizer', desc: 'Buy one appetizer, get one free.' },
    { id: 'c3', name: '10% Off', desc: '10% off your next date meal.' },
  ];

  // local preview + persisted URL
  const [date1Url, setDate1Url] = useState('');
  const [date2Url, setDate2Url] = useState('');
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);

  const [sel1, setSel1] = useState('');
  const [sel2, setSel2] = useState('');
  const [error, setError] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    setSel1('');
    setSel2('');
    setDate1Url('');
    setDate2Url('');
    setPreview1(null);
    setPreview2(null);
  }, [me]);

  // 1️⃣ subscribe & extract
  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      where('userIds', 'array-contains', me)
    );
    return onSnapshot(q, snap => {
      const convos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setConversations(convos);
      const dates = convos.flatMap(c =>
        (c.dates || [])
          .filter(d => d.status === 'accepted')
          .map(d => ({
            ...d,
            convoId: c.id,
            partnerId: c.userIds.find(u => u !== me)
          }))
      );
      setAcceptedDates(dates);
      // NEW: rejected dates
      const rejected = convos.flatMap(c =>
        (c.dates || [])
          .filter(d => d.adminRejected)
          .map(d => ({
            ...d,
            convoId: c.id,
            partnerId: c.userIds.find(u => u !== me)
          }))
      );
      setRejectedDates(rejected);
    });
  }, [me]);

  // Show popup if there are rejected dates
  useEffect(() => {
    if (rejectedDates.length > 0) {
      setShowRejectedPopup(true);
    }
  }, [rejectedDates]);

  // 2️⃣ fetch partner names
  useEffect(() => {
  acceptedDates.forEach(d => {
    const uid = String(d.partnerId); // force string
    if (!uid || usersMap[uid]) return;

    getDoc(doc(db, 'users', uid)).then(uDoc => {
      if (uDoc.exists()) {
        const { firstName, lastName } = uDoc.data();
        setUsersMap(m => ({ ...m, [uid]: `${firstName} ${lastName}`.trim() }));
      } else {
        setUsersMap(m => ({ ...m, [uid]: uid }));
      }
    });
  });
}, [acceptedDates]);
  

  // 3️⃣ whenever sel1 changes, reset slot1 state unless that date really has a URL
  useEffect(() => {
    const d = acceptedDates.find(d => d.id === sel1);
    if (d?.photos?.[me]?.uploaded) {
      setDate1Url(d.photos[me].url);
      setPreview1(null);
    } else {
      setDate1Url('');
      setPreview1(null);
    }
  }, [sel1, acceptedDates, me]);

  // 4️⃣ same for slot2
  useEffect(() => {
    const d = acceptedDates.find(d => d.id === sel2);
    if (d?.photos?.[me]?.uploaded) {
      setDate2Url(d.photos[me].url);
      setPreview2(null);
    } else {
      setDate2Url('');
      setPreview2(null);
    }
  }, [sel2, acceptedDates, me]);

  const onFile = (slot, e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      slot === 1 ? setPreview1(ev.target.result) : setPreview2(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const upload = async slot => {
    setError('');
    const selected = slot === 1 ? sel1 : sel2;
    const preview  = slot === 1 ? preview1 : preview2;
    const setLoading = slot === 1 ? setLoading1 : setLoading2;
    if (!selected) { setError(`Select date ${slot}`); return; }
    if (!preview)  { setError(`Upload your photo for date ${slot}`); return; }

    setLoading(true);
    try {
      const d = acceptedDates.find(x => x.id === selected);
      const path = `datePictures/${d.convoId}/${d.id}/${me}`;
      const ref  = storageRef(storage, path);
      const blob = await fetch(preview).then(r => r.blob());
      await uploadBytes(ref, blob);
      const url = await getDownloadURL(ref);

      // update Firestore
      const convoRef = doc(db, 'conversations', d.convoId);
      const snap     = await getDoc(convoRef);
      const data     = snap.data();
      const updated  = (data.dates || []).map(x =>
        x.id === d.id
          ? {
              ...x,
              photos: {
                ...x.photos,
                [me]: { uploaded: true, url }
              }
            }
          : x
      );
      await updateDoc(convoRef, { dates: updated });

      // persist locally
      if (slot === 1) {
        setDate1Url(url);
        setPreview1(null);
      } else {
        setDate2Url(url);
        setPreview2(null);
      }
    } catch (err) {
      console.error(err);
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-7 bg-white rounded shadow-lg relative">
      {/* View Coupons button */}
      <button
        className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded shadow"
        onClick={() => setShowCouponModal(true)}
      >
        View Coupons
      </button>
      {/* Coupon Modal/Panel */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white border-2 border-indigo-400 rounded-lg p-6 max-w-lg w-full relative shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
              onClick={() => setShowCouponModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {acceptedDates.length >= 2 ? (
              <>
                <div className="font-semibold text-lg mb-4">Select Your Coupon</div>
                <div className="space-y-4">
                  {coupons.map(coupon => (
                    <label key={coupon.id} className={`block border rounded p-4 cursor-pointer transition ${selectedCoupon === coupon.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'}`}>
                      <input
                        type="radio"
                        name="coupon"
                        value={coupon.id}
                        checked={selectedCoupon === coupon.id}
                        onChange={() => setSelectedCoupon(coupon.id)}
                        className="mr-3"
                      />
                      <span className="font-semibold">{coupon.name}</span>
                      <div className="text-gray-600 text-sm mt-1">{coupon.desc}</div>
                    </label>
                  ))}
                </div>
                <button
                  className={`mt-6 w-full py-2 rounded text-white ${selectedCoupon ? 'bg-indigo-600 hover:bg-indigo-800' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={!selectedCoupon}
                  onClick={() => setShowCouponModal(false)}
                >
                  Redeem Selected Coupon
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="font-semibold text-lg mb-2 text-red-600">You need 2 approved dates to access coupons.</div>
                <div className="text-gray-600">Once you have 2 dates approved, you can select your coupon here!</div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* REJECTED DATE POPUP OVERLAY */}
      {showRejectedPopup && rejectedDates.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white border-2 border-red-400 rounded-lg p-6 max-w-lg w-full relative shadow-xl">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
              onClick={() => setShowRejectedPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {(() => {
              const d = rejectedDates[0]; // Most recent
              const partner = d.partnerId ? usersMap[String(d.partnerId)] || d.partnerId : null;
              return (
                <div>
                  <div className="font-semibold text-lg mb-1">Date: {d.timestamp && d.timestamp.toDate ? d.timestamp.toDate().toLocaleString() : ''}</div>
                  <div className="text-gray-600 mb-1">Location: {d.location || 'N/A'}</div>
                  <div className="text-gray-600 mb-1">Partner: {partner || d.partnerId || 'N/A'}</div>
                  <div className="font-semibold text-red-600 mb-1">Status: Rejected</div>
                  {d.rejectionReason && (
                    <div className="text-red-700 bg-red-100 border border-red-300 rounded p-2 mt-2">
                      <span className="font-semibold">Admin message:</span> {d.rejectionReason}
                    </div>
                  )}
                  <button
                    className="mt-6 w-full py-2 rounded bg-red-600 hover:bg-red-800 text-white font-semibold"
                    onClick={() => setShowRejectedPopup(false)}
                  >
                    I understand
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      <h2 className="text-2xl mb-4">My Coupons</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {[1,2].map(slot => {
        const sel       = slot===1 ? sel1      : sel2;
        const setSel    = slot===1 ? setSel1    : setSel2;
        const preview   = slot===1 ? preview1   : preview2;
        const persisted = slot===1 ? date1Url   : date2Url;
        const otherSel  = slot===1 ? sel2       : sel1;
        const loading   = slot===1 ? loading1   : loading2;
        const dateObj = acceptedDates.find(d => String(d.id) === sel);
        const partnerId = dateObj?.partnerId;
        const partner = partnerId ? usersMap[String(partnerId)] || partnerId : null;
        return (
          <div key={slot} className="mb-8">
            <h3 className="font-semibold mb-2">
            {partner ? `Date with ${partner}` : `Date ${slot}`}
            </h3>
            <select
              className="border p-2 rounded w-full mb-4"
              value={sel}
              onChange={e => setSel(e.target.value)}
            >
              <option value="">Select a scheduled date…</option>
              {acceptedDates
                .filter(d => d.id !== otherSel)
                .map(d => {
                  const name = usersMap[String(d.partnerId)] || d.partnerId;
                  return (
                    <option key={d.id} value={d.id}>
                      {new Date(d.timestamp.toDate()).toLocaleString()}{' '}
                      — with {name} at {d.location}
                    </option>
                  );
                })}
            </select>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* YOU */}
              <div className="border-2 border-dashed rounded h-48 flex items-center justify-center">
                {persisted ? (
                  <img src={persisted} className="w-full h-full object-cover rounded" />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      id={`you-${slot}`}
                      className="hidden"
                      onChange={e => onFile(slot, e)}
                    />
                    <label
                      htmlFor={`you-${slot}`}
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                      {preview
                        ? <img src={preview} className="w-full h-full object-cover rounded" />
                        : <>
                            <div className="text-4xl text-gray-400">+</div>
                            <span>Your photo</span>
                          </>}
                    </label>
                  </>
                )}
              </div>
              {/* PARTNER */}
              <div className="border-2 border-dashed rounded h-48 flex items-center justify-center text-gray-400">
                {persisted ? 'Waiting for partner' : 'Your upload locks this slot'}
              </div>

            </div>

            <button
              onClick={() => upload(slot)}
              disabled={loading || !!persisted}
              className={`w-full py-2 text-white rounded ${
                persisted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : loading
                    ? 'bg-indigo-300'
                    : 'bg-indigo-600 hover:bg-indigo-800'
              }`}
            >
              {persisted ? 'Submitted ✅' : loading ? 'Uploading…' : `Submit Date ${slot}`}
            </button>
          </div>
        );
      })}

    </div>
  );
}

