import React, { useState } from "react";
import { DateTime } from 'luxon';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../../../pages/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../pages/firebaseConfig';
import { ReactComponent as LocationIcon } from '../../../images/location.svg';
import { ReactComponent as TimerIcon } from '../../../images/timer.svg';

function getDateParts(dateString, timeString, timeZone) {
  const normalizedTime = timeString ? timeString.replace(/am|pm/i, m => m.toUpperCase()).trim() : '';
  const cleanDate = (dateString || '').trim();

  const zoneMap = {
    'PST': 'America/Los_Angeles',
    'EST': 'America/New_York',
    'CST': 'America/Chicago',
    'MST': 'America/Denver',
  };
  const zone = zoneMap[timeZone] || timeZone || 'UTC';

  // Build candidate format strings.
  const withTime = [
    'yyyy-MM-dd h:mma',
    'yyyy-MM-dd H:mm',
    'MM/dd/yyyy h:mma',
    'MM/dd/yyyy H:mm',
    'M/d/yyyy h:mma',
    'M/d/yyyy H:mm',
    'MM/dd/yy h:mma',
    'MM/dd/yy H:mm',
    'M/d/yy h:mma',
    'M/d/yy H:mm',
  ];
  const dateOnly = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'M/d/yyyy',
    'MM/dd/yy',
    'M/d/yy',
  ];

  let dt = null;

  if (cleanDate) {
    const formatsToTry = normalizedTime ? withTime : dateOnly;
    for (const fmt of formatsToTry) {
      dt = DateTime.fromFormat(
        normalizedTime ? `${cleanDate} ${normalizedTime}` : cleanDate,
        fmt,
        { zone }
      );
      if (dt.isValid) break;
    }
    // As a last resort, let Luxon try ISO parsing.
    if (!dt || !dt.isValid) {
      dt = DateTime.fromISO(cleanDate, { zone });
    }
  }

  if (!dt || !dt.isValid) {
    return { dayOfWeek: '', day: '', month: '' };
  }

  return {
    dayOfWeek: dt.toFormat('ccc').toUpperCase(),
    day: dt.toFormat('d'),
    month: dt.toFormat('LLL').toUpperCase(),
  };
}

// Helper for Remo epoch timestamps
function getDatePartsFromMillis(millis) {
  if (!millis) return { dayOfWeek: '', day: '', month: '' };
  const dt = DateTime.fromMillis(Number(millis));
  return {
    dayOfWeek: dt.toFormat('ccc').toUpperCase(),
    day: dt.toFormat('d'),
    month: dt.toFormat('LLL').toUpperCase(),
    timeLabel: dt.toFormat('h:mm a'),
  };
}

const EventCard = ({ event, type, userGender, onSignUp, datesRemaining }) => {
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Prefer Remo timestamp if available
  const dateParts = event.startTime ? getDatePartsFromMillis(event.startTime) : getDateParts(event.date, event.time, event.timeZone);
  const { dayOfWeek, day, month, timeLabel } = dateParts;
  
  return (
    <>
      <div
        className="flex flex-col items-start rounded-[16px] border p-3 sm:p-4 xl:p-5 2xl:p-6 gap-4 sm:gap-5 xl:gap-6 2xl:gap-8 w-full"
        style={
          type === "signup"
            ? {
                border: "1px solid rgba(33, 31, 32, 0.10)",
                borderRadius: "16px",
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(226,255,101,0.50) 0%, rgba(210,255,215,0.50) 100%)"
              }
            : {
                border: "1px solid rgba(33, 31, 32, 0.10)",
                borderRadius: "16px",
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(176,238,255,0.50) 0%, rgba(231,233,255,0.50) 100%)"
              }
        }
      >


        {/* Remo Event Title - above age range */}
        <div className="border-3 border-black p-2 rounded mb-[-20px]">  
            {event.title && (
              <div className="font-medium text-[#211F20] font-bricolage leading-[130%] text-[14px] sm:text-[16px] lg:text-[20px] 2xl:text-[24px]">
                {event.title}
              </div>
            )}
          </div>
        
        {/* Age Range - Top */}
        {event.ageRange && (
          <div className="border-3 border-black p-2 rounded">
            <div className="
              font-medium
              text-[#211F20]
              font-bricolage
              leading-[130%]
              text-[14px] sm:text-[16px] lg:text-[20px] 2xl:text-[24px]
            ">
              Ages {event.ageRange}
            </div>
          </div>
        )}

        {/* Main Content with Date and Event Info */}
        <div className="border-3 border-black p-2 rounded w-full">
          <div className="flex gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 w-full">
            {/* Date Box */}
            <div className="
              flex-shrink-0 
              border border-[#211F20] 
              rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] xl:rounded-[16px]
              p-3 
              text-center 
              w-16
              h-fit
              flex flex-col items-center
            ">
              <div className="
                font-medium
                text-[#211F20]
                font-bricolage
                leading-[130%]
                uppercase
                text-[12px] sm:text-[12px] xl:text-[14px] 2xl:text-[16px]
              ">
                {dayOfWeek}
              </div>
              <div className="
                font-medium
                text-[#211F20]
                font-bricolage
                leading-normal
                text-[28px] sm:text-[30px] xl:text-[36px] 2xl:text-[40px]
              ">
                {day}
              </div>
              <div className="text-xs font-semibold text-gray-600">
                {month}
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-2 md:gap-[10px] lg:gap-3">
              {/* Location */}
              <div className="flex items-center gap-2">
                <LocationIcon className="w-4 h-4 text-gray-600" />
                <span className="
                  font-medium
                  text-[#211F20]
                  font-bricolage
                  leading-[130%]
                  uppercase
                  text-[12px] sm:text-[12px] lg:text-[14px] 2xl:text-[16px]
                ">
                  {event.location}
                </span>
              </div>
              
              {/* Time */}
              <div className="flex items-center gap-2">
                <TimerIcon className="w-4 h-4 text-gray-600" />
                <span className="
                  font-medium
                  text-[#211F20]
                  font-bricolage
                  leading-[130%]
                  uppercase
                  text-[12px] sm:text-[12px] lg:text-[14px] 2xl:text-[16px]
                ">
                  {event.eventType || ''}{event.eventType && timeLabel ? ' @ ' : ''}{timeLabel || ''}
                </span>
              </div>
              
              {/* Open Spots Group */}
              <div className="flex flex-col gap-0">
                <div className="text-sm text-gray-600">
                  Open Spots for Men: {(() => {
                    const total = Number(event.menSpots) || 0;
                    const signedUp = Number(event.menSignupCount) || 0;
                    return `${Math.max(total - signedUp, 0)}/${total}`;
                  })()}
                </div>
                <div className="text-sm text-gray-600">
                  Open Spots for Women: {(() => {
                    const total = Number(event.womenSpots) || 0;
                    const signedUp = Number(event.womenSignupCount) || 0;
                    return `${Math.max(total - signedUp, 0)}/${total}`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          disabled={joining}
          onClick={async () => {
            if (!event?.eventID) {
              alert('Missing event ID');
              return;
            }
            try {
              setJoining(true);
              if (onSignUp) {
                console.log('[JOIN NOW] Calling onSignUp for event:', event);
                await onSignUp(event);
                console.log('[JOIN NOW] onSignUp finished');
              }
              const functions = getFunctions();
              console.log('About to call getEventData');
              const getEventData = httpsCallable(functions, 'getEventData'); // returns full event
              const res = await getEventData({ eventId: event.eventID });
              console.log('getEventData response:', res);
              const { event: remoEvent } = res.data || {};
              if (!remoEvent) {
                alert('Event data not available yet.');
                return;
              }
              // Record the latest event this user joined
              if (auth.currentUser) {
                await setDoc(
                  doc(db, 'users', auth.currentUser.uid),
                  {
                    latestEventId: event.eventID,
                  },
                  { merge: true }
                );
              }
              // Do NOT redirect to Remo site anymore
              // const joinUrl = `https://live.remo.co/e/${remoEvent.code}`;
              // window.open(joinUrl, '_blank');
            } catch (err) {
              console.error('Error fetching join URL:', err);
              alert('Unable to fetch join link. Please try again later.');
            } finally {
              setJoining(false);
            }
          }}
          className={`
            bg-[#211F20] 
            text-white 
            font-medium 
            hover:bg-gray-800 
            transition-colors 
            text-left
            rounded-lg
            py-2 sm:py-2 xl:py-2 2xl:py-2
            px-6 sm:px-5 xl:px-5 2xl:px-5
            font-poppins
            leading-normal
            text-[12px] sm:text-[12px] lg:text-[14px] 2xl:text-[16px]
            ${joining ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          {joining ? 'Loading…' : (type === "signup" ? "Sign Up" : "Join Now")}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Successfully Signed Up!
              </h3>
              <p className="text-gray-600 mb-4">
                You've been successfully signed up for this event. Please check your email for the virtual event invitation.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">✗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sign Up Failed
              </h3>
              <p className="text-gray-600 mb-4">
                {errorMessage}
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
