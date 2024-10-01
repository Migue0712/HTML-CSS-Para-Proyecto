const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20; // tamaño del cuadro
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
};

let score = 0;
let d;
let countdown;

// Control de la serpiente
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode === 37 && d !== "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode === 38 && d !== "DOWN") {
        d = "UP";
    } else if (event.keyCode === 39 && d !== "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode === 40 && d !== "UP") {
        d = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar la comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Posición de la cabeza
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Dirección de movimiento
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Si la serpiente come
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * cols) * box,
            y: Math.floor(Math.random() * rows) * box,
        };
    } else {
        snake.pop(); // Eliminar la cola
    }

    let newHead = { x: snakeX, y: snakeY };

    // Fin del juego si la serpiente choca
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game); // Detener el intervalo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mostrar mensaje de fin del juego
        ctx.fillStyle = "white"; 
        ctx.font = "30px Changa one"; 
        const gameOverText = `Juego terminado. Puntuación: ${score}`;
        const textWidth = ctx.measureText(gameOverText).width; 
        ctx.fillText(gameOverText, (canvas.width - textWidth) / 2, canvas.height / 2);

        // Iniciar la cuenta regresiva automáticamente
        countdown = 5;
        displayCountdown();
        return;
    }

    snake.unshift(newHead);

    // Mostrar puntuación
    ctx.fillStyle = "white";
    ctx.font = "40px 'DS-Digital'";
    ctx.fillText(score, 2 * box, 1.5 * box);
}

function displayCountdown() {
    const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white"; // Asegúrate de que el texto sea visible
            ctx.font = "30px Changa one";
            ctx.fillText(`Reiniciando en: ${countdown}`, canvas.width / 2 - 120, canvas.height / 2);
            countdown--;
        } else {
            clearInterval(countdownInterval);
            resetGame();
        }
    }, 1000);
}

// Función resetGame
function resetGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    d = null;
    score = 0;
    food = {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box,
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game = setInterval(drawGame, 100);
}

// Iniciar el juego por primera vez
let game = setInterval(drawGame, 100);
