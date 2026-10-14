using UnityEngine;

namespace MythicGambit.Audio
{
    /// <summary>
    /// ScriptableObject defining the bespoke auditory signature for one of the 15 mythical kingdoms.
    /// Captures the cultural and elemental essence described in the Game Design Document.
    /// </summary>
    [CreateAssetMenu(fileName = "NewFactionAudioProfile", menuName = "Mythic Gambit/Audio/Faction Audio Profile")]
    public class FactionAudioProfile : ScriptableObject
    {
        [Header("Kingdom Identity")]
        public string kingdomId;              // e.g., "obsidian_roost", "verdant_court"
        public string kingdomDisplayName;     // e.g., "The Obsidian Roost"
        public string elementalAffinity;      // e.g., "Volcanic Magma", "Primeval Briars"
        
        [TextArea(2, 4)]
        public string auditoryDesignRationale; // Notes from GDD Section X

        [Header("Ambient Soundscape")]
        [Tooltip("Continuous looping atmospheric audio (e.g., magma crackles, forest whispering, church bells)")]
        public AudioClip ambientSoundscapeLoop;

        [Header("Tactical Piece Actions")]
        [Tooltip("Unique footstep or pedestal sound when this faction's unit moves")]
        public AudioClip pieceMoveFoley;
        [Tooltip("Unique attack impact when capturing with this faction")]
        public AudioClip attackClashClip;

        [Header("Cinematic Manifestation")]
        [Tooltip("Orchestral riser playing during the manifestation execution sequence")]
        public AudioClip manifestationRiserClip;
        [Tooltip("Elemental roar or faction war cry during execution")]
        public AudioClip elementalRoarClip;
        [Tooltip("Terrain transformation sound when converting a board tile")]
        public AudioClip terrainTransformClip;

        [Header("Queen's Ultimate")]
        [Tooltip("Full apocalyptic musical and sound effect sequence for the Queen's Ultimate")]
        public AudioClip queenUltimateAudioClip;

        [Header("Audio Mixer Offsets")]
        [Range(-6f, 6f)] public float ambientVolumeTrimDb = 0f;
        [Range(-6f, 6f)] public float sfxVolumeTrimDb = 0f;
    }
}
