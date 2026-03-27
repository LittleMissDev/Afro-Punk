// ==========================================
// MOBILE ADDRESS BAR BOUNCE FIX
// ==========================================
const lockHeroHeight = () => {
    // Get the exact pixel height of the screen on load
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};
// Run it immediately
lockHeroHeight();

// Only recalculate if the user rotates their phone sideways, 
// NOT when they scroll up and down!
let currentWindowWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== currentWindowWidth) {
        currentWindowWidth = window.innerWidth;
        lockHeroHeight();
    }
});

// ==========================================
// FORCE SCROLL TO TOP ON REFRESH
// ==========================================
if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// SHOW SIDEBAR
function showSidebar() {
    document.querySelector(".sidebar").classList.add("active");
}

// HIDE SIDEBAR
function hideSidebar() {
    document.querySelector(".sidebar").classList.remove("active");
}

//TEXT SHUFFLE ANIMATION
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
    
    // 1. Grab the text and IMMEDIATELY empty it so it hides behind the preloader
    let originalHTML = heroText.innerHTML;
    heroText.innerHTML = ""; 
    
    let index = 0;
    
    // 2. Wait 1 second for the red bars to fade enough to see through them
    setTimeout(() => {
        const revealText = setInterval(() => {
            if (index <= originalHTML.length) {
                let substring = originalHTML.substring(0, index);
                
                // This logic safely skips over your <br> tags
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
        }, 8); // 3. Changed from 0.1ms to 20ms for a visible, cinematic typewriter effect
    }, 1000); // The 1-second delay
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

    // --- ADDED THIS TO BRING BACK HIDDEN ELEMENTS ---
    // This tells GSAP to fade the nav, header, hamburger, and FAQ back in 
    // right after the loading screen finishes.
    if (window.gsap) {
        gsap.to("nav, header, .hamburger-btn, .faq", {
            opacity: 1,
            visibility: "visible", // This overrides your CSS 'visibility: hidden'
            duration: 1.5,
            delay: 0.5,            // Waits half a second after the hero loads
            ease: "power2.out"
        });
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
// CLIPBOARD COPY
// ==========================================
function initClipboard() {
    const clipButton = document.querySelector(".clipbutton");
    const contractInput = document.querySelector(".contract");

    if (!clipButton || !contractInput) return;

    clipButton.addEventListener("click", () => {
        const textToCopy = contractInput.value.trim();

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopiedFeedback(clipButton);
            }).catch(() => {
                fallbackCopy(contractInput, clipButton);
            });
        } else {
            fallbackCopy(contractInput, clipButton);
        }
    });
}

function fallbackCopy(inputEl, buttonEl) {
    inputEl.select();
    inputEl.setSelectionRange(0, 99999); 
    try {
        document.execCommand("copy");
        showCopiedFeedback(buttonEl);
    } catch (err) {
        console.warn("Copy failed:", err);
    }
    window.getSelection().removeAllRanges();
}

function showCopiedFeedback(button) {
    const icon = button.querySelector("i");

    if (icon) {
        icon.classList.remove("fa-copy");
        icon.classList.add("fa-check");
        icon.style.color = "green";
    }

    button.style.backgroundColor = "rgb(180, 230, 180)";

    let tooltip = document.querySelector(".copy-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("span");
        tooltip.className = "copy-tooltip";
        tooltip.textContent = "Copied!";
        tooltip.style.cssText = `
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            pointer-events: none;
            font-family: 'Druk Wide Bold', sans-serif;
            z-index: 100;
        `;
        const clipboard = document.querySelector(".clipboard");
        if (clipboard) {
            clipboard.style.position = "relative";
            clipboard.appendChild(tooltip);
        }
    }

    tooltip.style.opacity = "1";

    setTimeout(() => {
        if (icon) {
            icon.classList.remove("fa-check");
            icon.classList.add("fa-copy");
            icon.style.color = "rgba(2, 2, 2, 1.00)";
        }
        button.style.backgroundColor = "rgb(209, 207, 207)";
        if (tooltip) tooltip.style.opacity = "0";
    }, 1800);
}

// ==========================================
// MASTER DOM LOAD LISTENER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    heroHeading = document.querySelectorAll("h1");
    heroText = document.querySelector(".herotext");

    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        punkImage.style.opacity = "0";
        punkImage.style.transition = "opacity 1s ease-in";
    }

    initClipboard();

    // --- CLOSE SIDEBAR ON LINK CLICK ---
    // Finds all links inside the sidebar and tells them to hide the menu when clicked
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", () => {
            hideSidebar();
        });
    });

    try {
        const navElements = document.querySelectorAll("nav a.text");
        
       navElements.forEach((element) => {
            let innerText = element.textContent; // 
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
        console.warn("Nav animation error:", e); 
    }

   window.addEventListener("scroll", function(){
        const header = document.querySelector("nav");
        const hamburger = document.querySelector(".hamburger-btn");
        
        // Toggles sticky on desktop
        if (header) header.classList.toggle("sticky", window.scrollY > 0);
        
        // Toggles sticky on mobile
        if (hamburger) hamburger.classList.toggle("sticky", window.scrollY > 0);
    });

    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof Lenis !== 'undefined' && window.gsap) {
        const lenis = new Lenis();
        window.scrollTo(0, 0);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

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

   // --- PRELOADER (FIXED TIMING) ---
    const counterElement = document.querySelector(".counter");
    const barElements    = document.querySelectorAll(".bar");
    const overlayElement = document.querySelector(".overlay");

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

        // <-- THE FIX: This fires the Hero animations at the exact 
        // same 3.5-second mark that the bars begin to fade!
        gsap.delayedCall(3.5, triggerHeroAnimations);

        gsap.to(counterElement, { 
            opacity: 0, 
            duration: 0.25, 
            delay: 3.5,
            onComplete: () => {
                counterElement.style.display = "none";
            }
        });
        
        gsap.to(".bar", {
            opacity: 0,
            duration: 1.5,
            delay: 3.5,
            stagger: { amount: 0.5 },
            ease: "power4.inOut",
            onComplete: () => {
                if(overlayElement) overlayElement.style.display = "none";
            
            }
        });

    } else {
        triggerHeroAnimations();
    }
});