document.addEventListener('DOMContentLoaded', () => {
    // Load Header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Re-apply header scroll effect after header is loaded
            initHeaderScroll();
            // Set active navigation link based on current URL
            setActiveNavLink();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    function initHeaderScroll() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.navbar-custom');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('shadow');
                    header.classList.remove('shadow-sm');
                } else {
                    header.classList.remove('shadow');
                    header.classList.add('shadow-sm');
                }
            }
        });
    }

    function setActiveNavLink() {
        // Get the current page filename
        let currentPath = window.location.pathname;
        let pageName = currentPath.split("/").pop();
        
        // Default to index.html if the path is empty or ends with a slash
        if (pageName === "" || currentPath.endsWith("/")) {
            pageName = "index.html";
        }

        // Find all custom navigation links
        const navLinks = document.querySelectorAll('.nav-link-custom');
        
        navLinks.forEach(link => {
            // Check if the data-page attribute matches the current page name
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Swiper Initialization
    if (typeof Swiper !== 'undefined') {
        const heroSwiper = new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Testimonial Continuous Slider
        const testimonialSwiper = new Swiper('.testimonial-swiper', {
            loop: true,
            slidesPerView: 1.5, // Shows partial left and right slides on mobile (320px)
            centeredSlides: true,
            spaceBetween: 20,
            speed: 6000, // Slow continuous speed
            autoplay: {
                delay: 0, // No delay between transitions
                disableOnInteraction: false,
            },
            watchSlidesProgress: true,
            on: {
                progress: function(swiper) {
                    for (let i = 0; i < swiper.slides.length; i++) {
                        const slide = swiper.slides[i];
                        const progress = slide.progress;
                        const absProgress = Math.abs(progress);
                        
                        // Calculate effects based on exact distance from absolute center
                        const scale = 1 - Math.min(absProgress * 0.15, 0.15);
                        const opacity = 1 - Math.min(absProgress * 0.7, 0.7);
                        const blur = Math.min(absProgress * 4, 4);
                        
                        slide.style.opacity = opacity;
                        slide.style.transform = `scale(${scale})`;
                        slide.style.filter = `blur(${blur}px)`;
                        slide.style.zIndex = Math.round(10 - absProgress);
                    }
                },
                setTransition: function(swiper, transition) {
                    for (let i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.transition = `${transition}ms transform, ${transition}ms opacity, ${transition}ms filter`;
                    }
                }
            },
            breakpoints: {
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                }
            }
        });
    }

    // Intersection Observer for animated counters
    const counters = document.querySelectorAll('.counter');
    const speed = 50; 

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.disconnect(); // stop observing once counted
            }
        });
    };

    if (counters.length > 0) {
        const observer = new IntersectionObserver(animateCounters, {
            threshold: 0.5 
        });

        const counterSection = document.getElementById('counter-section');
        if (counterSection) {
            observer.observe(counterSection);
        }
    }
});
