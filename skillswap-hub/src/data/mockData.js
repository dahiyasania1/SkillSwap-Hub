export const currentUser = {
  id: 'u1',
  name: 'Sania Patel',
  email: 'sania@skillswap.com',
  avatar: null,
  initials: 'SP',
  bio: 'Full-stack developer passionate about teaching Python and learning graphic design. Always excited to connect with fellow learners and share knowledge.',
  location: 'Bangalore, India',
  availability: 'Weekday evenings & weekends',
  experienceLevel: 'Intermediate',
  learningGoals: ['Master UI/UX Design', 'Learn Data Science fundamentals', 'Improve public speaking'],
  skillsTeach: [
    { id: 's1', name: 'Python', level: 'Advanced', experience: '4 years', learnersHelped: 23, rating: 4.8, category: 'Technology' },
    { id: 's2', name: 'React.js', level: 'Intermediate', experience: '2 years', learnersHelped: 15, rating: 4.6, category: 'Technology' },
    { id: 's3', name: 'JavaScript', level: 'Advanced', experience: '3 years', learnersHelped: 18, rating: 4.7, category: 'Technology' },
  ],
  skillsLearn: [
    { id: 's4', name: 'Graphic Design', progress: 35, goal: 'Create professional UI mockups', category: 'Design' },
    { id: 's5', name: 'Data Science', progress: 20, goal: 'Analyze real-world datasets', category: 'Technology' },
    { id: 's6', name: 'Public Speaking', progress: 45, goal: 'Deliver confident presentations', category: 'Personal Development' },
  ],
  stats: {
    totalExchanges: 38,
    learningHours: 124,
    streak: 12,
    rating: 4.7,
  },
  achievements: ['First Skill Exchange', '7-Day Learning Streak', 'Helpful Mentor', 'Skill Explorer'],
  online: true,
  joinDate: '2024-06-15',
};

export const users = [
  {
    id: 'u2', name: 'Alex Chen', initials: 'AC', bio: 'UI/UX designer with 5 years of experience. Love teaching design principles and learning new programming languages.',
    location: 'San Francisco, USA', availability: 'Flexible', online: true,
    skillsTeach: [
      { name: 'Graphic Design', level: 'Expert', category: 'Design' },
      { name: 'UI/UX Design', level: 'Expert', category: 'Design' },
      { name: 'Figma', level: 'Advanced', category: 'Design' },
    ],
    skillsLearn: [
      { name: 'Python', progress: 30 },
      { name: 'Machine Learning', progress: 10 },
    ],
    rating: 4.9, totalExchanges: 52, streak: 21,
  },
  {
    id: 'u3', name: 'Maria Garcia', initials: 'MG', bio: 'Mathematics tutor and data analyst. Passionate about making math accessible and fun for everyone.',
    location: 'Madrid, Spain', availability: 'Weekends', online: false,
    skillsTeach: [
      { name: 'Mathematics', level: 'Expert', category: 'Mathematics' },
      { name: 'Statistics', level: 'Advanced', category: 'Mathematics' },
      { name: 'Excel', level: 'Advanced', category: 'Business' },
    ],
    skillsLearn: [
      { name: 'Web Development', progress: 45 },
      { name: 'React.js', progress: 20 },
    ],
    rating: 4.8, totalExchanges: 41, streak: 15,
  },
  {
    id: 'u4', name: 'James Wilson', initials: 'JW', bio: 'Digital marketing specialist with expertise in SEO, social media, and content strategy.',
    location: 'London, UK', availability: 'Evenings', online: true,
    skillsTeach: [
      { name: 'Digital Marketing', level: 'Expert', category: 'Marketing' },
      { name: 'SEO', level: 'Advanced', category: 'Marketing' },
      { name: 'Content Writing', level: 'Advanced', category: 'Marketing' },
    ],
    skillsLearn: [
      { name: 'Python', progress: 15 },
      { name: 'Data Visualization', progress: 25 },
    ],
    rating: 4.7, totalExchanges: 33, streak: 8,
  },
  {
    id: 'u5', name: 'Yuki Tanaka', initials: 'YT', bio: 'Language enthusiast teaching Japanese and English. Currently learning music production and guitar.',
    location: 'Tokyo, Japan', availability: 'Mornings', online: true,
    skillsTeach: [
      { name: 'Japanese', level: 'Expert', category: 'Languages' },
      { name: 'English', level: 'Advanced', category: 'Languages' },
    ],
    skillsLearn: [
      { name: 'Music Production', progress: 40 },
      { name: 'Guitar', progress: 55 },
    ],
    rating: 4.9, totalExchanges: 28, streak: 30,
  },
  {
    id: 'u6', name: 'Priya Sharma', initials: 'PS', bio: 'Public speaking coach and business consultant. Help professionals communicate with confidence.',
    location: 'Mumbai, India', availability: 'Weekday evenings', online: false,
    skillsTeach: [
      { name: 'Public Speaking', level: 'Expert', category: 'Personal Development' },
      { name: 'Business Strategy', level: 'Advanced', category: 'Business' },
      { name: 'Leadership', level: 'Advanced', category: 'Business' },
    ],
    skillsLearn: [
      { name: 'Graphic Design', progress: 60 },
      { name: 'Video Editing', progress: 35 },
    ],
    rating: 4.8, totalExchanges: 45, streak: 18,
  },
  {
    id: 'u7', name: 'David Kim', initials: 'DK', bio: 'Music producer and audio engineer. Teaching music theory, composition, and production techniques.',
    location: 'Seoul, South Korea', availability: 'Flexible', online: true,
    skillsTeach: [
      { name: 'Music Production', level: 'Expert', category: 'Music' },
      { name: 'Guitar', level: 'Advanced', category: 'Music' },
      { name: 'Music Theory', level: 'Advanced', category: 'Music' },
    ],
    skillsLearn: [
      { name: 'Web Development', progress: 25 },
      { name: 'Digital Marketing', progress: 15 },
    ],
    rating: 4.6, totalExchanges: 22, streak: 10,
  },
  {
    id: 'u8', name: 'Emma Thompson', initials: 'ET', bio: 'Business analyst and project management professional. Love teaching agile methodologies.',
    location: 'Toronto, Canada', availability: 'Weekends', online: true,
    skillsTeach: [
      { name: 'Project Management', level: 'Expert', category: 'Business' },
      { name: 'Business Analysis', level: 'Advanced', category: 'Business' },
      { name: 'Agile/Scrum', level: 'Expert', category: 'Business' },
    ],
    skillsLearn: [
      { name: 'Python', progress: 35 },
      { name: 'Data Science', progress: 20 },
    ],
    rating: 4.7, totalExchanges: 36, streak: 14,
  },
  {
    id: 'u9', name: 'Lucas Costa', initials: 'LC', bio: 'Frontend developer and creative coder. Building beautiful web experiences one component at a time.',
    location: 'São Paulo, Brazil', availability: 'Evenings', online: false,
    skillsTeach: [
      { name: 'Web Development', level: 'Expert', category: 'Technology' },
      { name: 'JavaScript', level: 'Expert', category: 'Technology' },
      { name: 'CSS', level: 'Advanced', category: 'Technology' },
    ],
    skillsLearn: [
      { name: 'Graphic Design', progress: 50 },
      { name: 'Japanese', progress: 10 },
    ],
    rating: 4.8, totalExchanges: 29, streak: 9,
  },
];

export const skillCategories = [
  { id: 'technology', name: 'Technology', icon: 'Monitor', count: 245, color: 'bg-blue-500' },
  { id: 'design', name: 'Design', icon: 'Palette', count: 182, color: 'bg-purple-500' },
  { id: 'business', name: 'Business', icon: 'Briefcase', count: 156, color: 'bg-amber-500' },
  { id: 'mathematics', name: 'Mathematics', icon: 'Calculator', count: 134, color: 'bg-emerald-500' },
  { id: 'languages', name: 'Languages', icon: 'Languages', count: 198, color: 'bg-rose-500' },
  { id: 'music', name: 'Music', icon: 'Music', count: 97, color: 'bg-indigo-500' },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone', count: 143, color: 'bg-orange-500' },
  { id: 'personal', name: 'Personal Development', icon: 'Heart', count: 167, color: 'bg-pink-500' },
];

export const allSkills = [
  { id: 'sk1', name: 'Python', category: 'Technology', level: 'Beginner to Advanced', learners: 1240, rating: 4.8, popularity: 95 },
  { id: 'sk2', name: 'React.js', category: 'Technology', level: 'Intermediate', learners: 980, rating: 4.7, popularity: 90 },
  { id: 'sk3', name: 'JavaScript', category: 'Technology', level: 'Beginner to Advanced', learners: 1100, rating: 4.7, popularity: 92 },
  { id: 'sk4', name: 'Web Development', category: 'Technology', level: 'Beginner to Advanced', learners: 1350, rating: 4.6, popularity: 88 },
  { id: 'sk5', name: 'Data Science', category: 'Technology', level: 'Intermediate', learners: 870, rating: 4.5, popularity: 82 },
  { id: 'sk6', name: 'Graphic Design', category: 'Design', level: 'Beginner to Advanced', learners: 890, rating: 4.8, popularity: 85 },
  { id: 'sk7', name: 'UI/UX Design', category: 'Design', level: 'Intermediate', learners: 750, rating: 4.9, popularity: 87 },
  { id: 'sk8', name: 'Figma', category: 'Design', level: 'Beginner to Advanced', learners: 620, rating: 4.7, popularity: 78 },
  { id: 'sk9', name: 'Digital Marketing', category: 'Marketing', level: 'Beginner to Advanced', learners: 920, rating: 4.6, popularity: 80 },
  { id: 'sk10', name: 'SEO', category: 'Marketing', level: 'Intermediate', learners: 540, rating: 4.5, popularity: 72 },
  { id: 'sk11', name: 'Mathematics', category: 'Mathematics', level: 'Beginner to Advanced', learners: 1050, rating: 4.7, popularity: 83 },
  { id: 'sk12', name: 'Statistics', category: 'Mathematics', level: 'Intermediate', learners: 680, rating: 4.6, popularity: 75 },
  { id: 'sk13', name: 'Japanese', category: 'Languages', level: 'Beginner to Advanced', learners: 430, rating: 4.9, popularity: 70 },
  { id: 'sk14', name: 'English', category: 'Languages', level: 'Beginner to Advanced', learners: 1580, rating: 4.5, popularity: 91 },
  { id: 'sk15', name: 'Spanish', category: 'Languages', level: 'Beginner to Advanced', learners: 890, rating: 4.7, popularity: 81 },
  { id: 'sk16', name: 'Guitar', category: 'Music', level: 'Beginner to Advanced', learners: 520, rating: 4.8, popularity: 73 },
  { id: 'sk17', name: 'Music Production', category: 'Music', level: 'Intermediate', learners: 410, rating: 4.6, popularity: 68 },
  { id: 'sk18', name: 'Public Speaking', category: 'Personal Development', level: 'Beginner to Advanced', learners: 780, rating: 4.7, popularity: 79 },
  { id: 'sk19', name: 'Leadership', category: 'Business', level: 'Intermediate to Advanced', learners: 650, rating: 4.8, popularity: 76 },
  { id: 'sk20', name: 'Project Management', category: 'Business', level: 'Intermediate', learners: 720, rating: 4.6, popularity: 77 },
];

export const skillMatches = [
  {
    id: 'm1',
    user: users[0],
    compatibility: 92,
    skillsTheyTeach: ['Graphic Design', 'UI/UX Design'],
    skillsTheyLearn: ['Python', 'Machine Learning'],
    sharedInterests: ['Design systems', 'Creative coding', 'Tech innovation'],
    explanation: 'Perfect match! Alex can teach you Graphic Design and UI/UX Design which you want to learn, while you can teach Python which they want to learn.',
  },
  {
    id: 'm2',
    user: users[1],
    compatibility: 87,
    skillsTheyTeach: ['Mathematics', 'Statistics'],
    skillsTheyLearn: ['Web Development', 'React.js'],
    sharedInterests: ['Data analysis', 'Web apps', 'Problem solving'],
    explanation: 'Great match! Maria can teach you Mathematics and Statistics, while you can help her learn Web Development and React.js.',
  },
  {
    id: 'm3',
    user: users[4],
    compatibility: 85,
    skillsTheyTeach: ['Public Speaking', 'Business Strategy'],
    skillsTheyLearn: ['Graphic Design', 'Video Editing'],
    sharedInterests: ['Communication', 'Professional growth', 'Creative expression'],
    explanation: 'Strong match! Priya can teach you Public Speaking, and you both share interests in creative fields. She wants to learn design skills you are developing.',
  },
  {
    id: 'm4',
    user: users[6],
    compatibility: 78,
    skillsTheyTeach: ['Project Management', 'Agile/Scrum'],
    skillsTheyLearn: ['Python', 'Data Science'],
    sharedInterests: ['Tech projects', 'Team collaboration', 'Analytics'],
    explanation: 'Good match! Emma can teach you Project Management and Agile methodologies while you can help her with Python and Data Science.',
  },
  {
    id: 'm5',
    user: users[7],
    compatibility: 81,
    skillsTheyTeach: ['Web Development', 'CSS'],
    skillsTheyLearn: ['Graphic Design', 'Japanese'],
    sharedInterests: ['Frontend design', 'Creative development', 'Languages'],
    explanation: 'Nice match! Lucas can help you with advanced Web Development techniques, and you share an interest in design and language learning.',
  },
];

export const messages = [
  {
    id: 'conv1',
    user: users[0],
    lastMessage: 'That sounds great! I have some design resources I can share.',
    timestamp: '2 min ago',
    unread: 2,
    online: true,
    messages: [
      { id: 'msg1', sender: 'u1', text: 'Hi Alex! I saw your profile and I am really interested in learning UI/UX design from you.', time: '10:30 AM' },
      { id: 'msg2', sender: 'u2', text: 'Hey Sania! I would love to help. I checked your profile and I am actually very interested in learning Python from you!', time: '10:35 AM' },
      { id: 'msg3', sender: 'u1', text: 'That is perfect! We could do a skill swap — I teach you Python basics and you teach me design fundamentals?', time: '10:40 AM' },
      { id: 'msg4', sender: 'u2', text: 'That sounds great! I have some design resources I can share.', time: '10:42 AM' },
    ],
  },
  {
    id: 'conv2',
    user: users[1],
    lastMessage: 'I will prepare some math exercises for our next session.',
    timestamp: '1 hour ago',
    unread: 0,
    online: false,
    messages: [
      { id: 'msg5', sender: 'u3', text: 'Hi Sania! Thanks for connecting. I noticed you are interested in data science — I can help with the math foundations!', time: '9:00 AM' },
      { id: 'msg6', sender: 'u1', text: 'Maria, that would be amazing! Statistics is something I really need to improve.', time: '9:15 AM' },
      { id: 'msg7', sender: 'u3', text: 'I will prepare some math exercises for our next session.', time: '9:20 AM' },
    ],
  },
  {
    id: 'conv3',
    user: users[4],
    lastMessage: 'Looking forward to our first session! Should we start next week?',
    timestamp: '3 hours ago',
    unread: 1,
    online: true,
    messages: [
      { id: 'msg8', sender: 'u6', text: 'Hello Sania! Your Python teaching reviews are fantastic. I have been wanting to learn programming for a while.', time: 'Yesterday' },
      { id: 'msg9', sender: 'u1', text: 'Thank you Priya! And your public speaking skills are exactly what I need. Would you be open to a skill swap?', time: 'Yesterday' },
      { id: 'msg10', sender: 'u6', text: 'Looking forward to our first session! Should we start next week?', time: 'Yesterday' },
    ],
  },
  {
    id: 'conv4',
    user: users[2],
    lastMessage: 'Great tips on the SEO strategies! I will implement them this week.',
    timestamp: '1 day ago',
    unread: 0,
    online: true,
    messages: [
      { id: 'msg11', sender: 'u4', text: 'Hey! I saw your post about web development. I have some marketing knowledge that could complement your skills.', time: '2 days ago' },
      { id: 'msg12', sender: 'u1', text: 'James, that is an interesting combination! Tell me more about what you have in mind.', time: '2 days ago' },
      { id: 'msg13', sender: 'u4', text: 'Great tips on the SEO strategies! I will implement them this week.', time: '1 day ago' },
    ],
  },
];

export const notifications = [
  { id: 'n1', type: 'connection', text: 'Alex Chen sent you a connection request', time: '5 min ago', read: false, icon: 'UserPlus' },
  { id: 'n2', type: 'match', text: 'New skill match found: Maria Garcia — 87% compatibility', time: '1 hour ago', read: false, icon: 'Sparkles' },
  { id: 'n3', type: 'message', text: 'New message from Priya Sharma', time: '2 hours ago', read: false, icon: 'MessageCircle' },
  { id: 'n4', type: 'reminder', text: 'Time for your daily learning session! Keep your streak going.', time: '4 hours ago', read: true, icon: 'Clock' },
  { id: 'n5', type: 'community', text: 'James Wilson liked your Python tutorial post', time: '6 hours ago', read: true, icon: 'Heart' },
  { id: 'n6', type: 'achievement', text: 'You earned the "7-Day Learning Streak" badge!', time: '1 day ago', read: true, icon: 'Award' },
  { id: 'n7', type: 'connection', text: 'Emma Thompson accepted your connection request', time: '1 day ago', read: true, icon: 'UserCheck' },
  { id: 'n8', type: 'match', text: 'Skill swap session completed with Lucas Costa — Rate your experience', time: '2 days ago', read: true, icon: 'Star' },
];

export const communityPosts = [
  {
    id: 'p1', type: 'tip', author: users[0],
    title: '5 Figma shortcuts every designer should know',
    content: 'As a designer, these shortcuts have saved me hundreds of hours. The most important ones are Auto Layout (Shift+A), Components (Ctrl+K), and Override text (Ctrl+Shift+B). These three alone can speed up your workflow by 50%.',
    likes: 42, comments: 8, timestamp: '2 hours ago',
    tags: ['Design', 'Figma', 'Productivity'],
  },
  {
    id: 'p2', type: 'question', author: users[1],
    title: 'Best resources for learning statistics for data science?',
    content: 'I want to strengthen my statistics foundation before diving into machine learning. What books, courses, or practice platforms would you recommend for someone with basic math knowledge?',
    likes: 28, comments: 15, timestamp: '5 hours ago',
    tags: ['Statistics', 'Data Science', 'Learning'],
  },
  {
    id: 'p3', type: 'update', author: currentUser,
    title: 'Just completed my first week of learning Graphic Design!',
    content: 'Started learning Figma and basic design principles through my skill swap with Alex. Already understanding color theory and typography better. The peer learning approach is so much more engaging than online courses alone.',
    likes: 56, comments: 12, timestamp: '1 day ago',
    tags: ['Graphic Design', 'Progress', 'Skill Swap'],
  },
  {
    id: 'p4', type: 'showcase', author: users[5],
    title: 'Built my first web app using skills from SkillSwap!',
    content: 'After learning JavaScript and React.js through skill swaps with Lucas and Emma, I finally built my own portfolio website! It took about 3 weeks of collaborative learning. Thanks to everyone who helped me along the way.',
    likes: 73, comments: 20, timestamp: '2 days ago',
    tags: ['Web Development', 'React', 'Project', 'Success Story'],
  },
];

export const weeklyActivity = [
  { day: 'Mon', hours: 2.5, skills: 3 },
  { day: 'Tue', hours: 1.8, skills: 2 },
  { day: 'Wed', hours: 3.2, skills: 4 },
  { day: 'Thu', hours: 0.5, skills: 1 },
  { day: 'Fri', hours: 2.8, skills: 3 },
  { day: 'Sat', hours: 4.0, skills: 5 },
  { day: 'Sun', hours: 3.5, skills: 4 },
];

export const skillProgressData = [
  { skill: 'Python', taught: 85, learned: 0 },
  { skill: 'React.js', taught: 70, learned: 0 },
  { skill: 'JavaScript', taught: 80, learned: 0 },
  { skill: 'Graphic Design', taught: 0, learned: 35 },
  { skill: 'Data Science', taught: 0, learned: 20 },
  { skill: 'Public Speaking', taught: 0, learned: 45 },
];

export const monthlyProgress = [
  { month: 'Jan', exchanges: 3, hours: 12 },
  { month: 'Feb', exchanges: 5, hours: 18 },
  { month: 'Mar', exchanges: 4, hours: 15 },
  { month: 'Apr', exchanges: 7, hours: 25 },
  { month: 'May', exchanges: 6, hours: 22 },
  { month: 'Jun', exchanges: 8, hours: 30 },
  { month: 'Jul', exchanges: 5, hours: 20 },
];

export const upcomingSessions = [
  { id: 'sess1', partner: users[0], skill: 'UI/UX Design Basics', date: 'Tomorrow, 6:00 PM', duration: '1 hour' },
  { id: 'sess2', partner: users[1], skill: 'Statistics Fundamentals', date: 'Wed, 7:00 PM', duration: '45 min' },
  { id: 'sess3', partner: users[4], skill: 'Public Speaking Practice', date: 'Sat, 10:00 AM', duration: '1 hour' },
];

export const recentActivity = [
  { id: 'a1', action: 'Completed skill exchange', detail: 'Python debugging session with Alex Chen', time: '2 hours ago', icon: 'CheckCircle' },
  { id: 'a2', action: 'New connection', detail: 'Connected with Emma Thompson', time: '5 hours ago', icon: 'UserPlus' },
  { id: 'a3', action: 'Skill updated', detail: 'Updated React.js proficiency to Advanced', time: '1 day ago', icon: 'ArrowUp' },
  { id: 'a4', action: 'Review received', detail: 'Maria Garcia left a 5-star review', time: '2 days ago', icon: 'Star' },
];

export const testimonials = [
  {
    id: 't1', name: 'Rachel Adams', role: 'Software Engineer', initials: 'RA',
    text: 'SkillSwap Hub changed how I learn. Instead of expensive courses, I connected with a Python mentor who taught me in exchange for CSS help. Win-win!',
    rating: 5,
  },
  {
    id: 't2', name: 'Michael Chen', role: 'Graphic Designer', initials: 'MC',
    text: 'I was struggling to learn web development on my own. Through SkillSwap, I found amazing mentors and made lasting professional connections.',
    rating: 5,
  },
  {
    id: 't3', name: 'Sofia Rodriguez', role: 'Data Analyst', initials: 'SR',
    text: 'The skill matching algorithm is incredible. It connected me with someone who needed exactly what I could teach, and vice versa. Brilliant platform!',
    rating: 4,
  },
];

export const achievements = [
  { id: 'ach1', name: 'First Skill Exchange', description: 'Completed your very first skill exchange', icon: 'Star', unlocked: true },
  { id: 'ach2', name: '7-Day Learning Streak', description: 'Maintained a learning streak for 7 consecutive days', icon: 'Flame', unlocked: true },
  { id: 'ach3', name: 'Helpful Mentor', description: 'Received 10 positive reviews from learners', icon: 'Award', unlocked: true },
  { id: 'ach4', name: 'Skill Explorer', description: 'Learned skills from 3 different categories', icon: 'Compass', unlocked: true },
  { id: 'ach5', name: 'Community Contributor', description: 'Published 5 posts or tips in the community', icon: 'Users', unlocked: false },
  { id: 'ach6', name: 'Master Teacher', description: 'Helped 50 learners achieve their goals', icon: 'Crown', unlocked: false },
  { id: 'ach7', name: '30-Day Streak', description: 'Maintained a learning streak for 30 days', icon: 'Flame', unlocked: false },
  { id: 'ach8', name: 'Network Builder', description: 'Connected with 25+ skill swappers', icon: 'Network', unlocked: false },
];
