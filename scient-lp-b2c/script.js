document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth Scrolling behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // 2. Intersection Observer for 'Glass Reveal' animations
    const observerOptions = {
        root: null, rootMargin: '0px', threshold: 0.15
    };
    
    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add CSS classes dynamically before observing
    const elementsToAnimate = [
        ...document.querySelectorAll('.glass-card'),
        ...document.querySelectorAll('.t-item'),
        document.querySelector('.takeaways-image'),
        document.querySelector('.host-details'),
        document.querySelector('.registration-panel')
    ];
    
    elementsToAnimate.forEach((el, index) => {
        if(el) {
            el.classList.add('glass-reveal');
            el.style.transitionDelay = `${index % 4 * 0.1}s`;
            elementObserver.observe(el);
        }
    });

    // 3. Form Submission Simulation (Sleek UI Response)
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = leadForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> PROCESSANDO...';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                leadForm.innerHTML = `
                    <div style="text-align: center; padding: 3rem 0; animation: fadeIn 0.5s ease;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: #2563EB; margin-bottom: 1.5rem;"></i>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #111827; font-family: 'Space Grotesk', sans-serif;">Sua vaga está garantida!</h3>
                        <p style="color: #4B5563; font-size: 1rem;">Verifique seu e-mail corporativo para acessar o link da transmissão.</p>
                    </div>
                `;
            }, 1500);
        });
    }

    // 4. Interactive Dot Grid Background
    const bgPattern = document.querySelector('.bg-pattern');
    if (bgPattern) {
        // Remove static CSS pattern
        bgPattern.style.backgroundImage = 'none';
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        bgPattern.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let viewportMouse = { x: -1000, y: -1000 };
        const spacing = 28; // Distance between dots
        const baseRadius = 0.8;
        const hoverRadius = 1.6; // Slightly larger for better feedback
        const hoverDistance = 90;

        function resize() {
            width = bgPattern.offsetWidth;
            height = bgPattern.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            viewportMouse.x = e.clientX;
            viewportMouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            viewportMouse.x = -1000;
            viewportMouse.y = -1000;
        });

        function draw() {
            ctx.clearRect(0, 0, width, height);
            
            const rect = canvas.getBoundingClientRect();
            
            // Only draw if pattern is visibly on screen
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                requestAnimationFrame(draw);
                return;
            }

            const localMouse = {
                x: viewportMouse.x - rect.left,
                y: viewportMouse.y - rect.top
            };
            
            const cols = Math.floor(width / spacing) + 1;
            const rows = Math.floor(height / spacing) + 1;
            
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const cx = i * spacing;
                    const cy = j * spacing;
                    
                    const dx = localMouse.x - cx;
                    const dy = localMouse.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    let radius = baseRadius;
                    let opacity = 0.05; // Base visibility bumped
                    
                    if (dist < hoverDistance) {
                        const intensity = 1 - (dist / hoverDistance);
                        radius = baseRadius + (hoverRadius - baseRadius) * intensity;
                        opacity = 0.15 + (0.2 * intensity); // Visibility range 15% to 35%
                    }
                    
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(156, 163, 175, ${opacity})`; // Neutral Light Gray
                    ctx.fill();
                }
            }
            
            requestAnimationFrame(draw);
        }
        
        draw();
    }

});
