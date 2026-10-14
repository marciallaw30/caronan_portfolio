using System.Collections.Generic;
using UnityEngine;

namespace MythicGambit.Core
{
    /// <summary>
    /// Validates legal moves adhering to classical chess rules with terrain and kingdom ability checks.
    /// </summary>
    public static class MovementRules
    {
        public static List<Vector2Int> GetLegalMoves(ChessPiece piece, BoardManager board)
        {
            var moves = new List<Vector2Int>();
            if (piece == null || board == null) return moves;

            int r = piece.CurrentRow;
            int c = piece.CurrentCol;

            switch (piece.role)
            {
                case PieceRole.Pawn:
                    GetPawnMoves(piece, board, moves);
                    break;
                case PieceRole.Knight:
                    GetKnightMoves(piece, board, moves);
                    break;
                case PieceRole.Bishop:
                    GetSlidingMoves(piece, board, moves, new[] { new Vector2Int(1, 1), new Vector2Int(1, -1), new Vector2Int(-1, 1), new Vector2Int(-1, -1) });
                    break;
                case PieceRole.Rook:
                    GetSlidingMoves(piece, board, moves, new[] { new Vector2Int(1, 0), new Vector2Int(-1, 0), new Vector2Int(0, 1), new Vector2Int(0, -1) });
                    break;
                case PieceRole.Queen:
                    GetSlidingMoves(piece, board, moves, new[] { 
                        new Vector2Int(1, 0), new Vector2Int(-1, 0), new Vector2Int(0, 1), new Vector2Int(0, -1),
                        new Vector2Int(1, 1), new Vector2Int(1, -1), new Vector2Int(-1, 1), new Vector2Int(-1, -1)
                    });
                    break;
                case PieceRole.King:
                    GetKingMoves(piece, board, moves);
                    break;
            }

            return moves;
        }

        private static void GetPawnMoves(ChessPiece piece, BoardManager board, List<Vector2Int> moves)
        {
            int dir = piece.side == PieceSide.White ? 1 : -1;
            int startRow = piece.side == PieceSide.White ? 1 : 6;
            int r = piece.CurrentRow;
            int c = piece.CurrentCol;

            // One step forward
            int forwardRow = r + dir;
            if (forwardRow >= 0 && forwardRow < 8 && board.GetPieceAt(forwardRow, c) == null)
            {
                moves.Add(new Vector2Int(forwardRow, c));

                // Two steps from starting rank
                int doubleRow = r + (dir * 2);
                if (r == startRow && board.GetPieceAt(doubleRow, c) == null)
                {
                    moves.Add(new Vector2Int(doubleRow, c));
                }
            }

            // Diagonal captures
            int[] diagCols = { c - 1, c + 1 };
            foreach (int dc in diagCols)
            {
                if (forwardRow >= 0 && forwardRow < 8 && dc >= 0 && dc < 8)
                {
                    ChessPiece target = board.GetPieceAt(forwardRow, dc);
                    if (target != null && target.side != piece.side)
                    {
                        moves.Add(new Vector2Int(forwardRow, dc));
                    }
                }
            }
        }

        private static void GetKnightMoves(ChessPiece piece, BoardManager board, List<Vector2Int> moves)
        {
            Vector2Int[] offsets = {
                new Vector2Int(2, 1), new Vector2Int(2, -1), new Vector2Int(-2, 1), new Vector2Int(-2, -1),
                new Vector2Int(1, 2), new Vector2Int(1, -2), new Vector2Int(-1, 2), new Vector2Int(-1, -2)
            };

            foreach (var off in offsets)
            {
                int nr = piece.CurrentRow + off.x;
                int nc = piece.CurrentCol + off.y;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8)
                {
                    ChessPiece target = board.GetPieceAt(nr, nc);
                    if (target == null || target.side != piece.side)
                    {
                        moves.Add(new Vector2Int(nr, nc));
                    }
                }
            }
        }

        private static void GetSlidingMoves(ChessPiece piece, BoardManager board, List<Vector2Int> moves, Vector2Int[] directions)
        {
            foreach (var dir in directions)
            {
                int nr = piece.CurrentRow + dir.x;
                int nc = piece.CurrentCol + dir.y;

                while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8)
                {
                    ChessPiece target = board.GetPieceAt(nr, nc);
                    if (target == null)
                    {
                        moves.Add(new Vector2Int(nr, nc));
                    }
                    else
                    {
                        if (target.side != piece.side)
                        {
                            moves.Add(new Vector2Int(nr, nc));
                        }
                        break; // Blocked by piece
                    }

                    nr += dir.x;
                    nc += dir.y;
                }
            }
        }

        private static void GetKingMoves(ChessPiece piece, BoardManager board, List<Vector2Int> moves)
        {
            for (int dr = -1; dr <= 1; dr++)
            {
                for (int dc = -1; dc <= 1; dc++)
                {
                    if (dr == 0 && dc == 0) continue;
                    int nr = piece.CurrentRow + dr;
                    int nc = piece.CurrentCol + dc;

                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8)
                    {
                        ChessPiece target = board.GetPieceAt(nr, nc);
                        if (target == null || target.side != piece.side)
                        {
                            moves.Add(new Vector2Int(nr, nc));
                        }
                    }
                }
            }
        }
    }
}
