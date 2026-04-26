document.addEventListener('DOMContentLoaded', () => {

    // === BRILHO DO MOUSE ===
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        window.addEventListener('mousemove', ({ clientX, clientY }) => {
            requestAnimationFrame(() => {
                glow.style.left = `${clientX}px`;
                glow.style.top = `${clientY}px`;
            });
        });
    }

    // === CARROSSÉIS ===
    document.querySelectorAll('.carousel-component').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const nextBtn = carousel.querySelector('.next-arrow');
        const prevBtn = carousel.querySelector('.prev-arrow');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const isMulti = carousel.classList.contains('detailed-benefits-carousel');

        if (!slides.length || !nextBtn || !prevBtn) return;

        let current = 0;
        let autoplayTimer = null;

        // Cria dots apenas para carrosséis de slide único
        if (dotsContainer && !isMulti) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            });
        }

        const getDots = () => dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

        const updateDots = () => {
            getDots().forEach((dot, i) => dot.classList.toggle('active', i === current));
        };

        const update = () => {
            if (isMulti) {
                const slideWidth = slides[0].getBoundingClientRect().width;
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                const containerWidth = track.parentElement.getBoundingClientRect().width;
                const inView = Math.floor((containerWidth + gap) / (slideWidth + gap));
                const max = Math.max(0, slides.length - inView);
                current = Math.min(Math.max(current, 0), max);
                track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
            } else {
                current = ((current % slides.length) + slides.length) % slides.length;
                track.style.transform = `translateX(-${current * 100}%)`;
                updateDots();
            }
        };

        const goTo = (index) => {
            current = index;
            update();
            resetAutoplay();
        };

        const startAutoplay = () => {
            if (isMulti) return;
            autoplayTimer = setInterval(() => { current++; update(); }, 5000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayTimer);
            startAutoplay();
        };

        nextBtn.addEventListener('click', () => { current++; update(); resetAutoplay(); });
        prevBtn.addEventListener('click', () => { current--; update(); resetAutoplay(); });
        window.addEventListener('resize', update);

        update();
        startAutoplay();
    });

    // === MODAL DE LOGIN ===
    const loginButtons = document.querySelectorAll('#login-btn, #login-btn-main');
    const modalOverlay = document.getElementById('login-modal-overlay');
    const closeModalBtn = document.getElementById('login-modal-close');
    const loginForm = document.getElementById('login-form');

    if (loginButtons.length && modalOverlay && closeModalBtn && loginForm) {
        const openModal = () => modalOverlay.classList.add('visible');
        const closeModal = () => modalOverlay.classList.remove('visible');

        loginButtons.forEach(btn => btn.addEventListener('click', openModal));
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Funcionalidade de login (back-end) não implementada.');
            closeModal();
        });
    }
});
