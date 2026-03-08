let animationsInitialized = false;
let heroHeading;
let heroText;

const randomLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomLetter() {
    return randomLetters[Math.floor(Math.random() * randomLetters.length)];
}

// HeroText Reveal Animation
function animateHeroText() {
    if (!heroText) return;
    let originalHTML = heroText.innerHTML;
    let index = 0;
    const revealText = setInterval(() => {
        if (index <= originalHTML.length) {
            let substring = originalHTML.substring(0, index);
            const lastOpenBracket = substring.lastIndexOf('<');
            const lastCloseBracket = substring.lastIndexOf('>');
            if (lastOpenBracket > lastCloseBracket) {
                index++;
            } else {
                heroText.innerHTML = substring;
                index++;
            }
        } else {
            clearInterval(revealText);
        }
    }, 15);
}

function animateElements(){
    if (animationsInitialized) return;
    animationsInitialized = true;
    heroHeading.forEach((element) => {
        let originalText = element.textContent;
        let index = 0;
        const shuffleElement = setInterval(() => {
            if (index < originalText.length){
                let shuffledText = "";
                for (let i = 0; i <= index; i++) {
                    shuffledText += i < index ? originalText[i] : getRandomLetter();
                }
                element.textContent = shuffledText + originalText.substring(index + 1);
                index++;
            } else{
                clearInterval(shuffleElement);
                element.textContent = originalText;
            }  
        }, 180);
    });
}

// ==========================================
// MASTER DOM LOAD LISTENER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Store references and set initial hidden state for punk image
    heroHeading = document.querySelectorAll("h1");
    heroText = document.querySelector(".herotext");

    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        punkImage.style.opacity = "0";
        punkImage.style.transition = "opacity 1s ease-in";
    }

    // 2. STAGGERED NAVIGATION LINKS
    let navElements = document.querySelectorAll(".text");
    navElements.forEach((element) => { 
        let innerText = element.innerText;
        element.innerHTML = "";
        let textContainer = document.createElement("div");
        textContainer.classList.add("block");

        for (let letter of innerText) {
            let span = document.createElement("span");
            span.innerText = letter.trim() === "" ? "\u00A0" : letter; 
            span.classList.add("letter");
            textContainer.appendChild(span);
        }
        element.appendChild(textContainer);
        element.appendChild(textContainer.cloneNode(true)); 
    });

    navElements.forEach((element) => {
        element.addEventListener("mouseover", () => {
            element.classList.add("play");
        });
        element.addEventListener("mouseout", () => {
            element.classList.remove("play");
        });
    });

    // 3. GSAP AND LENIS 
    if (window.gsap && window.gsap.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    const paths = document.getElementById("stroke");
    if (paths) {
        const pathLength = paths.getTotalLength();
        paths.style.strokeDasharray = pathLength;
        paths.style.strokeDashoffset = pathLength;
        gsap.to(paths, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".roadmap",
                start: "top bottom",
                end: "bottom 95%",
                scrub: 3,
            },
        });
    }

    // 4. MARQUEE ANIMATION
    document.querySelectorAll('.ticker').forEach(ticker => {
        const wrap = ticker.querySelector('.ticker-wrap');
        const original = wrap?.querySelector('.ticker-text');
        if (!wrap || !original) return;

        const duration = parseFloat(ticker.getAttribute('data-duration')) || 10;
        const clone = original.cloneNode(true);
        wrap.appendChild(clone);

        wrap.style.display = 'flex';
        wrap.style.width = 'max-content';
        wrap.style.gap = '20px';  

        requestAnimationFrame(() => {
            const itemWidth = original.offsetWidth;
            if (itemWidth === 0) return;

            const anim = gsap.to(wrap, {
                x: -itemWidth,
                duration: duration,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: (x, target) => {
                        if (parseFloat(x) <= -itemWidth) {
                            gsap.set(target, { x: 0 });
                            return '0px';
                        }
                        return x;
                    }
                }
            });
            ticker.addEventListener('mouseenter', () => anim.pause());
            ticker.addEventListener('mouseleave', () => anim.resume());
        });
    });

    // ACCORDION FAQ MENU
    const faqHeadings = document.querySelectorAll(".faqheading");

    faqHeadings.forEach((heading) => {
        heading.style.pointerEvents = "auto";
        heading.addEventListener("click", (e) => {
            e.stopPropagation();
            const parentBox = heading.parentElement;
            const symbol = heading.querySelector(".symbol");
            const isActive = parentBox.classList.contains("active");

            // close everything
            document.querySelectorAll(".faqbox").forEach((box) => {
                box.classList.remove("active");
                const boxSymbol = box.querySelector(".symbol");
                if (boxSymbol) boxSymbol.textContent = "+";
            });

            // if we were closed, open
            if (!isActive) {
                parentBox.classList.add("active");
                symbol.textContent = "-";
            }
        });
    });
});

// FOOTER ANIMATIONS using Intersection Observer
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.from(".footer-content p", {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out",
            });

            gsap.from(".social-links .social-link", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.2,
            });

            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

footerObserver.observe(document.querySelector('.footer'));

// ==========================================
// SHUFFLE HEADINGS ON SCROLL (Intersection Observer)
// ==========================================
function shuffleElement(element) {
    if (element.dataset.shuffled === 'true') return;
    element.dataset.shuffled = 'true';

    const originalText = element.textContent;
    let index = 0;

    const shuffleInterval = setInterval(() => {
        if (index < originalText.length) {
            let shuffledText = "";
            for (let i = 0; i <= index; i++) {
                shuffledText += i < index ? originalText[i] : getRandomLetter();
            }
            element.textContent = shuffledText + originalText.substring(index + 1);
            index++;
        } else {
            clearInterval(shuffleInterval);
            element.textContent = originalText;
        }
    }, 100);
}

const headingsToShuffle = document.querySelectorAll('h2, h3, h4, h5');
const shuffleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            shuffleElement(entry.target);
            shuffleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

headingsToShuffle.forEach(heading => shuffleObserver.observe(heading));

// ==========================================
// REVEAL ABOUT TEXT ON SCROLL
// ==========================================
function revealText(element) {
    if (element.dataset.revealed === 'true') return;
    element.dataset.revealed = 'true';

    const originalHTML = element.innerHTML;
    let index = 0;

    const revealInterval = setInterval(() => {
        if (index <= originalHTML.length) {
            let substring = originalHTML.substring(0, index);
            const lastOpenBracket = substring.lastIndexOf('<');
            const lastCloseBracket = substring.lastIndexOf('>');
            if (lastOpenBracket > lastCloseBracket) {
                index++;
            } else {
                element.innerHTML = substring;
                index++;
            }
        } else {
            clearInterval(revealInterval);
            element.innerHTML = originalHTML;
        }
    }, 0.2);
}

const aboutPunkElement = document.querySelector('.aboutpunk');
if (aboutPunkElement) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealText(entry.target);
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutPunkElement);
}

// ==========================================
// TOKENOMICS BOXES POP ANIMATION
// ==========================================
const tokenBoxes = document.querySelectorAll('.box, .boxes, .boxy');
if (tokenBoxes.length > 0) {
    gsap.set(tokenBoxes, { scale: 0 });
    const tokenObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const box = entry.target;
                gsap.to(box, {
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    delay: index * 0.1,
                });
                tokenObserver.unobserve(box);
            }
        });
    }, { threshold: 0.3 });
    tokenBoxes.forEach(box => tokenObserver.observe(box));
}

// ==========================================
// ROADMAP CARDS: FADE IN + TEXT TYPING
// ==========================================
function typeWriterEffect(element, text) {
    if (element.dataset.typed === 'true') return;
    element.dataset.typed = 'true';

    element.innerHTML = '';
    let index = 0;

    const typeInterval = setInterval(() => {
        if (index <= text.length) {
            element.innerHTML = text.substring(0, index);
            index++;
        } else {
            clearInterval(typeInterval);
            element.innerHTML = text;
        }
    }, 7);
}

const roadmapCards = document.querySelectorAll('.rmap');
if (roadmapCards.length) {
    roadmapCards.forEach(card => {
        const paragraphs = card.querySelectorAll('p');
        paragraphs.forEach(p => {
            const originalText = p.innerHTML;
            p.dataset.originalText = originalText;
            p.innerHTML = '';
        });
    });

    gsap.set(roadmapCards, { opacity: 0, scale: 0.9 });

    const roadmapObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                        const paragraphs = card.querySelectorAll('p');
                        paragraphs.forEach((p, i) => {
                            setTimeout(() => {
                                typeWriterEffect(p, p.dataset.originalText);
                            }, i * 200);
                        });
                    }
                });
                roadmapObserver.unobserve(card);
            }
        });
    }, { threshold: 0.3 });

    roadmapCards.forEach(card => roadmapObserver.observe(card));
}

// ==========================================
// FAQ BOXES STAGGERED APPEARANCE
// ==========================================
const faqBoxes = document.querySelectorAll('.faqbox');
if (faqBoxes.length) {
    gsap.set(faqBoxes, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        rotation: (i) => i % 2 === 0 ? -2 : 2,
    });

    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const box = entry.target;
                const index = Array.from(faqBoxes).indexOf(box);
                gsap.to(box, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: "back.out(1.2)",
                });
                faqObserver.unobserve(box);
            }
        });
    }, { threshold: 0.3 });

    faqBoxes.forEach(box => faqObserver.observe(box));
}

// ==========================================
// PRELOADER ANIMATION
// ==========================================
function startLoader(){
    let counterElement = document.querySelector(".counter");
    let currentValue = 0;

    function updateCounter() {
        if(currentValue === 100) return;
        currentValue += Math.floor(Math.random() * 10) + 1;
        if (currentValue > 100) currentValue = 100;
        counterElement.textContent = currentValue;
        let delay = Math.floor(Math.random() * 200) + 50;
        setTimeout(updateCounter, delay);
    }
    updateCounter();
}

startLoader();
gsap.to(".counter", 0.25, {
    delay: 3.5,
    opacity: 0,
});
gsap.to(".bar", 1.5, {
    delay: 3.5,
    opacity: 0,
    stagger: { amount: 0.5 },
    ease: "power4.inOut",
});

// ==========================================
// TRIGGER HERO ANIMATIONS AFTER PRELOADER
// ==========================================
gsap.delayedCall(3.5, () => {
    animateElements();
    animateHeroText();
    // Punk image fade‑in (starts 1.5s after preloader ends, replicating original delay)
    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        setTimeout(() => {
            punkImage.style.opacity = "1";
        }, 1500);
    }
});