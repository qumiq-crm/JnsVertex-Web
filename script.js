document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialize slides position
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * index}%)`;
    });

    // Function to update slide positions
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
        });
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlides();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlides();
    }

    // Event listeners for buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Optional: Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
});

function workdoneCarousel() {
    const slides = document.getElementsByClassName("workdone-c");
    let currentSlide = 0;
    const totalSlides = slides.length;
  
    // Helper function to update slide positions and styles
    const updateSlides = () => {
      for (let i = 0; i < totalSlides; i++) {
        if (i === currentSlide) {
          slides[i].style.left = "50%";
          slides[i].style.width = "45%";
          slides[i].style.zIndex = "3"; // Higher z-index for the active slide
        } else if (i === (currentSlide + 1) % totalSlides) {
          slides[i].style.left = "100%";
          slides[i].style.width = "30%";
          slides[i].style.zIndex = "2"; // Middle z-index for the next slide
        } else if (i === (currentSlide + totalSlides - 1) % totalSlides) {
          slides[i].style.left = "0%";
          slides[i].style.width = "30%";
          slides[i].style.zIndex = "2"; // Middle z-index for the previous slide
        } else {
          slides[i].style.left = "-100%";
          slides[i].style.width = "30%";
          slides[i].style.zIndex = "1"; // Lowest z-index for hidden slides
        }
      }
    };
  
    // Initial setup
    updateSlides();
  
    // Carousel interval
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlides();
    }, 3000);
  }
  
  // Initialize the carousel on page load
  window.onload = workdoneCarousel;
