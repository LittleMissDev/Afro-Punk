console.log("script loaded", typeof gsap, typeof Lenis, document.querySelector('.text'));

let animationsInitialized = false;
let heroHeading;
let heroText;

const randomLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomLetter() {
    return randomLetters[Math.floor(Math.random() * randomLetters.length)];
}

// ==========================================
// HERO TEXT REVEAL
// ==========================================
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
    }, 0.1);
}

// ==========================================
// HERO HEADING SCRAMBLE
// ==========================================
function animateElements() {
    if (animationsInitialized) return;
    animationsInitialized = true;
    heroHeading.forEach((element) => {
        let originalText = element.textContent;
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
        }, 180);
    });
}

// ==========================================
// HERO ANIMATIONS — called after preloader
// ==========================================
function triggerHeroAnimations() {
    animateElements();
    animateHeroText();
    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        setTimeout(() => { punkImage.style.opacity = "1"; }, 1500);
    }
}

// ==========================================
// SHUFFLE HEADINGS ON SCROLL
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

// ==========================================
// ABOUT TEXT REVEAL
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
    }, 15);
}

// ==========================================
// TYPEWRITER EFFECT
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

// ==========================================
// MASTER DOM LOAD LISTENER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    // --- References ---
    heroHeading = document.querySelectorAll("h1");
    heroText = document.querySelector(".herotext");

    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        punkImage.style.opacity = "0";
        punkImage.style.transition = "opacity 1s ease-in";
    }

    // --- NAV STAGGER ANIMATION ---
    // runs first, isolated in its own try/catch so nothing can kill it
   try {
    const navElements = document.querySelectorAll("nav a.text");
    
    console.log("nav elements found:", navElements.length); // ADD THIS
    
    navElements.forEach((element) => {
        console.log("processing:", element.innerText); // ADD THIS
        
        let innerText = element.innerText;
        element.innerHTML = "";

        const makeBlock = () => {
            let block = document.createElement("div");
            block.classList.add("block");
            for (let letter of innerText) {
                let span = document.createElement("span");
                span.innerText = letter.trim() === "" ? "\u00A0" : letter;
                span.classList.add("letter");
                block.appendChild(span);
            }
            return block;
        };

        element.appendChild(makeBlock());
        element.appendChild(makeBlock());
    });

    navElements.forEach((element) => {
        element.addEventListener("mouseover", () => element.classList.add("play"));
        element.addEventListener("mouseout",  () => element.classList.remove("play"));
    });

} catch(e) {
    console.warn("Nav animation error:", e); // This will show if something crashes
}

    // --- GSAP + LENIS ---
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof Lenis !== 'undefined' && window.gsap) {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    // --- SVG PATH DRAW ---
    const paths = document.getElementById("stroke");
    if (paths && window.gsap) {
        const pathLength = paths.getTotalLength();
        paths.style.strokeDasharray  = pathLength;
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

    // --- MARQUEE ---
    document.querySelectorAll('.ticker').forEach(ticker => {
        const wrap     = ticker.querySelector('.ticker-wrap');
        const original = wrap?.querySelector('.ticker-text');
        if (!wrap || !original) return;
        const duration = parseFloat(ticker.getAttribute('data-duration')) || 10;
        const clone = original.cloneNode(true);
        wrap.appendChild(clone);
        wrap.style.display = 'flex';
        wrap.style.width   = 'max-content';
        wrap.style.gap     = '20px';
        requestAnimationFrame(() => {
            const itemWidth = original.offsetWidth;
            if (!itemWidth) return;
            const anim = gsap.to(wrap, {
                x: -itemWidth,
                duration,
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

    // --- FAQ ACCORDION ---
    document.querySelectorAll(".faqheading").forEach((heading) => {
        heading.style.pointerEvents = "auto";
        heading.addEventListener("click", (e) => {
            e.stopPropagation();
            const parentBox = heading.parentElement;
            const symbol    = heading.querySelector(".symbol");
            const isActive  = parentBox.classList.contains("active");
            document.querySelectorAll(".faqbox").forEach((box) => {
                box.classList.remove("active");
                const s = box.querySelector(".symbol");
                if (s) s.textContent = "+";
            });
            if (!isActive) {
                parentBox.classList.add("active");
                if (symbol) symbol.textContent = "-";
            }
        });
    });

    // --- SHUFFLE HEADINGS ON SCROLL ---
    document.querySelectorAll('h2, h3, h4, h5').forEach(heading => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    shuffleElement(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        obs.observe(heading);
    });

    // --- ABOUT TEXT REVEAL ---
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

    // --- TOKENOMICS POP ---
    const tokenBoxes = document.querySelectorAll('.box, .boxes, .boxy');
    if (tokenBoxes.length && window.gsap) {
        gsap.set(tokenBoxes, { scale: 0 });
        const tokenObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        scale: 1,
                        duration: 0.5,
                        ease: "back.out(1.7)",
                        delay: index * 0.1,
                    });
                    tokenObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        tokenBoxes.forEach(box => tokenObserver.observe(box));
    }

    // --- ROADMAP CARDS ---
    const roadmapCards = document.querySelectorAll('.rmap');
    if (roadmapCards.length && window.gsap) {
        roadmapCards.forEach(card => {
            card.querySelectorAll('p').forEach(p => {
                p.dataset.originalText = p.innerHTML;
                p.innerHTML = '';
            });
        });
        gsap.set(roadmapCards, { opacity: 0, scale: 0.9 });
        const roadmapObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.style.height   = card.offsetHeight + 'px';
                    card.style.overflow = 'hidden';
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => {
                            card.querySelectorAll('p').forEach((p, i) => {
                                setTimeout(() => typeWriterEffect(p, p.dataset.originalText), i * 200);
                            });
                        }
                    });
                    roadmapObserver.unobserve(card);
                }
            });
        }, { threshold: 0.3 });
        roadmapCards.forEach(card => roadmapObserver.observe(card));
    }

    // --- FAQ BOXES STAGGER ---
    const faqBoxes = document.querySelectorAll('.faqbox');
    if (faqBoxes.length && window.gsap) {
        gsap.set(faqBoxes, {
            opacity: 0, y: 30, scale: 0.95,
            rotation: (i) => i % 2 === 0 ? -2 : 2,
        });
        const faqObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(faqBoxes).indexOf(entry.target);
                    gsap.to(entry.target, {
                        opacity: 1, y: 0, scale: 1, rotation: 0,
                        duration: 0.8, delay: index * 0.15,
                        ease: "back.out(1.2)",
                    });
                    faqObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        faqBoxes.forEach(box => faqObserver.observe(box));
    }

    // --- FOOTER ANIMATIONS ---
    const footer = document.querySelector('.footer');
    if (footer && window.gsap) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(".footer-content p", {
                        opacity: 0, y: 50, duration: 1, ease: "power2.out",
                    });
                    gsap.from(".social-links .social-link", {
                        opacity: 0, y: 30, duration: 0.8,
                        ease: "power2.out", stagger: 0.2,
                    });
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        footerObserver.observe(footer);
    }

    // --- PRELOADER ---
    const counterElement = document.querySelector(".counter");
    const barElements    = document.querySelectorAll(".bar");

    if (counterElement && barElements.length && window.gsap) {
        let currentValue = 0;
        function updateCounter() {
            if (currentValue >= 100) return;
            currentValue += Math.floor(Math.random() * 10) + 1;
            if (currentValue > 100) currentValue = 100;
            counterElement.textContent = currentValue;
            setTimeout(updateCounter, Math.floor(Math.random() * 200) + 50);
        }
        updateCounter();

        gsap.to(counterElement, { opacity: 0, duration: 0.25, delay: 3.5 });
        gsap.to(".bar", {
            opacity: 0,
            duration: 1.5,
            delay: 3.5,
            stagger: { amount: 0.5 },
            ease: "power4.inOut",
            onComplete: triggerHeroAnimations,
        });

    } else {
        // No preloader — fire hero immediately
        triggerHeroAnimations();
    }

}); // end DOMContentLoaded