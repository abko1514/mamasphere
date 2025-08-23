"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChefHat,
  Users,
  Heart,
  Activity,
  Briefcase,
  Menu,
  X,
  Clock,
  Target,
  TrendingUp,
  User,
  Mail,
  Phone,
  MapPin,
  Baby,
  Award,
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  BarChart3,
  CheckCircle,
  Star,
} from "lucide-react";

const features = [
  {
    id: "scheduling",
    title: "AI-Powered Scheduling",
    description:
      "Streamlines daily routines by intelligently prioritizing tasks, deadlines, and personal goals.",
    icon: Calendar,
    stats: { tasks: 12, completed: 8 },
  },
  {
    id: "meal-planning",
    title: "Meal Planning",
    description:
      "Offers customized meal plans, grocery lists, and batch cooking suggestions to save time.",
    icon: ChefHat,
    stats: { meals: 21, planned: 15 },
  },
  {
    id: "childcare",
    title: "Childcare Co-Ops",
    description:
      "Builds community networks for sharing childcare responsibilities like babysitting and school runs.",
    icon: Users,
    stats: { connections: 8, requests: 3 },
  },
  {
    id: "family-activities",
    title: "Family Activity Planning",
    description:
      "Suggests engaging activities to ensure quality family time despite busy schedules.",
    icon: Heart,
    stats: { activities: 25, favorites: 12 },
  },
  {
    id: "wellness",
    title: "Wellness Tracking",
    description:
      "Monitors physical and mental well-being with tailored fitness and mindfulness resources.",
    icon: Activity,
    stats: { streak: 7, goals: 5 },
  },
  {
    id: "career",
    title: "Career Support",
    description:
      "Provides resources and guidance for navigating maternity leave, returning to work, and career growth.",
    icon: Briefcase,
    stats: { resources: 18, completed: 6 },
  },
];

const userData = {
  personal: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "March 2024",
    profilePicture: "SJ",
  },
  family: {
    children: [
      { name: "Emma", age: 5, grade: "Kindergarten" },
      { name: "Lucas", age: 2, grade: "Toddler" },
    ],
    partner: "Michael Johnson",
    emergencyContact: "Lisa Martinez - (555) 987-6543",
  },
  preferences: {
    mealPreferences: ["Vegetarian", "Gluten-Free"],
    activityTypes: ["Outdoor", "Educational", "Creative"],
    workSchedule: "Flexible Remote",
    notifications: "Email + Push",
  },
  stats: {
    tasksCompleted: 247,
    mealsPlanned: 156,
    activitiesOrganized: 43,
    wellnessStreak: 14,
    connectionsMade: 23,
    achievementsEarned: 8,
  },
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const UserProfile = () => (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
        {userData.personal.profilePicture}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{userData.personal.name}</p>
        <p className="text-sm text-gray-500">Premium Member</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 shadow-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MamaSphere</h1>
                <p className="text-xs text-gray-500">Family Life Manager</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <UserProfile />

          <nav className="space-y-1 mt-8">
            <Button
              variant={activeSection === "overview" ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                activeSection === "overview"
                  ? "bg-pink-500 text-white shadow-md hover:bg-pink-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("overview")}
            >
              <TrendingUp className="mr-3 h-4 w-4" />
              Overview
            </Button>

            <Button
              variant={activeSection === "user-data" ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                activeSection === "user-data"
                  ? "bg-pink-500 text-white shadow-md hover:bg-pink-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("user-data")}
            >
              <User className="mr-3 h-4 w-4" />
              Profile
            </Button>

            <div className="pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-3">
                Features
              </p>
              {features.map((feature) => (
                <Button
                  key={feature.id}
                  variant={activeSection === feature.id ? "default" : "ghost"}
                  className={`w-full justify-start text-left ${
                    activeSection === feature.id
                      ? "bg-pink-500 text-white shadow-md hover:bg-pink-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveSection(feature.id)}
                >
                  <feature.icon className="mr-3 h-4 w-4" />
                  {feature.title}
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-600 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeSection === "overview"
                    ? "Dashboard"
                    : activeSection === "user-data"
                    ? "Profile & Settings"
                    : features.find((f) => f.id === activeSection)?.title ||
                      "Dashboard"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {activeSection === "overview"
                    ? "Your personalized workspace for managing work and family life"
                    : activeSection === "user-data"
                    ? "Manage your personal information and preferences"
                    : features.find((f) => f.id === activeSection)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === "overview" ? (
            <div className="space-y-8">
              <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold mb-3">
                        Good morning, {userData.personal.name.split(" ")[0]}! ✨
                      </h3>
                      <p className="text-pink-100 text-lg">
                        You&apos;re doing amazing balancing it all. Here&apos;s your day
                        at a glance.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-pink-100 text-sm mb-2">
                          Today&apos;s Progress
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-3 bg-white/20 rounded-full">
                            <div className="w-3/4 h-full bg-white rounded-full shadow-sm"></div>
                          </div>
                          <span className="text-lg font-bold">75%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Today&apos;s Tasks
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          8<span className="text-lg text-gray-500">/12</span>
                        </p>
                      </div>
                      <div className="p-3 bg-pink-100 rounded-xl">
                        <Clock className="h-6 w-6 text-pink-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="w-2/3 h-full bg-pink-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-500">67%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Weekly Goals
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          5<span className="text-lg text-gray-500">/7</span>
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Target className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="w-5/7 h-full bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-500">71%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Wellness Streak
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {userData.stats.wellnessStreak}
                        </p>
                        <p className="text-sm text-gray-500">days</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        On track!
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Achievements
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {userData.stats.achievementsEarned}
                        </p>
                        <p className="text-sm text-gray-500">earned</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-xl">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-600 font-medium">
                        Superstar!
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Features
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300 bg-transparent"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <Card
                      key={feature.id}
                      className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                      onClick={() => {setActiveSection(feature.id); console.log(index)}}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 group-hover:bg-pink-100 rounded-xl transition-colors duration-200">
                              <feature.icon className="h-6 w-6 text-gray-600 group-hover:text-pink-600 transition-colors duration-200" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900 group-hover:text-pink-600 transition-colors duration-200">
                                {feature.title}
                              </CardTitle>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4 text-gray-600 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(feature.stats).map(([key, value]) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                            >
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : activeSection === "user-data" ? (
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {userData.personal.profilePicture}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {userData.personal.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Member since {userData.personal.joinDate}
                      </p>
                      <div className="flex gap-3">
                        <Badge className="bg-pink-500 text-white hover:bg-pink-600 px-3 py-1">
                          Premium Member
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 px-3 py-1"
                        >
                          Active User
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Button className="bg-pink-500 text-white hover:bg-pink-600 shadow-md">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Email
                        </p>
                        <p className="text-gray-900">
                          {userData.personal.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Phone
                        </p>
                        <p className="text-gray-900">
                          {userData.personal.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Location
                        </p>
                        <p className="text-gray-900">
                          {userData.personal.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Family Information */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Heart className="h-5 w-5 text-pink-600" />
                      </div>
                      Family Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Partner
                      </p>
                      <p className="text-gray-900">{userData.family.partner}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Children
                      </p>
                      <div className="space-y-3">
                        {userData.family.children.map((child, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <Baby className="h-5 w-5 text-pink-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {child.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Age {child.age} • {child.grade}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Emergency Contact
                      </p>
                      <p className="text-gray-900">
                        {userData.family.emergencyContact}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Settings className="h-5 w-5 text-purple-600" />
                      </div>
                      Preferences & Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Meal Preferences
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {userData.preferences.mealPreferences.map(
                          (pref, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              {pref}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Activity Types
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {userData.preferences.activityTypes.map(
                          (type, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              {type}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-600">
                          Work Schedule
                        </p>
                        <p className="text-gray-900">
                          {userData.preferences.workSchedule}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-600">
                          Notifications
                        </p>
                        <p className="text-gray-900">
                          {userData.preferences.notifications}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics & Achievements */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-yellow-600" />
                      </div>
                      Your Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.stats.tasksCompleted}
                        </p>
                        <p className="text-sm text-gray-600">Tasks Completed</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.stats.mealsPlanned}
                        </p>
                        <p className="text-sm text-gray-600">Meals Planned</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.stats.activitiesOrganized}
                        </p>
                        <p className="text-sm text-gray-600">
                          Activities Organized
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.stats.connectionsMade}
                        </p>
                        <p className="text-sm text-gray-600">
                          Connections Made
                        </p>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-center">
                      <Award className="h-10 w-10 text-white mx-auto mb-3" />
                      <p className="text-white font-bold text-lg mb-1">
                        {userData.stats.achievementsEarned} Achievements Earned
                      </p>
                      <p className="text-pink-100 text-sm">
                        Keep up the amazing work!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Individual feature pages
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-gray-900">
                    {(() => {
                      const feature = features.find(
                        (f) => f.id === activeSection
                      );
                      const Icon = feature?.icon || Calendar;
                      return (
                        <>
                          <div className="p-4 bg-gray-100 rounded-xl">
                            <Icon className="h-8 w-8 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">
                              {feature?.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {feature?.description}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Plus className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Coming Soon!
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      We&apos;re working hard to bring you the best experience for{" "}
                      {features
                        .find((f) => f.id === activeSection)
                        ?.title.toLowerCase()}
                      .
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => setActiveSection("overview")}
                        className="bg-pink-500 text-white hover:bg-pink-600 shadow-md"
                      >
                        Back to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        Get Notified
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
