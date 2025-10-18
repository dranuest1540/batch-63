// Typed JS
const typed = new Typed('#multiple-text', {
    strings: ['Full-Stack Developer', 'Content-Creator', 'Mobile Developer'],
    typeSpeed: 50,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

// Swiper JS
document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.tech-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
        allowTouchMove: true,
        speed: 3000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false,
        },
        on: {
            beforeInit: function () {
                const slides = this.el.querySelectorAll('.swiper-slide');
                slides.forEach(slide => {
                    this.el.querySelector('.swiper-wrapper').appendChild(slide.cloneNode(true));
                });
            }
        }
    });

    swiper.autoplay.start();
});
