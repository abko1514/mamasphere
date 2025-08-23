import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  BookOpen,
  MessageCircle,
  Dumbbell,
  Calendar,
  Heart,
  Brain,
  Target,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function WellnessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Wellness Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and resources to support your physical, mental,
            and emotional well-being as a working mother.
          </p>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm border border-pink-200">
            <TabsTrigger
              value="tools"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-pink-700 font-medium"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Mini Tools
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-700 font-medium"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Books & Blogs
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-pink-700 font-medium"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger
              value="fitness"
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-700 font-medium"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Yoga & Fitness
            </TabsTrigger>
          </TabsList>

          {/* Mini Tools & Calculators Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-pink-800">
                        Pregnancy Tracker
                      </CardTitle>
                      <CardDescription>
                        Track your pregnancy journey week by week
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/tools#pregnancy">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700">
                      Start Tracking
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-rose-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-rose-800">
                        Period Tracker
                      </CardTitle>
                      <CardDescription>
                        Monitor your menstrual cycle and health
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/tools#period">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700">
                      Track Cycle
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Books & Blogs Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-pink-800">
                        Curated Books
                      </CardTitle>
                      <CardDescription>
                        Essential reads for working mothers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/resources#books">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700">
                      Browse Books
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-rose-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-rose-800">
                        Expert Blogs
                      </CardTitle>
                      <CardDescription>
                        Latest insights on work-life balance
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/resources#blogs">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700">
                      Read Articles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-pink-800">
                        Personal Wellness Chat
                      </CardTitle>
                      <CardDescription>
                        Get personalized advice and support
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/chat">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700">
                      Start Conversation
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-rose-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-rose-800">
                        Community Support
                      </CardTitle>
                      <CardDescription>
                        Connect with other working mothers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-rose-600 hover:bg-rose-700"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Yoga & Fitness Tab */}
          <TabsContent value="fitness" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-pink-800">
                        Yoga Sessions
                      </CardTitle>
                      <CardDescription>
                        Prenatal, postnatal & stress relief yoga
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/fitness#yoga">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700">
                      Start Yoga
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-rose-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-rose-800">
                        Quick Workouts
                      </CardTitle>
                      <CardDescription>
                        10-30 minute fitness routines for busy moms
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/wellness/fitness#workouts">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700">
                      View Workouts
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
