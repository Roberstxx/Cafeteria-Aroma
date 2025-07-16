// js/gallery-modal.js

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalCloseBtn = document.querySelector('.modal-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').dataset.fullSrc || item.querySelector('img').src; // Usa data-full-src si existe
            const imgAlt = item.querySelector('img').alt;
            const captionText = item.querySelector('.gallery-caption').textContent;

            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            modalCaption.textContent = captionText;
            
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll'); // Evitar scroll del fondo
        });

        // Habilitar apertura con Enter para accesibilidad
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                item.click();
            }
        });
    });

    modalCloseBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    });

    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        }
    });

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('no-scroll');
            }
        }
    });
});