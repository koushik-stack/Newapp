/**
 * Sloppy Bird - A Flappy Bird-style game
 * Play by clicking or pressing spacebar to make the bird flap
 */

export interface GameConfig {
  canvas: HTMLCanvasElement;
  onGameEnd: (score: number) => void;
  onClose: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  scored: boolean;
}

export class SloppyBird {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameActive: boolean = false;
  private gameRunning: boolean = false;
  private onGameEnd: (score: number) => void;
  private onClose: () => void;

  // Game objects
  private bird: GameObject & { velocityY: number };
  private pipes: Pipe[] = [];
  private score: number = 0;
  private frameCount: number = 0;

  // Constants
  private readonly BIRD_SIZE = 20;
  private readonly PIPE_WIDTH = 60;
  private readonly PIPE_GAP = 120;
  private readonly PIPE_SPACING = 200;
  private readonly GRAVITY = 0.6;
  private readonly FLAP_STRENGTH = -12;
  private readonly PIPE_SPEED = 4;
  private readonly GROUND_HEIGHT = 50;

  constructor(config: GameConfig) {
    this.canvas = config.canvas;
    this.onGameEnd = config.onGameEnd;
    this.onClose = config.onClose;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    this.ctx = ctx;

    // Initialize bird
    this.bird = {
      x: this.canvas.width / 4,
      y: this.canvas.height / 2,
      width: this.BIRD_SIZE,
      height: this.BIRD_SIZE,
      velocityY: 0,
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const handleFlap = () => {
      if (this.gameRunning) {
        this.bird.velocityY = this.FLAP_STRENGTH;
      } else if (!this.gameActive) {
        this.start();
      }
    };

    const handleClick = () => handleFlap();
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleFlap();
      }
      if (e.code === "Escape") {
        this.end();
      }
    };

    this.canvas.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyPress);

    // Store references for cleanup
    (this.canvas as any)._sloppyBirdClickHandler = handleClick;
    (document as any)._sloppyBirdKeyHandler = handleKeyPress;
  }

  private removeEventListeners(): void {
    const handleClick = (this.canvas as any)._sloppyBirdClickHandler;
    const handleKeyPress = (document as any)._sloppyBirdKeyHandler;

    if (handleClick) this.canvas.removeEventListener("click", handleClick);
    if (handleKeyPress) document.removeEventListener("keydown", handleKeyPress);
  }

  public start(): void {
    this.gameActive = true;
    this.gameRunning = true;
    this.score = 0;
    this.frameCount = 0;
    this.bird.y = this.canvas.height / 2;
    this.bird.velocityY = 0;
    this.pipes = [];

    // Create initial pipes
    for (let i = 0; i < 3; i++) {
      this.spawnPipe(this.canvas.width + i * this.PIPE_SPACING);
    }

    this.gameLoop();
  }

  private spawnPipe(x: number): void {
    const minHeight = 50;
    const maxHeight = this.canvas.height - this.GROUND_HEIGHT - this.PIPE_GAP - 50;
    const topHeight = minHeight + Math.random() * (maxHeight - minHeight);

    this.pipes.push({
      x,
      topHeight,
      scored: false,
    });
  }

  private gameLoop = (): void => {
    if (!this.gameRunning) return;

    this.update();
    this.draw();

    requestAnimationFrame(this.gameLoop);
  };

  private update(): void {
    // Physics
    this.bird.velocityY += this.GRAVITY;
    this.bird.y += this.bird.velocityY;

    // Move pipes
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      this.pipes[i].x -= this.PIPE_SPEED;

      // Check if bird passed pipe (scoring)
      if (
        !this.pipes[i].scored &&
        this.bird.x > this.pipes[i].x + this.PIPE_WIDTH
      ) {
        this.pipes[i].scored = true;
        this.score++;
      }

      // Remove off-screen pipes
      if (this.pipes[i].x + this.PIPE_WIDTH < 0) {
        this.pipes.splice(i, 1);
      }
    }

    // Spawn new pipes
    if (this.pipes.length > 0) {
      const lastPipe = this.pipes[this.pipes.length - 1];
      if (lastPipe.x < this.canvas.width - this.PIPE_SPACING) {
        this.spawnPipe(this.canvas.width);
      }
    }

    // Collision detection - ground
    if (
      this.bird.y + this.bird.height >=
      this.canvas.height - this.GROUND_HEIGHT
    ) {
      this.gameRunning = false;
      setTimeout(() => this.end(), 500);
      return;
    }

    // Collision detection - ceiling
    if (this.bird.y <= 0) {
      this.gameRunning = false;
      setTimeout(() => this.end(), 500);
      return;
    }

    // Collision detection - pipes
    for (const pipe of this.pipes) {
      const birdLeft = this.bird.x;
      const birdRight = this.bird.x + this.bird.width;
      const birdTop = this.bird.y;
      const birdBottom = this.bird.y + this.bird.height;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + this.PIPE_WIDTH;
      const pipeGapTop = pipe.topHeight;
      const pipeGapBottom = pipe.topHeight + this.PIPE_GAP;

      // Check if bird is in pipe's horizontal range
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check collision with top pipe
        if (birdTop < pipeGapTop) {
          this.gameRunning = false;
          setTimeout(() => this.end(), 500);
          return;
        }
        // Check collision with bottom pipe
        if (birdBottom > pipeGapBottom) {
          this.gameRunning = false;
          setTimeout(() => this.end(), 500);
          return;
        }
      }
    }
  }

  private draw(): void {
    // Clear canvas
    this.ctx.fillStyle = "#87CEEB";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw ground
    this.ctx.fillStyle = "#8B7355";
    this.ctx.fillRect(
      0,
      this.canvas.height - this.GROUND_HEIGHT,
      this.canvas.width,
      this.GROUND_HEIGHT
    );

    // Draw grass
    this.ctx.fillStyle = "#228B22";
    this.ctx.fillRect(
      0,
      this.canvas.height - this.GROUND_HEIGHT,
      this.canvas.width,
      5
    );

    // Draw bird
    this.ctx.fillStyle = "#FFD700";
    this.ctx.beginPath();
    this.ctx.arc(
      this.bird.x + this.bird.width / 2,
      this.bird.y + this.bird.height / 2,
      this.bird.width / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw bird eye
    this.ctx.fillStyle = "#000";
    const eyeX =
      this.bird.x +
      this.bird.width / 2 +
      (this.bird.velocityY > 0 ? 3 : 5);
    const eyeY = this.bird.y + this.bird.height / 2 - 3;
    this.ctx.beginPath();
    this.ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw pipes
    this.ctx.fillStyle = "#228B22";
    for (const pipe of this.pipes) {
      // Top pipe
      this.ctx.fillRect(pipe.x, 0, this.PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      this.ctx.fillRect(
        pipe.x,
        pipe.topHeight + this.PIPE_GAP,
        this.PIPE_WIDTH,
        this.canvas.height - pipe.topHeight - this.PIPE_GAP - this.GROUND_HEIGHT
      );

      // Pipe outline
      this.ctx.strokeStyle = "#1a6b1a";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(pipe.x, 0, this.PIPE_WIDTH, pipe.topHeight);
      this.ctx.strokeRect(
        pipe.x,
        pipe.topHeight + this.PIPE_GAP,
        this.PIPE_WIDTH,
        this.canvas.height - pipe.topHeight - this.PIPE_GAP - this.GROUND_HEIGHT
      );
    }

    // Draw score
    this.ctx.fillStyle = "#000";
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);

    // Draw instructions
    if (!this.gameRunning && this.gameActive) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = "#fff";
      this.ctx.font = "bold 36px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Game Over!", this.canvas.width / 2, this.canvas.height / 2 - 60);

      this.ctx.font = "24px Arial";
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);

      this.ctx.font = "16px Arial";
      this.ctx.fillText(
        "Press ESC to close or SPACE to play again",
        this.canvas.width / 2,
        this.canvas.height / 2 + 60
      );
      this.ctx.textAlign = "left";
    } else if (!this.gameActive) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = "#fff";
      this.ctx.font = "bold 36px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Sloppy Bird", this.canvas.width / 2, this.canvas.height / 2 - 60);

      this.ctx.font = "20px Arial";
      this.ctx.fillText(
        "Click or press SPACE to start",
        this.canvas.width / 2,
        this.canvas.height / 2 + 40
      );
      this.ctx.textAlign = "left";
    }
  }

  public end(): void {
    this.gameRunning = false;
    this.gameActive = false;
    this.removeEventListeners();
    this.onGameEnd(this.score);
    this.onClose();
  }
}
