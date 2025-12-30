document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CANVAS HERO (MERCURIO LÍQUIDO) ---
    const canvas = document.getElementById('mercury-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const particles = [];
        const numParticles = 40;
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.radius = Math.random() * 30 + 20;
                this.phase = Math.random() * Math.PI * 2;
            }
            update() {
                const time = Date.now() * 0.001;
                this.vx += Math.sin(time + this.phase) * 0.02; 
                this.vy += Math.cos(time + this.phase) * 0.02; 

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 300) {
                    this.vx += (dx/dist) * 0.5;
                    this.vy += (dy/dist) * 0.5;
                }
                this.x += this.vx; this.y += this.vy;
                this.vx *= 0.96; this.vy *= 0.96;

                if(this.x < -50) this.x = width + 50;
                if(this.x > width + 50) this.x = -50;
                if(this.y < -50) this.y = height + 50;
                if(this.y > height + 50) this.y = -50;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        }
        for(let i=0; i<numParticles; i++) particles.push(new Particle());
        
        document.addEventListener('mousemove', e => {
            if(window.scrollY < window.innerHeight) { mouse.x = e.clientX; mouse.y = e.clientY; }
        });
        function animate() {
            ctx.clearRect(0,0,width,height); particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- 2. SCROLL REVEAL ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-scroll').forEach(el => observer.observe(el));

    // --- 3. TEMAS ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeModal = document.getElementById('theme-modal');
    const closeTheme = document.getElementById('close-theme');
    const themeGrid = document.querySelector('.theme-grid');
    
    const themes = [
        { id: 'theme-pure-glass', color: '#ffffff' },
        { id: 'theme-ocean', color: '#bae6fd' },
        { id: 'theme-rose', color: '#fbcfe8' },
        { id: 'theme-amber', color: '#fde68a' },
        { id: 'theme-mint', color: '#a7f3d0' },
        { id: 'theme-obsidian', color: '#e5e5e5' },
        { id: 'theme-silver', color: '#cbd5e1' },
        { id: 'theme-violet', color: '#ddd6fe' },
        { id: 'theme-champagne', color: '#f3e5ab' },
        { id: 'theme-glacier', color: '#e0f2fe' },
    ];

    if (themeGrid && themeGrid.children.length === 0) {
        themes.forEach(t => {
            const dot = document.createElement('div');
            dot.className = 't-dot';
            dot.style.backgroundColor = t.color;
            dot.onclick = () => {
                document.body.className = `${t.id} custom-cursor-active`;
                themeModal.classList.remove('active');
            };
            themeGrid.appendChild(dot);
        });
    }

    if(themeToggle) themeToggle.onclick = () => themeModal.classList.add('active');
    if(closeTheme) closeTheme.onclick = () => themeModal.classList.remove('active');

    // --- 4. CURSOR ---
    const cursor = document.getElementById('cursor');
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch && cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('.hover-target, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // --- 5. BOTÓN TOP ---
    const topBtn = document.getElementById('scrollTopBtn');
    if(topBtn) {
        window.addEventListener('scroll', () => {
            topBtn.classList.toggle('visible', window.scrollY > 500);
        });
        topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- 6. MENU MÓVIL ---
    const menuBtn = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const closeMenu = document.getElementById('close-menu'); 
    const navLinks = document.querySelectorAll('.nav-link');
    
    function toggleMenu() {
        if(navOverlay.classList.contains('open')) {
            navOverlay.classList.remove('open');
        } else {
            navOverlay.classList.add('open');
        }
    }
    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(closeMenu) closeMenu.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // --- 7. FAQ ACORDEÓN (NUEVO) ---
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const content = faq.querySelector('.faq-content');
            const icon = faq.querySelector('i');
            
            // Cerrar otros
            faqs.forEach(other => {
                if(other !== faq) {
                    other.querySelector('.faq-content').classList.add('hidden');
                    other.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle actual
            content.classList.toggle('hidden');
            if (content.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});