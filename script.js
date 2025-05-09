// Navbar scroll effect
window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    document.getElementById('navbar').classList.add('scrolled');
  } else {
    document.getElementById('navbar').classList.remove('scrolled');
  }
});

// Back to top buttona
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
    // Add fade-in animation
    setTimeout(() => {
      backToTopButton.style.opacity = '1';
    }, 50);
  } else {
    backToTopButton.style.opacity = '0';
    setTimeout(() => {
      backToTopButton.style.display = 'none';
    }, 300);
  }
});

backToTopButton.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu after click
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navbarCollapse).hide();
      }
    }
  });
});

// Theme toggle functionality
function setupThemeToggle() {
  // Create theme toggle button and add it to navbar
  const navbarNav = document.querySelector('#navbarNav .navbar-nav');
  
  if (navbarNav) {
    // Create new list item for navbar
    const themeToggleItem = document.createElement('li');
    themeToggleItem.className = 'nav-item';
    
    // Create the toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle nav-link';
    themeToggle.id = 'theme-toggle';
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    
    // Add button to list item
    themeToggleItem.appendChild(themeToggle);
    
    // Add list item to navbar
    navbarNav.appendChild(themeToggleItem);
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcon('dark');
    }
  
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Add animation class
      themeToggle.classList.add('animate-toggle');
      
      // Set the theme after a slight delay (for animation)
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Remove animation class after animation completes
        setTimeout(() => {
          themeToggle.classList.remove('animate-toggle');
        }, 700);
      }, 300);
    });
  }
}

// Update the icon based on current theme
function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' 
      ? '<i class="fas fa-moon"></i>' 
      : '<i class="fas fa-sun"></i>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Setup theme toggle
  setupThemeToggle();
  
  // Apply initial animations for hero section elements that are visible on load
  setTimeout(() => {
    document.querySelectorAll('.hero-section .flow, .hero-section .scaleup').forEach(element => {
      element.classList.add('visible');
    });
  }, 300);
  
  // Add footer animation classes
  applyFooterAnimations();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Animate skill progress bars on scroll
  animateProgressBars();
  
  // Add staggered animations to list items
  animateStaggeredItems();
});

// Function to apply footer animation classes
function applyFooterAnimations() {
  const footer = document.querySelector('.footer');
  if (footer) {
    // Get footer columns
    const footerColumns = footer.querySelectorAll('.row > div');
    
    // Apply different animation classes to each column
    if (footerColumns.length >= 3) {
      footerColumns[0].classList.add('footer-animate-left');
      footerColumns[1].classList.add('footer-animate-bottom');
      footerColumns[2].classList.add('footer-animate-right');
    }
    
    // Add animation to copyright text
    const copyright = footer.querySelector('.text-center');
    if (copyright) {
      copyright.classList.add('footer-animate-bottom');
    }
  }
}

// Function to initialize scroll animations with continuous triggering
function initScrollAnimations() {
  // Get all elements that need animation
  const animatedElements = document.querySelectorAll(
    '.flow, .scaleup, .fade-in, .slide-in-left, .slide-in-right, .scale-in, ' + 
    '.footer-animate-left, .footer-animate-right, .footer-animate-bottom, .stagger-item'
  );
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If element is in viewport
      if (entry.isIntersecting) {
        // Add visible class and remove hidden class to trigger animation
        entry.target.classList.add('visible');
        entry.target.classList.remove('hidden');
      } else {
        // When element leaves viewport, add hidden class and remove visible class
        // This allows the animation to trigger again when scrolling back up
        entry.target.classList.add('hidden');
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.15, // Trigger when at least 15% of the element is visible
    rootMargin: '0px 0px -40px 0px' // Adjust trigger point (negative value means trigger earlier)
  });
  
  // Observe each element
  animatedElements.forEach(element => {
    // Add hidden class initially to ensure animations work properly
    element.classList.add('hidden');
    observer.observe(element);
  });
}

// Function to animate progress bars continuously
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Get the target width from aria-valuenow attribute
      const targetWidth = entry.target.getAttribute('aria-valuenow') + '%';
      
      if (entry.isIntersecting) {
        // Animate to target width
        entry.target.style.width = targetWidth;
      } else {
        // Reset to 0 when out of viewport
        entry.target.style.width = '0%';
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px'
  });
  
  progressBars.forEach(bar => {
    // Set initial width to 0
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// Function to animate staggered list items continuously
function animateStaggeredItems() {
  const listGroups = document.querySelectorAll('.list-group');
  
  listGroups.forEach(group => {
    const items = group.querySelectorAll('.list-group-item');
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Add visible class with delay based on index
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
            item.classList.remove('hidden');
          }, 100 * index);
        });
      } else {
        // Reset when out of viewport
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('hidden');
            item.classList.remove('visible');
          }, 100 * index);
        });
      }
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -80px 0px'
    });
    
    observer.observe(group);
  });
}

// Add scroll-triggered animations to specific sections
window.addEventListener('load', function() {
  // Add animation classes to elements based on their section
  document.querySelectorAll('.section-padding .row > div').forEach((element, index) => {
    if (index % 2 === 0) {
      element.classList.add('slide-in-left');
    } else {
      element.classList.add('slide-in-right');
    }
  });
  
  // Add scale-in animation to cards
  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('scale-in');
  });
  
  // Re-initialize animations after adding classes
  initScrollAnimations();
});