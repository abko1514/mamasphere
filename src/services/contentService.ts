// services/contentService.ts

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

class ContentService {
  private readonly HUGGING_FACE_API = 'https://api-inference.huggingface.co/models';
  private readonly NEWS_API = 'https://newsapi.org/v2';

  // Sample books database - in production, this would come from a real API
  private sampleBooks: Book[] = [
    {
      id: '1',
      title: 'The Working Mother\'s Guide to Life',
      author: 'Linda Mason',
      description: 'A comprehensive guide for working mothers to manage career and family successfully.',
      rating: 4.5,
      amazonUrl: 'https://amazon.com/working-mothers-guide-life',
      imageUrl: '/api/placeholder/120/160',
      category: 'work-life-balance',
      tags: ['career', 'parenting', 'productivity'],
      publishedYear: 2023
    },
    {
      id: '2',
      title: 'Mindful Motherhood',
      author: 'Cassandra Vieten',
      description: 'Practical mindfulness techniques for the modern mother to find peace and balance.',
      rating: 4.7,
      amazonUrl: 'https://amazon.com/mindful-motherhood',
      imageUrl: '/api/placeholder/120/160',
      category: 'wellness',
      tags: ['mindfulness', 'self-care', 'mental health'],
      publishedYear: 2022
    },
    {
      id: '3',
      title: 'The First Forty Days',
      author: 'Heng Ou',
      description: 'A guide to nourishing and nurturing new mothers in their first weeks postpartum.',
      rating: 4.6,
      amazonUrl: 'https://amazon.com/first-forty-days',
      imageUrl: '/api/placeholder/120/160',
      category: 'parenting',
      tags: ['postpartum', 'recovery', 'nutrition'],
      publishedYear: 2024
    },
    {
      id: '4',
      title: 'Lean In: Women, Work, and the Will to Lead',
      author: 'Sheryl Sandberg',
      description: 'Empowering advice for women to lean in and take leadership roles in their careers.',
      rating: 4.3,
      amazonUrl: 'https://amazon.com/lean-in-women-work',
      imageUrl: '/api/placeholder/120/160',
      category: 'career',
      tags: ['leadership', 'career development', 'empowerment'],
      publishedYear: 2023
    },
    {
      id: '5',
      title: 'The Self-Care Solution',
      author: 'Julie Burton',
      description: 'A month-by-month guide to taking care of yourself while caring for everyone else.',
      rating: 4.4,
      amazonUrl: 'https://amazon.com/self-care-solution',
      imageUrl: '/api/placeholder/120/160',
      category: 'self-care',
      tags: ['wellness', 'mental health', 'routines'],
      publishedYear: 2023
    },
    {
      id: '6',
      title: 'Getting Things Done for Busy Moms',
      author: 'David Allen',
      description: 'Productivity techniques specifically adapted for the busy modern mother.',
      rating: 4.5,
      amazonUrl: 'https://amazon.com/gtd-busy-moms',
      imageUrl: '/api/placeholder/120/160',
      category: 'productivity',
      tags: ['productivity', 'organization', 'time management'],
      publishedYear: 2022
    }
  ];

  // Sample blogs database
  private sampleBlogs: Blog[] = [
    {
      id: '1',
      title: '10 Minutes Morning Routine That Will Transform Your Day',
      author: 'Sarah Johnson',
      excerpt: 'Discover how a simple 10-minute morning routine can set you up for success, even with kids running around.',
      readTime: '5 min read',
      url: 'https://medium.com/@sarah/morning-routine-busy-moms',
      imageUrl: '/api/placeholder/120/80',
      category: 'productivity',
      tags: ['morning routine', 'productivity', 'self-care'],
      publishedDate: '2024-08-15',
      source: 'Medium'
    },
    {
      id: '2',
      title: 'Postpartum Depression: Breaking the Silence',
      author: 'Dr. Emily Chen',
      excerpt: 'An honest discussion about postpartum depression, its signs, and how to seek help.',
      readTime: '8 min read',
      url: 'https://healthline.com/postpartum-depression-guide',
      imageUrl: '/api/placeholder/120/80',
      category: 'wellness',
      tags: ['mental health', 'postpartum', 'support'],
      publishedDate: '2024-08-10',
      source: 'Healthline'
    },
    {
      id: '3',
      title: 'Balancing Career Ambitions with Family Life',
      author: 'Michelle Rodriguez',
      excerpt: 'Practical strategies for advancing your career while being present for your family.',
      readTime: '6 min read',
      url: 'https://harvard-business-review.com/career-family-balance',
      imageUrl: '/api/placeholder/120/80',
      category: 'career',
      tags: ['career development', 'work-life balance', 'leadership'],
      publishedDate: '2024-08-08',
      source: 'Harvard Business Review'
    },
    {
      id: '4',
      title: 'Quick Healthy Meals for Busy Weeknights',
      author: 'Chef Maria Santos',
      excerpt: 'Nutritious and delicious meal ideas that can be prepared in 30 minutes or less.',
      readTime: '4 min read',
      url: 'https://cooking-light.com/quick-healthy-meals',
      imageUrl: '/api/placeholder/120/80',
      category: 'wellness',
      tags: ['nutrition', 'cooking', 'family meals'],
      publishedDate: '2024-08-05',
      source: 'Cooking Light'
    },
    {
      id: '5',
      title: 'The Art of Saying No: Protecting Your Energy',
      author: 'Lisa Thompson',
      excerpt: 'Learn how to set boundaries and say no without guilt to protect your mental health.',
      readTime: '7 min read',
      url: 'https://psychology-today.com/saying-no-boundaries',
      imageUrl: '/api/placeholder/120/80',
      category: 'self-care',
      tags: ['boundaries', 'mental health', 'stress management'],
      publishedDate: '2024-08-01',
      source: 'Psychology Today'
    },
    {
      id: '6',
      title: 'Teaching Kids Independence: Age-Appropriate Chores',
      author: 'Parent Coach Amy Wright',
      excerpt: 'A comprehensive guide to age-appropriate chores that teach responsibility and independence.',
      readTime: '9 min read',
      url: 'https://parents.com/teaching-kids-independence',
      imageUrl: '/api/placeholder/120/80',
      category: 'parenting',
      tags: ['parenting', 'child development', 'life skills'],
      publishedDate: '2024-07-28',
      source: 'Parents Magazine'
    }
  ];

  async fetchBooks(category: string, searchQuery?: string): Promise<Book[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredBooks = this.sampleBooks;
      
      // Filter by category
      if (category !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === category);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Simulate fetching additional books from external APIs
      const additionalBooks = await this.fetchBooksFromGoogleBooks(searchQuery || 'working mothers');
      
      return [...filteredBooks, ...additionalBooks].slice(0, 12);
    } catch (error) {
      console.error('Error fetching books:', error);
      return this.sampleBooks.filter(book => category === 'all' || book.category === category);
    }
  }

  async fetchBlogs(category: string, searchQuery?: string): Promise<Blog[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredBlogs = this.sampleBlogs;
      
      // Filter by category
      if (category !== 'all') {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === category);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.title.toLowerCase().includes(query) ||
          blog.author.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Simulate fetching from Medium, Dev.to, etc.
      const additionalBlogs = await this.fetchBlogsFromMedium(searchQuery || 'working mothers');
      
      return [...filteredBlogs, ...additionalBlogs].slice(0, 12);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return this.sampleBlogs.filter(blog => category === 'all' || blog.category === category);
    }
  }

  private async fetchBooksFromGoogleBooks(query: string): Promise<Book[]> {
    try {
      // Google Books API
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query + ' working mothers parenting')}&maxResults=6`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Google Books API');
      }

      const data = await response.json();
      
      return data.items?.map((item: any, index: number) => ({
        id: `google_${item.id}`,
        title: item.volumeInfo.title || 'Untitled',
        author: item.volumeInfo.authors?.[0] || 'Unknown Author',
        description: item.volumeInfo.description?.substring(0, 200) + '...' || 'No description available',
        rating: item.volumeInfo.averageRating || 4.0,
        amazonUrl: `https://amazon.com/s?k=${encodeURIComponent(item.volumeInfo.title)}`,
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || '/api/placeholder/120/160',
        category: 'parenting',
        tags: item.volumeInfo.categories || ['parenting', 'motherhood'],
        publishedYear: parseInt(item.volumeInfo.publishedDate?.substring(0, 4)) || 2023
      })).slice(0, 3) || [];
    } catch (error) {
      console.error('Error fetching from Google Books:', error);
      return [];
    }
  }

  private async fetchBlogsFromMedium(query: string): Promise<Blog[]> {
    try {
      // Simulate fetching from RSS feeds and content APIs
      // In a real app, you'd use Medium's RSS or other blog APIs
      const simulatedBlogs: Blog[] = [
        {
          id: 'medium_1',
          title: 'The Mental Load: Why Working Mothers Are Always Exhausted',
          author: 'Dr. Jennifer Park',
          excerpt: 'Understanding the invisible burden that working mothers carry and strategies to share the mental load.',
          readTime: '6 min read',
          url: 'https://medium.com/@drpark/mental-load-working-mothers',
          imageUrl: '/api/placeholder/120/80',
          category: 'wellness',
          tags: ['mental health', 'work-life balance', 'stress'],
          publishedDate: '2024-08-20',
          source: 'Medium'
        },
        {
          id: 'medium_2',
          title: 'Building a Support Network as a Working Mom',
          author: 'Rachel Green',
          excerpt: 'How to create and maintain meaningful connections that support your journey as a working mother.',
          readTime: '5 min read',
          url: 'https://medium.com/@rachelgreen/building-support-network',
          imageUrl: '/api/placeholder/120/80',
          category: 'self-care',
          tags: ['community', 'support', 'relationships'],
          publishedDate: '2024-08-18',
          source: 'Medium'
        }
      ];

      return simulatedBlogs;
    } catch (error) {
      console.error('Error fetching from Medium:', error);
      return [];
    }
  }

  async fetchTrendingContent(): Promise<{ books: Book[]; blogs: Blog[] }> {
    try {
      // Fetch trending content based on engagement metrics
      const trendingBooks = this.sampleBooks
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      
      const trendingBlogs = this.sampleBlogs
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        .slice(0, 3);
      
      return {
        books: trendingBooks,
        blogs: trendingBlogs
      };
    } catch (error) {
      console.error('Error fetching trending content:', error);
      return {
        books: this.sampleBooks.slice(0, 3),
        blogs: this.sampleBlogs.slice(0, 3)
      };
    }
  }

  async searchContent(query: string, type: 'books' | 'blogs' | 'all'): Promise<{ books: Book[]; blogs: Blog[] }> {
    try {
      const results: { books: Book[]; blogs: Blog[] } = { books: [], blogs: [] };
      
      if (type === 'books' || type === 'all') {
        results.books = await this.fetchBooks('all', query);
      }
      
      if (type === 'blogs' || type === 'all') {
        results.blogs = await this.fetchBlogs('all', query);
      }
      
      return results;
    } catch (error) {
      console.error('Error searching content:', error);
      return { books: [], blogs: [] };
    }
  }
}

export const contentService = new ContentService();