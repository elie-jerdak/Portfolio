const path = require("path");
const prisma = require("../db");

exports.getExpertisePage = (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "views", "expertise", "index.html")
    );
};

const defaultTechnologies = [
    "ASP.NET Core",    "HTML5",    "CSS3",    "JavaScript",    "Bootstrap",    "Node.js",    "Express",    "Prisma",    "PostgreSQL",
    "MySQL",    "MongoDB",    "Python",    "Docker",    "Git",    "GitHub",    "Render",    "NumPy",    "Pandas",    "Scikit-Learn",
    "C#",    "SQL Server",    "Stripe"
];


const technologyIconMap = {

    // Frontend
    "HTML5": "html5",    "CSS3": "css3",    "JavaScript": "javascript",    "Bootstrap": "bootstrap",    "GSAP": "gsap",    "EJS": "ejs",

    // Backend
    "ASP.NET Core": "dotnet",    "Node.js": "nodejs",    "Express": "express",    "Prisma": "prisma",    "Sequelize": "sequelize",
    "Mongoose": "mongoose",

    // Databases
    "PostgreSQL": "postgresql",    "MySQL": "mysql",    "MongoDB": "mongodb",    "SQLite": "sqlite",    "SQL Server": "sqlserver",
    

    // Languages
    "Python": "python",    "C#": "csharp",

    // Data / AI
    "NumPy": "numpy",    "Pandas": "pandas",    "Scikit-Learn": "scikitlearn",    "Jupyter Notebook": "jupyter",

    // DevOps / Tools
    "Docker": "docker",    "Git": "git",    "GitHub": "github",    "Render": "render",

    // Services
    "Stripe": "stripe",    "Resend": "resend"

};


exports.getTechnologies = async (req, res) => {

    try {

        const projects = await prisma.projects.findMany({
            select: {
                technologies: true
            }
        });

        const projectTechnologies = projects
            .flatMap(project => project.technologies || [])
            .filter(Boolean);


        // Normalize icon mapping keys
        const normalizedIconMap = Object.fromEntries(
            Object.entries(technologyIconMap)
                .map(([key, value]) => [
                    key.toLowerCase().trim(),
                    value
                ])
        );


        // Merge defaults + database technologies and remove duplicates
        const uniqueTechnologies = [
            ...new Set([
                ...defaultTechnologies,
                ...projectTechnologies
            ]
            .filter(Boolean)
            .map(tech => tech.toLowerCase().trim()))
        ];


        const technologies = uniqueTechnologies
            .map(lowerTech => {


                // Find preferred display name
                const displayName =
                    defaultTechnologies.find(
                        tech =>
                            tech.toLowerCase().trim() === lowerTech
                    )
                    ||
                    projectTechnologies.find(
                        tech =>
                            tech.toLowerCase().trim() === lowerTech
                    )
                    ||
                    lowerTech;


                return {
                    name: displayName,
                    icon: normalizedIconMap[lowerTech] || "default"
                };

            })
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );


        res.json(technologies);


    }
    catch(error) {

        console.error(
            "Error retrieving technologies:",
            error
        );


        res.status(500).json({
            message: "Failed retrieving technologies"
        });

    }

};

const frontendTechnologies = [
    "html5",    "css3",    "javascript",    "bootstrap",    "gsap",    "ejs"
];

const backendTechnologies = [
    "asp.net core",    "node.js",    "express"
];

const ormTechnologies = [
    "prisma",    "sequelize",    "mongoose"
];

const databaseTechnologies = [
    "postgresql",    "mysql",    "mongodb",    "sqlite",    "sql server"
];

const toolingTechnologies = [
    "docker",    "git",    "github",    "render",    "stripe",    "resend"
];

exports.getExperienceStats = async (req, res) => {

    try {
        const projects = await prisma.projects.findMany({
            select: {
                technologies: true,
                url: true
            }
        });

        const deployedApplications =
            projects.filter(
                project =>
                    project.url &&
                    project.url.trim() !== ""
            ).length;

        const allTechnologies =
            projects.flatMap(
                project => project.technologies || []
            )
            .map(
                tech => tech.toLowerCase().trim()
            );

        const uniqueTechnologies =
            [
                ...new Set(allTechnologies)
            ].length;

        const fullStackProjects =
            projects.filter(project => {
                const tech =
                    project.technologies
                    .map(t => t.toLowerCase().trim());

                const hasFrontend = tech.some(t => frontendTechnologies.includes(t));

                const hasBackend =
                    tech.some(t => backendTechnologies.includes(t)) ||
                    tech.some(t => ormTechnologies.includes(t));

                const hasDatabase = tech.some(t => databaseTechnologies.includes(t));

                return hasFrontend && hasBackend && hasDatabase;
            }).length;

        const endToEndPercentage =
            projects.length === 0
                ? 0
                :
                Math.round(
                    (
                        projects.filter(
                            project =>
                                project.url &&
                                project.technologies.length > 0
                        ).length
                        /
                        projects.length
                    ) * 100
                );

        res.json({
            deployedApplications,
            uniqueTechnologies,
            fullStackProjects,
            endToEndPercentage
        });

    }
    catch(error){
        console.error(
            "Stats error:",
            error
        );

        res.status(500).json({
            message:"Failed loading experience stats"
        });

    }

};