document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const fullScreenMenu = document.getElementById("fullScreenMenu");
    const body = document.body;

    if (menuToggle && fullScreenMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("is-open");
            fullScreenMenu.classList.toggle("is-active");
            body.classList.toggle("menu-open");

            if (!fullScreenMenu.classList.contains("is-active")) {
                closeAllDropdowns();
            }
        });
    }

    const dropdowns = document.querySelectorAll(".custom-dropdown");

    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector(".dropdown-toggle");
        const dropdownList = dropdown.querySelector(".menu-item-dropdown-list");

        if (toggleBtn && dropdownList) {
            toggleBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = dropdown.classList.contains("is-open");

                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove("is-open");
                        const otherList = otherDropdown.querySelector(".menu-item-dropdown-list");
                        if (otherList) otherList.style.maxHeight = null;
                    }
                });

                if (!isOpen) {
                    dropdown.classList.add("is-open");
                    dropdownList.style.maxHeight = dropdownList.scrollHeight + "px";
                } else {
                    dropdown.classList.remove("is-open");
                    dropdownList.style.maxHeight = null;
                }
            });
        }
    });

    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove("is-open");
            const dropdownList = dropdown.querySelector(".menu-item-dropdown-list");
            if (dropdownList) dropdownList.style.maxHeight = null;
        });
    }
    const header = document.querySelector(".header");
    let lastScrollTop = 0;
    const scrollDelta = 10; 

    window.addEventListener("scroll", () => {
        if (fullScreenMenu && fullScreenMenu.classList.contains("is-active")) {
            return;
        }

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(lastScrollTop - scrollTop) <= scrollDelta) return;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            header.classList.add("scroll-hide");
        } else if (scrollTop < lastScrollTop) {
            header.classList.remove("scroll-hide");
        }
        
        lastScrollTop = scrollTop;
    });
});
window.addEventListener("load", () => {
    const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1.2 }
    });

    tl.to(".hero-intro-subtitle-wrapper", {
        opacity: 1,
        y: 0,
        startAt: { y: -20 },
        duration: 0.8
    });

    tl.to(".hero-intro-title", {
        y: "0%",
        stagger: 0.05,
        duration: 1.4
    }, "-=0.6"); 

    tl.to(".hero-intro-portrait-wrapper", {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.2");

    tl.to(".work-category", {
        opacity: 1,
        x: 0,
        stagger: 0.08,
        startAt: { x: (index) => index < 2 ? -15 : 15 }, 
        duration: 1
    }, "-=1.0");

    tl.to(".my-signature-wrapper", {
        opacity: 1,
        y: 0,
        startAt: { y: 15 },
        duration: 1,
        ease: "back.out(1.7)" 
    }, "-=0.5");
});document.addEventListener("DOMContentLoaded", () => {
    const heroContent = document.querySelector('.hero-intro-content-block');
    const heroSubtitle = document.querySelector('.hero-intro-subtitle-wrapper');
    const portrait = document.querySelector('.hero-intro-portrait-wrapper');

    if (!heroContent) return;

    const thresholdArray = [];
    for (let i = 0; i <= 100; i++) {
        thresholdArray.push(i / 100);
    }

    const observerOptions = {
        root: null,
        threshold: thresholdArray 
    };

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const visibleRatio = entry.intersectionRatio;

            heroContent.style.opacity = visibleRatio;
            
            if (heroSubtitle) heroSubtitle.style.opacity = visibleRatio;
            if (portrait) portrait.style.opacity = visibleRatio;

            const translateY = (1 - visibleRatio) * -30; 
            heroContent.style.transform = `translateY(${translateY}px)`;
        });
    }, observerOptions);

    heroObserver.observe(heroContent);
});
document.addEventListener("DOMContentLoaded", () => {
    const bioElement = document.querySelector('.short-bio');
    const socialElement = document.querySelector('.social-profiles-wrapper');

    if (!bioElement) return;

    const text = bioElement.innerText;
    bioElement.innerHTML = text.split(' ').map(word => {
        return `<span class="word">${word}</span>`;
    }).join(' ');

    const words = bioElement.querySelectorAll('.word');

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollTop > lastScrollTop) {
            scrollDirection = 'down';
        } else if (currentScrollTop < lastScrollTop) {
            scrollDirection = 'up';
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: "-8% 0px -8% 0px", 
        threshold: 0.1
    };

    const socialObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                socialElement.classList.remove('scroll-exit-down', 'scroll-exit-up', 'scroll-enter-up');
                socialElement.classList.add('scroll-enter-down');
            } else {
                if (scrollDirection === 'down') {
                    socialElement.classList.remove('scroll-enter-down', 'scroll-enter-up');
                    socialElement.classList.add('scroll-exit-down');
                } else {
                    socialElement.classList.remove('scroll-enter-down', 'scroll-enter-up');
                    socialElement.classList.add('scroll-exit-up');
                }
            }
        });
    }, observerOptions);

    const bioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bioElement.classList.remove('scroll-exit-down', 'scroll-exit-up', 'scroll-enter-up');
                bioElement.classList.add('scroll-enter-down');

                words.forEach((word, index) => {
                    word.style.transitionDelay = `${index * 0.03}s`; 
                });
            } else {
                bioElement.classList.remove('scroll-enter-down', 'scroll-enter-up');
                
                if (scrollDirection === 'down') {
                    bioElement.classList.add('scroll-exit-down');
                    words.forEach((word, index) => {
                        word.style.transitionDelay = `${index * 0.01}s`;
                    });
                } else {
                    bioElement.classList.add('scroll-exit-up');
                    words.forEach((word, index) => {
                        word.style.transitionDelay = `${(words.length - index) * 0.01}s`;
                    });
                }
            }
        });
    }, observerOptions);

    socialObserver.observe(socialElement);
    bioObserver.observe(bioElement);
});
document.addEventListener("DOMContentLoaded", () => {
    const serviceItems = document.querySelectorAll('.services-item');
    
    if (serviceItems.length === 0) return;

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollTop > lastScrollTop) {
            scrollDirection = 'down';
        } else if (currentScrollTop < lastScrollTop) {
            scrollDirection = 'up';
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: "-5% 0px -5% 0px", 
        threshold: 0.1
    };

    const servicesObserver = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        const leavingEntries = entries.filter(entry => !entry.isIntersecting);

        if (intersectingEntries.length > 0) {
            if (scrollDirection === 'up') {
                intersectingEntries.reverse(); 
            }

            intersectingEntries.forEach((entry, index) => {
                const el = entry.target;
                
                setTimeout(() => {
                    if (scrollDirection === 'down') {
                        el.classList.remove('service-hide-down', 'service-hide-up', 'service-reveal-up');
                        el.classList.add('service-reveal-down');
                    } else {
                        el.classList.remove('service-hide-down', 'service-hide-up', 'service-reveal-down');
                        el.classList.add('service-reveal-up');
                    }
                }, index * 120); 
            });
        }

        leavingEntries.forEach(entry => {
            const el = entry.target;
            el.classList.remove('service-reveal-down', 'service-reveal-up');

            if (scrollDirection === 'down') {
                el.classList.add('service-hide-down');
            } else {
                el.classList.add('service-hide-up');
            }
        });

    }, observerOptions);

    serviceItems.forEach(el => {
        el.classList.add('service-init-down');
        servicesObserver.observe(el);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.querySelector('.about-me');
    const titleElement = document.querySelector('.about-me-section-title');
    const textElements = document.querySelectorAll('.about-me-text');
    const buttonElement = document.querySelector('.arrow-button-block');
    const imageBlock = document.querySelector('.about-me-image-block');
    const parallaxImage = document.querySelector('.about-me-image');

    if (!aboutSection || !titleElement) return;

    const originalHTML = titleElement.innerHTML;
    const textNodes = titleElement.innerText.replace('.', '').split(' ');
    
    let splitHTML = textNodes.map(word => `<span class="word">${word}</span>`).join(' ');
    splitHTML += ` <span class="color-red">.</span>`;
    titleElement.innerHTML = splitHTML;

    const titleWords = titleElement.querySelectorAll('.word');

    const observerOptions = {
        root: null,
        rootMargin: "-10% 0px -10% 0px",
        threshold: 0.15
    };

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.classList.remove('about-hide-state');
                aboutSection.classList.add('about-reveal-active');

                titleWords.forEach((word, index) => {
                    word.style.transitionDelay = `${index * 0.05}s`;
                });

                textElements.forEach((text, index) => {
                    text.style.transitionDelay = `${(titleWords.length * 0.05) + (index * 0.15)}s`;
                });

                if (buttonElement) {
                    buttonElement.style.transitionDelay = `${(titleWords.length * 0.05) + (textElements.length * 0.15) + 0.1}s`;
                }
            } else {
                aboutSection.classList.remove('about-reveal-active');
                aboutSection.classList.add('about-hide-state');
                
                titleWords.forEach(w => w.style.transitionDelay = '0s');
                textElements.forEach(t => t.style.transitionDelay = '0s');
                if (buttonElement) buttonElement.style.transitionDelay = '0s';
            }
        });
    }, observerOptions);

    aboutObserver.observe(aboutSection);

    window.addEventListener('scroll', () => {
        if (!parallaxImage || !imageBlock) return;

        const blockRect = imageBlock.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (blockRect.top < windowHeight && blockRect.bottom > 0) {
            const totalRange = windowHeight + blockRect.height;
            const currentProgress = (windowHeight - blockRect.top) / totalRange;

            const parallaxTranslateY = (currentProgress - 0.5) * 60; 

            window.requestAnimationFrame(() => {
                parallaxImage.style.transform = `translateY(${parallaxTranslateY}px) scale(1.1)`;
            });
        }
    }, { passive: true });
});
document.addEventListener("DOMContentLoaded", () => {
    const skillsSection = document.querySelector('.skills-and-expertise');
    const skillBlocks = document.querySelectorAll('.skill-item-block');
    
    if (!skillsSection || skillBlocks.length === 0) return;

    const runOdometer = (element, targetValue) => {
        let startValue = 0;
        const duration = 1800; 
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(easeProgress * targetValue);
            element.innerText = `${currentValue}%`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerText = `${targetValue}%`;
            }
        };

        window.requestAnimationFrame(step);
    };

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: "-8% 0px -8% 0px", 
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsSection.classList.add('skills-active');
            } else {
                skillsSection.classList.remove('skills-active');
            }
        });
    }, observerOptions);

    sectionObserver.observe(skillsSection);

    const cardsObserver = new IntersectionObserver((entries) => {
        const intersectingCards = entries.filter(entry => entry.isIntersecting);
        const leavingCards = entries.filter(entry => !entry.isIntersecting);

        if (intersectingCards.length > 0) {
            if (scrollDirection === 'up') {
                intersectingCards.reverse();
            }

            intersectingCards.forEach((entry, index) => {
                const card = entry.target;
                
                if (!card.classList.contains('skill-revealed')) {
                    const percentElement = card.querySelector('.skill-percentage');
                    
                    if (!card.dataset.targetPercent) {
                        card.dataset.targetPercent = percentElement.innerText; 
                    }
                    
                    const targetPercent = parseInt(card.dataset.targetPercent, 10);

                    setTimeout(() => {
                        card.classList.remove('skill-hidden-state');
                        card.classList.add('skill-revealed');
                        card.style.setProperty('--skill-width', `${targetPercent}%`);

                        runOdometer(percentElement, targetPercent);
                    }, index * 120); 
                }
            });
        }

        leavingCards.forEach(entry => {
            const card = entry.target;
            
            card.classList.remove('skill-revealed');
            
            if (scrollDirection === 'down') {
                card.classList.add('skill-hidden-state');
            } else {
                card.classList.remove('skill-hidden-state');
            }
            
            const percentElement = card.querySelector('.skill-percentage');
            if (percentElement) {
                percentElement.innerText = '0%';
            }
            card.style.setProperty('--skill-width', '0%');
        });

    }, observerOptions);

    skillBlocks.forEach(block => {
        cardsObserver.observe(block);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const projectCards = document.querySelectorAll('.project-item-card');

    if (projectCards.length === 0) return;

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: "-10% 0px -10% 0px", 
        threshold: 0.15
    };

    const projectObserver = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        const leavingEntries = entries.filter(entry => !entry.isIntersecting);

        if (intersectingEntries.length > 0) {
            if (scrollDirection === 'up') {
                intersectingEntries.reverse();
            }

            intersectingEntries.forEach((entry, index) => {
                const card = entry.target;

                if (!card.classList.contains('project-card-revealed')) {
                    card.classList.remove('project-card-hidden-down', 'project-card-hidden-up');
                    card.classList.add('project-card-revealed');

                    const imageWrapper = card.querySelector('.project-card-image-wrapper');
                    const category = card.querySelector('.project-category-text');
                    const title = card.querySelector('.project-item-title-link');
                    const summary = card.querySelector('.project-summary');
                    const button = card.querySelector('.arrow-button-block');

                    if (imageWrapper) imageWrapper.style.transitionDelay = '0.1s';
                    
                    if (category) category.style.transitionDelay = '0.2s';
                    if (title) title.style.transitionDelay = '0.35s';
                    if (summary) summary.style.transitionDelay = '0.5s';
                    if (button) button.style.transitionDelay = '0.65s';
                }
            });
        }

        leavingEntries.forEach(entry => {
            const card = entry.target;
            
            card.classList.remove('project-card-revealed');

            const animElements = card.querySelectorAll('.project-card-image-wrapper, .project-category-text, .project-item-title-link, .project-summary, .arrow-button-block');
            animElements.forEach(el => el.style.transitionDelay = '0s');

            if (scrollDirection === 'down') {
                card.classList.add('project-card-hidden-down');
                card.classList.remove('project-card-hidden-up');
            } else {
                card.classList.add('project-card-hidden-up');
                card.classList.remove('project-card-hidden-down');
            }
        });

    }, observerOptions);

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const logoSection = document.querySelector('.company-logos-section');
    const logoWrapper = document.querySelector('.company-logo-wrapper');
    
    if (!logoSection || !logoWrapper) return;

    const originalItems = Array.from(logoWrapper.children);
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        logoWrapper.appendChild(clone);
    });

    const allItems = logoWrapper.querySelectorAll('.company-logo-item');

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logoSection.classList.add('logos-activated');

                allItems.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 80}ms`;
                });

                logoObserver.unobserve(logoSection);
            }
        });
    }, observerOptions);

    logoObserver.observe(logoSection);
});
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    const leftArrow = document.querySelector('.testimonial-slider-arrow-wrapper.left-arrow');
    const rightArrow = document.querySelector('.testimonial-slider-arrow-wrapper.right-arrow');
    const dotContainer = document.querySelector('.testimonial-slider-nav');

    if (slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    slides[0].classList.add('active-slide');

    if (dotContainer) {
        dotContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-slider-dot');
            if (index === 0) dot.classList.add('active-dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotContainer.appendChild(dot);
        });
    }

    const goToSlide = (targetIndex) => {
        if (targetIndex === currentIndex) return;

        slides[currentIndex].classList.remove('active-slide');

        currentIndex = (targetIndex + totalSlides) % totalSlides;

        slides[currentIndex].classList.add('active-slide');

        if (dotContainer) {
            const dots = dotContainer.querySelectorAll('.testimonial-slider-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active-dot');
                } else {
                    dot.classList.remove('active-dot');
                }
            });
        }
    };

    if (rightArrow) {
        rightArrow.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    if (leftArrow) {
        leftArrow.addEventListener('click', () => goToSlide(currentIndex - 1));
    }

    let autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 6000);

    const resetAutoPlay = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 6000);
    };

    if (leftArrow) leftArrow.addEventListener('click', resetAutoPlay);
    if (rightArrow) rightArrow.addEventListener('click', resetAutoPlay);
});
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.blog-card');
    
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const cardWidth = rect.width;
            const cardHeight = rect.height;
            const centerX = rect.left + cardWidth / 2;
            const centerY = rect.top + cardHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.centerY - centerY;
            
            const rotateX = (-mouseY / cardHeight) * 6; 
            const rotateY = (mouseX / cardWidth) * 6;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.08s linear, box-shadow 0.4s ease';
        });
    });
});