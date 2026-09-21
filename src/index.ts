// caveman-canvas — Visualize memory leaks and use-after-free vulnerabilities in real-time.
// Zero-dependency Worker that serves ONE self-contained HTML micro-product. The entire app
// (markup, styles, and logic) is authored by the agent and inlined below as a single document —
// no framework, no build step, no external requests.

const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caveman Canvas - Use After Free Visualization</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            color: #e0e0e0;
            font-family: Arial, sans-serif;
            transition: background-color 0.3s, color 0.3s;
        }
        canvas {
            border: 2px solid #4caf50;
        }
        @media (prefers-color-scheme: light) {
            body {
                background-color: #ffffff;
                color: #000000;
            }
            canvas {
                border-color: #f44336;
            }
        }
    </style>
</head>
<body>
    <canvas id="cavemanCanvas" width="800" height="600"></canvas>
    <script>
        const canvas = document.getElementById('cavemanCanvas');
        const ctx = canvas.getContext('2d');

        let pointers = [];
        let freePointers = [];

        function Pointer(x, y) {
            this.x = x;
            this.y = y;
            this.color = \`hsl(\${Math.random() * 360}, 100%, 50%)\`;
            this.size = Math.random() * 10 + 5;
        }

        function createPointer(x, y) {
            const pointer = new Pointer(x, y);
            pointers.push(pointer);
        }

        function freePointer(index) {
            if (index >= 0 && index < pointers.length) {
                freePointers.push(pointers[index]);
                pointers.splice(index, 1);
            }
        }

        function useAfterFree() {
            if (freePointers.length > 0) {
                const randomIndex = Math.floor(Math.random() * freePointers.length);
                const pointer = freePointers[randomIndex];
                pointer.x += (Math.random() - 0.5) * 10;
                pointer.y += (Math.random() - 0.5) * 10;
                freePointers.splice(randomIndex, 1);
                pointers.push(pointer);
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pointers.forEach((pointer, index) => {
                ctx.beginPath();
                ctx.arc(pointer.x, pointer.y, pointer.size, 0, Math.PI * 2);
                ctx.fillStyle = pointer.color;
                ctx.fill();
                ctx.closePath();

                // Simulate use-after-free by occasionally reusing freed pointers
                if (Math.random() < 0.01) {
                    freePointer(index);
                }
            });

            // Occasionally introduce use-after-free condition
            if (Math.random() < 0.005) {
                useAfterFree();
            }

            requestAnimationFrame(draw);
        }

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            createPointer(x, y);
        });

        draw();
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
