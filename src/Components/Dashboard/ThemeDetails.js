// Common theme details for use across components
export const themeDetails = {
  theme_forest: {
    icon: "🌲",
    dateIcon: "🍃",
    readMoreText: "Wander deeper",
  },
  theme_ocean: {
    icon: "🐠",
    dateIcon: "🫧",
    readMoreText: "Dive deeper",
  },
  theme_black: {
    icon: "🖤",
    dateIcon: "🌑",
    readMoreText: "Enter the void",
  },
  theme_calm_ocean: {
    icon: "🌊",
    dateIcon: "🐚",
    readMoreText: "Drift along",
  },
  theme_night_sky: {
    icon: "🌌",
    dateIcon: "✨",
    readMoreText: "Gaze upward",
  },
  theme_pastel_sky: {
    icon: "🎨",
    dateIcon: "☁️",
    readMoreText: "Feel the hues",
  },
  theme_energetic_yellow: {
    icon: "🌞",
    dateIcon: "⚡",
    readMoreText: "Feel the buzz",
  },
  theme_cozy_room: {
    icon: "🛋️",
    dateIcon: "🕯️",
    readMoreText: "Snuggle in",
  },
  theme_country_side: {
    icon: "🏞️",
    dateIcon: "🌼",
    readMoreText: "Stroll on",
  },
  theme_magical_room: {
    icon: "🪄",
    dateIcon: "✨",
    readMoreText: "Cast a spell",
  },
  theme_nothern_lights: {
    icon: "🌌",
    dateIcon: "❄️",
    readMoreText: "Feel the glow",
  },
  theme_post_apocalyptic: {
    icon: "🏚️",
    dateIcon: "🌿",
    readMoreText: "Survive on",
  },
  theme_space_observe: {
    icon: "🔭",
    dateIcon: "🌠",
    readMoreText: "Observe the cosmos",
  },
  theme_winter_cabin: {
    icon: "🏔️",
    dateIcon: "🔥",
    readMoreText: "Warm up",
  },

  // 🌸 Solid Cozy Themes
  theme_solid_pink: {
    icon: "🌸",
    dateIcon: "🕊️",
    readMoreText: "Soothe your soul",
  },
  theme_solid_blue: {
    icon: "📘",
    dateIcon: "💧",
    readMoreText: "Find calm",
  },
  theme_solid_green: {
    icon: "🌿",
    dateIcon: "🍀",
    readMoreText: "Grow within",
  },
  theme_solid_lavender: {
    icon: "💜",
    dateIcon: "🫧",
    readMoreText: "Ease your mind",
  },
  theme_solid_peach: {
    icon: "🍑",
    dateIcon: "🕯️",
    readMoreText: "Stay cozy",
  },
  theme_solid_mint: {
    icon: "🌱",
    dateIcon: "💨",
    readMoreText: "Breathe easy",
  },
  theme_solid_yellow: {
    icon: "🌼",
    dateIcon: "🌞",
    readMoreText: "Shine on",
  },
  theme_solid_coral: {
    icon: "🪸",
    dateIcon: "🏵️",
    readMoreText: "Glow up",
  },
  theme_solid_lilac: {
    icon: "🔮",
    dateIcon: "💫",
    readMoreText: "Drift softly",
  },
  theme_solid_aqua: {
    icon: "🧊",
    dateIcon: "🌀",
    readMoreText: "Flow freely",
  },
};

// Function to get card class based on theme
export const getCardClass = (theme) => {
  switch (theme) {
    case "theme_forest":
      return "card-forest";
    case "theme_ocean":
      return "card-ocean";
    case "theme_black":
      return "card-black";
    case "theme_calm_ocean":
      return "card-calm-ocean";
    case "theme_night_sky":
      return "card-night-sky";
    case "theme_pastel_sky":
    case "theme_pastle_sky": // typo-safe
      return "card-pastel-sky";
    case "theme_energetic_yellow":
      return "card-energetic-yellow";
    case "theme_cozy_room":
      return "card-cozy-room";
    case "theme_country_side":
      return "card-country-side";
    case "theme_magical_room":
      return "card-magical-room";
    case "theme_nothern_lights":
      return "card-northern-lights";
    case "theme_post_apocalyptic":
      return "card-post-apocalyptic";
    case "theme_space_observe":
      return "card-space-observe";
    case "theme_winter_cabin":
      return "card-winter-cabin";

    // Solid themes — use generic classes or create unique ones if you want
    case "theme_solid_pink":
      return "card-solid-pink";
    case "theme_solid_blue":
      return "card-solid-blue";
    case "theme_solid_green":
      return "card-solid-green";
    case "theme_solid_lavender":
      return "card-solid-lavender";
    case "theme_solid_peach":
      return "card-solid-peach";
    case "theme_solid_mint":
      return "card-solid-mint";
    case "theme_solid_yellow":
      return "card-solid-yellow";
    case "theme_solid_coral":
      return "card-solid-coral";
    case "theme_solid_lilac":
      return "card-solid-lilac";
    case "theme_solid_aqua":
      return "card-solid-aqua";

    default:
      return "card-dark";
  }
};

// Helper function to get theme details with fallback
export const getThemeDetails = (theme) => {
  return (
    themeDetails[theme] || {
      icon: "📝",
      dateIcon: "📅",
      readMoreText: "Read more",
    }
  );
};
