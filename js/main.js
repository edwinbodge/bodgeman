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

    // Fade-in effect for images (call again for images added later)
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const observeImages = (root = document) => {
        root.querySelectorAll('img:not(.fade-in):not(.no-fade)').forEach(image => {
            image.classList.add('fade-in');
            imageObserver.observe(image);
        });
    };
    observeImages();

    // Cards come from data/cards.json so new ones appear without editing any HTML
    const loadCards = () => fetch('data/cards.json', { cache: 'no-cache' })
        .then(res => res.json())
        .then(data => data.cards);

    // Home page: three random cards, different on every refresh
    const featured = document.getElementById('featured-cards');
    if (featured) {
        loadCards().then(cards => {
            // Fisher-Yates shuffle
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            cards.slice(0, 3).forEach(card => {
                const img = document.createElement('img');
                img.src = card.file;
                img.width = card.w;
                img.height = card.h;
                img.alt = 'A Bodgeman greeting card';
                featured.appendChild(img);
            });
            document.getElementById('gallery-link').hidden = false;
            observeImages(featured);
        }).catch(err => console.error('Could not load cards', err));
    }

    // Gallery page: every card, with a simple lightbox
    const grid = document.getElementById('card-grid');
    if (grid) {
        loadCards().then(cards => {
            const count = document.getElementById('gallery-count');
            if (count) count.textContent = 'Hundreds of cards and counting. Every one a disappointment.';

            const lightbox = document.getElementById('lightbox');
            const lbImg = document.getElementById('lb-img');
            let current = 0;
            const show = (i) => {
                current = (i + cards.length) % cards.length;
                lbImg.src = cards[current].file;
                lightbox.classList.add('open');
            };
            const close = () => lightbox.classList.remove('open');

            cards.forEach((card, i) => {
                const tile = document.createElement('button');
                tile.className = 'card-tile';
                tile.setAttribute('aria-label', `View card ${i + 1} of ${cards.length}`);
                const img = document.createElement('img');
                img.src = card.thumb;
                img.width = card.w;
                img.height = card.h;
                img.alt = 'A Bodgeman greeting card';
                img.loading = 'lazy';
                tile.appendChild(img);
                tile.addEventListener('click', () => show(i));
                grid.appendChild(tile);
            });
            observeImages(grid);

            document.getElementById('lb-close').addEventListener('click', close);
            document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
            document.getElementById('lb-next').addEventListener('click', () => show(current + 1));
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('open')) return;
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowLeft') show(current - 1);
                if (e.key === 'ArrowRight') show(current + 1);
            });
        }).catch(err => console.error('Could not load cards', err));
    }

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

            if(clickCount === 2) {
                button.textContent = "Can't catch me!";
            }
            if (clickCount === 3) {
                button.textContent = "Faster, faster!";
            }
            if (clickCount === 4) {
                button.textContent = "YEeeeEEeeeEE!";
            }


            // Update position
            posX += directionX * speed;
            posY += directionY * speed;

            // Apply new position
            button.style.transform = `translate(${posX}px, ${posY}px)`;
        };

        button.addEventListener('click', () => {
                speed += 2; // Increase speed on each click
                clickCount++; // Increment click count

            if (clickCount >= 5) {
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

    const patronButton = document.getElementById('patron-button');
    const investorButton = document.getElementById('investor-button');
    const fbiButton = document.getElementById('fbi-button');
    const bodgemanInfo = document.getElementById('bodgeman-info');

    const updateContent = (imageSrc, headerText, paragraphText) => {
        bodgemanInfo.innerHTML = `
            <img src="${imageSrc}" alt="${headerText}" style="max-width: 100%; height: auto;">
            <h2>${headerText}</h2>
            <p>${paragraphText}</p>
        `;
    };

    if (patronButton) {
        patronButton.addEventListener('click', () => {
            updateContent('images/patron.png', 
                'Thank you for your patronage!', 
                'Well that\'s about all we have to say ... we\'ve ... never had a real patron before.');
        });
    }

    if (investorButton) {
        investorButton.addEventListener('click', () => {
            updateContent('images/investor.png', 
                'Bodgeman can clean up!', 
                'Not visually -- no way! But financially -- oh, we can do some crazy stuff. Turns out, when you operate with zero spine for a few decades, you can make a lot of money. We\'re not sure what we\'ll do with it, but we\'re sure it\'ll be fun. Please direct all inquiries to our legal department, Calvin.');
        });
    }

    if (fbiButton) {
        fbiButton.addEventListener('click', () => {
            updateContent('images/fbi.png', 
                '🦅🦅 Hello sir or madam 🦅🦅',
                'We appreciate your service, and your interest in our high quality greeting cards. All cards are handmade in the greatest nation on earth, the great United States of America. Please enjoy your stay on our site, and honestly please just close this tab now.');
        });
    }
});
