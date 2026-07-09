//dynamic loading of projects in projects page:
async function loadAllProjects() {
    const container = document.getElementById("all-projects-container");

    if (!container) {
        console.error("Projects container not found.");
        return;
    }

    try {
        const response = await fetch("/projects/api");

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
                "card" 
            );

            card.innerHTML = `
                <div class="card-header">
                    <h5>${project.title}</h5>
                    <h6>${project.category}</h6>
                </div>
                <div class="tech-stack">
                    ${project.technologies.map((tech) => 
                        `<h6 class="badge tech-badge">${tech}</h6>`
                    ).join("")}
                </div>
                <div class="card-links">
                    <button class="details-btn" data-id="${project.id}">
                        Click to see more details
                    </button>
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer">
                        Go to project
                    </a>
                </div>
            `;

            container.appendChild(card);
 
        });

    } catch (error) {
        console.error("Error loading projects:", error);

        container.innerHTML = `
            <p>Unable to load projects.</p>
        `;
    }
}

loadAllProjects();

//dynamic loading of project details in modal
document.addEventListener("click", async (e)=>{


    if(!e.target.classList.contains("details-btn"))
        return;


    const id = e.target.dataset.id;


    try {

        const response = await fetch(`/projects/api/${id}`);

        if (!response.ok) {
            throw new Error("Failed loading project");
        }

        const project = await response.json();

        // Title
        document.getElementById("modalTitle").textContent =
            project.title;

        // Description
        document.getElementById("modalDescription").textContent =
            project.description;

        // Technologies
        const techContainer = document.getElementById("modalTechnologies");

        techContainer.innerHTML = project.technologies
            .map(tech => `<h6>${tech}</h6>`)
            .join("");

        // Live Project
        const projectLink = document.getElementById("modalLink");

        projectLink.href = project.url;
        projectLink.style.display = project.url ? "inline-block" : "none";

        // GitHub
        const githubLink = document.getElementById("modalGithubLink");

        githubLink.href = project.githubUrl;
        githubLink.style.display = project.githubUrl ? "inline-block" : "none";

        // Image
        const image = document.getElementById("modalImage");

        image.src = project.imageUrl || "/images/project-background-1.png";

        image.alt = `${project.title} Screenshot`;
        image.style.display = project.imageUrl ? "block" : "none";

        image.onerror = () => {
            image.src = "/images/project-background-1.png";
        }
        // Show modal
        const modal = new bootstrap.Modal(
            document.getElementById("projectModal")
        );

        modal.show();

    }
    catch (error) {

        console.error(error);

    }

});