// js/content-loader.js

document.addEventListener('DOMContentLoaded', async () => {

    /**
     * Fetches JSON data from a given URL.
     * @param {string} url - The URL of the JSON file.
     * @returns {Promise<Array>} A promise that resolves with the data array.
     */
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return []; // Return an empty array on error
        }
    }

    // --- Gallery Section Loader ---
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const galleryItems = await fetchData('data/gallery.json');
        galleryGrid.innerHTML = ''; // Clear existing static HTML

        if (galleryItems.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No hay imágenes disponibles en la galería por el momento.</p>';
        } else {
            galleryItems.forEach(item => {
                const figure = document.createElement('figure');
                figure.classList.add('gallery-item');
                figure.setAttribute('tabindex', '0');
                figure.setAttribute('role', 'button');
                figure.setAttribute('aria-label', `Ver imagen ampliada de ${item.alt}`);

                figure.innerHTML = `
                    <img src="${item.src}" data-full-src="${item.fullSrc || item.src}" alt="${item.alt}" class="gallery-img" loading="lazy" width="600" height="400" onerror="this.onerror=null;this.src='https://placehold.co/600x400/D4C9BF/333333?text=Imagen+No+Disp.'">
                    <figcaption class="gallery-caption">${item.caption}</figcaption>
                `;
                galleryGrid.appendChild(figure);
            });
            // Re-initialize gallery modal functionality after new items are added
            // This assumes gallery-modal.js has a function to re-attach listeners
            if (typeof initializeGalleryModal === 'function') {
                initializeGalleryModal();
            } else {
                // Fallback if initializeGalleryModal is not exposed globally
                // Re-attach listeners directly if needed, or ensure gallery-modal.js is loaded last
                // For this example, we assume gallery-modal.js will attach to .gallery-item elements
                // which are now present. If it needs re-init, it should expose a function.
                // For simplicity, the existing gallery-modal.js should be fine as it attaches to all existing .gallery-item on DOMContentLoaded.
                // If new items are added *after* gallery-modal.js runs, you'd need to re-run its init.
                // The current setup of gallery-modal.js assumes it runs once on DOMContentLoaded.
                // A better approach would be to make gallery-modal.js expose an init function.
                // For now, ensure this script runs *before* gallery-modal.js if you want it to attach to dynamically loaded content.
                // Or, if gallery-modal.js is designed to be re-run, call its init function here.
                // Given the previous structure, gallery-modal.js needs to be re-initialized or its listeners need to be added here.
                // Re-attaching the listeners for the modal directly here to ensure it works with dynamically loaded content.
                attachGalleryModalListeners();
            }
        }
    }

    /**
     * Attaches click listeners to gallery items for the modal.
     * This function is needed because gallery items are now loaded dynamically.
     */
    function attachGalleryModalListeners() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const modalCloseBtn = document.querySelector('.modal-close');

        galleryItems.forEach(item => {
            // Remove existing listeners to prevent duplicates if this function is called multiple times
            item.removeEventListener('click', openModal);
            item.removeEventListener('keydown', handleKeydown);

            item.addEventListener('click', openModal);
            item.addEventListener('keydown', handleKeydown);
        });

        function openModal() {
            const imgSrc = this.querySelector('img').dataset.fullSrc || this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            const captionText = this.querySelector('.gallery-caption').textContent;

            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            modalCaption.textContent = captionText;
            
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        }

        function handleKeydown(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                openModal.call(this); // Call openModal in the context of the clicked item
            }
        }

        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                if (modal.classList.contains('active')) {
                    closeModal();
                }
            }
        });

        function closeModal() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        }
    }


    // --- Testimonials Section Loader ---
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    if (testimonialsSlider && sliderDotsContainer && prevBtn && nextBtn) {
        const testimonials = await fetchData('data/testimonials.json');
        testimonialsSlider.innerHTML = ''; // Clear existing static HTML
        sliderDotsContainer.innerHTML = ''; // Clear existing dots

        if (testimonials.length === 0) {
            testimonialsSlider.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay testimonios disponibles por el momento.</p>';
            return;
        }

        testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.classList.add('testimonial-slide');
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-label', `Testimonio ${index + 1} de ${testimonials.length}`);
            if (index === 0) slide.classList.add('active'); // First slide active by default

            // Generate star rating HTML
            let starRatingHtml = '<div class="star-rating" aria-label="Calificación de ' + testimonial.rating + ' estrellas">';
            for (let i = 1; i <= 5; i++) {
                if (testimonial.rating >= i) {
                    starRatingHtml += '<span class="star" aria-hidden="true">&#9733;</span>';
                } else if (testimonial.rating > i - 1) {
                    starRatingHtml += '<span class="star half" aria-hidden="true">&#9733;</span>'; // For half stars
                } else {
                    starRatingHtml += '<span class="star empty" aria-hidden="true">&#9733;</span>'; // For empty stars if you want them visible
                }
            }
            starRatingHtml += '</div>';

            slide.innerHTML = `
                <div class="testimonial-content">
                    <svg class="quote-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                    <p class="testimonial-text">${testimonial.text}</p>
                </div>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="Avatar de ${testimonial.authorName}" class="author-avatar" loading="lazy" width="60" height="60" onerror="this.onerror=null;this.src='https://placehold.co/60x60/D4C9BF/333333?text=${testimonial.authorName.charAt(0)}'">
                    <div class="author-info">
                        <span class="author-name">${testimonial.authorName}</span>
                        <span class="author-desc">${testimonial.authorDesc}</span>
                    </div>
                    ${starRatingHtml}
                </div>
            `;
            testimonialsSlider.appendChild(slide);

            // Create dot for slider navigation
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            sliderDotsContainer.appendChild(dot);
        });

        // Re-initialize testimonials slider functionality after new items are added
        // This assumes testimonials-slider.js has a function to re-attach listeners or
        // is designed to work with dynamically loaded content.
        // For this to work, testimonials-slider.js should be loaded AFTER this script,
        // and its initialization logic should be called or re-called.
        // A simple way is to move the core logic of testimonials-slider.js into a function
        // and call it here.
        // For now, we'll re-run the logic from testimonials-slider.js directly here.
        let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
                if (i === index) {
                    slide.classList.add('active');
                    slide.setAttribute('aria-hidden', 'false');
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentSlide = parseInt(e.target.dataset.index);
                showSlide(currentSlide);
            });
        });

        showSlide(currentSlide); // Initial display
    }
});