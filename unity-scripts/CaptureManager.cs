using UnityEngine;
using MythicGambit.Audio;

namespace MythicGambit.Core
{
    /// <summary>
    /// Handles piece captures, Manifestation execution triggers, terrain mutations, and combat audio.
    /// </summary>
    public class CaptureManager : MonoBehaviour
    {
        public static CaptureManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this) Destroy(gameObject);
            else Instance = this;
        }

        public void ExecuteCapture(ChessPiece attacker, ChessPiece victim, int targetRow, int targetCol)
        {
            if (attacker == null || victim == null) return;

            Vector3 worldPos = BoardManager.Instance.GetWorldPosition(targetRow, targetCol);

            // 1. Play tactical clash audio
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.PlayCaptureClash(worldPos);
            }

            // 2. Trigger Manifestation combat cinematic
            TriggerManifestation(attacker, victim, targetRow, targetCol, worldPos);

            // 3. Remove captured piece from board
            victim.PlayDeathAnimation();
            Destroy(victim.gameObject, 1.2f);

            // 4. Update board grid position
            BoardManager.Instance.SetPieceAt(attacker.CurrentRow, attacker.CurrentCol, null);
            BoardManager.Instance.SetPieceAt(targetRow, targetCol, attacker);

            // 5. Mutate terrain based on attacker kingdom
            TerrainType terrain = attacker.kingdomId switch
            {
                "obsidian_roost" => TerrainType.VolcanicMagma,
                "verdant_court" => TerrainType.PrimevalBriar,
                _ => TerrainType.Standard
            };
            BoardManager.Instance.MutateTerrain(targetRow, targetCol, terrain);
        }

        private void TriggerManifestation(ChessPiece attacker, ChessPiece victim, int row, int col, Vector3 worldPos)
        {
            Debug.Log($"[Manifestation] {attacker.characterName} ({attacker.kingdomId}) manifests upon capturing {victim.characterName} at ({row}, {col})!");

            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.TriggerManifestationAudio(attacker.kingdomId, worldPos);
            }

            // Check if captured piece was King (Victory condition)
            if (victim.role == PieceRole.King)
            {
                Debug.Log("[Checkmate] Sovereign fallen! Victory achieved.");
                if (AudioManager.Instance != null)
                {
                    AudioManager.Instance.PlayCheckmateImpact();
                    AudioManager.Instance.SetMatchTension(MatchTensionState.Victory);
                }
            }
        }
    }
}
