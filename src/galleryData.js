// galleryData.js
// 12 authentic photographs of Akanksha
// Read-only path references directly to /PHOTOS/
// Organized into 3 curated thematic suites with varied editorial layouts,
// exact preserved aspect ratios, and thoughtful birthday wishes.

export const GALLERY_SUITES = [
  {
    suiteId: 1,
    title: 'Suite I — The Warmth of Everyday Joy',
    subtitle: 'Moments filled with quiet radiance and candid smiles',
    themeThought: '“May your days always be graced with this ease, lightness, and effortless beauty.”',
    photos: [
      {
        id: 1,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.49%20PM.jpeg',
        aspect: 0.75, // 1200 x 1600 Portrait
        title: 'Radiant Dawn',
        thought: 'A smile that lights up every room it enters.',
        position: [-1.45, 0.25, -0.2],
        rotation: [0, 0.08, -0.02],
        scale: 1.15,
      },
      {
        id: 2,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.50%20PM.jpeg',
        aspect: 0.75, // Portrait
        title: 'Unfiltered Grace',
        thought: 'Here’s to another year of moving through life with genuine grace.',
        position: [0.0, -0.1, 0.25],
        rotation: [0, -0.04, 0.015],
        scale: 1.35, // Focal centerpiece of Suite 1
      },
      {
        id: 3,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.54%20PM%20(1).jpeg',
        aspect: 0.75, // Portrait
        title: 'Joy in Motion',
        thought: 'Cherishing the laughter that turns ordinary afternoons into memories.',
        position: [1.45, 0.2, -0.15],
        rotation: [0, -0.09, -0.02],
        scale: 1.15,
      },
      {
        id: 4,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.54%20PM.jpeg',
        aspect: 0.75, // Portrait
        title: 'Golden Moments',
        thought: 'A tender reminder of the simple joys we hold closest.',
        position: [-2.6, -0.35, -0.6],
        rotation: [0, 0.14, 0.03],
        scale: 0.95,
      },
    ],
  },
  {
    suiteId: 2,
    title: 'Suite II — Togetherness & Shared Laughter',
    subtitle: 'Surrounded by celebration, warmth, and the people who cherish you',
    themeThought: '“The best celebrations are the ones remembered not by time, but by how deeply we laughed.”',
    photos: [
      {
        id: 9,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.11%20PM.jpeg',
        aspect: 1.778, // 1600 x 900 Landscape centerpiece
        title: 'Shared Light',
        thought: 'Golden hours made memorable by warmth, friendship, and affection.',
        position: [0.0, 0.35, 0.15],
        rotation: [0, 0, 0],
        scale: 1.45,
      },
      {
        id: 10,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.12%20PM.jpeg',
        aspect: 1.778, // Landscape
        title: 'An Evening to Remember',
        thought: 'Laughter captured at the heart of the table.',
        position: [-1.75, -0.45, -0.35],
        rotation: [0, 0.08, -0.02],
        scale: 1.1,
      },
      {
        id: 11,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.13%20PM.jpeg',
        aspect: 1.778, // Landscape
        title: 'Cherished Company',
        thought: 'Moments that stay with us long after the night ends.',
        position: [1.75, -0.45, -0.35],
        rotation: [0, -0.08, 0.02],
        scale: 1.1,
      },
      {
        id: 5,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.55%20PM.jpeg',
        aspect: 0.75, // Portrait accent
        title: 'Sweet Repose',
        thought: 'Soft light, sweet smiles, and heartfelt wishes.',
        position: [2.7, 0.25, -0.7],
        rotation: [0, -0.12, 0.03],
        scale: 0.95,
      },
    ],
  },
  {
    suiteId: 3,
    title: 'Suite III — Radiance & The Year Ahead',
    subtitle: 'Celebrating who you are and everything beautiful waiting on your horizon',
    themeThought: '“May the coming year bring you boundless happiness, thrilling discoveries, and quiet peace.”',
    photos: [
      {
        id: 6,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.17.58%20PM.jpeg',
        aspect: 0.75, // Portrait
        title: 'Quiet Confidence',
        thought: 'Standing gracefully in your own radiant light.',
        position: [-1.55, 0.1, -0.2],
        rotation: [0, 0.06, -0.015],
        scale: 1.15,
      },
      {
        id: 7,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.01%20PM.jpeg',
        aspect: 0.75, // Portrait centerpiece
        title: 'Timeless Beauty',
        thought: 'A portrait of someone truly special.',
        position: [0.0, 0.0, 0.2],
        rotation: [0, 0, 0],
        scale: 1.35,
      },
      {
        id: 8,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.02%20PM.jpeg',
        aspect: 0.75, // Portrait
        title: 'Vibrant Spirit',
        thought: 'May your enthusiasm for life continue to blossom with every year.',
        position: [1.55, 0.1, -0.2],
        rotation: [0, -0.06, 0.015],
        scale: 1.15,
      },
      {
        id: 12,
        url: '/PHOTOS/WhatsApp%20Image%202026-10-04%20at%204.18.15%20PM.jpeg',
        aspect: 0.75, // Portrait
        title: 'New Horizons',
        thought: 'Stepping forward into a year of exciting opportunities and dreams fulfilled.',
        position: [-2.65, -0.3, -0.65],
        rotation: [0, 0.12, 0.02],
        scale: 0.95,
      },
    ],
  },
]

// Flat list of all 12 photos for quick lookups
export const ALL_PHOTOS = GALLERY_SUITES.flatMap((s) => s.photos)
