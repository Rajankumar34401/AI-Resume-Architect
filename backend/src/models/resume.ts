import mongoose, { Schema, Document } from 'mongoose';

const ResumeSchema: Schema = new Schema({
  // Link this resume to a specific user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  personalInfo: {
    fullName: { type: String, default: '' },
    role: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  summary: { type: String, default: '' },
  experience: [{
    id: String,
    company: String,
    role: String,
    duration: String,
    desc: String
  }],
  education: [{
    id: String,
    school: String,
    degree: String,
    year: String,
    score: String,      
    scoreType: { type: String, default: 'CGPA' } // New field added here
  }],
  skills: [String],
  projects: [{
    id: String,
    name: String,
    link: String,
    desc: String
  }],
  certificates: [{
    id: String,
    name: String,
    issuer: String,
    date: String
  }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.model('Resume', ResumeSchema);