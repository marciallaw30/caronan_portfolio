import React, { useState } from 'react';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';

// 1. Mythic Gambit Game Dev 15 Kingdoms Dataset (Clickable with authentic GDD Lore & Mechanics)
const gameDevKingdomsData: GalleryItem[] = [
  {
    id: 'obsidian',
    common: 'The Obsidian Roost',
    binomial: 'Ignis Draconis • Volcanic Roost',
    photo: {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      text: 'Molten magma landscape and volcanic fires',
      pos: '50% 50%',
      by: 'Unsplash / Dan Meyers'
    },
    details: {
      element: 'Fire & Draconic',
      icon: '🔥',
      catalyst: 'Wrath & Territorial Ferocity',
      hierarchy: 'King: The Eternal Drake | Queen: The Ash Matriarch | Bishop: Cinder Cleric | Knight: Flame-Winged Vanguard | Rook: Magma Bastion | Pawn: Scaled Hatchling',
      passive: 'Heat Haze: Volcanic terrain emits thermal distortions reducing enemy ranged accuracy by 25% on claimed tiles.',
      ultimate: 'Lava Torrent: The Ash Matriarch ruptures the planar board, showering opposing squares in catastrophic volcanic lava.'
    }
  },
  {
    id: 'verdant',
    common: 'The Verdant Court',
    binomial: 'Sylva Aeterna • Ancient Forest',
    photo: {
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
      text: 'Deep ancient mystical mossy forest canopy',
      pos: '50% 40%',
      by: 'Unsplash / Sebastian Unrau'
    },
    details: {
      element: 'Nature & Enchantment',
      icon: '🌿',
      catalyst: 'Harmony & Protective Resentment',
      hierarchy: 'King: The Elder Dryad | Queen: The Forest Matriarch | Bishop: Thorn Warden | Knight: Stag-Rider | Rook: Ancient Treant | Pawn: Sproutling',
      passive: 'Root-Bound: Units landing on Verdant tiles sprout thorny briars restricting enemy mobility on subsequent turns.',
      ultimate: 'Thorn Surge: Primeval roots erupt across the entire 8x8 grid, entangling all hostile remnants.'
    }
  },
  {
    id: 'iron-anvil',
    common: 'The Iron-Anvil Forge',
    binomial: 'Ferrum Subterranea • Smelting Halls',
    photo: {
      url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      text: 'Subterranean molten foundry and industrial forge',
      pos: '50% 60%',
      by: 'Unsplash / Ant Rozetsky'
    },
    details: {
      element: 'Earth & Industrial Metallurgy',
      icon: '⚒️',
      catalyst: 'Pride & Unyielding Stubbornness',
      hierarchy: 'King: High Forge-Master | Queen: Mistress of Smelting | Bishop: Runic Smith | Knight: Armored Boar-Rider | Rook: Iron Spire | Pawn: Foundry Apprentice',
      passive: 'Reinforced Plate: Friendly pieces on Forge terrain gain temporary capture immunity on initial frontline clash.',
      ultimate: 'Geothermal Overload: Unleashes pressurized volcanic geothermal steam across opposing files, melting hostile defenses.'
    }
  },
  {
    id: 'abyssal-tides',
    common: 'The Abyssal Tides',
    binomial: 'Pelagius Profundus • Trench Mariana',
    photo: {
      url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80',
      text: 'Deep bioluminescent oceanic oceanic abyss',
      pos: '50% 45%',
      by: 'Unsplash / Jeremy Bishop'
    },
    details: {
      element: 'Water & Bioluminescence',
      icon: '🌊',
      catalyst: 'Isolation & Mourning',
      hierarchy: 'King: Abyssal Monarch | Queen: Leviathan Matriarch | Bishop: Trench Oracle | Knight: Deep-Sea Manta | Rook: Coral Fortress | Pawn: Nautiloid',
      passive: 'Tidal Flow: Pieces moving across flooded tiles gain +1 diagonal movement extension over watery boundaries.',
      ultimate: 'Crushing Deluge: Summons a towering tidal tsunami that swallows the opposing side of the planar board.'
    }
  },
  {
    id: 'frostbound',
    common: 'The Frostbound Reach',
    binomial: 'Glacies Mortalis • Permafrost Glaciers',
    photo: {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      text: 'Jagged glacial mountain peak under snowstorm',
      pos: '50% 30%',
      by: 'Unsplash / Kalen Emsley'
    },
    details: {
      element: 'Ice & Permafrost',
      icon: '❄️',
      catalyst: 'Cold Vengeance & Stoicism',
      hierarchy: 'King: Glacial Sovereign | Queen: Frost Matriarch | Bishop: Shard Weaver | Knight: Ice-Fang Wolf | Rook: Spire of Rime | Pawn: Snow Strider',
      passive: 'Permafrost: Enemy pieces stepping onto Glacial terrain lose 1 movement turn due to freezing crystallizations.',
      ultimate: 'Glacial Stasis: Encapsulates the entire battlefield in crystalline permafrost, shattering enemy pieces into ice shards.'
    }
  },
  {
    id: 'fulminating',
    common: 'The Fulminating Spire',
    binomial: 'Tempestas Fulgur • Sky Spire',
    photo: {
      url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1200&q=80',
      text: 'Cataclysmic lightning strikes lighting the storm clouds',
      pos: '50% 50%',
      by: 'Unsplash / Raychel Sanner'
    },
    details: {
      element: 'Lightning & Storm Energy',
      icon: '⚡',
      catalyst: 'Hyperactive Impatience & Ambition',
      hierarchy: 'King: Thunder Lord | Queen: Storm Matriarch | Bishop: Volt Magus | Knight: Lightning Stallion | Rook: Dynamo Pillar | Pawn: Spark Thrall',
      passive: 'Static Charge: Capturing a unit discharges a chain-lightning arc that debuffs adjacent opposing squares.',
      ultimate: 'Thunderstorm: Calls down cataclysmic atmospheric lightning bolts simultaneously across all 64 planar coordinates.'
    }
  },
  {
    id: 'gossamer',
    common: 'The Gossamer Glade',
    binomial: 'Faeria Illusio • Enchanted Hollow',
    photo: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      text: 'Ethereal glowing fairy glade in the twilight woods',
      pos: '50% 40%',
      by: 'Unsplash / JR Korpa'
    },
    details: {
      element: 'Fairy & Illusions',
      icon: '✨',
      catalyst: 'Mischief & Escapism',
      hierarchy: "King: Fae Sovereign | Queen: Glimmer Empress | Bishop: Mirage Seer | Knight: Dragonfly Rider | Rook: Will-o'-Wisp | Pawn: Sprite",
      passive: 'Glimmer Decoys: 30% chance for incoming tactical attacks to target a lingering optical fae illusion.',
      ultimate: 'Fae Trap: Distorts planar space-time, scattering enemy pieces into an ethereal labyrinth of illusions.'
    }
  },
  {
    id: 'titan',
    common: "The Titan's Foothold",
    binomial: 'Tectonica Monolith • Granite Peak',
    photo: {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      text: 'Towering granite canyon monolith and cliffs',
      pos: '50% 45%',
      by: 'Unsplash / Kalen Emsley'
    },
    details: {
      element: 'Tectonic & Mountain',
      icon: '🏔️',
      catalyst: 'Steadfast Resignation',
      hierarchy: 'King: Granite Monarch | Queen: Tectonic Matriarch | Bishop: Stone Chanter | Knight: Boulder Charger | Rook: Monolith | Pawn: Pebble Thrall',
      passive: 'Seismic Anchor: Friendly pieces on Tectonic tiles cannot be displaced or force-moved by enemy passives.',
      ultimate: 'Earth Cleave: Splits the 8x8 grid along fault lines, swallowing opposing backlines into the mantle.'
    }
  },
  {
    id: 'iron-tusk',
    common: 'The Iron-Tusk Horde',
    binomial: 'Orcus Bellum • War Camps',
    photo: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      text: 'Warrior torches and primal warfare encampment',
      pos: '50% 50%',
      by: 'Unsplash / Henry Hustava'
    },
    details: {
      element: 'Orcish Warfare & Brutality',
      icon: '🪓',
      catalyst: 'Conquest & Bloodlust',
      hierarchy: 'King: Warlord Supreme | Queen: War-Clan Matriarch | Bishop: Blood Shaman | Knight: Tusker Charger | Rook: Siege Tower | Pawn: Grunt',
      passive: 'Bloodrush: Moving into enemy territory grants aggressive tactical bonuses for consecutive pawn advances.',
      ultimate: 'Rampage: The War-Clan Matriarch summons a thundering stampede of war beasts flattening the opposition.'
    }
  },
  {
    id: 'sanguine',
    common: 'The Sanguine Court',
    binomial: 'Sanguis Nocturna • Gothic Citadel',
    photo: {
      url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80',
      text: 'Dark gothic castle spires silhouetted against crimson moon',
      pos: '50% 35%',
      by: 'Unsplash / David Menidrey'
    },
    details: {
      element: 'Vampiric & Blood Magic',
      icon: '🩸',
      catalyst: 'Decadence & Existential Dread',
      hierarchy: 'King: Sanguine Monarch | Queen: Blood Countess | Bishop: Crimson Priest | Knight: Night-Wing Charger | Rook: Mausoleum | Pawn: Thrall',
      passive: 'Life Siphon: Capturing an enemy unit restores a fallen friendly pawn onto an unoccupied friendly baseline file.',
      ultimate: 'Crimson Eclipse: Turns the battlefield sky blood-red, draining vital essence from every opposing unit.'
    }
  },
  {
    id: 'howling',
    common: 'The Howling Pack',
    binomial: 'Lupus Lunaris • Highland Crags',
    photo: {
      url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      text: 'Wild alpha predator roaming the highland mist',
      pos: '50% 40%',
      by: 'Unsplash / Clément Roy'
    },
    details: {
      element: 'Werewolf & Lunar Primal',
      icon: '🐺',
      catalyst: 'Ferity & Pack Loyalty',
      hierarchy: 'King: Alpha Sovereign | Queen: Lunar Matriarch | Bishop: Pack Shaman | Knight: Moon Stalker | Rook: Den Rock | Pawn: Wolfkin',
      passive: 'Moonlight Scent: Friendly pieces gain cooperative flank bonuses when attacking within 2 squares of the Queen.',
      ultimate: 'Spectral Tear: Summons a spectral lunar wolf pack that pounces across every open diagonal file.'
    }
  },
  {
    id: 'abyssal-veil',
    common: 'The Abyssal Veil',
    binomial: 'Void Umbra • Event Horizon',
    photo: {
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      text: 'Deep cosmic void and swirling dark nebula',
      pos: '50% 50%',
      by: 'Unsplash / Jeremy Thomas'
    },
    details: {
      element: 'Void & Shadows',
      icon: '🌑',
      catalyst: 'Emptiness & Bitterness',
      hierarchy: 'King: Void King | Queen: Shadow Queen | Bishop: Void Mage | Knight: Shadow Stalker | Rook: Void Pillar | Pawn: Shade',
      passive: 'Shadow Walk: Once per match, a Shadow piece may swap positions with any friendly unit across infinite distance.',
      ultimate: 'The Vortex: Dissolves the planar board into a swirling black hole pulling all remaining enemy pieces into nothingness.'
    }
  },
  {
    id: 'gearwork',
    common: 'The Gearwork Citadel',
    binomial: 'Mechanica Aeterna • Brass City',
    photo: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      text: 'Intricate golden clockwork gears and steampunk tech',
      pos: '50% 50%',
      by: 'Unsplash / Alexandre Debiève'
    },
    details: {
      element: 'Clockwork & Steam Tech',
      icon: '⚙️',
      catalyst: 'Obsessive Perfectionism',
      hierarchy: 'King: Grand Inventor | Queen: Gear Matriarch | Bishop: Aether-Smith | Knight: Clockwork Steed | Rook: Steam Engine | Pawn: Automaton',
      passive: 'Overclock: Friendly units adjacent to Clockwork pieces gain +1 maximum movement distance on mechanical tiles.',
      ultimate: 'The Clockwork Mechanism: Retracts tiles into a colossal spinning brass clock-machine that grinds the board to dust.'
    }
  },
  {
    id: 'sun-scorched',
    common: 'The Sun-Scorched Sands',
    binomial: 'Harena Solis • Endless Dunes',
    photo: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      text: 'Golden desert sand dunes curving under blazing sun',
      pos: '50% 50%',
      by: 'Unsplash / Moaz Tobok'
    },
    details: {
      element: 'Desert Heat & Mirages',
      icon: '🏜️',
      catalyst: 'Endurance & Sorrow',
      hierarchy: 'King: Sultan of Sand | Queen: Sand Matriarch | Bishop: Dune Mage | Knight: Dune Strider | Rook: Oasis Gate | Pawn: Nomad',
      passive: 'Mirage Veil: Units targeted by long-range attacks have a 50% chance of evading as a shimmering mirage.',
      ultimate: 'Colossal Sandstorm: Engulfs the entire board beneath thousands of tons of suffocating shifting dunes.'
    }
  },
  {
    id: 'grave-bound',
    common: 'The Grave-Bound Dynasty',
    binomial: 'Necropolis Antiqua • Crypt of Souls',
    photo: {
      url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80',
      text: 'Ancient shadowy catacombs and spectral glow',
      pos: '50% 45%',
      by: 'Unsplash / David Menidrey'
    },
    details: {
      element: 'Necromancy & Souls',
      icon: '💀',
      catalyst: 'Cold Acceptance & Remorse',
      hierarchy: 'King: The Lich Lord | Queen: The Death Matriarch | Bishop: The Soul-Weaver | Knight: Skeletal Charger | Rook: Crypt Guardian | Pawn: Risen Thrall',
      passive: 'Soul Binding: Captured pieces leave a Soul Well for 2 turns; moving onto it grants Spectral Protection.',
      ultimate: 'Subterranean Abyss: Splits the earth, summoning thousands of skeletal arms dragging remaining pieces down.'
    }
  }
];

// 2. Original Animal Gallery Dataset (Preserved for compatibility)
const animalGalleryData: GalleryItem[] = [
  {
    common: 'Lion',
    binomial: 'Panthera leo',
    photo: {
      url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      text: 'lion couple resting peacefully on a brown rock',
      pos: '47% 35%',
      by: 'Clément Roy'
    }
  },
  {
    common: 'Asiatic elephant',
    binomial: 'Elephas maximus',
    photo: {
      url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
      text: 'herd of Sri Lankan elephants walking away from a river',
      pos: '75% 65%',
      by: 'Alex Azabache'
    }
  },
  {
    common: 'Red-tailed black cockatoo',
    binomial: 'Calyptorhynchus banksii',
    photo: {
      url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
      text: 'close-up of a exotic black cockatoo',
      pos: '53% 43%',
      by: 'David Clode'
    }
  },
  {
    common: 'Dromedary',
    binomial: 'Camelus dromedarius',
    photo: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      text: 'camel and newborn calf traversing the Sahara desert',
      pos: '65% 65%',
      by: 'Moaz Tobok'
    }
  },
  {
    common: 'Polar bear',
    binomial: 'Ursus maritimus',
    photo: {
      url: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1200&q=80',
      text: 'polar bear traversing Arctic sea ice',
      pos: '50% 25%',
      by: 'Hans-Jurgen Mager'
    }
  },
  {
    common: 'Giant panda',
    binomial: 'Ailuropoda melanoleuca',
    photo: {
      url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1200&q=80',
      text: 'giant panda feeding on bamboo branches',
      pos: '47%',
      by: 'Jiachen Lin'
    }
  },
  {
    common: "Grévy's zebra",
    binomial: 'Equus grevyi',
    photo: {
      url: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?auto=format&fit=crop&w=1200&q=80',
      text: 'zebra standing in the golden field looking at camera',
      pos: '65% 35%',
      by: 'Jeff Griffith'
    }
  },
  {
    common: 'Cheetah',
    binomial: 'Acinonyx jubatus',
    photo: {
      url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=80',
      text: 'cheetah attentive in the savanna grass',
      by: 'Mike Bird'
    }
  },
  {
    common: 'King penguin',
    binomial: 'Aptenodytes patagonicus',
    photo: {
      url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1200&q=80',
      text: 'king penguin with fluffy brown chick',
      pos: '35%',
      by: 'Martin Wettstein'
    }
  },
  {
    common: 'Red panda',
    binomial: 'Ailurus fulgens',
    photo: {
      url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1200&q=80',
      text: 'red panda climbing mossy tree branches',
      by: 'Niels Baars'
    }
  }
];

const CircularGalleryDemo = () => {
  const [activeDataset, setActiveDataset] = useState<'kingdoms' | 'animals'>('kingdoms');
  const [selectedKingdom, setSelectedKingdom] = useState<GalleryItem | null>(null);
  const [radius, setRadius] = useState<number>(680);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState<number>(0.025);

  const currentItems = activeDataset === 'kingdoms' ? gameDevKingdomsData : animalGalleryData;

  const handleCardClick = (item: GalleryItem) => {
    setSelectedKingdom(item);
  };

  return (
    <div className="w-full bg-background text-foreground" style={{ height: '400vh' }}>
      {/* Sticky 3D Viewport centered on screen */}
      <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        
        {/* Top Header & Interactive Dataset Switcher */}
        <div className="text-center absolute top-6 z-20 px-4 max-w-4xl w-full">
          <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SHADCN 3D CIRCULAR COMPONENT
            </span>
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              CLICK CARDS FOR DETAILS
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {activeDataset === 'kingdoms' ? 'The 15 Mythical Kingdoms' : 'Fauna & Wildlife Gallery'}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1 max-w-2xl mx-auto">
            {activeDataset === 'kingdoms'
              ? 'Tactical 3D cylindrical gallery for Mythic Gambit GDD. Scroll or drag to rotate — click any card to inspect piece hierarchy, passive traits, and Queen Ultimates.'
              : 'Scroll to rotate the cylindrical gallery. Features auto-rotation and interactive depth perspective.'}
          </p>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <div className="bg-slate-900/80 border border-slate-700/60 p-1 rounded-full flex gap-1">
              <button
                type="button"
                onClick={() => setActiveDataset('kingdoms')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeDataset === 'kingdoms'
                    ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏰 Mythic Gambit (15 Kingdoms)
              </button>
              <button
                type="button"
                onClick={() => setActiveDataset('animals')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeDataset === 'animals'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🦁 Animal Gallery
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAutoRotateSpeed(prev => (prev === 0 ? 0.025 : 0))}
              className="px-3 py-1.5 rounded-full text-xs font-mono bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 transition"
            >
              {autoRotateSpeed === 0 ? '▶ Resume Auto-Rotate' : '⏸ Pause Rotation'}
            </button>
          </div>
        </div>

        {/* The 3D Cylindrical Gallery Engine */}
        <div className="w-full h-full pt-20">
          <CircularGallery
            items={currentItems}
            radius={radius}
            autoRotateSpeed={autoRotateSpeed}
            onItemClick={handleCardClick}
          />
        </div>

        {/* Bottom Instruction Pill */}
        <div className="absolute bottom-6 z-20 pointer-events-none text-center">
          <div className="px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-2xl backdrop-blur-md">
            🖱️ Scroll page down/up to spin • Click any card for Kingdom Lore &amp; Hierarchy
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal Dialog for Clicked Kingdom */}
      {selectedKingdom && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedKingdom(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {selectedKingdom.details?.icon || '🏰'}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedKingdom.common}
                  </h3>
                  <p className="text-xs font-mono text-purple-300">
                    {selectedKingdom.binomial} • {selectedKingdom.details?.element || 'Civilization'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKingdom(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Kingdom Banner Image */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 border border-slate-800">
              <img
                src={selectedKingdom.photo.url}
                alt={selectedKingdom.common}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              {selectedKingdom.details?.catalyst && (
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-sm">
                  ❤️ Catalyst: {selectedKingdom.details.catalyst}
                </div>
              )}
            </div>

            {/* Content Details */}
            {selectedKingdom.details ? (
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                    👑 Piece Hierarchy &amp; Thematic Unit Archetypes
                  </span>
                  <p className="text-slate-200 text-xs font-mono leading-relaxed">
                    {selectedKingdom.details.hierarchy}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                    🛡️ Passive Terrain Trait
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedKingdom.details.passive}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-amber-500/30">
                  <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider block mb-1">
                    ⚡ Queen Signature Ultimate Execution
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedKingdom.details.ultimate}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-300">
                <p>{selectedKingdom.photo.text}</p>
                <p className="mt-2 text-xs text-slate-400">Photo credit: {selectedKingdom.photo.by}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedKingdom(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition"
              >
                Close Codex
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircularGalleryDemo;
