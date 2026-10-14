using System.Collections.Generic;
using UnityEngine;
using MythicGambit.Audio;

namespace MythicGambit.Core
{
    public enum TerrainType
    {
        Standard,
        VolcanicMagma,     // Obsidian Roost
        PrimevalBriar,     // Verdant Court
        FrozenTundra,      // Frostbound Reach
        ChargedGround,     // Fulminating Spire
        VoidRift           // Abyssal Veil
    }

    /// <summary>
    /// Manages the 8x8 3D tactical grid, tile states, dynamic terrain conversions, and piece positions.
    /// </summary>
    public class BoardManager : MonoBehaviour
    {
        public static BoardManager Instance { get; private set; }

        public const int BoardSize = 8;

        [Header("Board Configuration")]
        [SerializeField] private GameObject tilePrefab;
        [SerializeField] private float tileSize = 1.2f;
        [SerializeField] private Material lightTileMat;
        [SerializeField] private Material darkTileMat;
        [SerializeField] private Material volcanicTileMat;
        [SerializeField] private Material verdantTileMat;

        [Header("Runtime State")]
        private GameObject[,] tileGrid = new GameObject[BoardSize, BoardSize];
        private ChessPiece[,] pieceGrid = new ChessPiece[BoardSize, BoardSize];
        private TerrainType[,] terrainGrid = new TerrainType[BoardSize, BoardSize];

        private void Awake()
        {
            if (Instance != null && Instance != this) Destroy(gameObject);
            else Instance = this;
        }

        private void Start()
        {
            GenerateBoard();
        }

        public void GenerateBoard()
        {
            for (int r = 0; r < BoardSize; r++)
            {
                for (int c = 0; c < BoardSize; c++)
                {
                    Vector3 worldPos = GetWorldPosition(r, c);
                    GameObject tile = Instantiate(tilePrefab, worldPos, Quaternion.identity, transform);
                    tile.name = $"Tile_{r}_{c}";

                    bool isLight = (r + c) % 2 == 0;
                    Renderer rend = tile.GetComponent<Renderer>();
                    if (rend != null)
                    {
                        rend.material = isLight ? lightTileMat : darkTileMat;
                    }

                    tileGrid[r, c] = tile;
                    terrainGrid[r, c] = TerrainType.Standard;
                }
            }
        }

        public Vector3 GetWorldPosition(int row, int col)
        {
            float offset = (BoardSize - 1) * 0.5f;
            return new Vector3((col - offset) * tileSize, 0f, (row - offset) * tileSize);
        }

        public ChessPiece GetPieceAt(int row, int col)
        {
            if (row < 0 || row >= BoardSize || col < 0 || col >= BoardSize) return null;
            return pieceGrid[row, col];
        }

        public void SetPieceAt(int row, int col, ChessPiece piece)
        {
            pieceGrid[row, col] = piece;
            if (piece != null)
            {
                piece.CurrentRow = row;
                piece.CurrentCol = col;
            }
        }

        public void MutateTerrain(int row, int col, TerrainType newTerrain)
        {
            if (row < 0 || row >= BoardSize || col < 0 || col >= BoardSize) return;

            terrainGrid[row, col] = newTerrain;
            Renderer rend = tileGrid[row, col].GetComponent<Renderer>();
            if (rend != null)
            {
                rend.material = newTerrain switch
                {
                    TerrainType.VolcanicMagma => volcanicTileMat,
                    TerrainType.PrimevalBriar => verdantTileMat,
                    _ => (row + col) % 2 == 0 ? lightTileMat : darkTileMat
                };
            }

            Vector3 worldPos = GetWorldPosition(row, col);
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.PlayTerrainMutated(worldPos);
            }
        }

        public TerrainType GetTerrainAt(int row, int col)
        {
            return terrainGrid[row, col];
        }
    }
}
