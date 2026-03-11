// ─── Family Members ───────────────────────────────────────────────────────────
export const familyMembers = [
  {
    id: 1, name: 'Leo', role: 'Child', age: 12,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJLjl6Ef7bK-u_B2NcS7dt7erjVSdao2IuOgK27fYvgiRYQ1c6TSjOn2sdLMrDArlKAERFzjINx7uZP06Noe9OuWk9booq3wx_Ryr2CnXiJmlGeFfkTTvbnQ2nyIl1AS87YfbZI6bo_EWwXAAb_y-FPf38D3Wjt2L_CCENy3dwziFH1GbRkcUEW70bREGv3h0R9w_7URV-lb-elowFiRVjBwBTZCHCe2qrwSOOSwX374fPBHyuCHdlgpBTKVSwwDgPaoq16c8oURM',
    points: 450, allowance: 25, wallet: 450,
  },
  {
    id: 2, name: 'Dad', fullName: 'David Thompson', role: 'Parent',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCHzAmckYooADZpKaH2UZzfS-q1we1IVKibAswbz2GMCsNkWOCwbFb85p5lZftGD2LGCIl29-GJpZt44noQOh9vBAbfzmv4zUaKL_HcppnWgZk8Vk5x6R0AM7re32czMSN1pcMhC-Enm6b2KfeRNpIzPC98jtFW-KnnNfRo8suf35W582jxWC6ZRSCZ3COV4I3qeCYkkJHneMKMpdmS-Qfz1hi3s9qqmX89lqrFrCO05b22THacaBuBsJnB7ydFmMKrclCY37_nZM',
    wallet: 8400,
  },
  {
    id: 3, name: 'Mom', fullName: 'Sarah Thompson', role: 'Parent',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBhu7iQP2P4p7ec1T3_FHqy2ZLpWBOssiNxlREpjvjkJV-_y-JDuUm7UQ0NQvkgNh8tQbXIPIoTWMZ9cQqLWRqGdngCgcfLhjmgNM-MtB5jjUAnFRT7jJoPQrPyQhj3Z3uKmajgQGLynYgXfNnHWWsBaT4L7CQKbXn5clnMouEGAo5FLjciiKmmImz7OX8UvSFEsdIxAxLDFQRXhDV8S5ZmilkXDfeTW_vSogo5OqNLr8DoRa38LxA4VBuPSROQp84XpTHFm70KM',
    wallet: 12200,
  },
  {
    id: 4, name: 'Sarah', fullName: 'Sarah Thompson Jr.', role: 'Child', age: 9,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1h1WK3gY4N6biYRHC-pOhef4d_ZeFFOLS6ZzmjSlMCSGDVSleiHSHvGtQjHqk63VRbTAhP3JVKs-M0521O1GrpN20vLEW2Svhz6ehvlcfBSz_TtU0vYu0PzfxVyG9Pw9TjK6AfzVulenKO5QY3j8cuKaebNE2yK5wxzW6ijIzD_cFU9SFbg3-PZ5zNaaIU0AYvubIAFPUG1-oWbwmvggDtM6kBNtD2Ul_sla0TMvZRy7sfOeSu8NtbParRs0lQzGk1IYuwF9Pkz0',
    wallet: 530,
  },
];

// ─── Chores / Tasks ───────────────────────────────────────────────────────────
export const tasks = [
  { id: 1, title: 'Clean your room', points: 50, due: 'Today', done: false, category: 'cleaning', requiresPhoto: true },
  { id: 2, title: 'Take out the trash', points: 30, due: 'Today', done: false, category: 'outdoor', requiresPhoto: false },
  { id: 3, title: 'Do the dishes', points: 40, due: 'Today', done: true, category: 'kitchen', requiresPhoto: false },
  { id: 4, title: 'Walk Luna', points: 35, due: 'Today', done: false, category: 'pets', requiresPhoto: false },
  { id: 5, title: 'Homework', points: 60, due: 'Today', done: false, category: 'school', requiresPhoto: true },
];

export const rewards = [
  { id: 1, title: 'Extra Screen Time', subtitle: '1 hour bonus', points: 100, icon: 'smartphone' },
  { id: 2, title: 'Movie Night Pick', subtitle: 'Choose the movie', points: 150, icon: 'movie' },
  { id: 3, title: 'Pizza Night', subtitle: 'Family pizza night', points: 200, icon: 'local_pizza' },
  { id: 4, title: 'Skip a Chore', subtitle: 'One chore pass', points: 250, icon: 'check_circle' },
];

// ─── Finance ──────────────────────────────────────────────────────────────────
export const finances = {
  totalSavings: 24580,
  recentActivity: [
    { id: 1, label: 'Leo – Weekly Allowance', amount: +25, date: 'Today', icon: 'payments' },
    { id: 2, label: 'Sarah – Movie Tickets', amount: -32, date: 'Yesterday', icon: 'movie' },
    { id: 3, label: 'Dad – Grocery Run', amount: -147.50, date: 'Mon', icon: 'shopping_cart' },
    { id: 4, label: 'Mom – Freelance Income', amount: +850, date: 'Sun', icon: 'work' },
  ],
  loans: [
    { id: 1, name: 'Mountain Bike', borrower: 'Leo', amount: 200, paid: 80, due: 'Oct 15', interest: 0 },
  ],
};

// ─── Stocks ───────────────────────────────────────────────────────────────────
export const portfolio = {
  value: 3420.50,
  change: +2.4,
  stocks: [
    { id: 1, name: 'Ice Cream Inc', ticker: 'ICEI', shares: 5, price: 24.50, change: +1.2, color: '#f472b6' },
    { id: 2, name: 'Toy Co', ticker: 'TOYC', shares: 10, price: 15.20, change: -0.8, color: '#60a5fa' },
    { id: 3, name: 'Pet Treats Ltd', ticker: 'PTLT', shares: 8, price: 31.80, change: +3.1, color: '#34d399' },
  ],
};

// ─── Sports ───────────────────────────────────────────────────────────────────
export const sports = {
  teams: [
    { id: 1, name: "Leo's Soccer", team: 'Tigers FC', member: 'Leo', active: true },
    { id: 2, name: "Sarah's Ballet", team: 'Lakewood Ballet', member: 'Sarah', active: false },
  ],
  schedule: [
    { id: 1, date: 'Sat, Oct 14', time: '10:00 AM', opponent: 'Blue Eagles FC', location: 'Riverside Park', isHome: true },
    { id: 2, date: 'Tue, Oct 17', time: '6:00 PM', type: 'Practice', location: 'School Field' },
    { id: 3, date: 'Sat, Oct 21', time: '2:00 PM', opponent: 'City Stars', location: 'City Stadium', isHome: false },
  ],
  equipment: [
    { id: 1, item: 'Shin guards', packed: true },
    { id: 2, item: 'Water bottle', packed: true },
    { id: 3, item: 'Cleats', packed: false },
    { id: 4, item: 'Team jersey #9', packed: true },
  ],
  contacts: [
    { id: 1, name: 'Coach Mike', role: 'Head Coach', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYECR27IDzxddN4wML17spxEAmw-tVkH2-fazaQOESnmvA_zwFmGlwEDuQPbXbYfWNdim1VNde2R0d2gym6hsJvmxbE2GZ4OX-P_XzzCtcEKldAMpR198NGpgTT_yoON1OxL_-LTX_6At8b9KbiyDGeOvq-LcU3-7vFMJRiW4q2M5nydofzPPEcZf7FekekbynV27iqBw1KpGi5jeQf0yMNZlIt4TTPl8XHcF2UjiqI4OptZJgcpxJEL9WwsIPiyBSzFUXKP1pOnI' },
    { id: 2, name: 'Jordan', role: 'Team Captain', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLLWcTmIbuwgDOyk4_y5L7k3VWam2UpwQbZ5r5XqlBdDXNI7LBEn9xergosfxdydxJ46FE3gpr0MKkWnDjEmNYLEaACki4qm2G1jWrazix_YDkp9wxARRWbmp9g70eOeTCbr9TPfwR6Gkv6KSCVgQ4AfvcSWbypPbEFb3I8_JXvU3U-r_ntjjBuwDTg1w1d6W4tvuHxu9xpBRsKvfDwoIs-yl2Om-E0vSYH8YYn2USpRcGnjbvsORy15SnBdwA_HVxb3MdKeiVfNI' },
  ],
  chatMessages: [
    { id: 1, sender: 'Coach Mike', text: 'Great practice everyone! Remember, game on Saturday at 10 AM. Be there 30 mins early!', time: '2:45 PM', isMe: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYECR27IDzxddN4wML17spxEAmw-tVkH2-fazaQOESnmvA_zwFmGlwEDuQPbXbYfWNdim1VNde2R0d2gym6hsJvmxbE2GZ4OX-P_XzzCtcEKldAMpR198NGpgTT_yoON1OxL_-LTX_6At8b9KbiyDGeOvq-LcU3-7vFMJRiW4q2M5nydofzPPEcZf7FekekbynV27iqBw1KpGi5jeQf0yMNZlIt4TTPl8XHcF2UjiqI4OptZJgcpxJEL9WwsIPiyBSzFUXKP1pOnI' },
    { id: 2, sender: 'Jordan', text: 'Can\'t wait! I\'ve been practicing my free kicks all week 🔥', time: '3:01 PM', isMe: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLLWcTmIbuwgDOyk4_y5L7k3VWam2UpwQbZ5r5XqlBdDXNI7LBEn9xergosfxdydxJ46FE3gpr0MKkWnDjEmNYLEaACki4qm2G1jWrazix_YDkp9wxARRWbmp9g70eOeTCbr9TPfwR6Gkv6KSCVgQ4AfvcSWbypPbEFb3I8_JXvU3U-r_ntjjBuwDTg1w1d6W4tvuHxu9xpBRsKvfDwoIs-yl2Om-E0vSYH8YYn2USpRcGnjbvsORy15SnBdwA_HVxb3MdKeiVfNI' },
    { id: 3, sender: 'Leo', text: 'Ready! 💪 See you all Saturday!', time: '3:05 PM', isMe: true },
  ],
};

// ─── Pets ─────────────────────────────────────────────────────────────────────
export const pets = {
  name: 'Luna', breed: 'Golden Retriever', age: 3, weight: '28 kg',
  status: 'Healthy', activity: 'High',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8gwWwrIh9CMMcO5YonRelRVBmi8KZ3jQe6rYiJK6W5rmYjdp04bi-_i4KkKyUhTCg6FW787KljgHKNnSYrMEBCR-qOqnY3004kYsci-K3hxxVe9_5LF3Up_rX1kIP0Nuh0nHkuNa0YVTrFzr6jby-7qs9Fz7nUPJHCFR08SQ9XcdXZcWQ_WDgai_05YHhRctJ_lbXFqT8XfPzZzdzxPG8gfquSFB3fkKEBuoGXH9HtJTVIiETQj71OkrKOI5-VKXJ-qHwfVaET_E',
  feeding: [
    { time: 'Morning', done: true, amount: '1.5 cups' },
    { time: 'Evening', done: false, amount: '1.5 cups' },
  ],
  walks: [
    { label: 'Morning Walk', distance: '1.2 km', done: true },
    { label: 'Afternoon Play', distance: '2.4 km', done: true },
  ],
  vetAppointment: { date: 'Oct 12', day: '12', month: 'OCT', title: 'Annual Check-up', clinic: 'Happy Paws Clinic', time: '10:30 AM' },
};

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthData = {
  member: { name: 'Leo Thompson', age: 12, bloodType: 'A+', allergies: 'None', vaccinationStatus: 'Up to Date' },
  medications: [
    { id: 1, name: 'Amoxicillin', dose: '250mg', frequency: 'Twice daily', daysLeft: 5, taken: true, icon: 'medication' },
    { id: 2, name: "Children's Tylenol", dose: '160mg', frequency: 'As needed', daysLeft: null, taken: false, icon: 'medication_liquid' },
  ],
  history: [
    { id: 1, title: 'Fever (38.8°C)', date: 'Mar 2', type: 'Illness', color: 'red', desc: 'Lasted 2 days. Given Tylenol, plenty of fluids. Fully recovered.', icon: 'thermometer' },
    { id: 2, title: 'Minor Knee Scrape', date: 'Feb 18', type: 'Injury', color: 'orange', desc: 'Scraped knee at soccer practice. Cleaned and bandaged. No further treatment needed.', icon: 'bandage' },
    { id: 3, title: 'Pediatrician Visit', date: 'Jan 15', type: 'Checkup', color: 'primary', desc: 'Annual checkup. All vitals normal. Height 152cm, Weight 44kg. Flu shot administered.', icon: 'stethoscope' },
  ],
};

// ─── Constitution ─────────────────────────────────────────────────────────────
export const constitution = {
  mission: 'The Thompson Family is committed to creating a loving, supportive environment where every member feels valued, heard, and empowered to grow.',
  values: [
    { id: 1, name: 'Kindness', icon: 'favorite', color: 'rose' },
    { id: 2, name: 'Honesty', icon: 'verified_user', color: 'blue' },
    { id: 3, name: 'Curiosity', icon: 'lightbulb', color: 'amber' },
  ],
  rules: [
    'Respect each other\'s time and space at all times.',
    'Phones are put away during family dinners.',
    'Everyone helps with at least one household chore daily.',
    'We celebrate each other\'s wins, big and small.',
  ],
  signatories: [1, 2, 3, 4],
};

// ─── Timeline ────────────────────────────────────────────────────────────────
export const timeline = [
  {
    month: 'October 2024',
    events: [
      { id: 1, type: 'achievement', title: "Leo's A+ in Math!", date: 'Oct 5', desc: 'Leo scored 98/100 on his algebra midterm. We are so proud!', icon: 'school', color: 'amber' },
    ],
  },
  {
    month: 'September 2024',
    events: [
      { id: 2, type: 'memory', title: 'Beach Day 🏖️', date: 'Sep 22', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9D8qWSMP2mIO0LjqIwemJZuEDpIsup8-qsV_6PzbkpLmIjJg8zzJm3o9QurBvGax24yvYLyEaSYz7xGG7wT-P4VWK8FCFITkDumbNpMnxxqS3K7upNh5X1dTLw7qG2r1PapGmlh_MzzipsLgu1FoQZHzq1TQtGIWpXTqGfRToDe9gOlRJNF32DQ_tQuxffuAInwHkSlpVYZEH009ry7rtrDKtoi2UjSAkv3QT0UROsDSAQrkZtG2f6l0Hch168vVRLO60mJ6Pj2g', likes: 12, comments: 4 },
      { id: 3, type: 'journal', title: 'Monthly Reflection', date: 'Sep 1', text: 'This month we focused on spending more quality time together as a family...', author: 'Mom' },
    ],
  },
  {
    month: 'August 2024',
    events: [
      { id: 4, type: 'milestone', title: 'Family Hub Created', date: 'Aug 12', desc: 'The Thompson family joined Family Hub Connect.', icon: 'home_heart' },
    ],
  },
];

// ─── Pending Invites ─────────────────────────────────────────────────────────
export const pendingInvites = [
  { id: 1, email: 'uncle.bob@email.com', role: 'Adult', sent: '2 days ago' },
  { id: 2, email: 'grandma@email.com', role: 'Adult', sent: '5 days ago' },
];

// ─── Appeal ──────────────────────────────────────────────────────────────────
export const appeal = {
  caseId: 'CASE-12345',
  consequence: '1-day screen time ban',
  reason: 'Missing curfew by 15 mins',
  childArgument: 'I was late because the school bus broke down and I had no way to call. I stayed at a friend\'s house and their parent drove me home as soon as they could.',
  proposedAlternative: 'Vacuuming the living room instead',
  status: 'Pending Review',
};

// ─── Governance ───────────────────────────────────────────────────────────────
export const governance = {
  juryPool: [
    { id: 3, name: 'Mom (Sarah)', period: 'Next Mediator (April 15-30)', active: true },
    { id: 2, name: 'Dad (Michael)', period: 'Standby Mediator', active: false },
  ],
  archive: [
    { id: 1, date: 'April 02, 2024', title: 'The "Dirty Dishes" Dispute', resolution: 'Agreed resolution: Leo will handle kitchen duty for 3 extra days; the group chat remains for reminders only.', highlight: true },
    { id: 2, date: 'March 18, 2024', title: 'Screen Time Extension', resolution: 'Resolution: Homework must be verified before 7 PM to unlock bonus hour.', highlight: false },
  ],
};

// ─── Family Court ─────────────────────────────────────────────────────────────
export const familyCourt = {
  stats: { activeMeasures: 3, weeklyResolution: 85, resolutionTrend: 12 },
  consequences: [
    { id: 1, title: '1-day screen time ban', violation: 'Missed curfew', icon: 'smartphone', iconBg: 'bg-[#4c8ce6]/10', iconColor: 'text-[#4c8ce6]', status: 'in_progress', timeRemaining: '4h 20m', progress: 75 },
    { id: 2, title: 'Extra Chore: Kitchen', violation: 'Unfinished chores', icon: 'cleaning_services', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', status: 'pending_review' },
    { id: 3, title: 'No Gaming: Weekend', violation: 'Late homework', icon: 'videogame_asset_off', iconBg: 'bg-slate-100', iconColor: 'text-slate-500', status: 'completed', resolvedAgo: '2h ago' },
  ],
  history: [
    { id: 1, title: 'Earlier Bedtime (8PM)', detail: 'Completed Jan 12 • Leo', status: 'completed', ago: '3 days ago' },
    { id: 2, title: 'No Dessert', detail: 'Waived by Mom • Maya', status: 'waived', ago: '5 days ago' },
  ],
};

// ─── Creator Studio ──────────────────────────────────────────────────────────
export const creatorStudio = {
  stats: { posts: 12, views: 847, likes: 203 },
  creations: [
    { id: 1, type: 'Photo Story', title: 'Soccer Tournament Highlights', date: 'Oct 8', likes: 24, icon: 'photo_camera', color: 'pink' },
    { id: 2, type: 'Family Poll', title: 'Where should we go for vacation?', date: 'Oct 3', responses: 4, icon: 'poll', color: 'violet' },
    { id: 3, type: 'Voice Memo', title: 'Grandma\'s Birthday Message', date: 'Sep 28', duration: '0:42', icon: 'mic', color: 'emerald' },
  ],
};
