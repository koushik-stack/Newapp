/**
 * Number Chess - A simplified chess game playable in the terminal
 * Uses numeric notation (e.g., "2,4 to 4,4" means move from row 2 col 4 to row 4 col 4)
 */

export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  row: number;
  col: number;
}

export class NumberChess {
  private board: (Piece | null)[][] = [];
  private currentPlayer: PieceColor = "white";
  private moveHistory: string[] = [];
  private gameActive: boolean = true;
  private selectedPosition: Position | null = null;

  constructor() {
    this.initializeBoard();
  }

  private initializeBoard(): void {
    // Create empty board
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Setup white pieces
    this.placePieces("white", 0, 1);

    // Setup black pieces
    this.placePieces("black", 7, 6);
  }

  private placePieces(color: PieceColor, backRow: number, pawnRow: number): void {
    const pieces: PieceType[] = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];

    // Back row
    pieces.forEach((type, col) => {
      this.board[backRow][col] = { type, color };
    });

    // Pawns
    for (let col = 0; col < 8; col++) {
      this.board[pawnRow][col] = { type: "pawn", color };
    }
  }

  public getBoard(): (Piece | null)[][] {
    return this.board;
  }

  public getCurrentPlayer(): PieceColor {
    return this.currentPlayer;
  }

  public isGameActive(): boolean {
    return this.gameActive;
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  public isValidMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (
      !this.isValidPosition(fromRow, fromCol) ||
      !this.isValidPosition(toRow, toCol)
    ) {
      return false;
    }

    const piece = this.board[fromRow][fromCol];

    // No piece at source
    if (!piece) return false;

    // Can't move opponent's piece
    if (piece.color !== this.currentPlayer) return false;

    // Can't capture own piece
    const targetPiece = this.board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;

    // Check piece-specific movement rules
    switch (piece.type) {
      case "pawn":
        return this.isValidPawnMove(
          fromRow,
          fromCol,
          toRow,
          toCol,
          piece.color
        );
      case "rook":
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
      case "knight":
        return this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
      case "bishop":
        return this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
      case "queen":
        return (
          this.isValidRookMove(fromRow, fromCol, toRow, toCol) ||
          this.isValidBishopMove(fromRow, fromCol, toRow, toCol)
        );
      case "king":
        return this.isValidKingMove(fromRow, fromCol, toRow, toCol);
    }
    return false;
  }

  private isPathClear(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    const rowDir = toRow === fromRow ? 0 : toRow > fromRow ? 1 : -1;
    const colDir = toCol === fromCol ? 0 : toCol > fromCol ? 1 : -1;

    let row = fromRow + rowDir;
    let col = fromCol + colDir;

    while (row !== toRow || col !== toCol) {
      if (this.board[row][col] !== null) return false;
      row += rowDir;
      col += colDir;
    }

    return true;
  }

  private isValidPawnMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    color: PieceColor
  ): boolean {
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;

    // Forward move
    if (fromCol === toCol) {
      if (toRow === fromRow + direction) {
        return this.board[toRow][toCol] === null;
      }
      if (
        fromRow === startRow &&
        toRow === fromRow + 2 * direction &&
        this.board[fromRow + direction][fromCol] === null
      ) {
        return this.board[toRow][toCol] === null;
      }
    }

    // Capture move
    if (
      Math.abs(toCol - fromCol) === 1 &&
      toRow === fromRow + direction &&
      this.board[toRow][toCol] !== null
    ) {
      return true;
    }

    return false;
  }

  private isValidRookMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return this.isPathClear(fromRow, fromCol, toRow, toCol);
  }

  private isValidKnightMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  private isValidBishopMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
    return this.isPathClear(fromRow, fromCol, toRow, toCol);
  }

  private isValidKingMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    return Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1;
  }

  public makeMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    const piece = this.board[fromRow][fromCol]!;
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Check for promotion
    if (piece.type === "pawn") {
      if ((piece.color === "white" && toRow === 0) || (piece.color === "black" && toRow === 7)) {
        piece.type = "queen";
      }
    }

    this.moveHistory.push(`${fromRow},${fromCol} to ${toRow},${toCol}`);
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";

    return true;
  }

  public renderBoard(): string {
    const pieceSymbols: Record<PieceType, Record<PieceColor, string>> = {
      pawn: { white: "♙", black: "♟" },
      rook: { white: "♖", black: "♜" },
      knight: { white: "♘", black: "♞" },
      bishop: { white: "♗", black: "♝" },
      queen: { white: "♕", black: "♛" },
      king: { white: "♔", black: "♚" },
    };

    let board = "\n    0   1   2   3   4   5   6   7\n";
    board += "  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n";

    for (let row = 0; row < 8; row++) {
      board += `${row} │`;
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece) {
          board += ` ${pieceSymbols[piece.type][piece.color]} │`;
        } else {
          board += "   │";
        }
      }
      board += `\n`;

      if (row < 7) {
        board += "  ├───┼───┼───┼───┼───┼───┼───┼───┤\n";
      }
    }

    board += "  └───┴───┴───┴───┴───┴───┴───┴───┘\n";

    return board;
  }

  public getMoveHistory(): string[] {
    return this.moveHistory;
  }
}
