const Project = require('../models/Project');

// ✅ Create Project
exports.createProject = async (req, res) => {
  const { projectName } = req.body;    // No need for `pages` in request body

  try {
    const newProject = new Project({
      userId: req.user,           // Logged-in user's ID
      projectName,
      pages: [],                   // Initialize with empty pages array
      complete: false              // New project is incomplete by default
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get All Projects for the Logged-in User
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get a Single Project by ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ _id: id, userId: req.user });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a Project by ID
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { projectName, pages } = req.body;

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId: req.user },
      { projectName, pages },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProjectComplete = async (req, res) => {
  const {id} = req.params
  const { complete } = req.body;

  // ✅ Validate inputs
  if (!id || complete === undefined) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { complete },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);     
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};



// ✅ Delete a Project by ID
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findOneAndDelete({ _id: id, userId: req.user });

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
