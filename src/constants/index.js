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
    href: '/admin/interests',
  },
  {
    id: 2,
    name: 'Consents',
    href: '/admin/consents',
  },
  {
    id: 3,
    name: 'Topics',
    href: '/admin/topics',
  },
];

export const socialLinks = [
  {
    id: 1,
    name: 'Youtube',
    href: 'https://www.youtube.com/@Bulfighter',
  },
  {
    id: 2,
    name: 'Tiktok',
    href: 'https://www.tiktok.com/@bul.fighter',
  },
  {
    id: 3,
    name: 'Instagram',
    href: 'https://www.instagram.com/bulfighter.exe',
  },
  {
    id: 4,
    name: 'Snapchat',
    href: 'https://www.snapchat.com/@bulfighter.exe',
  },
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