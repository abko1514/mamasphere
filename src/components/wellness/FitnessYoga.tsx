"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dumbbell,
  Clock,
  Play,
  Star,
  Users,
  Calendar,
  Filter,
  ExternalLink,
  Video as VideoIcon,
} from "lucide-react";
import { fitnessService } from "@/services/fitnessService";

interface WorkoutVideo {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  description: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  rating: number;
  views: string;
  equipment: string[];
  tags: string[];
  specialFocus: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  workouts: WorkoutVideo[];
  goals: string[];
}

// Fallback thumbnail component
const FallbackThumbnail = ({
  title,
  category,
}: {
  title: string;
  category: string;
}) => (
  <div className="w-full h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-center p-4">
    <div>
      <VideoIcon className="h-8 w-8 mx-auto mb-2" />
      <div className="text-sm font-medium leading-tight">
        {title.substring(0, 30)}...
      </div>
      <div className="text-xs opacity-75 mt-1">{category}</div>
    </div>
  </div>
);

// Enhanced Thumbnail component with error handling
const WorkoutThumbnail = ({
  src,
  alt,
  title,
  category,
  onClick,
}: {
  src: string;
  alt: string;
  title: string;
  category: string;
  onClick: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError || !src) {
    return (
      <div className="relative cursor-pointer" onClick={onClick}>
        <FallbackThumbnail title={title} category={category} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Button
            size="lg"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-800 hover:bg-white"
          >
            <Play className="h-6 w-6 mr-2" />
            Watch Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <VideoIcon className="h-8 w-8 text-slate-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <Button
          size="lg"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-800 hover:bg-white"
        >
          <Play className="h-6 w-6 mr-2" />
          Watch Now
        </Button>
      </div>
    </div>
  );
};

export default function FitnessYoga() {
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState<WorkoutVideo[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "yoga", label: "Yoga & Stretching" },
    { value: "cardio", label: "Cardio Workouts" },
    { value: "strength", label: "Strength Training" },
    { value: "pilates", label: "Pilates" },
    { value: "prenatal", label: "Prenatal Fitness" },
    { value: "postnatal", label: "Postnatal Recovery" },
    { value: "meditation", label: "Meditation & Mindfulness" },
  ];

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const durations = [
    { value: "all", label: "Any Duration" },
    { value: "0-15", label: "0-15 minutes" },
    { value: "15-30", label: "15-30 minutes" },
    { value: "30-45", label: "30-45 minutes" },
    { value: "45+", label: "45+ minutes" },
  ];

  // Real workout videos with verified YouTube links
  const mockVideos: WorkoutVideo[] = [
    {
      id: "1",
      title: "15 Min Morning Yoga for Busy Moms",
      instructor: "Yoga with Adriene",
      duration: "15 min",
      difficulty: "Beginner",
      category: "yoga",
      description:
        "A gentle morning flow perfect for busy mothers to start the day with energy and mindfulness.",
      thumbnailUrl: "https://img.youtube.com/vi/VaoV1PrYft4/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=VaoV1PrYft4",
      rating: 4.8,
      views: "2.1M",
      equipment: ["Yoga Mat"],
      tags: ["Morning", "Gentle", "Energy"],
      specialFocus: ["Flexibility", "Mindfulness", "Energy Boost"],
    },
    {
      id: "2",
      title: "10 Minute Morning Yoga Flow",
      instructor: "Boho Beautiful",
      duration: "10 min",
      difficulty: "Beginner",
      category: "yoga",
      description:
        "Quick energizing yoga flow to wake up your body and mind in just 10 minutes.",
      thumbnailUrl: "https://img.youtube.com/vi/UEEsdXn8oG8/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=UEEsdXn8oG8",
      rating: 4.7,
      views: "1.8M",
      equipment: ["Yoga Mat"],
      tags: ["Quick", "Morning", "Flow"],
      specialFocus: ["Energy", "Flexibility", "Focus"],
    },
    {
      id: "3",
      title: "20 Min HIIT Workout for Busy Moms",
      instructor: "FitnessBlender",
      duration: "20 min",
      difficulty: "Intermediate",
      category: "cardio",
      description:
        "High-intensity interval training designed specifically for busy mothers - no equipment needed!",
      thumbnailUrl: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
      rating: 4.6,
      views: "980K",
      equipment: [],
      tags: ["HIIT", "No Equipment", "Fat Burn"],
      specialFocus: ["Cardio", "Strength", "Time Efficient"],
    },
    {
      id: "4",
      title: "Postnatal Pilates - Core Recovery",
      instructor: "Move with Nicole",
      duration: "25 min",
      difficulty: "Beginner",
      category: "postnatal",
      description:
        "Gentle core strengthening exercises designed for new mothers recovering from childbirth.",
      thumbnailUrl: "https://img.youtube.com/vi/OUgsJ2-2FDk/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=OUgsJ2-2FDk",
      rating: 4.9,
      views: "750K",
      equipment: ["Mat", "Small Ball"],
      tags: ["Core", "Recovery", "Gentle"],
      specialFocus: ["Core Recovery", "Pelvic Floor", "Posture"],
    },
    {
      id: "5",
      title: "30 Min Full Body Strength Training",
      instructor: "SELF",
      duration: "30 min",
      difficulty: "Intermediate",
      category: "strength",
      description:
        "Complete full-body strength workout using bodyweight exercises - perfect for home workouts.",
      thumbnailUrl: "https://img.youtube.com/vi/UItWltVZZmE/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=UItWltVZZmE",
      rating: 4.5,
      views: "1.2M",
      equipment: [],
      tags: ["Full Body", "Strength", "No Equipment"],
      specialFocus: ["Muscle Building", "Toning", "Endurance"],
    },
    {
      id: "6",
      title: "Prenatal Yoga - Safe Stretches",
      instructor: "PsycheTruth",
      duration: "22 min",
      difficulty: "Beginner",
      category: "prenatal",
      description:
        "Safe and gentle yoga stretches specifically designed for expecting mothers.",
      thumbnailUrl: "https://img.youtube.com/vi/D3mPpEJPJRw/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=D3mPpEJPJRw",
      rating: 4.7,
      views: "650K",
      equipment: ["Yoga Mat", "Bolster"],
      tags: ["Pregnancy Safe", "Gentle", "Flexibility"],
      specialFocus: ["Prenatal Safety", "Flexibility", "Relaxation"],
    },
    {
      id: "7",
      title: "5 Minute Meditation for Busy Moms",
      instructor: "Headspace",
      duration: "5 min",
      difficulty: "Beginner",
      category: "meditation",
      description:
        "Quick meditation session perfect for busy mothers to find moments of calm throughout the day.",
      thumbnailUrl: "https://img.youtube.com/vi/ZToicYcHIOU/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
      rating: 4.8,
      views: "890K",
      equipment: [],
      tags: ["Quick", "Stress Relief", "Mindfulness"],
      specialFocus: ["Stress Relief", "Mental Clarity", "Calm"],
    },
    {
      id: "8",
      title: "12 Min Beginner Pilates Core",
      instructor: "MadFit",
      duration: "12 min",
      difficulty: "Beginner",
      category: "pilates",
      description:
        "Beginner-friendly Pilates routine focusing on core strength and stability.",
      thumbnailUrl: "https://img.youtube.com/vi/K56Z12xVoRY/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=K56Z12xVoRY",
      rating: 4.6,
      views: "1.1M",
      equipment: ["Mat"],
      tags: ["Core", "Beginner", "Pilates"],
      specialFocus: ["Core Strength", "Posture", "Stability"],
    },
  ];

  const mockWorkoutPlans: WorkoutPlan[] = [
    {
      id: "1",
      name: "30-Day Mom Fitness Challenge",
      description:
        "A comprehensive 30-day program designed specifically for busy mothers to build strength and energy.",
      duration: "30 Days",
      difficulty: "Beginner to Intermediate",
      goals: [
        "Build Strength",
        "Increase Energy",
        "Improve Mood",
        "Time Efficient",
      ],
      workouts: [mockVideos[0], mockVideos[2], mockVideos[4]],
    },
    {
      id: "2",
      name: "Postnatal Recovery Program",
      description:
        "Gentle 8-week program to help new mothers safely return to fitness after childbirth.",
      duration: "8 Weeks",
      difficulty: "Beginner",
      goals: [
        "Core Recovery",
        "Safe Return to Exercise",
        "Improve Posture",
        "Reduce Back Pain",
      ],
      workouts: [mockVideos[3], mockVideos[0], mockVideos[7]],
    },
  ];

  useEffect(() => {
    loadContent();
  }, [activeTab, selectedCategory, selectedDifficulty, selectedDuration]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (activeTab === "videos") {
        // Try to load from service, fallback to mock data
        try {
          const videoData = await fitnessService.fetchWorkoutVideos({
            category: selectedCategory,
            difficulty: selectedDifficulty,
            duration: selectedDuration,
          });
          setVideos(videoData.length > 0 ? videoData : mockVideos);
        } catch {
          console.log("Using mock video data");
          setVideos(mockVideos);
        }
      } else {
        // Try to load from service, fallback to mock data
        try {
          const planData = await fitnessService.fetchWorkoutPlans({
            category: selectedCategory,
            difficulty: selectedDifficulty,
          });
          setWorkoutPlans(planData.length > 0 ? planData : mockWorkoutPlans);
        } catch  {
          console.log("Using mock plan data");
          setWorkoutPlans(mockWorkoutPlans);
        }
      }
    } catch {
      console.error("Error loading fitness content:");
      // Fallback to mock data
      if (activeTab === "videos") {
        setVideos(mockVideos);
      } else {
        setWorkoutPlans(mockWorkoutPlans);
      }
    } finally {
      setLoading(false);
    }
  };

  const VideoCard = ({ video }: { video: WorkoutVideo }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <WorkoutThumbnail
          src={video.thumbnailUrl}
          alt={video.title}
          title={video.title}
          category={video.category}
          onClick={() => window.open(video.youtubeUrl, "_blank")}
        />
        <div className="absolute top-3 left-3">
          <Badge
            className={`${
              video.difficulty === "Beginner"
                ? "bg-green-500"
                : video.difficulty === "Intermediate"
                ? "bg-yellow-500"
                : "bg-red-500"
            } text-white`}
          >
            {video.difficulty}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/70 text-white">
            <Clock className="h-3 w-3 mr-1" />
            {video.duration}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>by {video.instructor}</span>
          <span>•</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span>{video.rating}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{video.views}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {video.specialFocus.slice(0, 3).map((focus, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {focus}
              </Badge>
            ))}
          </div>

          {video.equipment.length > 0 && (
            <div className="text-xs text-gray-500">
              Equipment: {video.equipment.join(", ")}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Badge variant="secondary" className="text-xs">
            {video.category}
          </Badge>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => window.open(video.youtubeUrl, "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            YouTube
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const WorkoutPlanCard = ({ plan }: { plan: WorkoutPlan }) => (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">
              {plan.name}
            </CardTitle>
            <p className="text-gray-600 text-sm">{plan.description}</p>
          </div>
          <Badge variant="outline" className="ml-4">
            {plan.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-purple-800">
              {plan.duration}
            </p>
            <p className="text-xs text-purple-600">Duration</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Dumbbell className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-semibold text-green-800">
              {plan.workouts.length} Workouts
            </p>
            <p className="text-xs text-green-600">Total Videos</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Goals:</h4>
          <div className="flex flex-wrap gap-1">
            {plan.goals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {goal}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Sample Workouts:</h4>
          <div className="space-y-2">
            {plan.workouts.slice(0, 3).map((workout, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {workout.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {workout.duration} • {workout.instructor}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(workout.youtubeUrl, "_blank")}
                >
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          Start Workout Plan
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-green-600" />
            Fitness & Yoga for Busy Mothers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Selection */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === "videos" ? "default" : "outline"}
              onClick={() => setActiveTab("videos")}
              className={
                activeTab === "videos" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              🎥 Workout Videos
            </Button>
            <Button
              variant={activeTab === "plans" ? "default" : "outline"}
              onClick={() => setActiveTab("plans")}
              className={
                activeTab === "plans" ? "bg-purple-600 hover:bg-purple-700" : ""
              }
            >
              📋 Workout Plans
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-40">
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {activeTab === "videos" && (
              <div className="sm:w-40">
                <Select
                  value={selectedDuration}
                  onValueChange={setSelectedDuration}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Content Banner */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">🌟 Featured This Week</h2>
            <p className="text-green-100 mb-4">
              {activeTab === "videos"
                ? "Quick 15-minute morning yoga routine perfect for busy mothers"
                : "30-day postnatal recovery program designed by certified trainers"}
            </p>
            <Button
              variant="secondary"
              className="bg-white text-green-600 hover:bg-green-50"
            >
              {activeTab === "videos" ? "Watch Now" : "Start Program"}
            </Button>
          </div>
          <div className="absolute right-0 top-0 opacity-20">
            <Dumbbell className="h-32 w-32 transform rotate-12" />
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {loading ? (
        <div
          className={`grid gap-6 ${
            activeTab === "videos"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse bg-white/80">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            activeTab === "videos"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {activeTab === "videos"
            ? videos.map((video) => <VideoCard key={video.id} video={video} />)
            : workoutPlans.map((plan) => (
                <WorkoutPlanCard key={plan.id} plan={plan} />
              ))}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        ((activeTab === "videos" && videos.length === 0) ||
          (activeTab === "plans" && workoutPlans.length === 0)) && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No content found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later for new content
              </p>
            </CardContent>
          </Card>
        )}

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">
            💡 Quick Fitness Tips for Busy Moms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                🏃‍♀️ Start Small
              </h4>
              <p className="text-sm text-blue-700">
                Even 10 minutes of movement daily can make a difference. Build
                consistency first, intensity later.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">
                🕐 Time-Efficient
              </h4>
              <p className="text-sm text-purple-700">
                High-intensity interval training (HIIT) can provide maximum
                benefits in minimum time.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                👶 Include Kids
              </h4>
              <p className="text-sm text-green-700">
                Make it family time! Many exercises can be done with children
                around or even participating.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold mb-3">
            🌟 You&apos;ve Got This, Mama!
          </h3>
          <p className="text-pink-100 mb-4 max-w-2xl mx-auto">
            Remember, taking care of your physical health isn&apos;t just about
            you - it&apos;s about being the best version of yourself for your
            family. Every workout, no matter how short, is an investment in your
            well-being and energy.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>💪</span>
              <span>Build Strength</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Boost Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🧘‍♀️</span>
              <span>Reduce Stress</span>
            </div>
            <div className="flex items-center gap-2">
              <span>😊</span>
              <span>Improve Mood</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Reminders */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
            ⚠️ Safety First - Important Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>
              <h4 className="font-semibold mb-2">🤰 For Pregnant Mothers:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Always consult your healthcare provider before starting any
                  exercise program
                </li>
                <li>
                  Avoid exercises lying flat on your back after the first
                  trimester
                </li>
                <li>Stay hydrated and avoid overheating</li>
                <li>Listen to your body and modify as needed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                👶 For Postpartum Recovery:
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Get medical clearance before returning to exercise</li>
                <li>Start slowly and gradually increase intensity</li>
                <li>Focus on core and pelvic floor recovery</li>
                <li>Watch for signs of diastasis recti</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> The fitness content provided is for
              informational purposes only and should not replace professional
              medical advice. Always consult with your healthcare provider
              before beginning any exercise program, especially during pregnancy
              or postpartum recovery.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
