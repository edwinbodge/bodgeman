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
    let clickCount = 0; // Track the number of clicks

    if (button) {
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
                clickCount++; // Increment click count

            if (clickCount >= 3) {
                const heading = document.querySelector('main section h2');
                if (heading) {
                    heading.textContent = "Oh, sorry about that.";
                }

                const paragraph = document.querySelector('main section + section p');
                if (paragraph) {
                    paragraph.textContent = "We've fired our intern. Turns out, our website code is publicly editable. We're very sorry about this experience.";
                }

                const button = document.getElementById('lawsuit-button');
                if (button) {
                    button.textContent = "Submit a Complaint";
                    speed = 1;

                    button.addEventListener('click', () => {
                        window.location.href = 'actual_lawsuit.html'; // Redirect to the new page
                    });
                }
            }
        });

        setInterval(moveButton, 20); // Move the button every 20ms
    }

    const tapButton = document.getElementById('tap-button');
    let count = 1000001;

    if(tapButton) {
        tapButton.addEventListener('click', () => {
            if (count === 999990) {
                alert("Do you really think you'll get to a million?");
            }
            if (count === 999960) {
                alert("Seriously, this is not going to happen.");
            }
            if (count > 0) {
                count--;
                tapButton.textContent = `Taps remaining: ${count}`;
            } else {
                tapButton.textContent = "There's been an error, please try again.";
                count = 1000000;
            }
            console.log(count);
        });
    }

    const rpsButton = document.getElementById('rps-button');

    if (rpsButton) {
        rpsButton.addEventListener('click', () => {
            // Hide the original button
            rpsButton.style.display = 'none';

            // Create the rock, paper, scissors buttons
            const options = ['Rock', 'Paper', 'Scissors'];
            const section = rpsButton.parentElement;

            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.id = `${option.toLowerCase()}-button`;
                button.classList.add('rps-option');
                section.appendChild(button);

                button.addEventListener('click', () => {
                    let message;
                    switch (option) {
                        case 'Rock':
                            message = 'Paper, try again.';
                            break;
                        case 'Paper':
                            message = 'Scissors, try again.';
                            break;
                        case 'Scissors':
                            message = 'Rock, try again.';
                            break;
                    }
                    alert(message);
                });
            });

            // Remove the event listener to prevent adding buttons multiple times
            rpsButton.removeEventListener('click', arguments.callee);
        });
    }

    const chessButton = document.getElementById('chess-button');
    if (chessButton) {
        chessButton.addEventListener('click', () => {
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        });
    }
});
