// models/UserProfile.js

import mongoose from "mongoose";

const { Schema } = mongoose;

// Work Experience Schema
const workExperienceSchema = new Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
  achievements: [
    {
      type: String,
      trim: true,
    },
  ],
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  location: {
    type: String,
    trim: true,
  },
  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "freelance", "internship"],
    default: "full-time",
  },
});

// Education Schema
const educationSchema = new Schema({
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  field: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4.0,
  },
  achievements: [
    {
      type: String,
      trim: true,
    },
  ],
  description: {
    type: String,
    trim: true,
  },
});

// Certification Schema
const certificationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  issuer: {
    type: String,
    required: true,
    trim: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  credentialUrl: {
    type: String,
    trim: true,
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
});

// Language Schema
const languageSchema = new Schema({
  language: {
    type: String,
    required: true,
    trim: true,
  },
  proficiency: {
    type: String,
    enum: ["basic", "intermediate", "advanced", "native"],
    required: true,
  },
});

// Desired Salary Range Schema
const salaryRangeSchema = new Schema({
  min: {
    type: Number,
    required: true,
    min: 0,
  },
  max: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    enum: ["USD", "EUR", "GBP", "CAD", "AUD", "INR"],
    default: "USD",
  },
});

// Main UserProfile Schema
const userProfileSchema = new Schema({
  // Personal Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  avatar: {
    type: String,
    trim: true,
  },

  // Pregnancy & Family Status
  isPregnant: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  pregnancyWeek: {
    type: Number,
    min: 1,
    max: 42,
  },
  childrenAges: [
    {
      type: Number,
      min: 0,
      max: 25,
    },
  ],
  partnerName: {
    type: String,
    trim: true,
  },
  familyStatus: {
    type: String,
    enum: ["single", "partnered", "married", "divorced", "widowed"],
    default: "single",
  },

  // Career Information
  currentRole: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    required: true,
    trim: true,
  },
  workExperience: [workExperienceSchema],
  skillsAndExperience: [
    {
      type: String,
      trim: true,
    },
  ],
  educationLevel: {
    type: String,
    enum: ["high_school", "associates", "bachelors", "masters", "phd", "other"],
    default: "bachelors",
  },
  educationDetails: [educationSchema],

  // Career Goals & Preferences
  careerGoals: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  workPreference: {
    type: String,
    enum: ["remote", "hybrid", "onsite", "flexible"],
    default: "hybrid",
  },
  availabilityStatus: {
    type: String,
    enum: [
      "maternity_leave",
      "returning_to_work",
      "actively_working",
      "seeking_opportunities",
      "career_break",
    ],
    default: "actively_working",
  },
  desiredSalaryRange: salaryRangeSchema,

  // Professional Development
  certifications: [certificationSchema],
  languages: [languageSchema],
  portfolioUrl: {
    type: String,
    trim: true,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },

  // Community & Social
  interests: [
    {
      type: String,
      trim: true,
    },
  ],
  supportGroups: [
    {
      type: String,
      trim: true,
    },
  ],
  mentorStatus: {
    type: String,
    enum: ["seeking", "offering", "both", "none"],
    default: "none",
  },

  // Preferences & Settings
  jobAlerts: {
    type: Boolean,
    default: true,
  },
  newsletter: {
    type: Boolean,
    default: true,
  },
  communityUpdates: {
    type: Boolean,
    default: true,
  },
  mentorshipInterested: {
    type: Boolean,
    default: false,
  },

  // Privacy Settings
  profileVisibility: {
    type: String,
    enum: ["public", "community", "private"],
    default: "community",
  },
  showContactInfo: {
    type: Boolean,
    default: false,
  },
  allowMessages: {
    type: Boolean,
    default: true,
  },

  // Career Support Specific
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
  },
  careerBreakDuration: {
    type: Number,
    min: 0,
    default: 0, // in months
  },
  returnToWorkDate: {
    type: Date,
    required: false,
  },
  flexibilityNeeds: [
    {
      type: String,
      trim: true,
    },
  ],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    required: false,
  },
});

// Indexes for better performance
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ industry: 1 });
userProfileSchema.index({ availabilityStatus: 1 });
userProfileSchema.index({ workPreference: 1 });
userProfileSchema.index({ location: 1 });
userProfileSchema.index({ skillsAndExperience: 1 });
userProfileSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
userProfileSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Pre-update middleware for findOneAndUpdate
userProfileSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    this.set({ updatedAt: new Date() });
    next();
  }
);

// Virtual for profile completeness percentage
userProfileSchema.virtual("completenessPercentage").get(function (this: Record<string, any>) {
  const requiredFields = [
    "name",
    "email",
    "location",
    "industry",
    "yearsOfExperience",
    "workPreference",
    "availabilityStatus",
  ];

  const optionalFields = [
    "bio",
    "currentRole",
    "company",
    "careerGoals",
    "phone",
    "skillsAndExperience",
    "workExperience",
    "educationDetails",
    "certifications",
    "languages",
  ];

  let completedRequired = 0;
  let completedOptional = 0;

  // Check required fields
  requiredFields.forEach((field) => {
    if (this[field] && this[field].toString().trim()) {
      completedRequired++;
    }
  });

  // Check optional fields
  optionalFields.forEach((field) => {
    if (this[field]) {
      if (Array.isArray(this[field]) && this[field].length > 0) {
        completedOptional++;
      } else if (typeof this[field] === "string" && this[field].trim()) {
        completedOptional++;
      } else if (
        typeof this[field] === "object" &&
        Object.keys(this[field]).length > 0
      ) {
        completedOptional++;
      }
    }
  });

  const requiredWeight = 70; // Required fields are 70% of completeness
  const optionalWeight = 30; // Optional fields are 30% of completeness

  const requiredPercentage =
    (completedRequired / requiredFields.length) * requiredWeight;
  const optionalPercentage =
    (completedOptional / optionalFields.length) * optionalWeight;

  return Math.round(requiredPercentage + optionalPercentage);
});

// Instance method to get profile summary
userProfileSchema.methods.getProfileSummary = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    currentRole: this.currentRole,
    company: this.company,
    industry: this.industry,
    yearsOfExperience: this.yearsOfExperience,
    location: this.location,
    workPreference: this.workPreference,
    availabilityStatus: this.availabilityStatus,
    skillsAndExperience: this.skillsAndExperience,
    completenessPercentage: this.completenessPercentage,
    isPregnant: this.isPregnant,
    childrenCount: this.childrenAges.length,
    profileVisibility: this.profileVisibility,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find profiles by criteria
userProfileSchema.statics.findBySkills = function (skills) {
  return this.find({
    skillsAndExperience: { $in: skills },
    profileVisibility: { $in: ["public", "community"] },
  });
};

userProfileSchema.statics.findByIndustry = function (industry) {
  return this.find({
    industry: industry,
    profileVisibility: { $in: ["public", "community"] },
  });
};

userProfileSchema.statics.findMentors = function () {
  return this.find({
    mentorStatus: { $in: ["offering", "both"] },
    profileVisibility: { $in: ["public", "community"] },
  });
};

userProfileSchema.statics.findMentees = function () {
  return this.find({
    mentorStatus: { $in: ["seeking", "both"] },
    profileVisibility: { $in: ["public", "community"] },
  });
};

// Export the model
export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);
