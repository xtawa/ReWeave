/** @jsx h */
import { h } from 'preact';

export function SnowEffect() {
    const script = `
    (function() {
        const now = new Date();
        const month = now.getMonth(); // 0-11, so 11 is December
        const date = now.getDate();
        
        // Check for Dec 24, 25, 26
        if (month === 11 && (date === 24 || date === 25 || date === 26)) {
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'snow-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '999999'; // Ensure it's on top
            document.body.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            
            const particles = [];
            const particleCount = 50; // Reduced from 100 for better performance
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 2 + 0.5, // Smaller radius: 0.5 - 2.5
                    d: Math.random() * particleCount,
                    a: Math.random() * 0.5 + 0.4 // Opacity: 0.4 - 0.9
                });
            }
            
            function draw() {
                ctx.clearRect(0, 0, width, height);
                
                for (let i = 0; i < particleCount; i++) {
                    const p = particles[i];
                    ctx.fillStyle = 'rgba(255, 255, 255, ' + p.a + ')';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
                    ctx.fill();
                }
                update();
            }
            
            let angle = 0;
            function update() {
                angle += 0.01;
                for (let i = 0; i < particleCount; i++) {
                    const p = particles[i];
                    // Slower movement
                    p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
                    p.x += Math.sin(angle) * 1; // Reduced horizontal sway
                    
                    if (p.x > width + 5 || p.x < -5 || p.y > height) {
                        if (i % 3 > 0) {
                            particles[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d, a: p.a };
                        } else {
                            if (Math.sin(angle) > 0) {
                                particles[i] = { x: -5, y: Math.random() * height, r: p.r, d: p.d, a: p.a };
                            } else {
                                particles[i] = { x: width + 5, y: Math.random() * height, r: p.r, d: p.d, a: p.a };
                            }
                        }
                    }
                }
            }
            
            function loop() {
                draw();
                requestAnimationFrame(loop);
            }
            
            // Start loop
            loop();
            
            // Handle resize
            window.addEventListener('resize', () => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
            });

            // Toggle Button
            const btn = document.createElement('button');
            btn.innerHTML = '❄️';
            // Position: Fixed bottom-right, but moved left to avoid MobileToc (which is usually bottom-6 right-6)
            // We'll place it at bottom-6 right-20 (approx 80px from right)
            btn.className = 'fixed bottom-6 right-20 z-50 p-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer text-xl flex items-center justify-center w-12 h-12';
            btn.title = 'Toggle Christmas Effects';
            document.body.appendChild(btn);

            const STORAGE_KEY = 'reweave-christmas-effect';
            let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';

            function updateState() {
                const canvas = document.getElementById('snow-canvas');
                const hats = document.querySelectorAll('.christmas-hat');
                
                if (isEnabled) {
                    if (canvas) canvas.style.display = 'block';
                    hats.forEach(h => h.classList.remove('hidden'));
                    btn.style.opacity = '1';
                    btn.style.filter = 'none';
                } else {
                    if (canvas) canvas.style.display = 'none';
                    hats.forEach(h => h.classList.add('hidden'));
                    btn.style.opacity = '0.5';
                    btn.style.filter = 'grayscale(1)';
                }
                localStorage.setItem(STORAGE_KEY, String(isEnabled));
            }

            btn.addEventListener('click', () => {
                isEnabled = !isEnabled;
                updateState();
            });

            // Initial State
            const hats = document.querySelectorAll('.christmas-hat');
            if (isEnabled) {
                hats.forEach(hat => {
                    hat.classList.remove('hidden');
                });
            } else {
                 if (canvas) canvas.style.display = 'none';
            }
        }
    })();
    `;

    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
