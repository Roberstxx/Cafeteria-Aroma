// js/testimonials-slider.js

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;

    if (slides.length === 0) return;

    // Crear dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const showSlide = (index) => {
        // Remover active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Añadir active al slide y dot actual
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        slides[index].setAttribute('aria-hidden', 'false');
        slides.forEach((slide, i) => {
            if (i !== index) {
                slide.setAttribute('aria-hidden', 'true');
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

    // Event listeners para botones
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Event listeners para dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSlide = parseInt(e.target.dataset.index);
            showSlide(currentSlide);
        });
    });

    // Inicializar el slider
    showSlide(currentSlide);

    // Opcional: Auto-avance del slider
    // setInterval(nextSlide, 7000); // Cambia el slide cada 7 segundos
});