// Clips shown on the /clips page, grouped by shoot.
// Video links aren't stored in the Topics Lambda yet (m0umxkjpy6...), so this
// is the source of truth for now. Once video links live in that table, swap
// fetchClips() in src/sections/Clips.jsx for a real fetch call keyed by topicId.

export const clipCollections = [
  {
    id: 'spotify-wrapped',
    title: 'Ranking and Matching Spotify Wrapped Playlists',
    clips: [
      { id: 'spotify-wrapped-1', type: 'video', youtubeId: 'Gc1O1e99SzA', start: 1322 },
      { id: 'spotify-wrapped-2', type: 'short', youtubeId: '8rIM4_ctfXg' },
    ],
  },
  {
    id: 'hot-takes-special',
    title: '5 Hot Takes Special',
    clips: [
      { id: 'hot-takes-1', type: 'video', youtubeId: 'h6nGIqxcXWg', start: 110 },
      { id: 'hot-takes-2', type: 'short', youtubeId: '2PwFtySflVU' },
      { id: 'hot-takes-3', type: 'short', youtubeId: '1lpT4zWtHBM' },
    ],
  },
]
