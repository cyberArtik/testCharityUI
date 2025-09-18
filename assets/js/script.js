'use strict';



/**
 * navbar toggle
 */

const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElemArr = [navOpenBtn, navCloseBtn];

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
  });
}

/**
 * toggle navbar when click any navbar link
 */

const navbarLinks = document.querySelectorAll("[data-nav-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
  });
}





/**
 * header active when window scrolled down
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 50 ? header.classList.add("active")
    : header.classList.remove("active");
});

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
  // Hide all slides
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Show current slide
  if (slides[index] && dots[index]) {
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }
}

function changeSlide(direction) {
  currentSlideIndex += direction;
  
  if (currentSlideIndex >= totalSlides) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = totalSlides - 1;
  }
  
  showSlide(currentSlideIndex);
}

function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
}

// Auto-slide every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

// Touch/swipe support for mobile
let startX = 0;
let endX = 0;

const slider = document.querySelector('.gallery-slider');

if (slider) {
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });
}

function handleSwipe() {
  const threshold = 50;
  const diff = startX - endX;
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      changeSlide(1); // Swipe left - next slide
    } else {
      changeSlide(-1); // Swipe right - previous slide
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  if (slides.length > 0) {
    showSlide(0);
  }
});
