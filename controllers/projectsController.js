const prisma = require("../db");
const path = require("path");

exports.getProjectsPage = (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "views", "projects" ,"index.html")
    );
}

exports.getProjects = async (req, res) => {
    const projects = await prisma.projects.findMany();

    if (projects.length === 0) {
        return res.status(404).json({
            message: "No projects found."
        });
    }

    res.json(projects);
};

exports.getFeaturedProjects = async (req, res) => {

    const projects = await prisma.projects.findMany({
        where: {
            featured: true
        },
        take: 3
    });

    if (projects.length === 0) {
        return res.status(404).json({
            message: "No projects found."
        });
    }

    res.json(projects);
};

exports.getProjectById = async (req,res)=>{

    const {id} = req.params;


    const project = await prisma.projects.findUnique({
        where:{
            id:Number(id)
        }
    });


    if(!project){
        return res.status(404).json({
            message:"Project not found"
        });
    }


    res.json(project);
};

