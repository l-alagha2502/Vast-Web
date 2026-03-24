// Script for Premium Link-in-Bio Site

document.addEventListener('DOMContentLoaded', () => {
    const enterScreen = document.getElementById('enter-screen');
    const mainContent = document.getElementById('main-content');
    const bioElement = document.getElementById('typewriter-bio');
    const bgMusic = document.getElementById('bg-music');

    const bioTexts = [
        "I don’t chase. I replace",
        "Some chapters aren’t meant to be shared",
        "Your bitch"
    ];

    // Play a mechanical "thud" or click on document click using Web Audio API
    const playMechanicalClick = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // Create a smoother, shorter, softer click
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = 'sine'; // Sine wave is softer/smoother than square
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.05); // Much shorter duration
        } catch (e) {
            console.log("Audio API not supported");
        }
    };

    document.documentElement.addEventListener('click', playMechanicalClick);

    // Process "Click to Enter"
    enterScreen.addEventListener('click', () => {
        // Use GSAP for smooth entrance
        gsap.to(enterScreen, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                enterScreen.style.display = 'none';
                
                mainContent.classList.remove('hidden');
                
                // Animate main container in
                gsap.fromTo(mainContent, 
                    { opacity: 0, y: 50, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
                );
                
                // Start typewriter after a short delay
                setTimeout(() => {
                    startTypewriter(bioTexts);
                }, 800);
            }
        });
    });

    // Typewriter Effect for Bio Array
    let txtIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function startTypewriter(textsArray) {
        const currentText = textsArray[txtIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        
        bioElement.innerHTML = `<span class="text">${currentText.substring(0, charIndex)}</span><span class="typing-cursor"></span>`;
        
        let typeSpeed = isDeleting ? 50 : 120; // Slower typing speed
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            txtIndex = (txtIndex + 1) % textsArray.length;
            typeSpeed = 600; // Pause before typing next word
        }
        
        setTimeout(() => startTypewriter(textsArray), typeSpeed);
    }

    // Add glowing trail effect to buttons
    const links = document.querySelectorAll('.link-btn');
    links.forEach(link => {
        link.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), rgba(20, 20, 20, 0.5) 40%)`;
        });

        link.addEventListener('mouseleave', function () {
            this.style.background = 'rgba(20, 20, 20, 0.5)';
        });
    });
});