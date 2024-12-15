document.addEventListener('DOMContentLoaded', function() {
    // Navigation Toggle for Mobile
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Reviews carousel
    const reviewsCarousel = document.getElementById('reviews-carousel');
    const reviewsImages = reviewsCarousel.querySelectorAll('img');
    let reviewsIndex = 0;

    function showNextReview() {
        reviewsImages[reviewsIndex].classList.remove('active');
        reviewsIndex = (reviewsIndex + 1) % reviewsImages.length;
        reviewsImages[reviewsIndex].classList.add('active');
    }
    reviewsImages[0].classList.add('active');
    setInterval(showNextReview, 3000);

    // Gallery carousel
    const galleryCarousel = document.getElementById('gallery-carousel');
    const galleryImages = galleryCarousel.querySelectorAll('img');
    let galleryIndex = 0;

    function showNextGalleryImage() {
        galleryImages[galleryIndex].classList.remove('active');
        galleryIndex = (galleryIndex + 1) % galleryImages.length;
        galleryImages[galleryIndex].classList.add('active');
    }
    galleryImages[0].classList.add('active');
    setInterval(showNextGalleryImage, 3000);

    // Observe the gradient-end sentinel for final CTA fade-in
    const finalCTA = document.getElementById('final-cta');
    const gradientEnd = document.getElementById('gradient-end');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                finalCTA.classList.add('visible');
            }
        });
    }, { threshold: 0 });

    observer.observe(gradientEnd);
});