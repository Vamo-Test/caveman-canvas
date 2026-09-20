// caveman-canvas — Interactive caveman simulation in your browser.
// Zero-dependency Worker that serves ONE self-contained HTML micro-product. The entire app
// (markup, styles, and logic) is authored by the agent and inlined below as a single document —
// no framework, no build step, no external requests.

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Caveman Canvas</title>
<style>
body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #121212; color: #e0e0e0; font-family: Arial, sans-serif; }
canvas { border: 2px solid #424242; }
@media (prefers-color-scheme: light) {
  body { background: #ffffff; color: #000000; }
  canvas { border-color: #d3d3d3; }
}
</style>
</head>
<body>
<canvas id="cavemanCanvas"></canvas>
<script>
const canvas = document.getElementById('cavemanCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Caveman {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 20 + 10;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.color = \`hsl(\${Math.random() * 360}, 100%, 50%)\`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const cavemen = [];
for (let i = 0; i < 50; i++) {
  cavemen.push(new Caveman(Math.random() * canvas.width, Math.random() * canvas.height));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cavemen.forEach(caveman => {
    caveman.update();
    caveman.draw();
  });
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
</script>
</body>
</html>`;

export default {
  async fetch(): Promise<Response> {
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
