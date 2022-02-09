// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"), // Create canvas context
    W = window.innerWidth, // Window's width
    H = window.innerHeight, // Window's height
    boxSide=22,
    movingPiece={},
    needNewPiece=true,
    mouse = {}, // Mouse object to store it's current position
    points = 0, // Varialbe to store points
    fps = 60, // Max FPS (frames per second)
    startBtn = {}, // Start button object
    over = 1, // flag varialbe, cahnged when the game is over
    init, // variable to initialize animation
    fin, // variable to finalize animation
    keypadHistory="",
    paddleHit;

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;
