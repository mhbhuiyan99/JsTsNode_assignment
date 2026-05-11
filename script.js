document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'images/hero-main.jpg',
        'images/grid-1.jpg',
        'images/grid-2.jpg',
        'images/grid-3.jpg',
        'images/grid-4.jpg'
    ];

    let currentIndex = 0;
    const viewPhotosBtn = document.querySelector('.view-photos-btn');
    const modal = document.getElementById('imageModal');
    const closeModal = document.querySelector('.close-modal');
    const galleryContainer = document.getElementById('gallery-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const imageCounter = document.querySelector('.image-counter');

    if (!viewPhotosBtn || !modal || !closeModal || !galleryContainer || !prevBtn || !nextBtn || !imageCounter) {
        return;
    }

    const isMobile = () => window.innerWidth <= 768;

    let observer;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 40;

    const renderGallery = () => {
        if (isMobile()) {
            // Mobile: single image with buttons
            galleryContainer.innerHTML = `
                <img src="${images[currentIndex]}" alt="Resort image ${currentIndex + 1}" class="gallery-img">
            `;
            imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            if (observer) observer.disconnect();
        }

        else {
            // PC: vertical scrollable gallery
            galleryContainer.innerHTML = images.map((src, index) =>
                `<img src="${src}" alt="Resort image ${index + 1}" class="gallery-img" data-index="${index}">`
            ).join('');
            imageCounter.textContent = '1 / ' + images.length;
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';

            // Set up IntersectionObserver for PC
            const galleryImages = galleryContainer.querySelectorAll('.gallery-img');
            if (observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.dataset.index) + 1;
                        imageCounter.textContent = `${index} / ${images.length}`;
                    }
                });
            }, { threshold: 0.5 });
            // Threshold 0.5 :: "Wait until at least half the image is visible before telling me."

            galleryImages.forEach(img => observer.observe(img));
        }
    };

    const openModal = () => {
        renderGallery();
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');
    };

    const closeGallery = () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        if (observer) observer.disconnect();
    };

    const showPrev = () => {
        if (!isMobile()) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        renderGallery();
    };

    const showNext = () => {
        if (!isMobile()) return;
        currentIndex = (currentIndex + 1) % images.length;
        renderGallery();
    };

    viewPhotosBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeGallery);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    galleryContainer.addEventListener('touchstart', (event) => {
        if (!isMobile() || !modal.classList.contains('open')) return;
        const touch = event.changedTouches[0];
        touchStartX = touch.pageX;
        touchStartY = touch.pageY;
    }, { passive: true });

    galleryContainer.addEventListener('touchend', (event) => {
        if (!isMobile() || !modal.classList.contains('open')) return;
        const touch = event.changedTouches[0];
        touchEndX = touch.pageX;
        touchEndY = touch.pageY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swipeThreshold) {
            if (dx > 0) {
                showPrev();
            } else {
                showNext();
            }
        }
    }, { passive: true });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeGallery();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('open')) return;
        if (event.key === 'Escape') closeGallery();
        if (isMobile()) {
            if (event.key === 'ArrowLeft') showPrev();
            if (event.key === 'ArrowRight') showNext();
        }
    });

    window.addEventListener('resize', () => {
        if (modal.classList.contains('open')) {
            renderGallery();
        }
    });
});