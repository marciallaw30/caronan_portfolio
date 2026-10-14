using System.Collections.Generic;
using UnityEngine;
using MythicGambit.Audio;

namespace MythicGambit.Core
{
    [System.Serializable]
    public class CharacterMapping
    {
        public PieceRole role;
        public string characterName;
        public string characterTitle;
        public GameObject piecePrefab;
        public Sprite characterPortrait;
    }

    /// <summary>
    /// Master ScriptableObject representing one of the 15 kingdoms,
    /// linking character models, passive mechanics, terrain types, and audio profiles.
    /// </summary>
    [CreateAssetMenu(fileName = "NewKingdomData", menuName = "Mythic Gambit/Kingdom Data")]
    public class KingdomData : ScriptableObject
    {
        [Header("Kingdom Metadata")]
        public string kingdomId;
        public string kingdomName;
        public string emotionalCatalyst;
        public Color primaryColor = Color.white;
        public Color accentColor = Color.yellow;

        [Header("Gameplay Mutators")]
        public string passiveName;
        [TextArea(2, 4)] public string passiveDescription;
        public string queenUltimateName;
        [TextArea(2, 4)] public string queenUltimateDescription;
        public TerrainType nativeTerrain;

        [Header("Audio Integration")]
        public FactionAudioProfile audioProfile;

        [Header("Real Character Piece Hierarchy (6 Units)")]
        public List<CharacterMapping> characters = new List<CharacterMapping>();
    }
}
