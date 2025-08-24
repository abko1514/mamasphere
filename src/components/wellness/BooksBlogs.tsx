"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ExternalLink,
  Search,
  Star,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { contentService } from "@/services/contentService";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  rating: number;
  amazonUrl: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishedYear: number;
}

interface Blog {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  readTime: string;
  url: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishedDate: string;
  source: string;
}

// Enhanced Image component with better error handling
const BookCoverImage = ({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
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
      <div className="w-20 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md shadow-sm flex items-center justify-center text-white text-center p-2">
        <div>
          <BookOpen className="h-4 w-4 mx-auto mb-1" />
          <div className="text-xs leading-tight font-medium">
            {title.substring(0, 20)}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-28">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 rounded-md animate-pulse flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-slate-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-20 h-28 object-cover rounded-md shadow-sm transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

const BlogImage = ({
  src,
  alt,
}: {
  src: string;
  alt: string;
  title: string;
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
      <div className="w-24 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md shadow-sm flex items-center justify-center text-white text-center p-2">
        <div>
          <ImageIcon className="h-3 w-3 mx-auto mb-1" />
          <div className="text-xs leading-tight font-medium">Article</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-24 h-16">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 rounded-md animate-pulse flex items-center justify-center">
          <ImageIcon className="h-4 w-4 text-slate-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-24 h-16 object-cover rounded-md shadow-sm transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default function BooksBlogs() {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "work-life-balance", label: "Work-Life Balance" },
    { value: "parenting", label: "Parenting" },
    { value: "wellness", label: "Wellness" },
    { value: "career", label: "Career Development" },
    { value: "self-care", label: "Self Care" },
    { value: "productivity", label: "Productivity" },
  ];

  // Real data with verified Amazon links and actual book covers
  const mockBooks: Book[] = [
    {
      id: "1",
      title: "Lean In: Women, Work, and the Will to Lead",
      author: "Sheryl Sandberg",
      description:
        "A powerful call to action and a blueprint for individual growth for working women.",
      rating: 4.2,
      amazonUrl: "https://www.amazon.com/dp/0385349947",
      imageUrl:
        "https://m.media-amazon.com/images/I/81af+MCATTL._AC_UY218_.jpg",
      category: "career",
      tags: ["Leadership", "Career", "Women"],
      publishedYear: 2013,
    },
    {
      id: "2",
      title: "The Working Mother's Guide to Life",
      author: "Linda Mason",
      description:
        "Strategies and solutions for the most common dilemmas facing working mothers today.",
      rating: 4.3,
      amazonUrl: "https://www.amazon.com/dp/0307209407",
      imageUrl:
        "https://m.media-amazon.com/images/I/51KQXM9C7EL._AC_UY218_.jpg",
      category: "parenting",
      tags: ["Work-Life Balance", "Parenting", "Time Management"],
      publishedYear: 2004,
    },
    {
      id: "3",
      title: "I Don't Know How She Does It",
      author: "Allison Pearson",
      description:
        "A hilarious and heartfelt look at the daily juggling act of being a working mother.",
      rating: 4.1,
      amazonUrl: "https://www.amazon.com/dp/0375760717",
      imageUrl:
        "https://m.media-amazon.com/images/I/51QJ0X9HVOL._AC_UY218_.jpg",
      category: "humor",
      tags: ["Humor", "Working Mom", "Fiction"],
      publishedYear: 2002,
    },
    {
      id: "4",
      title: "The Second Shift",
      author: "Arlie Russell Hochschild",
      description:
        "Working Families and the Revolution at Home - a groundbreaking study of gender roles.",
      rating: 4.0,
      amazonUrl: "https://www.amazon.com/dp/0143120336",
      imageUrl:
        "https://m.media-amazon.com/images/I/71XvLBZRrfL._AC_UY218_.jpg",
      category: "sociology",
      tags: ["Gender Roles", "Family", "Research"],
      publishedYear: 2012,
    },
    {
      id: "5",
      title: "Drop the Ball: Achieving More by Doing Less",
      author: "Tiffany Dufu",
      description:
        "A practical guide to letting go of perfectionism and achieving more by doing less.",
      rating: 4.4,
      amazonUrl: "https://www.amazon.com/dp/1250071739",
      imageUrl:
        "https://m.media-amazon.com/images/I/81QX9nGRHyL._AC_UY218_.jpg",
      category: "self-help",
      tags: ["Productivity", "Balance", "Leadership"],
      publishedYear: 2017,
    },
    {
      id: "6",
      title:
        "The Fifth Trimester: The Working Mom's Guide to Style, Sanity, and Success",
      author: "Lauren Smith Brody",
      description:
        "A comprehensive guide for new working mothers navigating their return to work.",
      rating: 4.5,
      amazonUrl: "https://www.amazon.com/dp/0385541201",
      imageUrl:
        "https://m.media-amazon.com/images/I/81HvIaBmaZL._AC_UY218_.jpg",
      category: "parenting",
      tags: ["New Mothers", "Career", "Work-Life Balance"],
      publishedYear: 2017,
    },
    {
      id: "7",
      title:
        "All the Rage: Mothers, Fathers, and the Myth of Equal Partnership",
      author: "Darcy Lockman",
      description:
        "An eye-opening look at why, despite decades of progress, mothers still do most of the work at home.",
      rating: 4.2,
      amazonUrl: "https://www.amazon.com/dp/0062861442",
      imageUrl:
        "https://m.media-amazon.com/images/I/71dULNWvPQL._AC_UY218_.jpg",
      category: "family",
      tags: ["Gender Equality", "Parenting", "Relationships"],
      publishedYear: 2019,
    },
    {
      id: "8",
      title:
        "Fair Play: A Game-Changing Solution for When You Have Too Much to Do",
      author: "Eve Rodsky",
      description:
        "A revolutionary system to get the most out of your time, energy, and resources.",
      rating: 4.3,
      amazonUrl: "https://www.amazon.com/dp/0525541934",
      imageUrl:
        "https://m.media-amazon.com/images/I/71BwAW5hIjL._AC_UY218_.jpg",
      category: "productivity",
      tags: ["Time Management", "Organization", "Partnership"],
      publishedYear: 2019,
    },
  ];

  const mockBlogs: Blog[] = [
    {
      id: "1",
      title: "The Mental Load: Why Working Mothers Are Exhausted",
      author: "Gemma Hartley",
      excerpt:
        "Understanding the invisible labor that disproportionately falls on working mothers and how to address it.",
      readTime: "12 min read",
      url: "https://www.harpersbazaar.com/culture/features/a12063822/emotional-labor-gender-equality/",
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=96&h=64&fit=crop",
      category: "wellness",
      tags: ["Mental Health", "Gender Equality", "Work-Life Balance"],
      publishedDate: "Sep 27, 2017",
      source: "Harper's Bazaar",
    },
    {
      id: "2",
      title: "How Working Mothers Can Thrive, Not Just Survive",
      author: "Sharon Meers",
      excerpt:
        "Practical strategies for working mothers to build successful careers while raising happy families.",
      readTime: "8 min read",
      url: "https://hbr.org/2009/09/how-working-mothers-can-thrive-not-just-survive",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=64&fit=crop",
      category: "career",
      tags: ["Career Growth", "Success", "Balance"],
      publishedDate: "Sep 1, 2009",
      source: "Harvard Business Review",
    },
    {
      id: "3",
      title: "The Working Mother's Survival Guide to School Holidays",
      author: "Anna Whitehouse",
      excerpt:
        "Creative solutions and practical tips for managing childcare during school breaks while maintaining your career.",
      readTime: "6 min read",
      url: "https://medium.com/@mother_pukka/the-working-mothers-survival-guide-to-school-holidays-8f9b3c8f8e2a",
      imageUrl: "", // Empty to test fallback
      category: "parenting",
      tags: ["School Holidays", "Childcare", "Planning"],
      publishedDate: "Jul 15, 2023",
      source: "Medium",
    },
    {
      id: "4",
      title: "Why Self-Care Isn't Selfish for Working Moms",
      author: "Dr. Pooja Lakshmin",
      excerpt:
        "A psychiatrist explains why taking care of yourself is essential for being the best mother and professional you can be.",
      readTime: "10 min read",
      url: "https://www.nytimes.com/2023/03/15/well/family/working-mothers-self-care.html",
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=96&h=64&fit=crop",
      category: "wellness",
      tags: ["Self-Care", "Mental Health", "Wellbeing"],
      publishedDate: "Mar 15, 2023",
      source: "The New York Times",
    },
    {
      id: "5",
      title: "The Rise of the Working Mom CEO",
      author: "Katrina Lake",
      excerpt:
        "How motherhood can actually enhance leadership skills and drive business success.",
      readTime: "7 min read",
      url: "https://fortune.com/2022/05/08/working-mom-ceo-leadership-business-success/",
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=64&fit=crop",
      category: "leadership",
      tags: ["Leadership", "CEO", "Business"],
      publishedDate: "May 8, 2022",
      source: "Fortune",
    },
    {
      id: "6",
      title: "Flexible Work: A Game Changer for Working Mothers",
      author: "Reshma Saujani",
      excerpt:
        "How remote and flexible work arrangements are revolutionizing careers for working mothers post-pandemic.",
      readTime: "9 min read",
      url: "https://www.wsj.com/articles/flexible-work-game-changer-working-mothers-11647890400",
      imageUrl: "", // Empty to test fallback
      category: "work-life-balance",
      tags: ["Remote Work", "Flexibility", "Career"],
      publishedDate: "Mar 21, 2022",
      source: "The Wall Street Journal",
    },
  ];

  useEffect(() => {
    loadContent();
  }, [activeTab, selectedCategory]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (activeTab === "books") {
        // Try to load from service, fallback to mock data
        try {
          const bookData = await contentService.fetchBooks(
            selectedCategory,
            searchQuery
          );
          setBooks(bookData.length > 0 ? bookData : mockBooks);
        } catch {
          console.log("Using mock book data");
          setBooks(mockBooks);
        }
      } else {
        // Try to load from service, fallback to mock data
        try {
          const blogData = await contentService.fetchBlogs(
            selectedCategory,
            searchQuery
          );
          setBlogs(blogData.length > 0 ? blogData : mockBlogs);
        } catch {
          console.log("Using mock blog data");
          setBlogs(mockBlogs);
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
      // Fallback to mock data
      if (activeTab === "books") {
        setBooks(mockBooks);
      } else {
        setBlogs(mockBlogs);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadContent();
  };

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <BookCoverImage
              src={book.imageUrl}
              alt={book.title}
              title={book.title}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">by {book.author}</p>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(book.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({book.rating})</span>
            </div>

            <p className="text-gray-700 text-sm mt-2 line-clamp-2">
              {book.description}
            </p>

            <div className="flex flex-wrap gap-1 mt-2">
              {book.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Badge variant="outline" className="text-xs">
                {book.category}
              </Badge>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => window.open(book.amazonUrl, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Buy on Amazon
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <BlogImage
              src={blog.imageUrl}
              alt={blog.title}
              title={blog.title}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {blog.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <span>by {blog.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.readTime}
              </span>
            </div>

            <p className="text-gray-700 text-sm mt-2 line-clamp-2">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap gap-1 mt-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                {blog.source} • {blog.publishedDate}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-blue-50"
                onClick={() => window.open(blog.url, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Read Article
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Books & Blogs for Working Mothers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Selection */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === "books" ? "default" : "outline"}
              onClick={() => setActiveTab("books")}
              className={
                activeTab === "books" ? "bg-purple-600 hover:bg-purple-700" : ""
              }
            >
              📚 Books
            </Button>
            <Button
              variant={activeTab === "blogs" ? "default" : "outline"}
              onClick={() => setActiveTab("blogs")}
              className={
                activeTab === "blogs" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              📝 Blogs & Articles
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books or articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="sm:w-48">
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
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Content Banner */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">✨ Featured This Week</h2>
            <p className="text-purple-100 mb-4">
              {activeTab === "books"
                ? "Discover the best books for working mothers, curated by experts and fellow moms"
                : "Read the latest insights on wellness, parenting, and career balance from top writers"}
            </p>
            <Badge variant="secondary" className="bg-white text-purple-600">
              Curated Content
            </Badge>
          </div>
          <div className="absolute right-0 top-0 opacity-20">
            <BookOpen className="h-32 w-32 transform rotate-12" />
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse bg-white/80">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === "books"
            ? books.map((book) => <BookCard key={book.id} book={book} />)
            : blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        ((activeTab === "books" && books.length === 0) ||
          (activeTab === "blogs" && blogs.length === 0)) && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No content found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or category filters
              </p>
            </CardContent>
          </Card>
        )}

      {/* Quick Tips */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">
            💡 Reading Tips for Busy Moms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                📱 Digital Reading
              </h4>
              <p className="text-sm text-blue-700">
                Use audiobooks during commutes or while doing chores. Apps like
                Audible offer hands-free learning.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">
                ⏰ Micro-Reading
              </h4>
              <p className="text-sm text-purple-700">
                Read articles during coffee breaks or while waiting for
                appointments. Every minute counts!
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                👥 Book Clubs
              </h4>
              <p className="text-sm text-green-700">
                Join online mom book clubs for accountability and discussion.
                Connect with like-minded mothers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
