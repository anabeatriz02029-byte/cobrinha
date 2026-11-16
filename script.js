const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20; // Tamanho de cada bloco (em pixels)
let score = 0;

// A cobra é um array de coordenadas
let snake = [
  { x: 9 * box, y: 10 * box },
  { x: 8 * box, y: 10 * box },
  { x: 7 * box, y: 10 * box }
];

// Direção inicial
let d = "RIGHT";

// Posição inicial da comida
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

// Captura as setas do teclado e impede que a tela role
document.addEventListener("keydown", direction);

function direction(event) {
  if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "ArrowLeft" && d !== "RIGHT") {
    d = "LEFT";
  } else if (event.key === "ArrowUp" && d !== "DOWN") {
    d = "UP";
  } else if (event.key === "ArrowRight" && d !== "LEFT") {
    d = "RIGHT";
  } else if (event.key === "ArrowDown" && d !== "UP") {
    d = "DOWN";
  }
}

// Verifica colisão com o próprio corpo
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Desenha uma grade sutil no fundo do canvas
function drawGrid() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= canvas.width; i += box) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

// Função principal de desenho do jogo
function draw() {
  // 1. Limpa o canvas com o fundo escuro azulado
  ctx.fillStyle = "#0b0d17";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha a grade
  drawGrid();

  // 2. Desenha a cobra com brilho neon
  for (let i = 0; i < snake.length; i++) {
    ctx.shadowBlur = i === 0 ? 15 : 8;
    ctx.shadowColor = i === 0 ? "#00ff87" : "#00b8ff";
    ctx.fillStyle = i === 0 ? "#00ff87" : "#00b8ff";

    ctx.fillRect(snake[i].x + 1, snake[i].y + 1, box - 2, box - 2);
  }

  // 3. Desenha a comida em formato circular com brilho rosa neon
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ff0055";
  ctx.fillStyle = "#ff0055";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.3, 0, Math.PI * 2);
  ctx.fill();

  // Reseta a sombra para não afetar os próximos desenhos
  ctx.shadowBlur = 0;

  // 4. Posição atual da cabeça
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Define a nova posição com base na direção
  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

  // 5. Verifica se a cobra comeu a comida
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreElement.innerText = score;
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    // Remove o último pedaço da cauda
    snake.pop();
  }

  // Cria a nova cabeça
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // 6. Condições de fim de jogo (paredes ou próprio corpo)
  if (
    snakeX < 0 ||
    snakeX >= canvas.width ||
    snakeY < 0 ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert(`Fim de jogo! Sua pontuação foi: ${score}`);
    location.reload();
    return;
  }

  // Adiciona a nova cabeça no início do array
  snake.unshift(newHead);
}

// Atualiza o jogo a cada 100 milissegundos
const game = setInterval(draw, 100);
