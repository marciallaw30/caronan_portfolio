using UnityEngine;
using MythicGambit.Audio;

namespace MythicGambit.Core
{
    /// <summary>
    /// Governs turn transitions, move counters, and dynamic tension escalation.
    /// </summary>
    public class TurnManager : MonoBehaviour
    {
        public static TurnManager Instance { get; private set; }

        public PieceSide CurrentTurn { get; private set; } = PieceSide.White;
        public int TurnNumber { get; private set; } = 1;

        private void Awake()
        {
            if (Instance != null && Instance != this) Destroy(gameObject);
            else Instance = this;
        }

        public void EndTurn()
        {
            CurrentTurn = (CurrentTurn == PieceSide.White) ? PieceSide.Black : PieceSide.White;
            TurnNumber++;

            Debug.Log($"[TurnManager] Turn {TurnNumber}: Now {CurrentTurn}'s turn.");

            // Escalate dynamic tension as the match progresses
            if (TurnNumber == 6 && AudioManager.Instance != null)
            {
                AudioManager.Instance.SetMatchTension(MatchTensionState.Escalating);
            }
        }
    }
}
