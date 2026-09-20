import { Profile, PersonalizationData, WeeklyMealPlan, AllowanceTransaction, Chore, ShoppingListItem, MessageChannel, Message, PhotoAlbum, Photo, MovieNightEvent, MovieSuggestion, Book, Trip, BudgetCategory, BudgetExpense, SavingsGoal, MaintenanceTask, HomeProject, ServiceContact, Skill, Routine, RoutineLog, ShoutOut, ExtracurricularActivity, SmartDevice, SmartScene } from './types';

// Helper to get the start of the week (Monday)
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setHours(0, 0, 0, 0);
    return new Date(d.setDate(diff));
};

const createMockMealPlan = (): WeeklyMealPlan => {
    const plan: WeeklyMealPlan = {};
    const start = getStartOfWeek(new Date());

    const day1 = new Date(start);
    const day1Key = day1.toISOString().split('T')[0];
    plan[day1Key] = {
        breakfast: { id: 'mock1', name: 'Oatmeal with berries' },
        lunch: { id: 'mock2', name: 'Turkey Sandwiches' },
        dinner: { id: 'mock3', name: 'Spaghetti Bolognese' },
    };

    const day2 = new Date(start);
    day2.setDate(day2.getDate() + 1);
    const day2Key = day2.toISOString().split('T')[0];
    plan[day2Key] = {
        breakfast: { id: 'mock4', name: 'Scrambled Eggs' },
        dinner: { id: 'mock5', name: 'Taco Tuesday!' },
    };

    const day4 = new Date(start);
    day4.setDate(day4.getDate() + 3);
    const day4Key = day4.toISOString().split('T')[0];
    plan[day4Key] = {
        dinner: { id: 'mock6', name: 'Pizza Night' },
    };

    return plan;
};

const createMockAllowanceTransactions = (): AllowanceTransaction[] => {
    const now = Date.now();
    return [
        { id: 't1', profileId: 'profile_3', date: now - 86400000 * 8, description: 'Initial balance', amount: 10, category: 'adjustment' },
        { id: 't2', profileId: 'profile_3', date: now - 86400000 * 7, description: 'Weekly Allowance', amount: 5, category: 'allowance' },
        { id: 't3', profileId: 'profile_3', date: now - 86400000 * 5, description: 'Cleaned your room', amount: 2.50, category: 'chore' },
        { id: 't4', profileId: 'profile_3', date: now - 86400000 * 3, description: 'Bought "Extra Screen Time" reward', amount: -7, category: 'reward' },
        { id: 't5', profileId: 'profile_3', date: now - 86400000 * 1, description: 'Weekly Allowance', amount: 5, category: 'allowance' },
        { id: 't6', profileId: 'profile_1', date: now - 86400000 * 2, description: 'Gas money', amount: -40, category: 'adjustment' },
    ];
};

const createMockChores = (): Chore[] => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return [
        {
            id: 'chore_1', title: 'Feed the dog', assignedTo: 'profile_3',
            reward: 1.00, dueDate: formatDate(today), status: 'to-do',
            recurrence: 'daily', createdAt: Date.now() - 86400000 * 2
        },
        {
            id: 'chore_2', title: 'Take out the trash', assignedTo: 'profile_3',
            reward: 1.50, dueDate: formatDate(today), status: 'pending-approval',
            recurrence: 'weekly', createdAt: Date.now() - 86400000, completedAt: Date.now() - 3600000
        },
        {
            id: 'chore_3', title: 'Clean your room', assignedTo: 'profile_3',
            reward: 5.00, dueDate: formatDate(yesterday), status: 'done',
            recurrence: 'none', createdAt: Date.now() - 86400000 * 3, completedAt: Date.now() - 86400000 * 2, approvedAt: Date.now() - 86400000
        },
        {
            id: 'chore_4', title: 'Set the dinner table', assignedTo: 'profile_3',
            reward: 0.50, dueDate: formatDate(tomorrow), status: 'to-do',
            recurrence: 'none', createdAt: Date.now()
        }
    ];
};

const createMockShoppingList = (): ShoppingListItem[] => {
    return [
        { id: 'sli_1', name: 'Milk (2 Gallons)', category: 'Dairy', isComplete: false },
        { id: 'sli_2', name: 'Cheddar Cheese', category: 'Dairy', isComplete: true },
        { id: 'sli_3', name: 'Apples', category: 'Produce', isComplete: false },
        { id: 'sli_4', name: 'Bananas', category: 'Produce', isComplete: false },
        { id: 'sli_5', name: 'Ground Beef (2 lbs)', category: 'Meat', isComplete: false },
        { id: 'sli_6', name: 'Whole Wheat Bread', category: 'Bakery', isComplete: false },
        { id: 'sli_7', name: 'Paper Towels', category: 'Household', isComplete: true },
        { id: 'sli_8', name: 'Dish Soap', category: 'Household', isComplete: false },
        { id: 'sli_9', name: 'Cereal', category: 'Pantry', isComplete: false },
    ];
};

const createMockMessageChannels = (): MessageChannel[] => {
    return [
        { id: 'channel_1', name: 'General Family Chat', description: 'For everyone!', memberIds: ['profile_1', 'profile_2', 'profile_3'] },
        { id: 'channel_2', name: 'Parents Only', description: 'For mom and dad.', memberIds: ['profile_1', 'profile_2'] },
        { id: 'channel_3', name: 'Weekend Plans', description: 'What are we doing this weekend?', memberIds: ['profile_1', 'profile_2', 'profile_3'] },
    ];
};

const createMockMessages = (): Message[] => {
    const now = Date.now();
    return [
        { id: 'msg_1', channelId: 'channel_1', senderId: 'profile_1', content: 'Hey everyone! Don\'t forget we have the family meeting tonight at 7pm.', timestamp: now - 3600000 * 3 },
        { id: 'msg_2', channelId: 'channel_1', senderId: 'profile_3', content: 'Okay mom! Can we have pizza? 🍕', timestamp: now - 3600000 * 2.5 },
        { id: 'msg_3', channelId: 'channel_1', senderId: 'profile_2', content: 'Sure, sounds good to me. I\'ll pick it up on my way home.', timestamp: now - 3600000 * 2 },
        { id: 'msg_4', channelId: 'channel_2', senderId: 'profile_1', content: 'We need to discuss Leo\'s birthday party plans.', timestamp: now - 86400000 },
        { id: 'msg_5', channelId: 'channel_2', senderId: 'profile_2', content: 'Good idea. Let\'s chat after he goes to bed tonight.', timestamp: now - 86400000 + 60000 },
        { id: 'msg_6', channelId: 'channel_3', senderId: 'profile_3', content: 'Can we go to the park this weekend?', timestamp: now - 3600000 },
        { id: 'msg_7', channelId: 'channel_1', senderId: 'profile_1', content: 'See you all soon!', timestamp: now - 60000 },
    ];
};

const createMockPhotoAlbums = (): PhotoAlbum[] => {
    const now = Date.now();
    return [
        { id: 'album_1', name: 'Summer Vacation 2024', description: 'Our trip to the beach!', coverPhotoUrl: 'https://placehold.co/400x300/3498db/ffffff?text=Beach+Fun', createdBy: 'profile_1', createdAt: now - 86400000 * 10 },
        { id: 'album_2', name: 'Leo\'s 10th Birthday', description: 'The big one-zero!', coverPhotoUrl: 'https://placehold.co/400x300/2ecc71/ffffff?text=Happy+B-Day', createdBy: 'profile_2', createdAt: now - 86400000 * 5 },
    ];
};

const createMockPhotos = (): Photo[] => {
    const now = Date.now();
    return [
        // Album 1 Photos
        { id: 'photo_1', albumId: 'album_1', url: 'https://placehold.co/600x400/3498db/ffffff?text=Sandcastles', caption: 'Building a giant sandcastle.', uploaderId: 'profile_1', timestamp: now - 86400000 * 9 },
        { id: 'photo_2', albumId: 'album_1', url: 'https://placehold.co/600x400/3498db/ffffff?text=Swimming', caption: 'Leo learning to surf!', uploaderId: 'profile_2', timestamp: now - 86400000 * 8 },
        { id: 'photo_3', albumId: 'album_1', url: 'https://placehold.co/600x400/3498db/ffffff?text=Sunset', caption: 'Beautiful sunset over the ocean.', uploaderId: 'profile_1', timestamp: now - 86400000 * 7 },
        // Album 2 Photos
        { id: 'photo_4', albumId: 'album_2', url: 'https://placehold.co/600x400/2ecc71/ffffff?text=Cake', caption: 'The amazing cake!', uploaderId: 'profile_1', timestamp: now - 86400000 * 4 },
        { id: 'photo_5', albumId: 'album_2', url: 'https://placehold.co/600x400/2ecc71/ffffff?text=Presents', caption: 'Opening presents.', uploaderId: 'profile_2', timestamp: now - 86400000 * 3 },
    ];
};

const createMockMovieNight = (): { events: MovieNightEvent[], suggestions: MovieSuggestion[] } => {
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + (5 + 7 - nextFriday.getDay()) % 7);
    const eventId = 'movie_event_1';

    const events: MovieNightEvent[] = [
        { id: eventId, date: nextFriday.toISOString().split('T')[0], status: 'voting' }
    ];

    const suggestions: MovieSuggestion[] = [
        {
            id: 'sugg_1', eventId, title: 'The Incredibles',
            description: 'A family of undercover superheroes, while trying to live a quiet suburban life, are forced into action to save the world.',
            posterUrl: 'https://placehold.co/400x600/e74c3c/ffffff?text=The+Incredibles',
            suggestedBy: 'profile_3', votes: ['profile_3', 'profile_1']
        },
        {
            id: 'sugg_2', eventId, title: 'How to Train Your Dragon',
            description: 'A hapless young Viking who aspires to hunt dragons becomes the unlikely friend of a young dragon himself, and learns there may be more to the creatures than he assumed.',
            posterUrl: 'https://placehold.co/400x600/3498db/ffffff?text=How+to+Train+Your+Dragon',
            suggestedBy: 'profile_1', votes: []
        },
        {
            id: 'sugg_3', eventId, title: 'Paddington 2',
            description: 'Paddington, now happily settled with the Brown family, picks up a series of odd jobs to buy the perfect present for his Aunt Lucy\'s 100th birthday, only for the gift to be stolen.',
            posterUrl: 'https://placehold.co/400x600/f1c40f/ffffff?text=Paddington+2',
            suggestedBy: 'profile_2', votes: ['profile_2']
        },
    ];
    return { events, suggestions };
};

const createMockBooks = (): Book[] => {
    return [
        {
            id: 'book_1',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            summary: 'A hobbit goes on an unexpected adventure with a group of dwarves to reclaim their treasure from a dragon.',
            coverUrl: 'https://placehold.co/400x600/2ecc71/ffffff?text=The+Hobbit',
            pageCount: 310,
            currentPage: 75,
            status: 'reading',
            addedBy: 'profile_3' // Leo
        },
        {
            id: 'book_2',
            title: 'Harry Potter and the Sorcerer\'s Stone',
            author: 'J.K. Rowling',
            summary: 'An orphaned boy discovers he is a wizard and begins his education at Hogwarts School of Witchcraft and Wizardry.',
            coverUrl: 'https://placehold.co/400x600/9b59b6/ffffff?text=Harry+Potter',
            pageCount: 223,
            currentPage: 223,
            status: 'finished',
            addedBy: 'profile_3'
        }
    ];
};

const createMockTrips = (): Trip[] => {
    return [
        {
            id: 'trip_1',
            name: 'Hawaii Family Adventure',
            destination: 'Honolulu, HI',
            startDate: '2024-07-20',
            endDate: '2024-07-27',
            travelerIds: ['profile_1', 'profile_2', 'profile_3'],
            coverImageUrl: 'https://placehold.co/400x300/1abc9c/ffffff?text=Hawaii',
            itinerary: [
                {
                    date: '2024-07-21',
                    activities: [
                        { id: 'act_1', title: 'Waikiki Beach Day', description: 'Relax, swim, and build sandcastles.', timeSlot: 'Morning', status: 'confirmed' },
                        { id: 'act_2', title: 'Diamond Head Hike', description: 'Hike for amazing views of the island.', timeSlot: 'Afternoon', status: 'idea' },
                        { id: 'act_3', title: 'Luau Dinner Show', description: 'Traditional Hawaiian food and entertainment.', timeSlot: 'Evening', status: 'confirmed' },
                    ]
                },
                {
                    date: '2024-07-22',
                    activities: [
                        { id: 'act_4', title: 'Pearl Harbor Visit', description: 'Visit the historical sites.', timeSlot: 'Morning', status: 'confirmed' },
                    ]
                }
            ],
            packingList: [
                { id: 'pack_1', name: 'Swimsuits', category: 'Clothing', packedBy: null },
                { id: 'pack_2', name: 'Sunscreen', category: 'Toiletries', packedBy: 'profile_1' },
                { id: 'pack_3', name: 'Sandals', category: 'Clothing', packedBy: null },
                { id: 'pack_4', name: 'Camera', category: 'Electronics', packedBy: 'profile_2' },
            ],
            budget: [
                { id: 'bud_1', category: 'Flights', description: 'Round-trip airfare', estimatedCost: 1800, actualCost: 1750 },
                { id: 'bud_2', category: 'Accommodation', description: 'Hotel for 7 nights', estimatedCost: 2500, actualCost: 2600 },
                { id: 'bud_3', category: 'Food', description: 'Meals and snacks', estimatedCost: 1000, actualCost: null },
            ]
        }
    ];
};

const createMockBudgets = (): { categories: BudgetCategory[], expenses: BudgetExpense[] } => {
    const categories: BudgetCategory[] = [
        { id: 'budget_1', name: 'Family Entertainment', limit: 200 },
        { id: 'budget_2', name: 'Groceries', limit: 800 },
        { id: 'budget_3', name: 'Eating Out', limit: 250 },
    ];
    const expenses: BudgetExpense[] = [
        { id: 'exp_1', categoryId: 'budget_1', description: 'Movie tickets', amount: 45, date: Date.now() - 86400000 * 5 },
        { id: 'exp_2', categoryId: 'budget_2', description: 'Weekly shop', amount: 180.50, date: Date.now() - 86400000 * 3 },
        { id: 'exp_3', categoryId: 'budget_3', description: 'Pizza night', amount: 55, date: Date.now() - 86400000 * 2 },
        { id: 'exp_4', categoryId: 'budget_2', description: 'Mid-week top-up', amount: 62.75, date: Date.now() - 86400000 * 1 },
    ];
    return { categories, expenses };
};

const createMockSavingsGoals = (): SavingsGoal[] => {
    return [
        {
            id: 'goal_1', name: 'New Video Game',
            targetAmount: 70, currentAmount: 25.50,
            imageUrl: 'https://placehold.co/400x300/9b59b6/ffffff?text=New+Game',
            createdBy: 'profile_3' // Leo
        },
        {
            id: 'goal_2', name: 'Summer Camp',
            targetAmount: 500, currentAmount: 250,
            imageUrl: 'https://placehold.co/400x300/e67e22/ffffff?text=Summer+Camp',
            createdBy: 'profile_3' // Leo
        }
    ];
};

const createMockMaintenanceTasks = (): MaintenanceTask[] => {
    const today = new Date();
    const overdue = new Date();
    overdue.setDate(today.getDate() - 10);
    const soon = new Date();
    soon.setDate(today.getDate() + 5);
    const later = new Date();
    later.setMonth(today.getMonth() + 2);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return [
        {
            id: 'maint_1', name: 'Change HVAC Air Filter',
            description: 'Use the 20x25x1 filters.',
            category: 'HVAC', recurrence: 'quarterly',
            lastCompleted: '2024-06-01', nextDue: formatDate(soon),
            isComplete: false
        },
        {
            id: 'maint_2', name: 'Test Smoke Detectors',
            description: 'Press the test button on all detectors.',
            category: 'General', recurrence: 'monthly',
            nextDue: formatDate(today), isComplete: false
        },
        {
            id: 'maint_3', name: 'Clean Gutters',
            description: 'After all leaves have fallen.',
            category: 'Yard', recurrence: 'annually',
            lastCompleted: '2023-11-15', nextDue: '2024-11-15',
            isComplete: false
        },
        {
            id: 'maint_4', name: 'Deep Clean Refrigerator',
            category: 'Appliance', recurrence: 'quarterly',
            nextDue: formatDate(overdue), // Overdue
            isComplete: false
        }
    ];
};

const createMockHomeProjects = (): HomeProject[] => {
    return [
        {
            id: 'proj_1', name: 'Paint Living Room',
            description: 'Repaint the living room walls with a modern grey color.',
            status: 'In Progress', budget: 300,
            tasks: [
                { id: 'ptask_1', name: 'Buy paint and supplies', isComplete: true },
                { id: 'ptask_2', name: 'Prep walls and tape edges', isComplete: true },
                { id: 'ptask_3', name: 'Paint first coat', isComplete: false },
                { id: 'ptask_4', name: 'Paint second coat', isComplete: false },
                { id: 'ptask_5', name: 'Clean up', isComplete: false },
            ]
        },
        {
            id: 'proj_2', name: 'Build Backyard Deck',
            description: 'Construct a new wooden deck in the backyard for entertaining.',
            status: 'Planning', budget: 2500,
            tasks: [
                { id: 'ptask_6', name: 'Finalize deck design', isComplete: true },
                { id: 'ptask_7', name: 'Get building permit', isComplete: false },
                { id: 'ptask_8', name: 'Purchase lumber and materials', isComplete: false },
            ]
        },
        {
            id: 'proj_3', name: 'Organize Garage',
            description: 'Clean out and install new shelving in the garage.',
            status: 'Completed', budget: 150,
            tasks: [
                { id: 'ptask_9', name: 'Declutter and throw away junk', isComplete: true },
                { id: 'ptask_10', name: 'Assemble and install shelves', isComplete: true },
                { id: 'ptask_11', name: 'Organize items into bins', isComplete: true },
            ]
        }
    ];
};

const createMockServiceContacts = (): ServiceContact[] => {
    return [
        { id: 'serv_1', name: 'Plumb Perfect Inc.', category: 'Plumber', phone: '555-123-4567', email: 'contact@plumbperfect.com', notes: 'Very reliable, fixed the kitchen sink leak last year.' },
        { id: 'serv_2', name: 'Mike "Sparky" Watts', category: 'Electrician', phone: '555-765-4321', notes: 'Independent electrician. Great for small jobs.' },
        { id: 'serv_3', name: 'Cool Breeze HVAC', category: 'HVAC', phone: '555-222-3333', email: 'service@coolbreeze.com' },
        { id: 'serv_4', name: 'Frank\'s Lawn Care', category: 'Landscaper', phone: '555-987-6543' },
    ];
};

const createMockSmartDevices = (): SmartDevice[] => {
    return [
        { id: 'light_1', name: 'Living Room Lamp', room: 'Living Room', type: 'Light', status: 'on', connectionState: 'connected' },
        { id: 'light_2', name: 'Kitchen Main', room: 'Kitchen', type: 'Light', status: 'off', connectionState: 'connected' },
        { id: 'thermostat_1', name: 'Main Thermostat', room: 'Hallway', type: 'Thermostat', status: 72, connectionState: 'connected' },
        { id: 'lock_1', name: 'Front Door', room: 'Entrance', type: 'Lock', status: 'locked', connectionState: 'connected' },
        { id: 'camera_1', name: 'Backyard Cam', room: 'Backyard', type: 'Camera', status: 'on', connectionState: 'disconnected' },
         { id: 'light_3', name: 'Bedroom Light', room: 'Bedroom', type: 'Light', status: 'off', connectionState: 'connected' },
    ];
};

const createMockSmartScenes = (): SmartScene[] => {
    return [
        { 
            id: 'scene_1', name: 'Movie Night', icon: '🎬',
            actions: [
                { deviceId: 'light_1', targetStatus: 'on' },
                { deviceId: 'light_2', targetStatus: 'off' },
                { deviceId: 'thermostat_1', targetStatus: 70 },
                { deviceId: 'lock_1', targetStatus: 'locked' }
            ]
        },
        { 
            id: 'scene_2', name: 'Good Morning', icon: '☀️',
            actions: [
                { deviceId: 'light_3', targetStatus: 'on' },
                { deviceId: 'thermostat_1', targetStatus: 72 }
            ]
        },
        { 
            id: 'scene_3', name: 'Good Night', icon: '🌙',
            actions: [
                { deviceId: 'light_1', targetStatus: 'off' },
                { deviceId: 'light_2', targetStatus: 'off' },
                { deviceId: 'light_3', targetStatus: 'off' },
                { deviceId: 'thermostat_1', targetStatus: 68 },
                { deviceId: 'lock_1', targetStatus: 'locked' }
            ]
        },
    ];
};

const createMockSkills = (): Skill[] => {
    return [
        {
            id: 'skill_1', name: 'Learn to Play Guitar', level: 1, xp: 50, addedBy: 'profile_3',
            milestones: [
                { id: 'ms_1', description: 'Learn 3 basic chords (G, C, D)', isComplete: true },
                { id: 'ms_2', description: 'Play "Twinkle Twinkle Little Star"', isComplete: false },
                { id: 'ms_3', description: 'Practice for 15 minutes', isComplete: false },
            ]
        },
        {
            id: 'skill_2', name: 'Learn to Code in Python', level: 2, xp: 620, addedBy: 'profile_3',
            milestones: [
                { id: 'ms_4', description: 'Complete "Hello, World!"', isComplete: true },
                { id: 'ms_5', description: 'Learn about variables and data types', isComplete: true },
                { id: 'ms_6', description: 'Write a simple calculator program', isComplete: false },
            ]
        }
    ];
};

const createMockRoutines = (): { routines: Routine[], logs: RoutineLog[] } => {
    const routines: Routine[] = [
        { id: 'routine_1', name: 'Morning Routine', description: 'Get ready for a great day!', frequency: 'daily', addedBy: 'profile_3' },
        { id: 'routine_2', name: 'Tidy Room', description: 'Spend 5 minutes cleaning up before bed.', frequency: 'daily', addedBy: 'profile_3' },
    ];

    const logs: RoutineLog[] = [];
    const today = new Date();
    // Log morning routine for some recent days
    for (let i = 1; i < 5; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        logs.push({ routineId: 'routine_1', date: d.toISOString().split('T')[0] });
    }
    // Log tidy room for some recent days
     for (let i = 1; i < 3; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        logs.push({ routineId: 'routine_2', date: d.toISOString().split('T')[0] });
    }

    return { routines, logs };
};

const createMockShoutOuts = (): ShoutOut[] => {
    const now = Date.now();
    return [
        {
            id: 'shout_1',
            fromProfileId: 'profile_1', // Maria
            toProfileId: 'profile_3', // Leo
            message: "A huge thank you for helping with the groceries today without even being asked. You're a superstar!",
            timestamp: now - 3600000 * 2, // 2 hours ago
            reactions: { 'profile_2': '❤️' }
        },
        {
            id: 'shout_2',
            fromProfileId: 'profile_2', // John
            toProfileId: 'profile_1', // Maria
            message: 'Amazing job planning movie night! The snacks were perfect and everyone had a blast.',
            timestamp: now - 86400000, // 1 day ago
            reactions: { 'profile_3': '👍', 'profile_1': '😄' }
        },
    ];
};

const createMockLockerRoomActivities = (): ExtracurricularActivity[] => {
    return [
        {
            id: 'activity_1',
            profileId: 'profile_3', // Leo
            name: 'Soccer Practice',
            type: 'Sport',
            location: 'City Park, Field 4',
            schedule: [
                { dayOfWeek: 'Tuesday', startTime: '16:00', endTime: '17:30' },
                { dayOfWeek: 'Thursday', startTime: '16:00', endTime: '17:30' },
            ],
            gear: [
                { id: 'gear_1', name: 'Cleats', packed: false },
                { id: 'gear_2', name: 'Shin Guards', packed: true },
                { id: 'gear_3', name: 'Soccer Ball', packed: false },
                { id: 'gear_4', name: 'Water Bottle', packed: true },
            ],
            notes: "Don't forget to stretch before practice!",
        },
        {
            id: 'activity_2',
            profileId: 'profile_3', // Leo
            name: 'Piano Lessons',
            type: 'Music',
            location: 'Ms. Anya\'s Studio',
            schedule: [
                { dayOfWeek: 'Wednesday', startTime: '15:00', endTime: '15:45' },
            ],
            gear: [
                { id: 'gear_5', name: 'Piano Book: Level 3', packed: true },
                { id: 'gear_6', name: 'Notebook', packed: false },
            ],
        }
    ];
};


export const MOCK_PROFILES: Profile[] = [
    { id: 'profile_1', name: 'Maria', role: 'Admin', age: 42, birthday: '1983-05-15' },
    { id: 'profile_2', name: 'John', role: 'Parent', age: 43, birthday: '1982-03-10' },
    { id: 'profile_3', name: 'Leo', role: 'Child', age: 10, birthday: '2015-08-22' },
];

const mockMovieData = createMockMovieNight();
const mockBudgetData = createMockBudgets();
const mockRoutinesData = createMockRoutines();

export const MOCK_PERSONALIZATION_DATA: PersonalizationData = {
    familyName: 'The Smith Family',
    motto: 'Adventure Awaits!',
    coatOfArmsUrl: 'https://placehold.co/200x200/3498db/ffffff?text=S',
    familyFoundations: {
        content: "Our Family Constitution:\n\n1. Be Kind & Respectful.\n2. Always Tell the Truth.\n3. Help Without Being Asked.\n4. Have Fun!",
        acknowledgements: {}
    },
    familyMeetings: [
        { id: 'meet1', title: 'Weekly Check-in', date: '2025-07-27', time: '18:00', agenda: [], actionItems: [] }
    ],
    familyCourtCases: [
        { id: 'case1', title: 'The Mystery of the Missing Cookies', description: 'The cookie jar was empty on Tuesday morning.', plaintiffId: 'profile_1', defendantId: 'profile_3', status: 'Closed', verdict: 'Guilty', consequence: 'No dessert for 2 days.', consequenceDurationHours: 48, verdictTimestamp: Date.now() - (12 * 60 * 60 * 1000) },
        { id: 'case2', title: 'Unfinished Homework', description: 'Leo did not complete his math homework on Wednesday.', plaintiffId: 'profile_1', defendantId: 'profile_3', status: 'Open' }
    ],
    mealPlans: createMockMealPlan(),
    allowanceSettings: {
        'profile_3': { amount: 5, interval: 'weekly', dayOfWeek: 5 } // $5 every Friday for Leo
    },
    allowanceTransactions: createMockAllowanceTransactions(),
    chores: createMockChores(),
    shoppingListItems: createMockShoppingList(),
    messageChannels: createMockMessageChannels(),
    messages: createMockMessages(),
    photoAlbums: createMockPhotoAlbums(),
    photos: createMockPhotos(),
    movieNightEvents: mockMovieData.events,
    movieSuggestions: mockMovieData.suggestions,
    readingCornerBooks: createMockBooks(),
    trips: createMockTrips(),
    budgets: mockBudgetData.categories,
    expenses: mockBudgetData.expenses,
    savingsGoals: createMockSavingsGoals(),
    maintenanceTasks: createMockMaintenanceTasks(),
    homeProjects: createMockHomeProjects(),
    serviceContacts: createMockServiceContacts(),
    skills: createMockSkills(),
    routines: mockRoutinesData.routines,
    routineLogs: mockRoutinesData.logs,
    shoutOuts: createMockShoutOuts(),
    extracurricularActivities: createMockLockerRoomActivities(),
    smartDevices: createMockSmartDevices(),
    smartScenes: createMockSmartScenes(),
};