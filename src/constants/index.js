export const navLinks = [
  {
    id: 1,
    name: 'Join a video',
    href: '/#join',
  },
  {
    id: 2,
    name: 'Clips',
    href: '/clips',
  },
  // {
  //   id: 3,
  //   name: 'Games',
  //   href: '#games',
  // },
];

export const adminLinks = [
  {
    id: 1,
    name: 'Interests',
    href: '#interests',
  },
  {
    id: 2,
    name: 'Consents',
    href: '#consents',
  },
  {
    id: 3,
    name: 'Topics',
    href: '#topics',
  },
];

export const socialLinks = [
  {
    id: 1,
    name: 'Youtube',
    href: 'https://www.youtube.com/@rankandmatch',
    image: '/assets/youtube.png',
  },
  {
    id: 2,
    name: 'Tiktok',
    href: 'https://www.tiktok.com/@rankandmatch',
    image: '/assets/tiktok.png',
  },
  {
    id: 3,
    name: 'Instagram',
    href: 'https://www.instagram.com/rankandmatch',
    image: '/assets/instagram.png',
  },
//   {
//     id: 4,
//     name: 'Snapchat',
//     href: 'https://www.snapchat.com/rankandmatch',
//     image: '/assets/snapchat.png',
//   },
]

const spotifyWrapped = [
  'Ranking and Matching Spotify Wrapped Playlists',
  {
    id: '1',
    link: 'https://www.youtube.com/embed/Gc1O1e99SzA?si=fGOPMNj9ruSdBgz1&amp;start=1322',
    width: 320,
    height: 315,
    type: 'video'
  },
  {
    id: '2',
    title: 'Ranking and Matching Spotify Wrapped Playlists',
    link: 'https://youtube.com/embed/8rIM4_ctfXg?si=yMFoftfwFPqnGq7e',
    width: 560,
    height: 315,
    type: 'short'
  },
  {
    id: '3',
    title: 'Ranking and Matching Spotify Wrapped Playlists',
    link: 'https://www.youtube.com/embed/Gc1O1e99SzA?si=fGOPMNj9ruSdBgz1&amp;start=1322',
    width: 560,
    height: 315,
    type: 'short'
  }
]

const hotTakesSpecial = [
  '5 Hot Takes Special',
  {
    id: '1',
    title: '5 Hot Takes Special',
    link: 'https://www.youtube.com/embed/h6nGIqxcXWg?si=_uP7jTyRzlvilFPP&amp;start=110',
    width: 560,
    height: 315,
    type: 'video'
  },
  {
    id: '2',
    title: '5 Hot Takes Special',
    link: 'https://youtube.com/shorts/2PwFtySflVU?si=poZW6KcFcj1QzA_S',
    width: 560,
    height: 315,
    type: 'short'
  },
  {
    id: '3',
    title: '5 Hot Takes Special',
    link: 'https://youtube.com/shorts/1lpT4zWtHBM?si=uVwEU9C0OGE7qOob',
    width: 560,
    height: 315,
    type: 'short'
  },
]

export const videoLinks = [
  spotifyWrapped,
  hotTakesSpecial,
]

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
  };
};

export const MainTopics = [
  { "topicId": 1, "Topic": "Snapchat private story names", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 2, "Topic": "Period simulator scores", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 3, "Topic": "3 Hot takes", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 4, "Topic": "Food deliveries history", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 5, "Topic": "Callisthenics skills", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 6, "Topic": "First 10 videos on the explore page (shorts, Instagram, Tiktok FYP)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 7, "Topic": "Friends 'close friends' posts", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 8, "Topic": "CV & Cover letter", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 9, "Topic": "Their last 3 birthday celebrations", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 10, "Topic": "Roast from the roast thread", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 11, "Topic": "Academic record (results & certificates)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 12, "Topic": "Tattoos", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 13, "Topic": "Wedding outfits", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 14, "Topic": "Screen Time reports", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 15, "Topic": "Sport the person plays", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 16, "Topic": "The makeup artist", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 17, "Topic": "Locket recap (edit to remove the person)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 18, "Topic": "Alarm names", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 19, "Topic": "Playlists", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 20, "Topic": "Group chat names", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 21, "Topic": "Adverts", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 22, "Topic": "Dishes", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 23, "Topic": "Tattoos", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 24, "Topic": "Body transformations", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 25, "Topic": "House type they live in", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 26, "Topic": "Shoe collection", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 27, "Topic": "Lock Screen choices", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 28, "Topic": "iPhone Home Screen setups", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 29, "Topic": "Screenshots", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 30, "Topic": "Pickup lines", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 31, "Topic": "Snapchat AI names", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 32, "Topic": "Gamer tags", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 33, "Topic": "Phone cases", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 34, "Topic": "Instagram captions", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 35, "Topic": "Subject they teach", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 36, "Topic": "Job Description", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 37, "Topic": "Boyfriend application template", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 38, "Topic": "Girlfriend application template", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 39, "Topic": "Freestyle (on paper)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 40, "Topic": "Poem (on paper)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 41, "Topic": "Weird talent (eg wiggle your ear)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 42, "Topic": "Last 5 games they played", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 43, "Topic": "Their type", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 44, "Topic": "Spotify wrapped", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 45, "Topic": "Email", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 46, "Topic": "ChatGPT chat titles", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 47, "Topic": "Hoodie collection", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 48, "Topic": "What’s in their bag/pocket dump", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 49, "Topic": "Room setup", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 50, "Topic": "Their villain origin story", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 51, "Topic": "The ex-boyfriend", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 52, "Topic": "The ex-girlfriend", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 53, "Topic": "The anime top picks", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 54, "Topic": "K-drama top picks", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 55, "Topic": "Prom dress", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 56, "Topic": "Handmade jewellery", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 57, "Topic": "Pets", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 58, "Topic": "Notes app confessions", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 59, "Topic": "Most recent Amazon orders", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 60, "Topic": "Most recent Temu orders", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 61, "Topic": "Usernames", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 62, "Topic": "Birthday cake that represents them", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 63, "Topic": "Games made by them", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 64, "Topic": "Meal plans", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 65, "Topic": "Cheating methods", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 66, "Topic": "Handwriting", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 67, "Topic": "Their closet", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 68, "Topic": "Gallery recycle bin", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 69, "Topic": "Perfume collection", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 70, "Topic": "Animated crushes", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 71, "Topic": "Ghost, Block, Stalk, FMK choices", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 72, "Topic": "3 Icks", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 73, "Topic": "3 superpower picks", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 74, "Topic": "Short stories they made", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 75, "Topic": "One word descriptions from friends", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 76, "Topic": "Dancing instructor milestones", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 77, "Topic": "Favourite quotes", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 78, "Topic": "Addiction", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 79, "Topic": "Traditional Jobs", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 80, "Topic": "Non-Traditional Jobs", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 81, "Topic": "Self-Made animation", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 82, "Topic": "Rooms", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 83, "Topic": "Degree(s)", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 84, "Topic": "Clothing aesthetic", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 85, "Topic": "Social media gross followers", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 86, "Topic": "Self-made TikTok sound", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 87, "Topic": "Stuffed Animals", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 88, "Topic": "Body jobs done", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 89, "Topic": "Injuries/Scars/Dislocations", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 90, "Topic": "Elderies ages", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 91, "Topic": "Got lost story", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 92, "Topic": "Shots in a girl's DM", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 93, "Topic": "Couples and how they shot their shot", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
  { "topicId": 94, "Topic": "Piercings", "Ranked": false, "R-Uploaded": false, "Matched": false, "M-Uploaded": false },
]
