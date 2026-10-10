// bookContent.js
// Curated thematic data structure for Akanksha's physical keepsake book.
// Color palette directly derived from Akanksha's photographs:
// warm golden yellows, rich maroon/crimson, deep velvet rose, warm ivory paper.
// Distributes all 12 original photographs with exact preserved aspect ratios.

export const BOOK_PAGES = [
  // Page 1 — The Hardcover Front
  {
    pageIndex: 0,
    pageType: 'cover',
    theme: {
      bg: '#941B2E', // rich crimson velvet
      accent: '#FFCA3A', // sunshine gold
      highlight: '#FFF3B0',
      textLight: '#FFFBF2',
      textDark: '#590d22',
      badgeBg: '#FFCA3A',
      badgeText: '#4A0815',
    },
    title: 'Dear',
    name: 'Akanksha',
    subtitle: 'A Kept Promise of Joy, Warm Wishes & Cherished Moments',
    callToAction: 'Open your birthday book ✦',
    photos: [],
  },

  // Page 2 — A wish for happiness
  {
    pageIndex: 1,
    pageType: 'single_portrait',
    theme: {
      bg: '#FFFBF2', // warm soft ivory paper
      accent: '#E63946', // rich warm crimson
      highlight: '#FFD166', // warm yellow
      textTitle: '#800F2F', // deep maroon
      textBody: '#2B2118',
    },
    badge: 'Page 2 · A Wish for Happiness',
    title: 'May Your Heart Stay Light',
    wish: 'May your life always be filled with happiness, laughter, beautiful moments, and countless reasons to smile. May your heart stay light and your days be filled with joy.',
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.49%20PM.jpeg',
        aspect: 0.75, // 1200 x 1600
        alt: 'Akanksha smiling with birthday cake',
      },
    ],
  },

  // Page 3 — A wish for health and blessings
  {
    pageIndex: 2,
    pageType: 'side_feature',
    theme: {
      bg: '#FFFDF5', // creamy ivory
      accent: '#D90429', // radiant red
      highlight: '#FFCA3A', // sunshine yellow
      textTitle: '#590D22', // deep burgundy
      textBody: '#2B2118',
    },
    badge: 'Page 3 · Health & Blessings',
    title: 'Always Blessed & Peaceful',
    wish: 'May you always stay blessed, healthy, peaceful, and surrounded by people who genuinely care for you. May every new year of your life bring you strength, good health, and beautiful memories.',
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.50%20PM.jpeg',
        aspect: 0.75,
        alt: 'Akanksha portrait',
      },
    ],
  },

  // Page 4 — A wish for growth and opportunities
  {
    pageIndex: 3,
    pageType: 'single_portrait',
    theme: {
      bg: '#FFF9EE', // warm parchment ivory
      accent: '#E07A5F', // warm terracotta
      highlight: '#F4A261', // warm gold amber
      textTitle: '#7209B7', // royal plum
      textBody: '#2B2118',
    },
    badge: 'Page 4 · Growth & Potential',
    title: 'New Doors Opening',
    wish: 'May you receive every opportunity you deserve to learn, grow, explore, and discover your full potential. May new doors open for you, and may you always have the courage to walk through them.',
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.54%20PM%20(1).jpeg',
        aspect: 0.75,
        alt: 'Joyful moment',
      },
    ],
  },

  // Page 5 — A wish for success
  {
    pageIndex: 4,
    pageType: 'side_feature',
    theme: {
      bg: '#FFFDF5', // warm linen ivory
      accent: '#C9184A', // rose crimson
      highlight: '#FFB703', // rich sunshine gold
      textTitle: '#590D22', // deep wine
      textBody: '#2B2118',
    },
    badge: 'Page 5 · Dreams & Achievements',
    title: 'Brighter Than You Imagined',
    wish: 'May you achieve everything you dream of and work towards. I hope your efforts turn into achievements, your challenges make you stronger, and your future becomes brighter than you imagined.',
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.54%20PM.jpeg',
        aspect: 0.75,
        alt: 'Radiant smile',
      },
    ],
  },

  // Page 6 — A wish for lifelong happiness
  {
    pageIndex: 5,
    pageType: 'single_portrait',
    theme: {
      bg: '#FFF9EE', // soft golden cream
      accent: '#A4161A', // deep ruby red
      highlight: '#FFD166', // warm yellow
      textTitle: '#660708', // dark maroon
      textBody: '#2B2118',
    },
    badge: 'Page 6 · Staying True To You',
    title: 'Keep Finding Joy',
    wish: 'May you never lose the beautiful things that make you who you are. Keep smiling, keep growing, keep believing in yourself, and keep finding happiness in even the smallest moments.',
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.55%20PM.jpeg',
        aspect: 0.75,
        alt: 'Grace and joy',
      },
    ],
  },

  // Page 7 — A wish for our friendship
  {
    pageIndex: 6,
    pageType: 'friendship_scrapbook',
    theme: {
      bg: '#FFFBF2', // natural warm ivory
      accent: '#9B2226', // vintage deep crimson
      highlight: '#EE9B00', // warm amber gold
      textTitle: '#590D22', // deep burgundy
      textBody: '#2B2118',
    },
    badge: 'Page 7 · Our Friendship',
    title: 'Always My Beloved Friend',
    wish: 'More than anything, I hope you always stay happy and loved. No matter how much life changes or where our journeys take us, I hope you will always remain my beloved friend. You deserve so much happiness, today and always.',
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.58%20PM.jpeg',
        aspect: 0.75,
        caption: 'Gentle warmth',
      },
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.11%20PM.jpeg',
        aspect: 1.778, // Landscape celebration
        caption: 'Together in laughter',
      },
    ],
  },

  // Page 8 — Final Celebration Finale
  {
    pageIndex: 7,
    pageType: 'final_mosaic',
    theme: {
      bg: '#800F2F', // majestic deep crimson maroon
      accent: '#FFD166', // sunshine gold
      highlight: '#FFF3B0',
      textTitle: '#FFFFFF',
      textBody: '#FFF9EE',
    },
    badge: 'Final Page · A Birthday Just For You',
    title: 'Happy Birthday, Akanksha!',
    wish: "May this new chapter of your life bring you endless happiness, good health, meaningful opportunities, wonderful achievements, and memories you'll treasure forever. Stay blessed, stay happy, and keep shining in your own beautiful way.",
    photos: [
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.01%20PM.jpeg',
        aspect: 0.75,
      },
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.02%20PM.jpeg',
        aspect: 0.75,
      },
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.12%20PM.jpeg',
        aspect: 1.778,
      },
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.13%20PM.jpeg',
        aspect: 1.778,
      },
      {
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.15%20PM.jpeg',
        aspect: 0.75,
      },
    ],
  },
]
