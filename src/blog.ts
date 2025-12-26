// Blog Management System
interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
}

export class BlogManager {
  private posts: BlogPost[] = [
    {
      id: 1,
      title: "Building NeuroRiftV3: From Python to Triton GPU Kernels",
      category: "ai",
      date: "2025-01-10",
      excerpt: "Deep dive into creating a specialized LLM that translates Python code into high-performance Triton GPU kernels. Learn about the challenges and breakthroughs in automated code optimization.",
      content: "The journey of building NeuroRiftV3 started with a simple question: Can we automatically optimize Python code for GPU execution? This post explores the technical challenges, architectural decisions, and the fascinating world of code translation using machine learning. From tokenization strategies to model architecture, we'll cover the complete pipeline that makes this translation possible.",
      readTime: "8 min read",
      tags: ["AI", "GPU", "Python", "Optimization"]
    },
    {
      id: 2,
      title: "Machine Learning at Anthropic: Tokenization Insights",
      category: "ai",
      date: "2025-01-09",
      excerpt: "Exploring the intricacies of tokenization in large language models and how it impacts model performance and efficiency in production systems.",
      content: "Tokenization is often overlooked but plays a crucial role in LLM performance. In this post, I share insights from working on tokenization systems at Anthropic and how proper encoding strategies can dramatically improve model efficiency. We'll explore different tokenization approaches, their trade-offs, and real-world performance implications.",
      readTime: "6 min read",
      tags: ["ML", "Tokenization", "LLM", "Performance"]
    },
    {
      id: 3,
      title: "Retro-Father Programming Language: Design Decisions",
      category: "dev",
      date: "2025-01-08",
      excerpt: "Why I built my own programming language and the key design decisions that shaped Retro-Father's architecture, from lambda expressions to closure implementations.",
      content: "Creating a programming language from scratch teaches you about the fundamental concepts of computation. This post covers the design philosophy behind Retro-Father, including its functional programming features and planned optimizations. We'll dive into parser implementation, AST design, and the challenges of building an interpreter.",
      readTime: "10 min read",
      tags: ["Programming Languages", "Compilers", "Functional Programming"]
    },
    {
      id: 4,
      title: "AWS Microservices: Lessons from Traffic Management",
      category: "tech",
      date: "2025-01-07",
      excerpt: "Real-world insights from building a scalable traffic management solution using AWS services, microservices architecture, and multi-language integration.",
      content: "Building distributed systems teaches you about the complexities of modern software architecture. This post shares lessons learned from implementing a traffic management solution using AWS, including service orchestration and data consistency challenges. We'll cover deployment strategies, monitoring, and scaling considerations.",
      readTime: "7 min read",
      tags: ["AWS", "Microservices", "Distributed Systems", "DevOps"]
    },
    {
      id: 5,
      title: "Neural Networks from Scratch: Image Recognition Deep Dive",
      category: "ai",
      date: "2025-01-06",
      excerpt: "Building an image recognition system without frameworks - understanding the mathematics and implementation details behind convolutional neural networks.",
      content: "There's something magical about building neural networks from first principles. This post walks through implementing a complete image recognition system using only Python and NumPy, covering backpropagation, convolution operations, and optimization techniques. Understanding these fundamentals is crucial for any ML engineer.",
      readTime: "12 min read",
      tags: ["Neural Networks", "Computer Vision", "Mathematics", "Python"]
    },
    {
      id: 6,
      title: "Game Development with Unreal Engine: Sparks of Genius",
      category: "dev",
      date: "2025-01-05",
      excerpt: "Combining visual scripting with traditional programming in Unreal Engine to create immersive gaming experiences and the lessons learned in game architecture.",
      content: "Game development requires a unique blend of technical skills and creative vision. This post explores the development of Sparks of Genius, covering everything from world design to multiplayer networking and the integration of C# and Java components. We'll discuss performance optimization and user experience design.",
      readTime: "9 min read",
      tags: ["Game Development", "Unreal Engine", "C#", "Java"]
    },
    {
      id: 7,
      title: "The Future of Code Translation: AI-Powered Development",
      category: "tech",
      date: "2025-01-04",
      excerpt: "Exploring how AI is revolutionizing software development through automated code translation, optimization, and the implications for developers.",
      content: "AI is transforming how we write and optimize code. This post examines the current state and future potential of AI-powered development tools, from code completion to full program synthesis. We'll discuss the opportunities and challenges this presents for software engineers.",
      readTime: "8 min read",
      tags: ["AI", "Future Tech", "Development Tools", "Automation"]
    },
    {
      id: 8,
      title: "How to tackle Big Tech Interview ",
      category: "tech , interview",
      date: "2025-01-03",
      excerpt: "Bridging the gap between quantum and classical computing through hybrid algorithms and practical applications in current technology stacks.",
      content: "Quantum computing isn't just theoretical anymore. This post explores practical applications of quantum algorithms in classical systems and how hybrid approaches are solving real-world problems. We'll cover quantum-inspired optimization and its applications in machine learning.",
      readTime: "11 min read",
      tags: ["Quantum Computing", "Algorithms", "Hybrid Systems", "Optimization"]
    }
  ];
  
  private currentFilter: string = 'all';
  private displayedPosts: number = 3;
  private filteredPosts: BlogPost[] = [...this.posts];
  private searchTerm: string = '';

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  createPostHTML(post: BlogPost): string {
    return `
      <div class="blog-post" data-category="${post.category}" style="animation-delay: ${Math.random() * 0.3}s">
        <h4>${post.title}</h4>
        <div class="post-meta">
          <span class="post-category">${post.category.toUpperCase()}</span>
          <span>${this.formatDate(post.date)} • ${post.readTime}</span>
        </div>
        <p>${post.excerpt}</p>
        <div class="post-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <span class="read-more" onclick="window.blogManager.expandPost(${post.id})">Read more →</span>
      </div>
    `;
  }

  filterPosts(category: string): void {
    this.currentFilter = category;
    this.displayedPosts = 3;
    this.applyFilters();
    this.updateActiveFilter(category);
    this.renderPosts();
  }

  searchPosts(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.displayedPosts = 3;
    this.applyFilters();
    this.renderPosts();
  }

  private applyFilters(): void {
    let filtered = [...this.posts];
    
    // Apply category filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(post => post.category === this.currentFilter);
    }
    
    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(this.searchTerm) ||
        post.excerpt.toLowerCase().includes(this.searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
      );
    }
    
    this.filteredPosts = filtered;
  }

  private updateActiveFilter(category: string): void {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-filter="${category}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  renderPosts(): void {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    const postsToShow = this.filteredPosts.slice(0, this.displayedPosts);
    
    if (postsToShow.length === 0) {
      container.innerHTML = `
        <div class="loading-posts">
          <h4>No posts found${this.searchTerm ? ` for "${this.searchTerm}"` : ' for this category'}.</h4>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      `;
      const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLElement;
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    container.innerHTML = postsToShow.map(post => this.createPostHTML(post)).join('');
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLElement;
    if (loadMoreBtn) {
      if (this.displayedPosts >= this.filteredPosts.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-flex';
        loadMoreBtn.textContent = `Load More Posts (${this.filteredPosts.length - this.displayedPosts} remaining)`;
      }
    }
  }

  loadMorePosts(): void {
    this.displayedPosts += 3;
    this.renderPosts();
  }

  expandPost(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      // Create a modal-like experience
      const modal = document.createElement('div');
      modal.className = 'post-modal';
      modal.innerHTML = `
        <div class="post-modal-content">
          <div class="post-modal-header">
            <h2>${post.title}</h2>
            <button class="close-modal" onclick="window.blogManager.closeModal(this)">&times;</button>
          </div>
          <div class="post-modal-meta">
            <span class="post-category">${post.category.toUpperCase()}</span>
            <span>${this.formatDate(post.date)} • ${post.readTime}</span>
          </div>
          <div class="post-modal-body">
            <p>${post.content}</p>
            <div class="post-tags">
              ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
      
      // Add click outside to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.querySelector('.close-modal') as HTMLElement);
        }
      });
      
      // Prevent body scroll
      document.body.classList.add('modal-open');
      
      document.body.appendChild(modal);
    }
  }

  closeModal(closeButton: HTMLElement): void {
    const modal = closeButton.closest('.post-modal') as HTMLElement;
    if (modal) {
      const content = modal.querySelector('.post-modal-content') as HTMLElement;
      if (content) {
        content.style.animation = 'bookClose 0.4s ease-in forwards';
        modal.style.animation = 'fadeOut 0.4s ease-in forwards';
        
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
            // Re-enable body scroll
            document.body.classList.remove('modal-open');
          }
        }, 400);
      }
    }
  }

  init(): void {
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = (btn as HTMLElement).dataset.filter;
        if (filterValue) {
          this.filterPosts(filterValue);
        }
      });
    });
    
    // Initial render with loading simulation
    setTimeout(() => {
      this.renderPosts();
    }, 500);
  }
}

// Export functions for global access
export function initializeBlog(): BlogManager {
  const blogManager = new BlogManager();
  
  // Make it globally accessible for onclick handlers
  (window as any).blogManager = blogManager;
  
  // Global functions for HTML onclick handlers
  (window as any).loadMorePosts = () => {
    blogManager.loadMorePosts();
  };
  
  (window as any).searchPosts = () => {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      blogManager.searchPosts(searchInput.value);
    }
  };
  
  return blogManager;
}