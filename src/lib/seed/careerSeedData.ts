// lib/seedData/careerSeedData.ts
export const seedCareerTips = [
  {
    title: "Building Your Professional Network While on Maternity Leave",
    content:
      "Stay connected with your professional network during maternity leave by engaging on LinkedIn, attending virtual industry events, and scheduling occasional coffee chats. This helps maintain relationships and keeps you informed about industry developments.",
    category: "maternity_leave",
    targetAudience: ["new_mothers", "maternity_leave"],
    isPersonalized: false,
    tags: ["networking", "professional_development", "social_media"],
    aiGenerated: false,
    relevanceScore: 0.8,
  },
  {
    title: "Negotiating Flexible Work Arrangements",
    content:
      "When returning to work, prepare a proposal for flexible arrangements. Research your company's policies, present a clear plan for maintaining productivity, and be specific about your needs. Consider starting with a trial period to demonstrate success.",
    category: "returning_to_work",
    targetAudience: ["returning_mothers", "working_mothers"],
    isPersonalized: false,
    tags: ["negotiation", "work_life_balance", "flexibility"],
    aiGenerated: false,
    relevanceScore: 0.9,
  },
  {
    title: "Upskilling During Career Breaks",
    content:
      "Use career breaks to learn new skills through online courses, certifications, or volunteer work. Focus on digital skills, industry-specific knowledge, or leadership development to stay competitive and confident when returning to work.",
    category: "skills_development",
    targetAudience: ["career_break", "skill_building"],
    isPersonalized: false,
    tags: ["education", "online_learning", "career_development"],
    aiGenerated: false,
    relevanceScore: 0.85,
  },
];

export const seedJobRecommendations = [
  {
    title: "Senior Marketing Manager - Remote",
    company: "FlexWork Solutions",
    location: "Remote, US",
    type: "full-time",
    workArrangement: "remote",
    salaryRange: { min: 75000, max: 95000, currency: "USD" },
    description:
      "Lead marketing strategies for a growing SaaS company. Perfect for experienced marketers seeking work-life balance with a family-friendly company culture.",
    requirements: [
      "5+ years marketing experience",
      "Digital marketing expertise",
      "Team leadership skills",
    ],
    benefits: [
      "Flexible hours",
      "Maternity/paternity leave",
      "Health insurance",
      "Professional development budget",
    ],
    isMaternityFriendly: true,
    flexibleHours: true,
    applicationUrl: "https://example.com/apply/marketing-manager",
    postedDate: new Date("2024-01-15"),
  },
  {
    title: "Part-Time UX Designer",
    company: "Creative Minds Studio",
    location: "New York, NY",
    type: "part-time",
    workArrangement: "hybrid",
    salaryRange: { min: 40000, max: 55000, currency: "USD" },
    description:
      "Join our design team on a flexible part-time basis. Great opportunity for mothers returning to work or seeking better work-life balance.",
    requirements: [
      "3+ years UX design experience",
      "Proficiency in Figma/Sketch",
      "Portfolio required",
    ],
    benefits: ["Flexible schedule", "Childcare support", "Creative freedom"],
    isMaternityFriendly: true,
    flexibleHours: true,
    applicationUrl: "https://example.com/apply/ux-designer",
    postedDate: new Date("2024-01-20"),
  },
];

export const seedSmallBusinesses = [
  {
    businessName: "Mindful Mama Wellness",
    ownerName: "Sarah Johnson",
    ownerId: "user_123",
    category: "health",
    description:
      "Providing yoga classes, meditation workshops, and wellness coaching specifically designed for mothers. Creating a supportive community for maternal mental health and physical wellbeing.",
    services: [
      "Prenatal Yoga",
      "Mom & Baby Classes",
      "Meditation Workshops",
      "Wellness Coaching",
    ],
    location: "Austin, TX",
    contactInfo: {
      email: "hello@mindfulmamawellness.com",
      phone: "+1-555-0123",
      website: "https://mindfulmamawellness.com",
      socialMedia: {
        instagram: "https://instagram.com/mindfulmamawellness",
        facebook: "https://facebook.com/mindfulmamawellness",
      },
    },
    images: ["https://example.com/wellness1.jpg"],
    isVerified: true,
    rating: 4.8,
    reviewCount: 47,
    isMomOwned: true,
    tags: ["wellness", "yoga", "meditation", "maternal_health"],
  },
  {
    businessName: "Little Sprouts Organic",
    ownerName: "Maria Rodriguez",
    ownerId: "user_456",
    category: "food",
    description:
      "Handcrafted organic baby food and toddler snacks made with locally sourced ingredients. Supporting busy parents with nutritious, convenient meal options for little ones.",
    services: [
      "Organic Baby Food",
      "Toddler Snacks",
      "Custom Meal Plans",
      "Nutrition Consulting",
    ],
    location: "Portland, OR",
    contactInfo: {
      email: "orders@littlesproutsorganic.com",
      phone: "+1-555-0456",
      website: "https://littlesproutsorganic.com",
      socialMedia: {
        instagram: "https://instagram.com/littlesproutsorganic",
      },
    },
    images: ["https://example.com/organic1.jpg"],
    isVerified: true,
    rating: 4.9,
    reviewCount: 89,
    isMomOwned: true,
    tags: ["organic", "baby_food", "nutrition", "local"],
  },
];

export const seedFreelanceOpportunities = [
  {
    title: "Content Writing for Parenting Blog",
    clientName: "Modern Parenting Co.",
    projectType: "writing",
    budget: { min: 50, max: 75, currency: "USD", type: "hourly" },
    duration: "3 months",
    skillsRequired: [
      "Content Writing",
      "SEO",
      "Parenting Knowledge",
      "Research",
    ],
    description:
      "Seeking experienced content writer to create engaging blog posts about modern parenting challenges, work-life balance, and child development. Perfect for someone with personal parenting experience.",
    isRemote: true,
    applicationDeadline: new Date("2024-02-15"),
    postedDate: new Date("2024-01-10"),
    experienceLevel: "intermediate",
  },
  {
    title: "Social Media Management - Kids Fashion Brand",
    clientName: "Tiny Threads Boutique",
    projectType: "marketing",
    budget: { min: 2000, max: 3500, currency: "USD", type: "fixed" },
    duration: "6 months",
    skillsRequired: [
      "Social Media Marketing",
      "Content Creation",
      "Brand Strategy",
      "Photography",
    ],
    description:
      "Manage social media presence for growing children's fashion brand. Create engaging content, manage community, and drive brand awareness. Flexible schedule perfect for working moms.",
    isRemote: true,
    applicationDeadline: new Date("2024-02-20"),
    postedDate: new Date("2024-01-12"),
    experienceLevel: "intermediate",
  },
];
