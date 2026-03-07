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
    animationsInitialized = true
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
    
    // 1. HERO ANIMATIONS
    heroHeading = document.querySelectorAll("h1");
    heroText = document.querySelector(".herotext");
    animateElements();
    animateHeroText();
    
    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        punkImage.style.opacity = "0";
        punkImage.style.transition = "opacity 1s ease-in";
        setTimeout(() => {
            punkImage.style.opacity = "1";
        }, 1500);
    }

    // 2. STAGGERED NAVIGATION LINKS (Now protected!)
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
        gsap.ticker.lagSmoothing(0); // <-- FIXED TYPO (Capital S)
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

    //ACCORDION FAQ MENU
    console.log("✓ Accordion init reached");
    
    // Global click listener to debug
    document.addEventListener("click", (e) => {
        console.log("Click detected on:", e.target);
    });

    const faqHeadings = document.querySelectorAll(".faqheading");
    console.log("Found " + faqHeadings.length + " FAQ headings");

    faqHeadings.forEach((heading) => {
        console.log("Attaching click listener to:", heading);
        heading.style.pointerEvents = "auto";
        heading.addEventListener("click", (e) => {
            console.log("FAQ heading clicked", e);
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

            // Stop observing after animation
            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

footerObserver.observe(document.querySelector('.footer'));