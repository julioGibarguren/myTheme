document.addEventListener('DOMContentLoaded', function () {
    // Image swap functionality
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(image => {
        const primaryImg = image.getAttribute('data-primary-img');
        const secondaryImg = image.getAttribute('data-secondary-img');
        
        if (primaryImg && secondaryImg) {
            image.addEventListener('mouseover', function() {
                this.src = secondaryImg;
            });
            
            image.addEventListener('mouseout', function() {
                this.src = primaryImg;
            });
        }
    });

    // Custom scrollbar functionality
    const container = document.getElementById('productGrid');
    const thumb = document.getElementById('scrollbarThumb');
    const track = thumb.parentElement;

    function updateScrollThumb() {
        // Calculate scroll percentage
        const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;

        // Calculate thumb width - minimum 10% of track width
        const thumbWidth = Math.max(
            (container.clientWidth / container.scrollWidth) * 100,
            10
        );

        // Calculate maximum left position to prevent overflow
        const maxLeft = 100 - thumbWidth;
        const leftPosition = Math.min(scrollPercentage, maxLeft);

        // Update thumb position and width
        thumb.style.left = `${leftPosition}%`;
        thumb.style.width = `${thumbWidth}%`;
    }

    // Drag functionality with bounds checking
    let isDragging = false;
    let startX;
    let scrollLeft;
    let trackWidth;

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        thumb.classList.add('bg-gray-500/80'); // Active state

        // Calculate initial positions
        startX = e.pageX - track.getBoundingClientRect().left - (thumb.offsetLeft);
        scrollLeft = container.scrollLeft;
        trackWidth = track.offsetWidth;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        // Calculate new position
        const trackRect = track.getBoundingClientRect();
        const x = e.pageX - trackRect.left;

        // Calculate bounds
        const thumbWidth = thumb.offsetWidth;
        const maxX = trackWidth - thumbWidth;

        // Constrain position within bounds
        const boundedX = Math.max(0, Math.min(x - startX, maxX));

        // Calculate scroll position
        const scrollRatio = boundedX / maxX;
        container.scrollLeft = scrollRatio * (container.scrollWidth - container.clientWidth);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        thumb.classList.remove('bg-gray-500/80'); // Remove active state
    });

    // Update on scroll and resize
    container.addEventListener('scroll', updateScrollThumb);
    window.addEventListener('resize', updateScrollThumb);

    // Initial setup
    updateScrollThumb();

    // Toggle functionality for mobile view
    const wrapper = document.getElementById('gridWrapper');
    const toggleButton = document.getElementById('toggleButton');

    toggleButton.addEventListener('click', function () {
        const isExpanded = wrapper.classList.contains('expanded');

        if (isExpanded) {
            wrapper.classList.remove('expanded');
            wrapper.classList.add('collapsed');
            this.textContent = 'Show More';
            this.setAttribute('aria-expanded', 'false');

            // Smooth scroll to grid top when collapsing
            wrapper.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            wrapper.classList.remove('collapsed');
            wrapper.classList.add('expanded');
            this.textContent = 'Show Less';
            this.setAttribute('aria-expanded', 'true');
        }
    });

    // Initialize collapsed state on mobile
    if (window.innerWidth < 1024) {
        wrapper.classList.add('collapsed');
    }

    // Handle resize events
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) {
            wrapper.classList.remove('collapsed', 'expanded');
        } else if (!wrapper.classList.contains('expanded')) {
            wrapper.classList.add('collapsed');
        }
    });
}); 