/*
================================================================================
FILE: script.js
PROJECT: Aoura Group Coming Soon (Space Engine and Micro-interactions)
================================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SET TARGET LAUNCH DATE ---
    // Launching exactly 5 days from current date
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 5);

    // --- 2. COUNTDOWN TIMER ENGINE ---
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate.getTime() - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to avoid layout shift

    // --- 3. PROGRESS BAR ENGINE ---
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percentage');
    const targetProgress = 62;
    let currentProgress = 0;

    // Smoothly animate progress counter and bar width on load
    function animateProgressBar() {
        const duration = 1800; // Match CSS transition duration (1.8s)
        const startTime = performance.now();

        function step(timestamp) {
            const elapsed = timestamp - startTime;
            const progressRatio = Math.min(elapsed / duration, 1);
            
            // Custom easeOutCubic curve
            const ease = 1 - Math.pow(1 - progressRatio, 3);
            currentProgress = Math.round(ease * targetProgress);

            if (progressPercent) {
                progressPercent.textContent = `${currentProgress}%`;
            }
            if (progressFill) {
                progressFill.style.width = `${currentProgress}%`;
            }

            if (progressRatio < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // Trigger after a tiny delay for CSS layout initialization
    setTimeout(animateProgressBar, 300);

    // --- 4. RIPPLE CLICK ANIMATION (Notify Button) ---
    const notifyButton = document.getElementById('notify-button');
    if (notifyButton) {
        notifyButton.addEventListener('click', function(e) {
            // Calculate absolute click offsets
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            // Cleanup ripple span after animation runs
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // --- 5. SUBSCRIPTION FORM FEEDBACK ---
    const notifyForm = document.getElementById('notify-form');
    const emailInput = document.getElementById('email-input');

    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailValue = emailInput.value.trim();

            if (!emailValue || !validateEmail(emailValue)) {
                // Shake animation on error
                emailInput.style.animation = 'shake 0.4s ease-in-out';
                setTimeout(() => emailInput.style.animation = '', 400);
                return;
            }

            // Visual Success Transformation
            const buttonText = notifyButton.querySelector('.btn-text');
            if (buttonText) {
                buttonText.textContent = 'Subscribed';
                notifyButton.style.background = 'linear-gradient(90deg, #00f2fe, #4f00e0)';
                notifyButton.style.color = '#ffffff';
                notifyButton.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.4)';
            }
            emailInput.value = '';
            emailInput.disabled = true;
            emailInput.placeholder = 'We will keep you updated.';
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Dynamic error shake animation injection
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(styleSheet);

    // --- 6. 60 FPS INTERACTIVE SPACE ENGINE (Twinkling Stars, Drifting Dust, Inertial Parallax) ---
    const canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let stars = [];
    let particles = [];
    const starCount = 350;
    const particleCount = 45;

    // Mouse tracking variables
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let parallax = { x: 0, y: 0 };
    const easeFactor = 0.06; // Smooth parallax inertia dampening factor

    // Adjust canvas buffer coordinates
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Star Object Definition
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5;
            this.alpha = Math.random();
            this.twinkleSpeed = 0.005 + Math.random() * 0.015;
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
            // Far parallax factor (stars move very slightly)
            this.parallaxFactor = 0.01 + Math.random() * 0.02;
        }

        update() {
            // Twinkling light logic
            this.alpha += this.twinkleSpeed * this.twinkleDir;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.twinkleDir = -1;
            } else if (this.alpha <= 0.1) {
                this.alpha = 0.1;
                this.twinkleDir = 1;
            }
        }

        draw(px, py) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            // Compute parallax offset coordinates
            const drawX = this.x + px * this.parallaxFactor;
            const drawY = this.y + py * this.parallaxFactor;
            
            ctx.beginPath();
            ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Floating Dust Particle Definition
    class DustParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = 1 + Math.random() * 2.5;
            this.vx = (Math.random() - 0.5) * 0.08;
            this.vy = (Math.random() - 0.5) * 0.05 - 0.03; // Slow upward drift
            this.alpha = 0.1 + Math.random() * 0.3;
            // Closer parallax factor (dust floats faster)
            this.parallaxFactor = 0.05 + Math.random() * 0.08;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Recenter elements wrapping coordinates
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw(px, py) {
            ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
            const drawX = this.x + px * this.parallaxFactor;
            const drawY = this.y + py * this.parallaxFactor;

            ctx.beginPath();
            ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
            ctx.fill();
            // Outer glow for dust particles
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
            ctx.shadowBlur = 0; // Reset canvas shadows immediately
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new DustParticle());
        }
    }

    // 60FPS Engine Loop
    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Smooth target mouse coords interpolation (inertial friction damping)
        const targetX = -(mouse.x - window.innerWidth / 2);
        const targetY = -(mouse.y - window.innerHeight / 2);
        
        parallax.x += (targetX - parallax.x) * easeFactor;
        parallax.y += (targetY - parallax.y) * easeFactor;

        // Apply Parallax offset to Eclipsed Planet (CSS variables)
        const planetContainer = document.querySelector('.planet-container');
        if (planetContainer) {
            // Planet parallax is distinct and subtle
            const planetOffsetX = parallax.x * 0.04;
            const planetOffsetY = parallax.y * 0.04;
            planetContainer.style.transform = `translate(calc(-50% + ${planetOffsetX}px), calc(-50% + ${planetOffsetY}px))`;
        }

        // Apply Parallax offset to Nebulae elements
        const nebulae = document.querySelectorAll('.nebula');
        nebulae.forEach((neb, index) => {
            const factor = (index + 1) * 0.12;
            neb.style.transform = `translate(${parallax.x * factor}px, ${parallax.y * factor}px)`;
        });

        // Render Canvas Objects
        stars.forEach(star => {
            star.update();
            star.draw(parallax.x, parallax.y);
        });

        particles.forEach(p => {
            p.update();
            p.draw(parallax.x, parallax.y);
        });

        requestAnimationFrame(renderLoop);
    }

    // Initialize environment
    resizeCanvas();
    renderLoop();

});
