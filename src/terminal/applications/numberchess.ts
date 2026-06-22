import FileSystemBash, { FileSystemType } from "../fileSystemBash";
import { NumberChess } from "../../games/numberchess";

let gameInstance: NumberChess | null = null;
let gameActive = false;

export default function numberchess(
  print: (s: string, md?: boolean) => void,
  path: FileSystemType
) {
  const docs = {
    name: "numberchess",
    short: "play number chess - chess with numeric coordinates",
    long: `Number Chess - A simplified chess game played in the terminal.
Usage:
  numberchess start    - Start a new game
  numberchess move <from> <to>  - Move piece (e.g., "move 6,4 4,4")
  numberchess board    - Display the board
  numberchess undo     - Undo last move
  numberchess quit     - Quit the game
Coordinates are in format: row,column (0-7)`,
  };

  const app = (args: string[], options: string[]) => {
    if (options.find((o) => o === "-h" || o === "-help")) {
      print(`\n${docs.name} – ${docs.short}\n${docs.long}`);
      return;
    }

    if (args.length === 0) {
      print(`\n${docs.long}`);
      return;
    }

    const command = args[0].toLowerCase();

    if (command === "start") {
      if (gameInstance) {
        print(`\n⚠️  A game is already in progress! Use 'numberchess quit' to exit.`);
        return;
      }

      gameInstance = new NumberChess();
      gameActive = true;
      print(`\n♟️  Number Chess started!`);
      print(gameInstance.renderBoard());
      print(
        `\n${gameInstance.getCurrentPlayer().toUpperCase()}'s turn.`
      );
      print(`Type 'numberchess move 6,4 4,4' to move a piece (e.g., pawn two squares).`);
      return;
    }

    if (!gameInstance || !gameActive) {
      print(`\n❌ No active game. Start with 'numberchess start'`);
      return;
    }

    if (command === "board") {
      print(gameInstance.renderBoard());
      print(
        `\n${gameInstance.getCurrentPlayer().toUpperCase()}'s turn.`
      );
      return;
    }

    if (command === "move") {
      if (args.length < 3) {
        print(`\n❌ Invalid move format. Use: numberchess move <from> <to>`);
        print(`   Example: numberchess move 6,4 4,4`);
        return;
      }

      const fromParts = args[1].split(",").map((n) => parseInt(n, 10));
      const toParts = args[2].split(",").map((n) => parseInt(n, 10));

      if (
        fromParts.length !== 2 ||
        toParts.length !== 2 ||
        isNaN(fromParts[0]) ||
        isNaN(fromParts[1]) ||
        isNaN(toParts[0]) ||
        isNaN(toParts[1])
      ) {
        print(`\n❌ Invalid coordinates. Use format: row,col (e.g., 6,4)`);
        return;
      }

      const [fromRow, fromCol] = fromParts;
      const [toRow, toCol] = toParts;

      if (!gameInstance.isValidMove(fromRow, fromCol, toRow, toCol)) {
        print(`\n❌ Invalid move! That move is not allowed.`);
        return;
      }

      gameInstance.makeMove(fromRow, fromCol, toRow, toCol);
      print(gameInstance.renderBoard());
      print(`✓ Move made: ${fromRow},${fromCol} → ${toRow},${toCol}`);
      print(
        `\n${gameInstance.getCurrentPlayer().toUpperCase()}'s turn.`
      );
      return;
    }

    if (command === "quit") {
      print(`\n👋 Game ended. Move history: ${gameInstance.getMoveHistory().join(", ") || "No moves"}`);
      gameInstance = null;
      gameActive = false;
      return;
    }

    print(`\n❌ Unknown command. Type 'numberchess -h' for help.`);
  };

  return { docs, app };
}
