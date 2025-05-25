import Forest from "../../../assets/forest.png";
import Ocean from "../../../assets/water.png";
import Black from "../../../assets/black-n.png";
import CalmOcean from "../../../assets/calm-ocean-n.png";
import NightSky from "../../../assets/night-sky-n.png";
import EnergeticYellow from "../../../assets/energetic-yellow-n.png";
import CozyRoom from "../../../assets/cozy-room-e.png";
import CountrySide from "../../../assets/country-side-e.png";
import MagicalRoom from "../../../assets/magical-room-e.png";
import NothernLights from "../../../assets/nothern-lights-e.png";
import PostApocalyptic from "../../../assets/post-apocalyptic-e.png";
import SpaceObserve from "../../../assets/space-observe-e.png";
import WinterCabin from "../../../assets/winter-cabin-e.png";

//seasonal
import Christmas from "../../../assets/christmas.png";

// Example concept pack images - replace with your actual image paths
import ConceptImage1 from "../../../assets/concept_sheep.png";
import ConceptImage2 from "../../../assets/concept_sheep1.png";
import ConceptImage3 from "../../../assets/concept_sheep2.png";

// Mail theme preview image
import ElfMailPreview from "../../../assets/elf.png";
import WifeMailPreview from "../../../assets/wifu.png";

export const shopItems = [
  // New Mail Themes
  {
    id: "mailtheme_elf_from_elbaf",
    name: "Elf From Elbaf Mail Theme",
    price: 450,
    image: ElfMailPreview,
    category: "mailtheme",
    featured: "New",
    featuredStyle: "feature-card",
    isEmoji: false,
    previewClass: "elf-theme-preview",
    previewHtml: `
  <div style="
  background-image: url('${ElfMailPreview}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 2rem;
  color: white;
  font-family: 'Merriweather', 'Cinzel', serif;
  min-height: 400px;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.3);
  background-blend-mode: overlay;
">
  <p>Ara~ did the stars guide you back to me again, wanderer? <br /></p>
  <p>Elaniel, an elf of Elbaf's twilight groves, whispers with the stars and walks where moonlight lingers. 🌙</p>
  <p><br />~ Elaniel Moonshade</p>
</div>

`,
  },
  {
    id: "mailtheme_wifu",
    name: "Rexona",

    price: 450,
    image: WifeMailPreview,
    category: "mailtheme",
    featured: "New",
    featuredStyle: "feature-card",
    isEmoji: false,
    previewClass: "waifu-theme-preview",
    previewHtml: `
  <div style="
  background-image: url('${WifeMailPreview}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 2rem;
  color: white;
  font-family: 'Merriweather', 'Cinzel', serif;
  min-height: 400px;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.3);
  background-blend-mode: overlay;
">
  <p>~Hi, my darling senpai! 💖</p>
  <p>Rexona, your sweet and sparkly wifu from the pastel realms, dreams of mochi dates and cozy cuddles under sakura trees. 🌸</p>
  <p><br />~ Rexona</p>
</div>

  `,
  },
  // New Concept Packs
  {
    id: "concept_pack_maple_woolly",
    name: "Maple & Woolly's Little Journey",
    description: "Set of 3 Illustrated Scenes",
    story:
      "Maple wasn't a hero. Just a little wanderer with a big hat, a woolly friend, and a map full of dreams.\nEvery morning, they picked a new direction. Some led to glowing caves where stars whispered.\nOthers to towering mountains bathed in peachy skies.\nAnd sometimes they just rested beneath cherry blossoms and scribbled in journals, not chasing anything at all.\nBecause to them, the best journeys weren't about reaching anywhere—they were about wandering together.",
    price: 450,
    category: "conceptpack",
    featured: "New",
    featuredStyle: "feature-card",
    conceptImages: [
      {
        id: "maple_wolly_toward_the_peaks",
        image: ConceptImage1,
        name: "Toward the Peaks",
        description: "Part of the Maple & Woolly's Little Journey",
        parentPack: "concept_pack_maple_woolly",
      },
      {
        id: "maple_wolly_glowpath_wanderers",
        image: ConceptImage2,
        name: "Glowpath Wanderers",
        description: "Part of the Maple & Woolly's Little Journey",
        parentPack: "concept_pack_maple_woolly",
      },
      {
        id: "maple_wolly_dragons_lair",
        image: ConceptImage3,
        name: "Dragon's Lair",
        description: "Part of the Maple & Woolly's Little Journey",
        parentPack: "concept_pack_maple_woolly",
      },
    ],
  },

  // Original shop items
  {
    id: "theme_christmas",
    name: "Christmas",
    description: "Celebrate the holidays with a festive theme",
    price: 0,
    image: Christmas,
    category: "theme",
    featured: "Seasonal 2025",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_cozy_room",
    name: "Cozy Room",
    description: "Relax and unwind in a cozy room",
    price: 100,
    image: CozyRoom,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_country_side",
    name: "Country Side",
    description: "Immerse yourself in a picturesque country side",
    price: 100,
    image: CountrySide,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_magical_room",
    name: "Magical Room",
    description: "Enter a world of enchantment and magic",
    price: 100,
    image: MagicalRoom,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_nothern_lights",
    name: "Northern Lights",
    description: "Immerse yourself in the mesmerizing northern lights",
    price: 100,
    image: NothernLights,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_post_apocalyptic",
    name: "Post-Apocalyptic",
    description: "Enter a world of dystopia and apocalypse",
    price: 100,
    image: PostApocalyptic,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_space_observe",
    name: "Space Observe",
    description: "Immerse yourself in the vastness of space",
    price: 100,
    image: SpaceObserve,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_winter_cabin",
    name: "Winter Cabin",
    description: "Relax and unwind in a cozy winter cabin",
    price: 100,
    image: WinterCabin,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_forest",
    name: "Forest Theme",
    description: "Transform your journal with serene forest visuals",
    price: 100,
    image: Forest,
    category: "theme",
    featured: "Exclusive",
    featuredStyle: "feature-card",
    isEmoji: false,
  },
  {
    id: "theme_ocean",
    name: "Ocean Theme",
    description: "Immerse yourself in tranquil ocean waves",
    price: 50,
    image: Ocean,
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_black",
    name: "Black Theme",
    description: "Enter a world of darkness and intrigue",
    price: 50,
    image: Black,
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_calm_ocean",
    name: "Calm Ocean Theme",
    description: "Relax and unwind in a serene coastal haven",
    price: 50,
    image: CalmOcean,
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_night_sky",
    name: "Night Sky Theme",
    description: "Immerse yourself in a mesmerizing night sky",
    price: 50,
    image: NightSky,
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_energetic_yellow",
    name: "Energetic Yellow Theme",
    description: "Immerse yourself in a vibrant and energetic yellow theme",
    price: 50,
    image: EnergeticYellow,
    category: "theme",
    isEmoji: false,
  },
  {
    id: "theme_solid_pink",
    name: "Dusty Rose",
    description: "A warm and muted pink theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#4A3A3A",
    gradient: "radial-gradient(circle at center, #b06d86, #4a3a3a)",
  },
  {
    id: "theme_solid_blue",
    name: "Deep Indigo",
    description: "A calming deep indigo theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#2E2B4F",
    gradient: "radial-gradient(circle at center, #47487a, #2e2b4f)",
  },
  {
    id: "theme_solid_green",
    name: "Moss Green",
    description: "A soothing moss green theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#1F2924",
    gradient: "radial-gradient(circle at center, #416b5b, #1f2924)",
  },
  {
    id: "theme_solid_lavender",
    name: "Twilight Lavender",
    description: "A deep lavender-gray theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#3F3A4A",
    gradient: "radial-gradient(circle at center, #796687, #3f3a4a)",
  },
  {
    id: "theme_solid_peach",
    name: "Burnt Peach",
    description: "A cozy burnt peach theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#4F3D32",
    gradient: "radial-gradient(circle at center, #a76d50, #4f3d32)",
  },
  {
    id: "theme_solid_yellow",
    name: "Golden Ember",
    description: "A warm golden ember theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#4A3F2A",
    gradient: "radial-gradient(circle at center, #b08b3f, #4a3f2a)",
  },
  {
    id: "theme_solid_coral",
    name: "Muted Coral",
    description: "A toned-down coral theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#543737",
    gradient: "radial-gradient(circle at center, #a7544c, #543737)",
  },
  {
    id: "theme_solid_lilac",
    name: "Vintage Lilac",
    description: "A muted lilac-gray theme for your journal",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#4B3C4C",
    gradient: "radial-gradient(circle at center, #8c688e, #4b3c4c)",
  },
  {
    id: "theme_solid_aqua",
    name: "Ashen Aqua",
    description: "A deep aqua theme with ashen tones",
    price: 10,
    image: null,
    category: "theme",
    isEmoji: false,
    color: "#2F3E3F",
    gradient: "radial-gradient(circle at center, #4e767b, #2f3e3f)",
  },
];
