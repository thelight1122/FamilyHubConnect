// ─── Mock Data Scaffold ───────────────────────────────────────────────────────
// All arrays are empty pending real API integration.
// Each export maps to a future API endpoint noted in the comment.

// TODO: GET /api/family/members
export const familyMembers = [
  {
    id: 'user-1',
    name: 'Dad',
    role: 'adult',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCHzAmckYooADZpKaH2UZzfS-q1we1IVKibAswbz2GMCsNkWOCwbFb85p5lZftGD2LGCIl29-GJpZt44noQOh9vBAbfzmv4zUaKL_HcppnWgZk8Vk5x6R0AM7re32czMSN1pcMhC-Enm6b2KfeRNpIzPC98jtFW-KnnNfRo8suf35W582jxWC6ZRSCZ3COV4I3qeCYkkJHneMKMpdmS-Qfz1hi3s9qqmX89lqrFrCO05b22THacaBuBsJnB7ydFmMKrclCY37_nZM'
  },
  {
    id: 'user-2',
    name: 'Leo',
    role: 'child',
    allowance: 25.50,
    points: 450,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXCtkM0Kz8TVPiuRxqDjNn33-crPQUMT3MkHVNxNXGTEuym3T1rpaZ12iCWtjA6xOer7eW1SGYP-xp4wmd09AHMyX6F_Zjta6d2wogH7HUdNLYdl3D6l9r9Ho2xr35rvUx4IuhDmtjgIme18QsfsA56SJYelHH_6h5B2xpAf76l8V3uAWCuqrZvikExrstN_Z3W7Ho6zueJpVqkKQet4Muw15unKvs_gE6Cu0eak-IOKitFMBNHw6ezgpvGqNaNBvEFFXQ_drOM49iM'
  },
  {
    id: 'user-3',
    name: 'Emma',
    role: 'child',
    allowance: 15.00,
    points: 820,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXCtkM0Kz8TVPiuRxqDjNn33-crPQUMT3MkHVNxNXGTEuym3T1rpaZ12iCWtjA6xOer7eW1SGYP-xp4wmd09AHMyX6F_Zjta6d2wogH7HUdNLYdl3D6l9r9Ho2xr35rvUx4IuhDmtjgIme18QsfsA56SJYelHH_6h5B2xpAf76l8V3uAWCuqrZvikExrstN_Z3W7Ho6zueJpVqkKQet4Muw15unKvs_gE6Cu0eak-IOKitFMBNHw6ezgpvGqNaNBvEFFXQ_drOM49iM'
  }
];

// TODO: GET /api/chores/tasks
export const tasks = [];

// TODO: GET /api/chores/rewards
export const rewards = [];

// TODO: GET /api/finance/summary
export const finances = {
  totalSavings: 0,
  recentActivity: [],
  loans: [],
};

// TODO: GET /api/finance/portfolio
export const portfolio = {
  value: 0,
  change: 0,
  stocks: [],
};

// TODO: GET /api/sports
export const sports = {
  teams: [],
  schedule: [],
  equipment: [],
  contacts: [],
  chatMessages: [],
};

// TODO: GET /api/pets
export const pets = null;

// TODO: GET /api/health
export const healthData = {
  member: null,
  medications: [],
  history: [],
};

// TODO: GET /api/constitution
export const constitution = {
  mission: '',
  values: [],
  rules: [],
  signatories: [],
};

// TODO: GET /api/timeline
export const timeline = [];

// TODO: GET /api/invites/pending
export const pendingInvites = [];

// TODO: GET /api/appeals/active
export const appeal = null;

// TODO: GET /api/governance
export const governance = {
  juryPool: [],
  archive: [],
};

// TODO: GET /api/court
export const familyCourt = {
  stats: { activeMeasures: 0, weeklyResolution: 0, resolutionTrend: 0 },
  consequences: [],
  history: [],
};

// TODO: GET /api/creator-studio
export const creatorStudio = {
  stats: { posts: 0, views: 0, likes: 0 },
  creations: [],
};
