class Carousel {
    constructor(element) {
        this.container = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.currentIndex = 0;
        this.autoplayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Create indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(dot);
        });
        this.container.appendChild(indicators);

        // Add navigation buttons
        const prevButton = this.container.querySelector('.prev');
        const nextButton = this.container.querySelector('.next');
        
        // Event listeners
        prevButton?.addEventListener('click', () => this.prev());
        nextButton?.addEventListener('click', () => this.next());
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.container.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause autoplay on interaction
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    updateSlidePosition() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        // Update indicators
        this.container.querySelectorAll('.carousel-indicator').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlidePosition();
        this.resetAutoplay();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
        this.resetAutoplay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlidePosition();
        this.resetAutoplay();
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.stopAutoplay();
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
        this.startAutoplay();
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => this.next(), 7000);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Navigation Toggle for Mobile
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Handle browser back button
    window.addEventListener('pageshow', (event) => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    window.addEventListener('popstate', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    // Initialize carousels
    const galleryCarousel = new Carousel(document.getElementById('gallery-carousel'));
    const reviewsCarousel = new Carousel(document.getElementById('reviews-carousel'));

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