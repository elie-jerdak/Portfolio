// cursor repulsion + interactive keyword wave

const title = document.querySelector("#title");

// 1. Wrap letters
title.innerHTML = title.innerHTML.replace(
  /(?![^<]*>)[^<\s]/g,
  (char) => `<span class="letter">${char}</span>`
);

const letters = Array.from(document.querySelectorAll(".letter"));

// 2. Cache positions
let letterData = letters.map((el) => {
  const rect = el.getBoundingClientRect();

  return {
    el,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    vx: 0,
    vy: 0
  };
});

// 3. Track mouse (cheap)
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// 4. Update positions on resize (important)
window.addEventListener("resize", () => {
  letterData.forEach((item) => {
    const rect = item.el.getBoundingClientRect();
    item.x = rect.left + rect.width / 2;
    item.y = rect.top + rect.height / 2;
  });
});

// 5. Animation loop (smooth 60fps control) for repulsion effect
function animate() {
  for (let i = 0; i < letterData.length; i++) {
    const l = letterData[i];

    const dx = l.x - mouseX;
    const dy = l.y - mouseY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 140;

    let forceX = 0;
    let forceY = 0;

    if (distance < maxDistance && distance > 0.0001) {
      const force = (1 - distance / maxDistance) * 30;

      forceX = (dx / distance) * force;
      forceY = (dy / distance) * force;
    }

    // smooth easing (inertia)
    l.vx += (forceX - l.vx) * 0.15;
    l.vy += (forceY - l.vy) * 0.15;

    l.el.style.transform = `translate(${l.vx}px, ${l.vy}px) scale(${1 + Math.abs(l.vx + l.vy) * 0.002})`;
  }

  requestAnimationFrame(animate);
}

animate();

// interactive keyword wave effect on scroll
function triggerWave() {
  const interactiveLetters = title.querySelectorAll(".wave-word .letter");

  interactiveLetters.forEach((letter, i) => {
    letter.style.animation = "none";
    void letter.offsetHeight;

    letter.style.animation = `wave 0.6s ease-in-out`;
    letter.style.animationDelay = `${i * 40}ms`;
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      triggerWave();
    }
  });
}, {
  threshold: 0.6
});

observer.observe(title);

// Ensure tsParticles initializes correctly once the DOM layer loads
(async () => {
  await loadSlim(tsParticles);
  
  await tsParticles.load({
    id: "tsparticles",
    options: {
        "key": "nasa",
        "name": "NASA",
        "particles": {
            "number": {
                "value": 50,
                "density": {
                    "enable": true
                }
            },
            "paint": {
                "fill": {
                    "color": {
                        "value": "#f0f0f0"
                    }
                }
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": {
                    "min": 0.1,
                    "max": 1
                },
                "animation": {
                    "enable": true,
                    "speed": 2,
                    "sync": false
                }
            },
            "size": {
                "value": {
                    "min": 1,
                    "max": 5
                }
            },
            "move": {
                "enable": true,
                "speed": {
                    "min": 0.1,
                    "max": 1
                }
            }
        },
        "interactivity": {
            "events": {
                "onHover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onClick": {
                    "enable": true,
                    "mode": "push"
                }
            },
            "modes": {
                "grab": {
                    "distance": 300,
                    "links": {
                    "opacity": 1
                    }
                },
                "push": {
                    "quantity": 4
                }
            }
        } 
    }
    });
})();


//dynamic loading of featured projects in home page:
async function loadFeaturedProjects() {
    const container = document.getElementById("featured-projects-container");

    if (!container) {
        console.error("Projects container not found.");
        return;
    }

    try {
        const response = await fetch("/projects/api/featured");

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const projects = await response.json();

        if (!projects || projects.length === 0) {
            container.innerHTML = `
                <p>No featured projects available.</p>
            `;
            return;
        }

        container.innerHTML = "";

        projects.forEach((project, index) => {

            const card = document.createElement("div");

            card.classList.add(
                "card",
                `card${index + 1}`
            );

            card.innerHTML = `
                <div>
                    <h2>${project.title}</h2>

                    <p>
                        ${project.description}
                    </p>
                </div>

                <a href="${project.url}" target="_blank" rel="noopener noreferrer">
                    View Project
                </a>
            `;

            container.appendChild(card);
 
        });

        initializeProjectAnimations(); //load animations after appending the card to the DOM

    } catch (error) {
        console.error("Error loading projects:", error);

        container.innerHTML = `
            <p>Unable to load projects.</p>
        `;
    }
}

loadFeaturedProjects();

//GSAP animations for projects section
function initializeProjectAnimations() {

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".projects",
            start: "top top",
            end: "center center",
            scrub: 1
        }
    });

    gsap.set(".card1", {
        xPercent: -50,
        yPercent: -30,
        rotate: -14
    });

    gsap.set(".card2", {
        xPercent: -50,
        yPercent: -30,
        rotate: 8
    });

    gsap.set(".card3", {
        xPercent: -50,
        yPercent: -30,
        rotate: -6
    });

    gsap.set(".project-header", {
        xPercent: 0,
        yPercent: -260
    });

    tl.to(".project-header", {
        y: -40,
        opacity: 1
    }, 0);

    tl.to(".card1", {
        x: -440,
        y: -60,
        rotate: 0
    }, 0);

    tl.to(".card2", {
        x: 0,
        y: 20,
        rotate: 0
    }, 0);

    tl.to(".card3", {
        x: 440,
        y: -60,
        rotate: 0
    }, 0);

}

