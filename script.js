
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