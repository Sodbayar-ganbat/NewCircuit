const RemoEvent = (
  isAudienceViewDisabled,
  isScreenShareDisabled,
  isRemojiDisabled,
  isQnADisabled,
  isChatSupportDisabled,
  isChatDisabled,
  isWhiteboardDisabled,
  isLobbyActive,
  isGuestExperienceSurveyDisabled,
  isOverflowSeatingDisabled,
  isUserIdDisplayed,
  startTime,
  endTime,
  description,
  isPrivate,
  logoURL,
  name,
  isTextDefault,
  isMediaDefault,
  theaters,
  isDiscoveryOptedOut,
  eventOutcome,
  eventType,
  updatedAt,
  contactChannels
) => {
  return {
    isAudienceViewDisabled: isAudienceViewDisabled !== undefined ? isAudienceViewDisabled : true,
    isScreenShareDisabled: isScreenShareDisabled !== undefined ? isScreenShareDisabled : false,
    isRemojiDisabled: isRemojiDisabled !== undefined ? isRemojiDisabled : false,
    isQnADisabled: isQnADisabled !== undefined ? isQnADisabled : false,
    isChatSupportDisabled: isChatSupportDisabled !== undefined ? isChatSupportDisabled : false,
    isChatDisabled: isChatDisabled !== undefined ? isChatDisabled : false,
    isWhiteboardDisabled: isWhiteboardDisabled !== undefined ? isWhiteboardDisabled : false,
    isLobbyActive: isLobbyActive !== undefined ? isLobbyActive : false,
    isGuestExperienceSurveyDisabled: isGuestExperienceSurveyDisabled !== undefined ? isGuestExperienceSurveyDisabled : true,
    isOverflowSeatingDisabled: isOverflowSeatingDisabled !== undefined ? isOverflowSeatingDisabled : true,
    isUserIdDisplayed: isUserIdDisplayed !== undefined ? isUserIdDisplayed : false,
    startTime: startTime !== undefined ? startTime : "1709602800000",
    endTime: endTime !== undefined ? endTime : "1709619000000",
    description: description !== undefined ? description : "",
    isPrivate: isPrivate !== undefined ? isPrivate : false,
    logoURL: logoURL !== undefined ? logoURL : "https://images.unsplash.com/photo-1571645163064-77faa9676a46?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=490&ixid=MnwxfDB8MXxyYW5kb218MHw5NTM3MjQ0fHx8fHx8fDE3MDk2MDI3ODE&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=780",
    name: name !== undefined ? name : "Event created via API",
    isTextDefault: isTextDefault !== undefined ? isTextDefault : false,
    isMediaDefault: isMediaDefault !== undefined ? isMediaDefault : false,
    theaters: theaters !== undefined ? theaters : [
      {
        capacity: 20,
        theme: "REALISTIC",
        template: "PHOTOREALISTIC-PHOTO-REALISTIC"
      }
    ],
    isDiscoveryOptedOut: isDiscoveryOptedOut !== undefined ? isDiscoveryOptedOut : false,
    eventOutcome: eventOutcome !== undefined ? eventOutcome : "other",
    eventType: eventType !== undefined ? eventType : "other",
    updatedAt: updatedAt !== undefined ? updatedAt : Math.floor(Date.now() / 1000),
    contactChannels: contactChannels !== undefined ? contactChannels : []
  };
};

export default RemoEvent;