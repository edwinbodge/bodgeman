document.addEventListener('DOMContentLoaded', function() {
    // Navigation Toggle for Mobile
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        window.addEventListener('pageshow', (event) => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });

        window.addEventListener('popstate', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    } else {
        console.error('Hamburger or mobile menu element not found');
    }

    // Observe the gradient-end sentinel for final CTA fade-in
    const finalCTA = document.getElementById('final-cta');
    const gradientEnd = document.getElementById('gradient-end');

    if (finalCTA && gradientEnd) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    finalCTA.classList.add('visible');
                }
            });
        }, { threshold: 0 });

        observer.observe(gradientEnd);
    } else {
        console.error('Final CTA or gradient-end element not found');
    }

    // Fade-in effect for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(image => {
        image.classList.add('fade-in');
        imageObserver.observe(image);
    });

    const button = document.getElementById('lawsuit-button');
    let speed = 0;
    let directionX = 1;
    let directionY = 1;
    let posX = 0;
    let posY = 0;

    const moveButton = () => {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = document.body.getBoundingClientRect();

        // Check for collision with container boundaries
        if (buttonRect.right >= containerRect.right || buttonRect.left <= containerRect.left) {
            directionX *= -1;
        }
        if (buttonRect.bottom >= containerRect.bottom || buttonRect.top <= containerRect.top) {
            directionY *= -1;
        }

        // Update position
        posX += directionX * speed;
        posY += directionY * speed;

        // Apply new position
        button.style.transform = `translate(${posX}px, ${posY}px)`;
    };

    button.addEventListener('click', () => {
        speed += 3; // Increase speed on each click
    });

    setInterval(moveButton, 20); // Move the button every 20ms
});
