async function loadTechnologies() {

    const marquee = document.getElementById("technologies-marquee");

    if (!marquee) {
        console.error("Technologies marquee container not found.");
        return;
    }

    try {

        const response = await fetch("/expertise/api/technologies");

        if (!response.ok) {
            throw new Error(`Failed loading technologies: ${response.status}`);
        }


        const technologies = await response.json();


        console.log("Technologies received:", technologies);


        const invalidTechnologies = technologies.filter(
            tech => !tech.name || !tech.icon
        );


        if (invalidTechnologies.length > 0) {

            console.warn(
                "Technologies with missing data:",
                invalidTechnologies
            );

        }


        marquee.innerHTML = "";


        [...technologies, ...technologies]
            .forEach(tech => {


                const span = document.createElement("span");


                span.innerHTML = `
                    <img 
                        src="/images/technologies/${tech.icon}.svg"
                        alt="${tech.name ?? "Unknown"}"
                        loading="lazy">

                    <p>${tech.name ?? "Unknown"}</p>
                `; 

                marquee.appendChild(span);

            });


    }
    catch(error) {

        console.error(
            "Error loading technologies:",
            error
        );


        marquee.innerHTML = `
            <p>
                Unable to load technologies.
            </p>
        `;

    }

}

function initializeStatsAnimation(){


    gsap.registerPlugin(ScrollTrigger);


    document.querySelectorAll(".counter")
    .forEach(counter => {

        const number = counter.querySelector("span");

        const target = Number(counter.dataset.target);

        ScrollTrigger.create({

            trigger:counter,
            start:"top 80%",
            once:true,
            onEnter(){

                let obj = {
                    value:0
                };

                gsap.to(obj,{
                    value:target,
                    duration:2,
                    ease:"power4.out",
                    onUpdate(){

                        number.textContent =
                            Math.floor(obj.value)
                            + (target === 100 ? "%" : "+");
                    }
                });
            }
        });
    });
}

function emitSpark() {

    const timeline = document.querySelector(".timeline");
    const spark = document.querySelector(".timeline-spark");

    if (!timeline || !spark) return;

    const sparkRect = spark.getBoundingClientRect();
    const timelineRect = timeline.getBoundingClientRect();

    const x = sparkRect.left - timelineRect.left + sparkRect.width / 2;
    const y = sparkRect.top - timelineRect.top + sparkRect.height / 2;

    const colors = [
        "#ffffff",
        "#ffe66d",
        "#ffb703",
        "#fb8500",
        "#ff5400"
    ];

    const particle = document.createElement("div");

    particle.className = "spark-particle";

    timeline.appendChild(particle);

    gsap.set(particle, {
        left: x,
        top: y,
        width: gsap.utils.random(2, 6),
        height: gsap.utils.random(2, 6),
        borderRadius: "50%",
        background: gsap.utils.random(colors),
        boxShadow: `0 0 8px ${gsap.utils.random(colors)}`
    });

    gsap.to(particle, {

        x: gsap.utils.random(-18, 18),
        y: gsap.utils.random(-35, -8),

        scale: 0,

        opacity: 0,

        duration: gsap.utils.random(.35, .8),

        ease: "power1.out",

        onComplete() {

            particle.remove();

        }

    });

}

function initializeTimeline() {

    gsap.registerPlugin(ScrollTrigger);

    const timeline = document.querySelector(".timeline");
    const spark = document.querySelector(".timeline-spark");
    const progress = document.querySelector(".timeline-progress");

    const steps = gsap.utils.toArray(".timeline-step");


    // Initial states
    gsap.set(".timeline-card", {
        autoAlpha: 0,
        scale: 0.9,
        y: (i, target) =>
            target.closest(".top") ? -50 : 50
    });


    gsap.set(".timeline-dot", {
        backgroundColor: "var(--secondaryHi)",
        boxShadow: "0 0 0 transparent"
    });


    gsap.set(progress, {
        scaleX: 0,
        transformOrigin: "left center"
    });


    /*
        Calculate real dot positions
    */

    const timelineRect = timeline.getBoundingClientRect();


    const dotPositions = steps.map(step => {

        const dot = step.querySelector(".timeline-dot");

        const dotRect = dot.getBoundingClientRect();

        return (
            dotRect.left -
            timelineRect.left +
            dotRect.width / 2
        );

    });



    const tl = gsap.timeline({

        scrollTrigger: {
            trigger: ".timeline",
            start: "top 5%",
            end: "bottom 30%",
            scrub: 1, 
            pin: true, 
            onLeave() {
                gsap.ticker.remove(emitSpark);
            },

            onLeaveBack() {
                gsap.ticker.remove(emitSpark);
            },

            onEnter() {
                gsap.ticker.add(emitSpark);
            },

            onEnterBack() {
                gsap.ticker.add(emitSpark);
            }
        }

    });



    steps.forEach((step,index)=>{

        const sparkPercentage =
            (dotPositions[index] / timelineRect.width) * 100;

        /* Move spark AND extend fuse together */

        tl.to(spark, {
            left: `${sparkPercentage}%`,
            duration: 1,
            ease: "none"
        });

        tl.to(progress, {
            scaleX: sparkPercentage / 100,
            duration: 1,
            ease: "none"
        }, "<");

        /* Ignite dot */

        tl.to(step.querySelector(".timeline-dot"), {

            backgroundColor:"white",
            boxShadow: `
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 25px rgba(255, 255, 255, 0.5),
                0 0 45px rgba(255, 255, 255, 0.2)
            `,
            duration:.2
        });

        /* Reveal card */

        tl.to(step.querySelector(".timeline-card"), {
            autoAlpha:1,
            scale:1,
            y:0,
            duration:.5,
            ease:"back.out(1.5)"
        });

        // small pause
        tl.to({},{
            duration:.2
        });

    });
}

// function initializeExpertiseAnimation() {

//     const cards = gsap.utils.toArray(".expertise-card");

//     const tl = gsap.timeline();

//     tl.from(".engineering-expertise h1", {
//         opacity: 0,
//         y: -40,
//         duration: 0.7,
//         ease: "power3.out"
//     })

//     .from(".engineering-expertise p", {
//         opacity: 0,
//         y: 20,
//         duration: 0.5
//     }, "-=0.35");

//     cards.forEach((card, index) => {

//         const column = index % 3;

//         let vars = {
//             opacity: 0,
//             duration: 1,
//             ease: "power3.out"
//         };

//         if (column === 0) {
//             // Starts off-screen to the left
//             vars.x = -window.innerWidth;
//         }
//         else if (column === 1) {
//             // Starts above the viewport
//             vars.y = -window.innerHeight;
//         }
//         else {
//             // Starts off-screen to the right
//             vars.x = window.innerWidth;
//         }

//         tl.from(card, vars, "-=0.55");

//         tl.eventCallback("onComplete", () => {
//             document.querySelectorAll(".expertise-card").forEach(card => {
//                 card.classList.add("hover-ready");
//             });
//         });
//     });

    
// }

function initializeExpertiseAnimation() {

    const cards = gsap.utils.toArray(".expertise-card");

    const tl = gsap.timeline();

    tl.from(".engineering-expertise h1", {
        opacity: 0,
        y: -40,
        duration: 0.7,
        ease: "power3.out"
    })

    .from(".engineering-expertise p", {
        opacity: 0,
        y: 20,
        duration: 0.5
    }, "-=0.35");

    cards.forEach((card, index) => {

        const column = index % 3;

        let vars = {
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        };

        if (column === 0) {
            vars.x = -window.innerWidth;
        }
        else if (column === 1) {
            vars.y = -window.innerHeight;
        }
        else {
            vars.x = window.innerWidth;
        }

        tl.from(card, vars, "-=0.55");
    });

    // set once, after all card tweens are added to the timeline
    tl.eventCallback("onComplete", () => {
        cards.forEach(card => {
            gsap.set(card, { clearProps: "transform,opacity" });
            card.classList.add("hover-ready");
        });
    });
}

loadTechnologies();
initializeStatsAnimation();
initializeTimeline();
initializeExpertiseAnimation();