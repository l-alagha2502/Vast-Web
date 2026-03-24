document.addEventListener("DOMContentLoaded", () => {
    const enterScreen = document.getElementById("enter-screen");
    const mainContent = document.getElementById("main-content");
    const card = document.querySelector(".card");
    
    // Typewriter effect variables
    const messages = [
        "Staff at Vast",
        "Syrian & Muslim",
        "Bodybuilder & Sportsman",
        "“وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَىٰ بِاللَّهِ وَكِيلًا”"
    ];
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typewriterElement = document.getElementById("typewriter");
    
    // Add cursor
    typewriterElement.innerHTML = '<span id="text-span"></span><span class="cursor">&nbsp;</span>';
    const textSpan = document.getElementById("text-span");

    function typeWriter() {
        const currentMsg = messages[msgIndex];
        
        if (isDeleting) {
            textSpan.innerHTML = currentMsg.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textSpan.innerHTML = currentMsg.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 80;
        if (isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        if (!isDeleting && charIndex === currentMsg.length) {
            typeSpeed = 2000; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            msgIndex = (msgIndex + 1) % messages.length;
            typeSpeed = 500; // Pause before typing next message
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Click to enter logic
    enterScreen.addEventListener("click", () => {
        // Hide enter screen
        enterScreen.style.opacity = '0';
        enterScreen.style.visibility = 'hidden';
        
        // Show main content
        setTimeout(() => {
            mainContent.classList.remove("hidden");
            mainContent.classList.add("visible");
            
            // Start typewriter after a short delay
            setTimeout(() => {
                typeWriter();
            }, 500);
            
            // Start audio if any (uncomment and config to add music)
            // const audio = new Audio('song.mp3');
            // audio.volume = 0.5;
            // audio.play();
            
            // Add subtle tilt effect on mouse move
            document.addEventListener("mousemove", (e) => {
                if (mainContent.classList.contains("visible")) {
                    // Calculate subtle rotation (divide by higher number for less tilt)
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
                    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                }
            });

            // Reset tilt when mouse leaves window
            document.addEventListener("mouseleave", () => {
                card.style.transform = `rotateY(0deg) rotateX(0deg)`;
            });
            
            // Add sound effects (using generic mechanical thud / click sounds via external URL as placeholders)
            const hoverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
            hoverSound.volume = 0.15;
            
            const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
            clickSound.volume = 0.3;

            const interactiveElements = document.querySelectorAll('a, .social-link, .vast-widget, .badge-icon, .verified-icon');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    hoverSound.currentTime = 0;
                    hoverSound.play().catch(err => console.log('Audio overlap'));
                });
                
                el.addEventListener('click', () => {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(err => console.log('Audio overlap'));
                });
            });
            
        }, 500);
    });
});

// Copy Discord username to clipboard
window.copyDiscord = function() {
    navigator.clipboard.writeText("kr9b").then(() => {
        const tooltipElem = document.getElementById("discord-tooltip");
        if (tooltipElem) {
            tooltipElem.setAttribute("data-tooltip", "Copied!");
            setTimeout(() => {
                tooltipElem.setAttribute("data-tooltip", "Copy Discord");
            }, 2000);
        }
    });
};
