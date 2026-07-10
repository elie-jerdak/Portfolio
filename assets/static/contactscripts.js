const waveKeyword = document.querySelector(".wave-word");

//directly keyword wave 
function triggerWave() {
    

    // 1. Wrap letters
    waveKeyword.innerHTML = waveKeyword.innerHTML.replace(
    /(?![^<]*>)[^<\s]/g,
    (char) => `<span class="letter">${char}</span>`
    );

    const letters = Array.from(document.querySelectorAll(".letter"));

    const interactiveLetters = waveKeyword.querySelectorAll(".wave-word .letter");

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

observer.observe(waveKeyword);


// Ensure tsParticles initializes correctly once the DOM layer loads
(async () => {
  await loadSlim(tsParticles);
  
  await tsParticles.load({
          id: "contact-particles",
          options: {
        "key": "responsive",
        "name": "Responsive",
        "particles": {
          "number": {
            "value": 60,
            "density": {
              "enable": false
            }
          },
          "paint": {
            "fill": {
              "color": {
                "value": "hsl(156, 51%, 14%)"
              },
              "enable": true
            }
          },
          "shape": {
            "type": "circle"
          },
          "opacity": {
            "value": 0.5
          },
          "size": {
            "value": {
              "min": 3,
              "max": 15
            }
          },
          "links": {
            "enable": true,
            "distance": 100,
            "color": "#f0f0f0",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1
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
              "distance": 200,
              "links": {
                "opacity": 1,
                "color": "hsl(156, 51%, 14%);"
              }
            },
            "bubble": {
              "distance": 50,
              "size": 40,
              "duration": 2,
              "opacity": 0.8
            },
            "repulse": {
              "distance": 50
            },
            "push": {
              "quantity": 4
            },
            "remove": {
              "quantity": 2
            }
          }
        },
        "responsive": [
          {
            "maxWidth": 600,
            "options": {
              "particles": {
                "paint": {
                  "fill": {
                    "color": {
                      "value": "hsl(156, 51%, 14%)"
                    },
                    "enable": true
                  }
                },
                "number": {
                  "value": 60
                }
              }
            }
          },
          {
            "maxWidth": 1000,
            "options": {
              "particles": {
                "paint": {
                  "fill": {
                    "color": {
                      "value": "hsl(156, 51%, 14%)"
                    },
                    "enable": true
                  }
                },
                "number": {
                  "value": 60
                }
              }
            }
          }
        ],
        "background": {
          "color": "transparent"
        },
        "fullScreen": {
          "enable": false
        },
      }
    });
})();

// submit message button
document.getElementById("contact-form").addEventListener("submit", async(e)=>{

    e.preventDefault();

    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData);

    try {

        const response = await fetch("/contact/api/send", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });


        const result = await response.json();


        if(!response.ok){
            throw new Error(result.message);
        }


        alert("Message sent successfully!");

        e.target.reset();


    }
    catch(error){

        console.error(error);

        alert("Failed to send message.");

    }

});


// initialize availability + resume CTA GSAP animation
function initializeAvailabilityAnimation(){

    gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({
    scrollTrigger: {
    trigger: ".availability-cta",
    start: "top 50%",
    end: "top 15%",
    scrub: 1
    } 
  })
  .from(".availability", {
      x: () => -window.innerWidth,
      ease: "none"
  }, 0)
  .from(".resume", {
      x: () => window.innerWidth,
      ease: "none"
  }, 0);

}

function initializeContactCardsAnimation() {

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
        ".contact-card .card",
        {
            y: 150,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            stagger: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-card",
                start: "top 75%",
                end: "top 30%",
                scrub: 1
            }
        }
    );
}

initializeAvailabilityAnimation();
initializeContactCardsAnimation();