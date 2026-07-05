document.addEventListener("DOMContentLoaded", () => {

    // 1. Aplicar tema guardado
    const savedTheme = localStorage.getItem('blogTheme') || 'gothic';
    document.body.className = `theme-${savedTheme}`;

    // 2. Splash Screen
    const splash = document.getElementById('splash-screen');
    if(splash) {
        setTimeout(() => {
            splash.classList.add('hidden');
        }, 3000); // Desaparece a los 3 segundos
    }

    // 3. Menú lateral
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeMenu = document.getElementById('close-menu');
    
    if(menuBtn) {
        menuBtn.addEventListener('click', () => sideMenu.classList.toggle('open'));
        closeMenu.addEventListener('click', () => sideMenu.classList.remove('open'));
    }

    // 4. Buscador y Configuración Dropdowns
    const searchBtn = document.getElementById('search-btn');
    const searchDropdown = document.getElementById('search-dropdown');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsDropdown = document.getElementById('settings-dropdown');

    if(searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchDropdown.classList.toggle('show');
            settingsDropdown.classList.remove('show');
        });
    }

    if(settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('show');
            searchDropdown.classList.remove('show');
        });
    }

    document.addEventListener('click', (e) => {
        if(!e.target.closest('.dropdown') && !e.target.closest('.icon-btn')) {
            searchDropdown?.classList.remove('show');
            settingsDropdown?.classList.remove('show');
        }
    });

    // 5. Cambiar Tema
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = btn.dataset.theme;
            document.body.className = `theme-${theme}`;
            localStorage.setItem('blogTheme', theme);
            settingsDropdown.classList.remove('show');
        });
    });

    // 6. Buscador functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            searchResults.innerHTML = '';
            if(term.length < 2) return;

            // Buscar en postsData (definido en posts-data.js)
            if(typeof postsData !== 'undefined') {
                const results = postsData.filter(post => 
                    post.title.toLowerCase().includes(term) || 
                    post.keywords.toLowerCase().includes(term)
                );

                results.forEach(post => {
                    const a = document.createElement('a');
                    a.href = post.url;
                    a.innerText = post.title;
                    searchResults.appendChild(a);
                });
            }
        });
    }

    // 7. Lluvia de Estrellas Neón (Solo en Dashboard)
    const starCanvas = document.getElementById('star-canvas');
    if(starCanvas) {
        const ctx = starCanvas.getContext('2d');
        let stars = [];
        
        const resizeCanvas = () => {
            starCanvas.width = window.innerWidth;
            starCanvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Star {
            constructor() {
                this.x = Math.random() * starCanvas.width;
                this.y = Math.random() * starCanvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * 0.5 + 0.2;
                this.opacity = Math.random() * 0.8 + 0.2;
                const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.y += this.speedY;
                if(this.y > starCanvas.height) {
                    this.y = 0;
                    this.x = Math.random() * starCanvas.width;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        }

        for(let i=0; i<40; i++) stars.push(new Star());

        function animateStars() {
            ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
            stars.forEach(star => { star.update(); star.draw(); });
            requestAnimationFrame(animateStars);
        }
        animateStars();
    }

    // 8. Gifs Flotantes Y2K (Solo en Dashboard)
    const dashboard = document.querySelector('main.dashboard');
    if(dashboard) {
        const gifs = [
            'assets/gifs/gif1.gif', // Reemplaza con tus rutas
            'assets/gifs/gif2.gif',
            'assets/gifs/gif3.gif'
        ];
        
        setInterval(() => {
            if(Math.random() > 0.5) return; // 50% de probabilidad de aparecer

            const img = document.createElement('img');
            // Validar si los gifs existen o usar placeholder
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            img.src = randomGif;
            img.onerror = () => img.remove(); // Si no encuentra el gif, lo borra
            img.className = 'floating-gif';
            
            // Posición aleatoria
            img.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            img.style.top = Math.random() * (window.innerHeight - 100) + 'px';
            
            document.body.appendChild(img);
            
            // Fade in
            setTimeout(() => img.classList.add('show'), 50);
            
            // Fade out y eliminar
            setTimeout(() => {
                img.classList.remove('show');
                setTimeout(() => img.remove(), 1000);
            }, 3000); // Desaparece a los 3 segundos
        }, 5000); // Aparece cada 5 segundos
    }

    // 9. Reproducir Audio (Loop)
    const audioPlayer = document.getElementById('audio-player');
    if(audioPlayer) {
        // Los navegadores bloquean el autoplay. Intentamos reproducir al primer click.
        const playAudio = () => {
            audioPlayer.play().catch(e => console.log("Autoplay bloqueado"));
            document.removeEventListener('click', playAudio);
        };
        document.addEventListener('click', playAudio);
    }
});
