class BestSellersScroll {
  constructor() {
    this.init();
  }

  init() {
    this.initImageSwap();
    this.initScrollbar();
    this.initMobileToggle();
  }

  initImageSwap() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(image => {
      const primaryImg = image.getAttribute('data-primary-img');
      const secondaryImg = image.getAttribute('data-secondary-img');
      
      if (primaryImg && secondaryImg) {
        image.addEventListener('mouseover', () => {
          image.src = secondaryImg;
        });
        
        image.addEventListener('mouseout', () => {
          image.src = primaryImg;
        });
      }
    });
  }

  initScrollbar() {
    const container = document.getElementById('productGrid');
    const thumb = document.getElementById('scrollbarThumb');
    const track = thumb?.parentElement;

    if (!container || !thumb || !track) return;

    let isDragging = false;
    let startX;
    let scrollLeft;
    let thumbLeft;

    const updateScrollThumb = () => {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      
      // Calculate thumb width (minimum 10% of track width)
      const thumbWidth = Math.max((clientWidth / scrollWidth) * 100, 10);
      thumb.style.width = `${thumbWidth}%`;

      // Calculate thumb position
      const maxScroll = scrollWidth - clientWidth;
      const scrollPercentage = (scrollLeft / maxScroll) * 100;
      const maxThumbLeft = 100 - thumbWidth;
      const thumbLeft = Math.min(scrollPercentage, maxThumbLeft);
      
      thumb.style.left = `${thumbLeft}%`;
    };

    // Handle thumb dragging
    thumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - thumb.offsetLeft;
      scrollLeft = container.scrollLeft;
      thumbLeft = thumb.offsetLeft;
      
      // Add active state
      thumb.style.height = '0.375rem';
      thumb.style.background = 'rgba(107, 114, 128, 0.8)';
    });

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const trackRect = track.getBoundingClientRect();
      const x = e.pageX - trackRect.left;
      const thumbWidth = thumb.offsetWidth;
      const maxX = trackRect.width - thumbWidth;
      
      // Calculate new thumb position
      let newThumbLeft = x - startX;
      newThumbLeft = Math.max(0, Math.min(newThumbLeft, maxX));
      
      // Calculate scroll position
      const scrollRatio = newThumbLeft / maxX;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = scrollRatio * maxScroll;
    };

    const handleMouseUp = () => {
      isDragging = false;
      // Remove active state
      thumb.style.height = '0.25rem';
      thumb.style.background = 'rgba(156, 163, 175, 0.5)';
    };

    // Add click handler for track
    track.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      
      const trackRect = track.getBoundingClientRect();
      const x = e.pageX - trackRect.left;
      const thumbWidth = thumb.offsetWidth;
      const maxX = trackRect.width - thumbWidth;
      
      // Calculate new thumb position
      let newThumbLeft = x - (thumbWidth / 2);
      newThumbLeft = Math.max(0, Math.min(newThumbLeft, maxX));
      
      // Calculate scroll position
      const scrollRatio = newThumbLeft / maxX;
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = scrollRatio * maxScroll;
    });

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('scroll', updateScrollThumb);
    window.addEventListener('resize', updateScrollThumb);

    // Initial setup
    updateScrollThumb();
  }

  initMobileToggle() {
    const wrapper = document.getElementById('gridWrapper');
    const toggleButton = document.getElementById('toggleButton');

    if (!wrapper || !toggleButton) return;

    toggleButton.addEventListener('click', () => {
      const isExpanded = wrapper.classList.contains('expanded');

      if (isExpanded) {
        wrapper.classList.remove('expanded');
        wrapper.classList.add('collapsed');
        toggleButton.textContent = 'Show More';
        toggleButton.setAttribute('aria-expanded', 'false');
        wrapper.scrollIntoView({ behavior: 'smooth' });
      } else {
        wrapper.classList.remove('collapsed');
        wrapper.classList.add('expanded');
        toggleButton.textContent = 'Show Less';
        toggleButton.setAttribute('aria-expanded', 'true');
      }
    });

    if (window.innerWidth < 1024) {
      wrapper.classList.add('collapsed');
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        wrapper.classList.remove('collapsed', 'expanded');
      } else if (!wrapper.classList.contains('expanded')) {
        wrapper.classList.add('collapsed');
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BestSellersScroll());
} else {
  new BestSellersScroll();
} 