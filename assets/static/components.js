async function loadComponent(elementId, componentPath) {

    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Component container '${elementId}' not found.`);
        return;
    }

    try {

        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(
                `Failed to load component: ${componentPath}`
            );
        }

        const html = await response.text();

        element.innerHTML = html;


        // Execute scripts after injection
        const scripts = element.querySelectorAll("script");

        scripts.forEach(script => {

            const newScript = document.createElement("script");

            if (script.src) {
                newScript.src = script.src;
            }
            else {
                newScript.textContent = script.textContent;
            }

            document.body.appendChild(newScript);

        });


    } catch (error) {
        console.error("Component loading error:", error);
    }
}

async function initializeComponents() {

    const components = [
        loadComponent("navbar", "/components/navbar.html"),
        loadComponent("footer", "/components/footer.html")
    ];
 
    await Promise.all(components);
}

initializeComponents();
 