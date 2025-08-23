import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Heart,
  GraduationCap,
  Target,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Save,
  Edit3,
  Baby,
  Home,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const CareerProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  interface StepErrors {
    [key: string]: string;
  }
  const [errors, setErrors] = useState<StepErrors>({});

  // Type definitions for formData
  interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    employmentType: string;
  }

  interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialUrl: string;
  }

  interface Language {
    language: string;
    proficiency: string;
  }

  interface DesiredSalaryRange {
    min: number;
    max: number;
    currency: string;
  }

  interface CareerProfileFormData {
    // Personal Information
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;

    // Family & Pregnancy Status
    isPregnant: boolean;
    dueDate: string;
    pregnancyWeek: string;
    childrenAges: number[];
    familyStatus: string;

    // Career Information
    currentRole: string;
    company: string;
    industry: string;
    yearsOfExperience: number;
    educationLevel: string;
    skillsAndExperience: string[];

    // Work Experience
    workExperience: WorkExperience[];

    // Career Goals & Preferences
    careerGoals: string;
    workPreference: string;
    availabilityStatus: string;
    desiredSalaryRange: DesiredSalaryRange;

    // Flexibility & Support
    flexibilityNeeds: string[];

    // Professional Development
    certifications: Certification[];
    languages: Language[];

    // Preferences
    jobAlerts: boolean;
    newsletter: boolean;
    mentorshipInterested: boolean;

    // Privacy Settings
    profileVisibility: string;
    showContactInfo: boolean;
    allowMessages: boolean;
  }

  const [formData, setFormData] = useState<CareerProfileFormData>({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",

    // Family & Pregnancy Status
    isPregnant: false,
    dueDate: "",
    pregnancyWeek: "",
    childrenAges: [],
    familyStatus: "single",

    // Career Information
    currentRole: "",
    company: "",
    industry: "",
    yearsOfExperience: 0,
    educationLevel: "bachelors",
    skillsAndExperience: [],

    // Work Experience
    workExperience: [],

    // Career Goals & Preferences
    careerGoals: "",
    workPreference: "hybrid",
    availabilityStatus: "actively_working",
    desiredSalaryRange: {
      min: 50000,
      max: 100000,
      currency: "USD",
    },

    // Flexibility & Support
    flexibilityNeeds: [],

    // Professional Development
    certifications: [],
    languages: [],

    // Preferences
    jobAlerts: true,
    newsletter: true,
    mentorshipInterested: false,

    // Privacy Settings
    profileVisibility: "community",
    showContactInfo: false,
    allowMessages: true,
  });

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Family Status", icon: Heart },
    { id: 3, title: "Career Background", icon: Briefcase },
    { id: 4, title: "Goals & Preferences", icon: Target },
    { id: 5, title: "Professional Dev", icon: GraduationCap },
    { id: 6, title: "Settings", icon: Globe },
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Marketing",
    "Consulting",
    "Engineering",
    "Design",
    "Sales",
    "Human Resources",
    "Operations",
    "Legal",
    "Non-profit",
    "Retail",
    "Media",
    "Other",
  ];

  const commonSkills = [
    "Project Management",
    "Data Analysis",
    "Digital Marketing",
    "Python",
    "JavaScript",
    "Leadership",
    "Communication",
    "Problem Solving",
    "Strategic Planning",
    "Customer Service",
    "Social Media",
    "Graphic Design",
    "Writing",
    "Research",
    "Teaching",
    "Sales",
    "Finance",
    "Excel",
    "Adobe Creative Suite",
    "SEO/SEM",
  ];

  const flexibilityOptions = [
    "School pickup/dropoff",
    "Doctor appointments",
    "Flexible start times",
    "Work from home options",
    "Compressed work weeks",
    "Job sharing",
    "Reduced travel",
    "Quiet space for pumping",
    "Flexible lunch hours",
    "Remote work capability",
  ];

// Form validation

interface ValidateStepFn {
    (step: number): boolean;
}

const validateStep: ValidateStepFn = (step) => {
    const newErrors: StepErrors = {};

    switch (step) {
        case 1:
            if (!formData.name) newErrors.name = "Name is required";
            if (!formData.email) newErrors.email = "Email is required";
            if (!formData.location) newErrors.location = "Location is required";
            break;
        case 3:
            if (!formData.industry) newErrors.industry = "Industry is required";
            if (formData.yearsOfExperience < 0)
                newErrors.yearsOfExperience =
                    "Years of experience cannot be negative";
            break;
        default:
            break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const response = await fetch("/api/career/profile", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          isEditing
            ? "Profile updated successfully!"
            : "Profile created successfully!"
        );
        setIsEditing(false);
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Error saving profile: " + error.message);
      } else {
        alert("Error saving profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Add work experience
  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
          employmentType: "full-time",
        },
      ],
    }));
  };

  // Remove work experience
interface RemoveWorkExperienceFn {
    (id: string): void;
}

const removeWorkExperience: RemoveWorkExperienceFn = (id) => {
    setFormData((prev) => ({
        ...prev,
        workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
};

  // Update work experience
interface UpdateWorkExperienceFn {
    (id: string, field: keyof WorkExperience, value: WorkExperience[keyof WorkExperience]): void;
}

const updateWorkExperience: UpdateWorkExperienceFn = (id, field, value) => {
    setFormData((prev) => ({
        ...prev,
        workExperience: prev.workExperience.map((exp) =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ),
    }));
};

  // Handle skill addition
interface AddSkillFn {
    (skill: string): void;
}

const addSkill: AddSkillFn = (skill) => {
    if (!formData.skillsAndExperience.includes(skill)) {
        setFormData((prev) => ({
            ...prev,
            skillsAndExperience: [...prev.skillsAndExperience, skill],
        }));
    }
};

  // Handle skill removal
interface RemoveSkillFn {
    (skill: string): void;
}

const removeSkill: RemoveSkillFn = (skill) => {
    setFormData((prev) => ({
        ...prev,
        skillsAndExperience: prev.skillsAndExperience.filter((s) => s !== skill),
    }));
};

  // Handle children ages
  const addChildAge = () => {
    setFormData((prev) => ({
      ...prev,
      childrenAges: [...prev.childrenAges, 0],
    }));
  };

interface UpdateChildAgeFn {
    (index: number, age: number | string): void;
}

const updateChildAge: UpdateChildAgeFn = (index, age) => {
    setFormData((prev) => ({
        ...prev,
        childrenAges: prev.childrenAges.map((a, i) =>
            i === index ? parseInt(age as string) || 0 : a
        ),
    }));
};

interface RemoveChildAgeFn {
    (index: number): void;
}

const removeChildAge: RemoveChildAgeFn = (index) => {
    setFormData((prev) => ({
        ...prev,
        childrenAges: prev.childrenAges.filter((_, i) => i !== index),
    }));
};

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="City, State/Province, Country"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell us about yourself, your background, and what you're passionate about..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Family & Personal Status
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Family Status
                </label>
                <select
                  value={formData.familyStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      familyStatus: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="single">Single</option>
                  <option value="partnered">Partnered</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="pregnant"
                  checked={formData.isPregnant}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPregnant: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="pregnant"
                  className="text-sm font-medium text-gray-700"
                >
                  I'm currently pregnant
                </label>
              </div>

              {formData.isPregnant && (
                <div className="grid md:grid-cols-2 gap-6 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Week (optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="42"
                      value={formData.pregnancyWeek}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pregnancyWeek: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Week"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Children's Ages
                  </label>
                  <button
                    type="button"
                    onClick={addChildAge}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Child
                  </button>
                </div>

                {formData.childrenAges.length === 0 ? (
                  <p className="text-gray-500 text-sm">No children added yet</p>
                ) : (
                  <div className="space-y-2">
                    {formData.childrenAges.map((age, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={age}
                          onChange={(e) =>
                            updateChildAge(index, e.target.value)
                          }
                          className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Age"
                        />
                        <span className="text-sm text-gray-600">years old</span>
                        <button
                          type="button"
                          onClick={() => removeChildAge(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Career Background
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role
                </label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentRole: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Marketing Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsOfExperience: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.yearsOfExperience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.yearsOfExperience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      educationLevel: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="high_school">High School</option>
                  <option value="associates">Associate's Degree</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skills & Experience
              </label>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {commonSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      disabled={formData.skillsAndExperience.includes(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.skillsAndExperience.includes(skill)
                          ? "bg-purple-100 text-purple-700 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      }`}
                    >
                      {formData.skillsAndExperience.includes(skill)
                        ? "✓ "
                        : "+ "}
                      {skill}
                    </button>
                  ))}
                </div>

                {formData.skillsAndExperience.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected Skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsAndExperience.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-purple-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Career Goals & Preferences
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Goals
              </label>
              <textarea
                value={formData.careerGoals}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    careerGoals: e.target.value,
                  }))
                }
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What are your short-term and long-term career goals?"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Preference
                </label>
                <select
                  value={formData.workPreference}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workPreference: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="remote">Remote Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Availability Status
                </label>
                <select
                  value={formData.availabilityStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availabilityStatus: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="actively_working">Currently Working</option>
                  <option value="seeking_opportunities">
                    Seeking Opportunities
                  </option>
                  <option value="maternity_leave">On Maternity Leave</option>
                  <option value="returning_to_work">Returning to Work</option>
                  <option value="career_break">Career Break</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Desired Salary Range (Annual)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.desiredSalaryRange.min}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        desiredSalaryRange: {
                          ...prev.desiredSalaryRange,
                          min: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.desiredSalaryRange.max}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        desiredSalaryRange: {
                          ...prev.desiredSalaryRange,
                          max: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.desiredSalaryRange.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        desiredSalaryRange: {
                          ...prev.desiredSalaryRange,
                          currency: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Flexibility Needs
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {flexibilityOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.flexibilityNeeds.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            flexibilityNeeds: [
                              ...prev.flexibilityNeeds,
                              option,
                            ],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            flexibilityNeeds: prev.flexibilityNeeds.filter(
                              (need) => need !== option
                            ),
                          }));
                        }
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Professional Development
            </h3>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Certifications
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      certifications: [
                        ...prev.certifications,
                        {
                          id: Date.now().toString(),
                          name: "",
                          issuer: "",
                          issueDate: "",
                          expiryDate: "",
                          credentialUrl: "",
                        },
                      ],
                    }))
                  }
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Certification
                </button>
              </div>

              {formData.certifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No certifications added yet
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((c) =>
                                c.id === cert.id
                                  ? { ...c, name: e.target.value }
                                  : c
                              ),
                            }))
                          }
                          placeholder="Certification name"
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((c) =>
                                c.id === cert.id
                                  ? { ...c, issuer: e.target.value }
                                  : c
                              ),
                            }))
                          }
                          placeholder="Issuing organization"
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((c) =>
                                c.id === cert.id
                                  ? { ...c, issueDate: e.target.value }
                                  : c
                              ),
                            }))
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={cert.expiryDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((c) =>
                                c.id === cert.id
                                  ? { ...c, expiryDate: e.target.value }
                                  : c
                              ),
                            }))
                          }
                          placeholder="Expiry date (optional)"
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <input
                          type="url"
                          value={cert.credentialUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((c) =>
                                c.id === cert.id
                                  ? { ...c, credentialUrl: e.target.value }
                                  : c
                              ),
                            }))
                          }
                          placeholder="Credential URL (optional)"
                          className="flex-1 mr-3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.filter(
                                (c) => c.id !== cert.id
                              ),
                            }))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Languages
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      languages: [
                        ...prev.languages,
                        {
                          language: "",
                          proficiency: "intermediate",
                        },
                      ],
                    }))
                  }
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Language
                </button>
              </div>

              {formData.languages.length === 0 ? (
                <p className="text-gray-500 text-sm">No languages added yet</p>
              ) : (
                <div className="space-y-3">
                  {formData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            languages: prev.languages.map((l, i) =>
                              i === index
                                ? { ...l, language: e.target.value }
                                : l
                            ),
                          }))
                        }
                        placeholder="Language"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={lang.proficiency}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            languages: prev.languages.map((l, i) =>
                              i === index
                                ? { ...l, proficiency: e.target.value }
                                : l
                            ),
                          }))
                        }
                        className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="basic">Basic</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="native">Native</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            languages: prev.languages.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Preferences & Settings
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Notifications
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.jobAlerts}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          jobAlerts: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Receive job alerts based on my preferences
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newsletter: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Subscribe to career tips and industry insights newsletter
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.mentorshipInterested}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mentorshipInterested: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I'm interested in mentorship opportunities
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Privacy Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={formData.profileVisibility}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          profileVisibility: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="public">
                        Public - Visible to everyone
                      </option>
                      <option value="community">
                        Community - Visible to Mamasphere members only
                      </option>
                      <option value="private">
                        Private - Visible to me only
                      </option>
                    </select>
                  </div>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.showContactInfo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          showContactInfo: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Show my contact information to other members
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.allowMessages}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allowMessages: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Allow other members to message me
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing
              ? "Edit Your Career Profile"
              : "Complete Your Career Profile"}
          </h1>
          <p className="text-gray-600">
            Help us provide personalized career guidance and opportunities
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-purple-500 border-purple-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle size={20} />
                    ) : (
                      <StepIcon size={20} />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-purple-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-purple-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          {currentStep === steps.length ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEditing ? "Update Profile" : "Complete Profile"}
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Next
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Your information is secure and will be used to provide personalized
            career recommendations.
            <br />
            You can edit your profile anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerProfileForm;
