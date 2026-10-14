using UnityEngine;

namespace MythicGambit.Core
{
    public enum PieceRole { Pawn, Knight, Bishop, Rook, Queen, King }
    public enum PieceSide { White, Black }

    /// <summary>
    /// Represents a real character figurine on the tactical board.
    /// Maps classical chess roles to authentic GDD characters (e.g. Queen -> The Ash Matriarch).
    /// </summary>
    public class ChessPiece : MonoBehaviour
    {
        [Header("Tactical Identity")]
        public PieceRole role;
        public PieceSide side;
        public string kingdomId;          // e.g., "obsidian_roost", "verdant_court"
        public string characterName;      // e.g., "The Ash Matriarch"
        public string characterTitle;     // e.g., "Obsidian Sovereign"

        [Header("Board Coordinates")]
        public int CurrentRow;
        public int CurrentCol;
        public bool HasMoved = false;

        [Header("Visual Model & Animations")]
        [SerializeField] private Animator animator;
        [SerializeField] private GameObject manifestationFxPrefab;

        public void PlayMoveAnimation()
        {
            if (animator != null) animator.SetTrigger("Move");
        }

        public void PlayAttackAnimation()
        {
            if (animator != null) animator.SetTrigger("Attack");
        }

        public void PlayDeathAnimation()
        {
            if (animator != null) animator.SetTrigger("Death");
        }
    }
}
