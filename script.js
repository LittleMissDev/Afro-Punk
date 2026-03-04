
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
    
    // Intersection Observer for Afro Punk image
    const punkImage = document.querySelector(".punk");
    if (punkImage) {
        // Hide image initially
        punkImage.style.opacity = "0";
        punkImage.style.transition = "opacity 1s ease-in";
        
        // Make image slowly appear after page load
        setTimeout(() => {
            punkImage.style.opacity = "1";
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



          //MARQUEE ANIMATION
document.addEventListener('DOMContentLoaded', () => {
  // Select all ticker containers
  document.querySelectorAll('.ticker').forEach(ticker => {
    const wrap = ticker.querySelector('.ticker-wrap');
    const original = wrap?.querySelector('.ticker-text');
    if (!wrap || !original) return;

    // Get duration from data-duration (default 10s if missing)
    const duration = parseFloat(ticker.getAttribute('data-duration')) || 10;

    // Clone the original text content
    const clone = original.cloneNode(true);
    wrap.appendChild(clone);

    // Ensure the wrap is a flex container and doesn't wrap
    wrap.style.display = 'flex';
    wrap.style.width = 'max-content';
    wrap.style.gap = '20px';          // matches your CSS gap

    // Wait a frame for layout to calculate widths
    requestAnimationFrame(() => {
      const itemWidth = original.offsetWidth;

      // If width is 0 (element hidden), fallback to a reasonable estimate
      if (itemWidth === 0) {
        console.warn('Ticker text width is zero – check visibility');
        return;
      }

      // Animate the wrap from 0 to -itemWidth (move left by one item)
      const anim = gsap.to(wrap, {
        x: -itemWidth,
        duration: duration,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x, target) => {
            // When the position reaches or passes -itemWidth, instantly reset to 0
            if (parseFloat(x) <= -itemWidth) {
              gsap.set(target, { x: 0 });
              return '0px';
            }
            return x;
          }
        }
      });

      // Pause/resume on hover
      ticker.addEventListener('mouseenter', () => anim.pause());
      ticker.addEventListener('mouseleave', () => anim.resume());
    });
  });
});


                  // ACCORDION MENU
 const faqboxes = document.querySelectorAll('.faqbox');

faqboxes.forEach(box => {
  box.addEventListener('click', function () {
    faqboxes.forEach(otherBox => {
      if (otherBox !== this) {
        otherBox.classList.remove('active');
        const otherSymbol = otherBox.querySelector('.symbol');
        if (otherSymbol) otherSymbol.textContent = '+';
      }
    });

    this.classList.toggle('active');
    const symbol = this.querySelector('.symbol');
    if (symbol) {
      symbol.textContent = this.classList.contains('active') ? '−' : '+';
    }
  });
});