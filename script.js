
let animationsInitialized = false;
let heroHeading;
let heroText;

const randomLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomLetter() {
    return randomLetters[Math.floor(Math.random() * randomLetters.length)];
}

document.addEventListener("DOMContentLoaded", () => {
    heroHeading = document.querySelectorAll("h1");
    heroText = document.querySelector(".herotext");
    animateElements();
    animateHeroText();
    
    // Intersection Observer for Mickey image
    const mickeyImage = document.querySelector(".Mickey");
    if (mickeyImage) {
        // Hide image initially
        mickeyImage.style.opacity = "0";
        mickeyImage.style.transition = "opacity 1s ease-in";
        
        // Make image slowly appear after page load
        setTimeout(() => {
            mickeyImage.style.opacity = "1";
        }, 1500);
    }
})

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


 //HeroText Reveal Animation

function animateHeroText() {
    if (!heroText) return;
    
    let originalHTML = heroText.innerHTML;
    let index = 0;

    const revealText = setInterval(() => {
        if (index <= originalHTML.length) {
            let substring = originalHTML.substring(0, index);
            
            // Check if we're in the middle of an HTML tag
            const lastOpenBracket = substring.lastIndexOf('<');
            const lastCloseBracket = substring.lastIndexOf('>');
            
            // If the last < comes after the last >, we're in the middle of a tag
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

//Staggered Animation for Navigation Links
let elements = document.querySelectorAll(".text");

elements.forEach((element) => { 
    let innerText = element.innerText;
    element.innerHTML = "";

    let textContainer = document.createElement("div");
    textContainer.classList.add("block");

    for (let letter of innerText) {
        let span = document.createElement("span");
        span.innerText = letter.trim() === "" ? "\u00A0" : letter; // Preserve spaces
        span.classList.add("letter");
        textContainer.appendChild(span);
    }

    element.appendChild(textContainer);
    element.appendChild(textContainer.cloneNode(true)); // Create duplicate for animation
});

elements.forEach((element) => {
    element.addEventListener("mouseover", () => {
        console.log("Hovering over:", element.textContent);
        element.classList.add("play");
        console.log("Play class added, class list:", element.className);
    });
    element.addEventListener("mouseout", () => {
        element.classList.remove("play");
    });
});

//SVG Path animation using GSAP and ScrollTrigger

// The GSAP and ScrollTrigger scripts are loaded via CDN in index.html.
// Remove module imports which break the non-module script.

// make sure ScrollTrigger plugin is registered once the CDN script has loaded
if (window.gsap && window.gsap.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

// you also need to include lenis via CDN, or remove the smooth-scrolling logic
// below assumes a global Lenis class provided by a <script> tag in index.html

document.addEventListener("DOMContentLoaded", () => {
    // initialize Lenis if available
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagsmoothing(0);
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
                // begin as soon as the section enters the viewport
                start: "top bottom",
                // extend the end a bit further up the page to lengthen the scroll distance
                end: "bottom 95%",
                // scrub value >1 slows the animation; 1 second of catch‑up time
                scrub: 3,
            },
        });
    }
});