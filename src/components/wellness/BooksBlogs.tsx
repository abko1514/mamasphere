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
import { BookOpen, ExternalLink, Search, Star, Clock, Tag } from "lucide-react";
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

  useEffect(() => {
    loadContent();
  }, [activeTab, selectedCategory]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (activeTab === "books") {
        const bookData = await contentService.fetchBooks(
          selectedCategory,
          searchQuery
        );
        setBooks(bookData);
      } else {
        const blogData = await contentService.fetchBlogs(
          selectedCategory,
          searchQuery
        );
        setBlogs(blogData);
      }
    } catch (error) {
      console.error("Error loading content:", error);
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
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-20 h-28 object-cover rounded-md shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/80/112";
              }}
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
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-24 h-16 object-cover rounded-md shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/96/64";
              }}
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
