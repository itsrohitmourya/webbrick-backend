const mongoose = require('mongoose');

// ✅ Subdocument schema for pages
const pageSchema = new mongoose.Schema({
  pageName: { type: String, required: true },
  pageCode: { type: String, required: true }
});

// ✅ Main project schema
const projectSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // Reference to User model
    required: true 
  },
  projectName: { 
    type: String, 
    required: true 
  },
  pages: {
    type: [pageSchema],   // Array of page objects
    default: []
  },
  complete: { 
    type: Boolean,
    default: false
  }
}, { timestamps: true });  // ✅ Add createdAt & updatedAt timestamps automatically

// ✅ Create the Mongoose model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
