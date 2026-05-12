document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "images/hero-main.jpg",
        "images/grid-1.jpg",
        "images/grid-2.jpg",
        "images/grid-3.jpg",
        "images/grid-4.jpg",
        "images/grid-5.jpg",
        "images/grid-6.jpg",
        "images/grid-7.jpg",
        "images/grid-8.jpg",
        "images/grid-9.jpg",
        "images/grid-10.jpg",
    ];

    let currentIndex = 0;
    const viewPhotosBtn = document.querySelector(".view-photos-btn");
    const modal = document.getElementById("imageModal");
    const closeModal = document.querySelector(".close-modal");
    const galleryContainer = document.getElementById("gallery-container");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const imageCounter = document.querySelector(".image-counter");

    if (
        !viewPhotosBtn ||
        !modal ||
        !closeModal ||
        !galleryContainer ||
        !prevBtn ||
        !nextBtn ||
        !imageCounter
    ) {
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
            prevBtn.style.display = "flex";
            nextBtn.style.display = "flex";
            if (observer) observer.disconnect();
        } else {
            // PC: vertical scrollable gallery
            galleryContainer.innerHTML = images
                .map(
                    (src, index) =>
                        `<img src="${src}" alt="Resort image ${index + 1}" class="gallery-img" data-index="${index}">`,
                )
                .join("");
            imageCounter.textContent = "1 / " + images.length;
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

            // Set up IntersectionObserver for PC
            const galleryImages = galleryContainer.querySelectorAll(".gallery-img");
            if (observer) observer.disconnect();
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const index = parseInt(entry.target.dataset.index) + 1;
                            imageCounter.textContent = `${index} / ${images.length}`;
                        }
                    });
                },
                { threshold: 0.5 },
            );
            // Threshold 0.5 :: "Wait until at least half the image is visible before telling me."

            galleryImages.forEach((img) => observer.observe(img));
        }
    };

    const openModal = () => {
        renderGallery();
        modal.classList.add("open");
        document.body.classList.add("modal-open");
        document.documentElement.classList.add("modal-open");
    };

    const closeGallery = () => {
        modal.classList.remove("open");
        document.body.classList.remove("modal-open");
        document.documentElement.classList.remove("modal-open");
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

    viewPhotosBtn.addEventListener("click", openModal);
    closeModal.addEventListener("click", closeGallery);
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);

    galleryContainer.addEventListener(
        "touchstart",
        (event) => {
            if (!isMobile() || !modal.classList.contains("open")) return;
            const touch = event.changedTouches[0];
            touchStartX = touch.pageX;
            touchStartY = touch.pageY;
        },
        { passive: true },
    );

    galleryContainer.addEventListener(
        "touchend",
        (event) => {
            if (!isMobile() || !modal.classList.contains("open")) return;
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
        },
        { passive: true },
    );

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeGallery();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("open")) return;
        if (event.key === "Escape") closeGallery();
        if (isMobile()) {
            if (event.key === "ArrowLeft") showPrev();
            if (event.key === "ArrowRight") showNext();
        }
    });

    window.addEventListener("resize", () => {
        if (modal.classList.contains("open")) {
            renderGallery();
        }
    });

    // Show more/less functionality
    const showMoreButtons = document.querySelectorAll(".show-more");
    showMoreButtons.forEach((button) => {
        let isExpanded = false;
        button.addEventListener("click", () => {
            const parent =
                button.closest(".about-text") || button.closest(".amenities");
            if (parent.classList.contains("about-text")) {
                const textContainer = parent;
                if (!isExpanded) {
                    const additionalText = document.createElement("p");
                    additionalText.textContent =
                        "Additional details: This resort offers unparalleled luxury with personalized service, gourmet dining options, and exclusive access to premium amenities. Guests can enjoy private beach areas, yacht charters, and bespoke experiences tailored to individual preferences.";
                    textContainer.insertBefore(additionalText, button);
                    button.textContent = "Show less";
                } else {
                    const additionalP = textContainer.querySelectorAll("p")[2]; // The added one
                    if (additionalP) additionalP.remove();
                    button.textContent = "Show more";
                }
                isExpanded = !isExpanded;
            } else if (parent.classList.contains("amenities")) {
                const grid = parent.querySelector(".amenity-grid");
                if (!isExpanded) {
                    const additionalItems = [
                        { text: "Full Spa Access" },
                        { text: "24/7 Gym" },
                        { text: "Concierge Service" },
                        { text: "High-Speed WiFi" },
                    ];
                    additionalItems.forEach((item) => {
                        const div = document.createElement("div");
                        div.className = "amenity-item";
                        div.innerHTML = `
                            <span class="icon">
                                <img src="/images/soaking_tubs.png">
                            </span>
                            ${item.text}
                        `;
                        grid.appendChild(div);
                    });
                    button.textContent = "Show less";
                } else {
                    const items = grid.querySelectorAll(".amenity-item");
                    for (let i = items.length - 1; i >= 9; i--) {
                        // Remove added ones (original has 9)
                        items[i].remove();
                    }
                    button.textContent = "Show more";
                }
                isExpanded = !isExpanded;
            }
        });
    });

    // Initialize the datepicker
    setupDatepicker();
});


const setupDatepicker = () => {
    const masterInput = document.getElementById('resort-date-range');
    const trigger = document.getElementById('datepicker-trigger');
    const checkInDisp = document.getElementById('check-in-display');
    const checkOutDisp = document.getElementById('check-out-display');
    const totalPriceEl = document.getElementById('total-price');
    const clearBtn = document.getElementById('clear-selection-btn');
    const nightlyPrice = 2026;

    if (!masterInput || !trigger || !checkInDisp || !checkOutDisp || !totalPriceEl) return;

    totalPriceEl.textContent = `$${nightlyPrice.toLocaleString()}`;

    const toDate = (value) => value instanceof Date ? value : new Date(Number(value));
    const formatDate = (date) => fecha.format(toDate(date), 'YYYY-MM-DD');

    const resetSelections = () => {
        if (hdp && typeof hdp.clear === 'function') {
            hdp.clear();
        }
        masterInput.value = '';
        checkInDisp.textContent = 'Select Date';
        checkOutDisp.textContent = 'Select Date';
        checkInDisp.classList.remove('has-date');
        checkOutDisp.classList.remove('has-date');
        totalPriceEl.textContent = `$${nightlyPrice.toLocaleString()}`;
    };

    const updateTotalPrice = (start, end) => {
        const startDate = toDate(start);
        const endDate = toDate(end);
        const nights = Math.max(1, Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
        totalPriceEl.textContent = `$${(nightlyPrice * nights).toLocaleString()}`;
    };

    const createPopupButtons = () => {
        if (!hdp || !hdp.datepicker) return;
        if (hdp.datepicker.querySelector('.datepicker-popup-actions')) return;

        const actionRow = document.createElement('div');
        actionRow.className = 'datepicker-popup-actions';
        actionRow.innerHTML = `
      <button type="button" class="datepicker-popup-clear">Clear</button>
      <button type="button" class="datepicker-popup-submit">Submit</button>
    `;

        hdp.datepicker.appendChild(actionRow);

        const popupClear = actionRow.querySelector('.datepicker-popup-clear');
        const popupSubmit = actionRow.querySelector('.datepicker-popup-submit');

        popupClear.addEventListener('click', (event) => {
            event.stopPropagation();
            resetSelections();
        });

        popupSubmit.addEventListener('click', (event) => {
            event.stopPropagation();
            if (hdp.start && hdp.end) {
                checkInDisp.textContent = formatDate(hdp.start);
                checkOutDisp.textContent = formatDate(hdp.end);
                checkInDisp.classList.add('has-date');
                checkOutDisp.classList.add('has-date');
                updateTotalPrice(hdp.start, hdp.end);
            }
            if (typeof hdp.close === 'function') {
                hdp.close();
            }
        });
    };

    const hdp = new HotelDatepicker(masterInput, {
        format: 'YYYY-MM-DD',
        startDate: new Date(),
        minNights: 1,
        selectForward: true,
        animationSpeed: '.2s',
        showTopbar: false,
        moveClickNav: true,
        autoClose: false,
        onOpenDatepicker: function () {
            createPopupButtons();
        },
        onSelectRange: function () {
            const range = this.getValue();
            if (!range || range.indexOf(' - ') === -1) return;

            const dates = range.split(' - ');
            if (dates.length !== 2) return;

            checkInDisp.textContent = dates[0];
            checkInDisp.classList.add('has-date');
            checkOutDisp.textContent = dates[1];
            checkOutDisp.classList.add('has-date');

            if (this.start && this.end) {
                updateTotalPrice(this.start, this.end);
            }
        }
    });

    // Ensure the trigger correctly opens the hidden input's picker
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        hdp.open();
        setTimeout(createPopupButtons, 50);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetSelections();
        });
    }
};