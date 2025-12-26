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
      id: 2,
      title: "Anthropic’s Interview Process & Questions",
      category: "TECH INTERVIEW",
      date: "2025-12-26",
      excerpt: "Exploring the intricacies of my interview process at Anthropic and the questions I was asked.",
      content: "My interview experience at Anthropic was rigorous, deeply technical, and strongly grounded in real-world AI engineering and responsibility. It began with a 30-minute recruiter call that covered my background, motivation for joining Anthropic, understanding of its mission as a B Corp, and long-term goals, while also setting expectations around system design, particularly model-serving infrastructure for AI inference. The coding challenge phase—either live or a take-home CodeSignal assessment depending on the role—tested practical algorithmic thinking, where preparation using the NeetCode 75 was especially valuable, and the problems closely resembled applied LeetCode questions such as Ant on the Boundary (3028), Make String Anti-palindrome (3088), Count Ways to Build Rooms in an Ant Colony (1916), and Last Moment Before All Ants Fall Out of a Plank (1503), emphasizing correctness, efficiency, and edge-case handling. The hiring manager round was primarily technical, combining a deep dive into one of my completed projects with cross-language code review, where I was expected to identify bugs, infer intent, and explain trade-offs. The onsite interviews elevated the challenge further with a one-hour coding round in a shared Python environment, a one-hour system design session using a visual drawing tool, and a system interview where I was asked to design an agentic AI system capable of autonomously adapting to new tasks, covering aspects such as modular agents, memory, feedback loops, safety constraints, and scalability, alongside API design for developers and partners. The behavioral discussions were notably thoughtful and conversational, focusing on AI ethics, safety, data protection, knowledge sharing, and the broader impact of AI on the job market, making the entire process feel holistic, intellectually demanding, and truly reflective of Anthropic’s engineering culture and values.",




      readTime: "6 min read",
      tags: ["ML", "Tokenization", "LLM", "Performance"]
    },
    
    
    
    
    
    
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