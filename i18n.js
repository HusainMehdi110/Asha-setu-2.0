export const strings = {
  en: {
    appName: 'Setu',
    tagline: 'Every visit stays with the patient',
    fieldView: 'Field visit',
    dashboardView: 'Facility dashboard',
    online: 'Online — synced',
    offline: 'Offline — saving on this device',
    syncing: 'Syncing…',
    pendingSync: (n) => `${n} record${n === 1 ? '' : 's'} waiting to sync`,
    newPatient: 'New patient',
    existingPatient: 'Existing patient',
    healthId: 'Health ID',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    village: 'Village',
    phone: 'Mobile number',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    vitals: 'Vitals',
    bp: 'Blood pressure',
    pulse: 'Pulse',
    temp: 'Temperature',
    weight: 'Weight (kg)',
    symptoms: 'Symptoms / complaint',
    notes: 'Notes',
    saveVisit: 'Save visit',
    referralNeeded: 'This patient needs a referral',
    referTo: 'Refer to',
    referralReason: 'Reason for referral',
    urgency: 'Urgency',
    routine: 'Routine',
    urgent: 'Urgent',
    emergency: 'Emergency',
    savedOffline: 'Saved on this device. Will sync when back online.',
    savedOnline: 'Saved and synced.',
    recentVisits: 'Recent visits recorded here',
    referralsByStatus: 'Referrals by status',
    created: 'Created',
    inTransit: 'In transit',
    received: 'Received',
    seenByDoctor: 'Seen by doctor',
    closed: 'Closed',
    needsReview: 'Needs review',
    markNext: 'Move to next stage',
    noReferrals: 'No referrals yet in this facility.',
    patientId: 'Patient ID',
    facilityDashboardHint: 'This view shows only records that have synced from the field.',
    resetDemo: 'Reset demo data',
    goOffline: 'Simulate offline',
    goOnline: 'Simulate online',
    required: 'Required',
    checkupNote: "Doctor's checkup note",
    addCheckupNote: '+ Add checkup note',
    editCheckupNote: 'Edit note',
    saveCheckupNote: 'Save note',
    cancelNote: 'Cancel',
    checkupNotePlaceholder: 'Diagnosis, treatment given, advice for follow-up…',
    notedOn: 'Noted'
    ,appointments: 'Appointments'
    ,doctorPortal: 'Doctor portal'
    ,appointmentTitle: 'Book a doctor appointment'
    ,appointmentHint: 'Schedule a confirmed referral or follow-up. The patient’s reminder is queued automatically.'
    ,selectPatient: 'Select patient'
    ,selectPatientEmpty: 'No synced patients yet — record and sync a field visit first.'
    ,appointmentDate: 'Appointment date'
    ,appointmentTime: 'Time slot'
    ,doctorName: 'Doctor'
    ,department: 'Department'
    ,bookAppointment: 'Book appointment & queue reminder'
    ,appointmentBooked: 'Appointment booked. Reminder message queued for the patient.'
    ,upcomingAppointments: 'Upcoming appointments'
    ,reminderCentre: 'Reminder messages'
    ,reminderHint: 'Prototype view: messages are queued for SMS/WhatsApp delivery 24 hours before the appointment.'
    ,reminderQueued: 'Queued for 24 hours before appointment'
    ,reminderSent: 'Reminder sent'
    ,sendNow: 'Mark sent now'
    ,doctorLogin: 'Doctor sign in'
    ,doctorLoginHint: 'Use your public-health facility ID to open the clinical view.'
    ,doctorId: 'Doctor ID number'
    ,doctorIdPlaceholder: 'e.g. MH-DOC-1042'
    ,continueToPortal: 'Continue to clinical portal'
    ,signOut: 'Sign out'
    ,patientSearch: 'Search patient'
    ,patientSearchHint: 'Enter a patient mobile number to find their record.'
    ,patientHistory: 'Longitudinal patient history'
    ,noPatientsFound: 'No patient matches that search.'
    ,selectPatientHistory: 'Choose a patient to view visits, referrals, and appointments.'
    ,visitHistory: 'Field visit history'
    ,referralHistory: 'Referral history'
    ,appointmentHistory: 'Appointment history'
    ,noHistory: 'No records available yet.'
    ,backToSearch: 'Back to results'
    ,recordedOn: 'Recorded'
    ,patientProfile: 'Patient profile'
    ,emergencyTeleconsult: 'Emergency city-doctor video consult'
    ,emergencyTeleconsultHint: 'If the village team is unsure, connect the patient to the on-call city doctor for immediate guidance.'
    ,startVideoConsult: 'Start video consult'
    ,patientAtVillage: 'Patient side · Village'
    ,connectingCityDoctor: 'Connecting city doctor…'
    ,cityDoctorConnected: 'Dr. Anjali Patil · City Hospital'
    ,connectDoctor: 'Connect doctor (demo)'
    ,callLive: 'Consultation live'
    ,closeConsult: 'Close consult'
    ,validPhone: 'Enter a valid 10-digit mobile number.'
    ,phoneAlreadyRegistered: 'A patient record already exists with this mobile number. Select Existing patient.'
    ,phoneNotFound: 'No patient found with this mobile number on this device.'
    ,emergencySupport: 'Emergency support'
    ,getHelpFast: 'Get help in one tap'
    ,offlineVoiceCall: 'Call on-call doctor'
    ,offlineVoiceCallSub: 'GSM voice call · works without internet'
    ,callAmbulance: 'Call ambulance'
    ,ambulanceNumber: 'Emergency helpline · 108'
    ,nearbySupport: 'Nearby support'
    ,bloodBankAndPharmacy: 'Blood bank & pharmacy'
    ,directoryOffline: 'Offline directory saved'
    ,directoryOnline: 'Directory synced'
    ,callingOnCallDoctor: 'Calling district on-call doctor…'
    ,callUsesGsm: 'Voice call uses the phone network, not mobile data. It needs cellular signal.'
    ,endCall: 'End call'
    ,directoryNotice: 'Saved local directory — confirm availability by calling the facility before sending the patient.'
  },
  mr: {
    appName: 'सेतू',
    tagline: 'प्रत्येक भेट रुग्णासोबत राहते',
    fieldView: 'क्षेत्र भेट',
    dashboardView: 'सुविधा डॅशबोर्ड',
    online: 'ऑनलाइन — सिंक झाले',
    offline: 'ऑफलाइन — या डिव्हाइसवर जतन होत आहे',
    syncing: 'सिंक होत आहे…',
    pendingSync: (n) => `${n} नोंदी सिंक होण्याच्या प्रतीक्षेत`,
    newPatient: 'नवीन रुग्ण',
    existingPatient: 'आधीचा रुग्ण',
    healthId: 'आरोग्य आयडी',
    name: 'नाव',
    age: 'वय',
    gender: 'लिंग',
    village: 'गाव',
    phone: 'मोबाइल क्रमांक',
    male: 'पुरुष',
    female: 'स्त्री',
    other: 'इतर',
    vitals: 'जीवनावश्यक नोंदी',
    bp: 'रक्तदाब',
    pulse: 'नाडी',
    temp: 'तापमान',
    weight: 'वजन (किलो)',
    symptoms: 'लक्षणे / तक्रार',
    notes: 'टीप',
    saveVisit: 'भेट जतन करा',
    referralNeeded: 'या रुग्णाला संदर्भाची गरज आहे',
    referTo: 'कोणाकडे संदर्भित करावे',
    referralReason: 'संदर्भाचे कारण',
    urgency: 'तातडी',
    routine: 'नियमित',
    urgent: 'तातडीचे',
    emergency: 'आणीबाणी',
    savedOffline: 'या डिव्हाइसवर जतन झाले. नेटवर्क आल्यावर सिंक होईल.',
    savedOnline: 'जतन आणि सिंक झाले.',
    recentVisits: 'येथे नोंदवलेल्या अलीकडील भेटी',
    referralsByStatus: 'स्थितीनुसार संदर्भ',
    created: 'तयार केले',
    inTransit: 'मार्गावर',
    received: 'प्राप्त झाले',
    seenByDoctor: 'डॉक्टरांनी तपासले',
    closed: 'पूर्ण झाले',
    needsReview: 'तपासणी आवश्यक',
    markNext: 'पुढील टप्प्यावर न्या',
    noReferrals: 'या सुविधेत अद्याप संदर्भ नाहीत.',
    patientId: 'रुग्ण आयडी',
    facilityDashboardHint: 'ही दृश्य केवळ क्षेत्रातून सिंक झालेल्या नोंदी दाखवते.',
    resetDemo: 'डेमो डेटा रीसेट करा',
    goOffline: 'ऑफलाइन सिम्युलेट करा',
    goOnline: 'ऑनलाइन सिम्युलेट करा',
    required: 'आवश्यक',
    checkupNote: 'डॉक्टरांची तपासणी टीप',
    addCheckupNote: '+ तपासणी टीप जोडा',
    editCheckupNote: 'टीप संपादित करा',
    saveCheckupNote: 'टीप जतन करा',
    cancelNote: 'रद्द करा',
    checkupNotePlaceholder: 'निदान, दिलेला उपचार, पुढील सल्ला…',
    notedOn: 'नोंदवले'
    ,emergencyTeleconsult: 'आपत्कालीन शहर-डॉक्टर व्हिडिओ सल्ला'
    ,emergencyTeleconsultHint: 'गावातील पथकाला खात्री नसल्यास त्वरित मार्गदर्शनासाठी ऑन-कॉल शहरातील डॉक्टरांशी जोडा.'
    ,startVideoConsult: 'व्हिडिओ सल्ला सुरू करा'
    ,patientAtVillage: 'रुग्ण बाजू · गाव'
    ,connectingCityDoctor: 'शहरातील डॉक्टरांशी जोडत आहे…'
    ,cityDoctorConnected: 'डॉ. अंजली पाटील · शहर रुग्णालय'
    ,connectDoctor: 'डॉक्टर जोडा (डेमो)'
    ,callLive: 'सल्ला सुरू आहे'
    ,closeConsult: 'सल्ला बंद करा'
    ,validPhone: 'वैध 10 अंकी मोबाइल क्रमांक टाका.'
    ,phoneAlreadyRegistered: 'या मोबाइल क्रमांकावर रुग्ण नोंद आधीच आहे. आधीचा रुग्ण निवडा.'
    ,phoneNotFound: 'या मोबाइल क्रमांकासाठी या डिव्हाइसवर रुग्ण सापडला नाही.'
    ,emergencySupport: 'आपत्कालीन मदत'
    ,getHelpFast: 'एका टॅपवर मदत मिळवा'
    ,offlineVoiceCall: 'ऑन-कॉल डॉक्टरांना कॉल करा'
    ,offlineVoiceCallSub: 'GSM व्हॉइस कॉल · इंटरनेटशिवाय काम करते'
    ,callAmbulance: 'रुग्णवाहिका कॉल करा'
    ,ambulanceNumber: 'आपत्कालीन हेल्पलाइन · 108'
    ,nearbySupport: 'जवळची मदत'
    ,bloodBankAndPharmacy: 'रक्तपेढी आणि औषधालय'
    ,directoryOffline: 'ऑफलाइन निर्देशिका जतन केली'
    ,directoryOnline: 'निर्देशिका सिंक झाली'
    ,callingOnCallDoctor: 'जिल्हा ऑन-कॉल डॉक्टरांना कॉल करत आहे…'
    ,callUsesGsm: 'व्हॉइस कॉल मोबाइल डेटा नव्हे, फोन नेटवर्क वापरतो. मोबाईल सिग्नल आवश्यक आहे.'
    ,endCall: 'कॉल बंद करा'
    ,directoryNotice: 'जतन केलेली स्थानिक निर्देशिका — रुग्ण पाठवण्यापूर्वी कॉल करून उपलब्धतेची खात्री करा.'
  }
};

export const STATUS_ORDER = ['created', 'inTransit', 'received', 'seenByDoctor', 'closed'];
