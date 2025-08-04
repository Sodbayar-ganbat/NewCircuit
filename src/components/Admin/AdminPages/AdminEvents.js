import React, { useState, useEffect } from 'react';
import { db } from '../../../pages/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { FaSearch, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { DateTime } from 'luxon';
import { formatUserName } from '../../../utils/nameFormatter';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoverEventId, setHoverEventId] = useState(null); // for ID tooltip on hover
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    time: '',
    timeZone: '',
    menSpots: '',
    womenSpots: '',
    ageRange: '',
    eventType: '',
    eventID: ''
  });
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [eventUsers, setEventUsers] = useState([]);
  const [maleUsers, setMaleUsers] = useState([]);
  const [femaleUsers, setFemaleUsers] = useState([]);

  const LOCATION_OPTIONS = [
    'Atlanta',
    'Chicago',
    'Dallas',
    'Houston',
    'Los Angeles',
    'Miami',
    'New York City',
    'San Francisco / Bay Area',
    'Seattle',
    'Washington D.C.'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const functionsInst = getFunctions();
      const getEventDataCF = httpsCallable(functionsInst, 'getEventData');

      const eventsList = await Promise.all(
        eventsSnapshot.docs.map(async (d) => {
          const meta = d.data();
          const eventId = meta.eventID || d.id;
          try {
            const res = await getEventDataCF({ eventId });
            const remo = res.data?.event || {};
            return { id: d.id, ...remo, ...meta }; // Firebase meta (eventType etc.) overrides
          } catch (e) {
            console.error('Remo fetch fail', e);
            return { id: d.id, ...meta };
          }
        })
      );
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleShowUsers = async (event) => {
    setSelectedEvent(event);
    setShowUsersModal(true);
    setLoadingUsers(true);
    try {
      const functionsInst = getFunctions();
      const getMembers = httpsCallable(functionsInst, 'getEventMembers');
      // The Callable result comes back as an object: { data: <actualArray> }
      const res = await getMembers({ eventId: event.eventID });
      console.log('getEventMembers response:', res);

      const attendees = Array.isArray(res?.data) ? res.data : [];

      const normalized = attendees.map((a) => {
        const profile = a.user?.profile || {};
        const nameCombined = profile.name || formatUserName(profile);

        const email = a.user?.email || a.invite?.email || '-';

        const status = a.status || a.invite?.status || '-';
        const accepted = (a.invite?.isAccepted ?? (status === 'accepted')) ? 'Yes' : 'No';

        return {
          // Prefer explicit IDs; fall back to invite _id or email for table key
          id: a.user?.id || a.user?._id || a.invite?._id || a._id || email,
          name: nameCombined || email,
          email,
          // Use createdAt from root or invite object as sign-up timestamp
          signedUpAt: a.createdAt || a.invite?.createdAt || a.invite?.updatedAt || '',
          status,
          accepted,
        };
      });
      setEventUsers(normalized);
    } catch (error) {
      console.error('Error fetching Remo members:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'events', selectedEvent.id));
      setEvents(events.filter(evt => evt.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create the doc first to obtain its ID
      const docRef = await addDoc(collection(db, 'events'), {
        ...newEvent,
        menSignupCount: 0,
        womenSignupCount: 0,
      });

      // 2️⃣ Immediately write the Firestore ID inside the document for easy querying later
      await updateDoc(docRef, { id: docRef.id });

      setShowAddModal(false);
      setNewEvent({ title: '', date: '', location: '', time: '', timeZone: '', menSpots: '', womenSpots: '', ageRange: '', eventType: '', eventID: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'events', selectedEvent.id), selectedEvent);
      setShowEditModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const filteredEvents = events.filter(evt =>
    evt.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-7 bg-white rounded-3xl border border-gray-50 border-solid shadow-[0_4px_20px_rgba(238,238,238,0.502)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Events Management</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#0043F1] text-white rounded-xl hover:bg-[#0034BD] transition-colors"
          >
            <FaPlus />
            Create New Event
          </button>
        </div>
      </div>

      <div
        className="overflow-y-auto max-h-[calc(100vh-250px)]"
        onScroll={() => hoverEventId && setHoverEventId(null)}
      >
        <table className="min-w-full whitespace-nowrap text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Zone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign Ups</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredEvents.map(evt => (
              <tr key={evt.id}>
                {(() => {
                  const dt = evt.startTime ? DateTime.fromMillis(Number(evt.startTime)) : null;
                  const dateStr = dt ? dt.toFormat('MM/dd/yyyy') : (evt.date ? DateTime.fromISO(evt.date).toFormat('MM/dd/yyyy') : '');
                  const timeStr = dt ? dt.toFormat('h:mm a') : (evt.time || '');
                  const tzStr = dt ? dt.offsetNameShort : (evt.timeZone || '');
                  return (
                    <> 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="relative text-blue-600 underline cursor-pointer"
                          onMouseEnter={() => setHoverEventId(evt.id)}
                        >
                          {evt.name || evt.title}
                          {hoverEventId === evt.id && (
                            <div
                              className="absolute z-10 left-full ml-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-lg rounded p-2 text-xs whitespace-nowrap"
                              onMouseEnter={() => setHoverEventId(evt.id)}
                              onMouseLeave={() => setHoverEventId(null)}
                            >
                              <div><span className="font-semibold">Firestore:</span> {evt.id}</div>
                              <div><span className="font-semibold">Event ID:</span> {evt.eventID || '-'}</div>
                            </div>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{dateStr}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{timeStr}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tzStr}</td>
                       </>
                  );
                })()}
                <td className="px-6 py-4 whitespace-nowrap">{evt.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleShowUsers(evt)}
                    className="px-3 py-1 bg-[#0043F1] text-white text-sm rounded-lg hover:bg-[#0034BD] transition-colors"
                  >
                    Users
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{evt.eventType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{evt.ageRange}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditEvent(evt)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                    title="Edit Event"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(evt)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Event"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Delete Event</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedEvent?.title}? This action cannot be undone.
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

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={newEvent.location}
                  onChange={(e)=>setNewEvent({...newEvent, location:e.target.value})}
                  required
                >
                  <option value="" disabled>Select location</option>
                  {LOCATION_OPTIONS.map(loc => (<option key={loc} value={loc}>{loc}</option>))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Time (e.g., 7:00 PM)</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={newEvent.time}
                    onChange={(e)=>setNewEvent({...newEvent, time:e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Time Zone</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={newEvent.timeZone}
                    onChange={(e)=>setNewEvent({...newEvent, timeZone:e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Men Spots</label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={newEvent.menSpots}
                    onChange={(e) => setNewEvent({ ...newEvent, menSpots: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Women Spots</label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={newEvent.womenSpots}
                    onChange={(e) => setNewEvent({ ...newEvent, womenSpots: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Age Range (e.g., 25-35)</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={newEvent.ageRange}
                  onChange={(e) => setNewEvent({ ...newEvent, ageRange: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Event Type</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                  required
                >
                  <option value="" disabled>Select type</option>
                  {['Brunch','Happy Hour','Dinner'].map(t=>(<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Event ID</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={newEvent.eventID}
                  onChange={(e) => setNewEvent({ ...newEvent, eventID: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0043F1] text-white rounded-lg hover:bg-[#0034BD] transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>
            <form onSubmit={handleUpdateEvent} className="flex flex-col gap-4">
              {/* Event Title */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={selectedEvent.title}
                  onChange={(e)=>setSelectedEvent({...selectedEvent,title:e.target.value})}
                  required
                />
              </div>

              {/* Location before Date */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={selectedEvent.location}
                  onChange={(e)=>setSelectedEvent({...selectedEvent,location:e.target.value})}
                  required
                >
                  {LOCATION_OPTIONS.map(loc=>(<option key={loc} value={loc}>{loc}</option>))}
                </select>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={selectedEvent.date}
                  onChange={(e)=>setSelectedEvent({...selectedEvent,date:e.target.value})}
                  required
                />
              </div>

              {/* Time & TimeZone Row */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Time (e.g., 7:00 PM)</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={selectedEvent.time}
                    onChange={(e)=>setSelectedEvent({...selectedEvent,time:e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Time Zone</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={selectedEvent.timeZone}
                    onChange={(e)=>setSelectedEvent({...selectedEvent,timeZone:e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Men & Women Spots Row */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Men Spots</label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={selectedEvent.menSpots}
                    onChange={(e)=>setSelectedEvent({...selectedEvent, menSpots:e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-gray-700">Women Spots</label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none w-full"
                    value={selectedEvent.womenSpots}
                    onChange={(e)=>setSelectedEvent({...selectedEvent, womenSpots:e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Age Range */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Age Range</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={selectedEvent.ageRange}
                  onChange={(e)=>setSelectedEvent({...selectedEvent,ageRange:e.target.value})}
                  required
                />
              </div>

              {/* Event Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Event Type</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={selectedEvent.eventType}
                  onChange={(e)=>setSelectedEvent({...selectedEvent,eventType:e.target.value})}
                  required
                >
                  {['Brunch','Happy Hour','Dinner'].map(t=>(<option key={t} value={t}>{t}</option>))}
                </select>
              </div>

              {/* Event ID */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Event ID</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  value={selectedEvent.eventID}
                  onChange={(e)=>setSelectedEvent({...selectedEvent,eventID:e.target.value})}
                  required
                />
              </div>


              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={()=>setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0043F1] text-white rounded-lg hover:bg-[#0034BD] transition-colors">Update Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Overview Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Users for {selectedEvent?.name || selectedEvent?.title}
            </h2>
            {loadingUsers ? (
              <div className="text-center py-8">Loading...</div>
            ) : eventUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No users have signed up yet.</div>
            ) : (
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-semibold mb-2">All Users</h3>
                  <table className="min-w-full text-sm table-fixed">
                    <thead className="bg-gray-50 sticky z-10">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/5">Name</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/5">Signed Up At</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/5">Email</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/5">Status</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600 w-1/5">Accepted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {eventUsers.map(u => (
                        <tr key={u.id}>
                          <td className="px-4 py-2 whitespace-nowrap w-1/5 truncate">{u.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap w-1/5 truncate">{u.signedUpAt ? new Date(u.signedUpAt).toLocaleString() : '-'}</td>
                          <td className="px-4 py-2 whitespace-nowrap w-1/5 truncate">{u.email}</td>
                          <td className="px-4 py-2 whitespace-nowrap w-1/5 truncate capitalize">{u.status}</td>
                          <td className="px-4 py-2 whitespace-nowrap w-1/5 truncate">{u.accepted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowUsersModal(false)}
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

export default AdminEvents; 