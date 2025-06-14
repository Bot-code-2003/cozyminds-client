const adjectives = [
  "Whispering", "Dancing", "Soaring", "Gentle", "Mystic",
  "Radiant", "Serene", "Vibrant", "Cosmic", "Ethereal",
  "Luminous", "Tranquil", "Enchanted", "Harmonious", "Celestial",
  "Dreamy", "Melodic", "Peaceful", "Magical", "Stellar",
  "Wandering", "Floating", "Glowing", "Twinkling", "Breezy",
  "Sparkling", "Misty", "Shimmering", "Drifting", "Gliding",
  "Swaying", "Murmuring", "Rustling", "Swishing", "Sighing",
  "Bubbling", "Gurgling", "Rippling", "Splashing", "Trickling",
  "Humming", "Buzzing", "Chirping", "Singing", "Whistling"
];

const nouns = [
  "Dreamer", "Wanderer", "Explorer", "Seeker", "Traveler",
  "Observer", "Listener", "Thinker", "Creator", "Artist",
  "Poet", "Writer", "Sage", "Mystic", "Visionary",
  "Spirit", "Soul", "Heart", "Mind", "Star",
  "Moon", "Sun", "Cloud", "Wind", "River",
  "Ocean", "Mountain", "Forest", "Garden", "Flower",
  "Tree", "Bird", "Butterfly", "Dragonfly", "Phoenix",
  "Dragon", "Unicorn", "Pegasus", "Griffin", "Angel",
  "Fairy", "Elf", "Dwarf", "Wizard", "Knight",
  "Princess", "Prince", "Queen", "King"
];

// Generate anonymous name using nickname from sessionStorage
export const generateAnonymousName = () => {
  let nickname = "Guest";

  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    nickname = user?.nickname || "Guest";
  } catch (e) {
    console.warn("Could not parse user from sessionStorage, using default nickname.");
  }

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  const hash = nickname
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000;

  return `${adj}${noun}${hash}`;
};

// Validation function
export const isAnonymousName = (name) => {
  const hasAdj = adjectives.some(adj => name.includes(adj));
  const hasNoun = nouns.some(noun => name.includes(noun));
  const endsWithDigits = /\d+$/.test(name);

  return hasAdj && hasNoun && endsWithDigits;
};
