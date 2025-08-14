// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  body.classList.add(currentTheme);
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  const theme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
  localStorage.setItem('theme', theme);
  
  // Change icon
  const icon = themeToggle.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
});

// Initialize icon
const icon = document.createElement('i');
icon.classList.add('fas');
icon.classList.add(body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon');
themeToggle.appendChild(icon);

// Animated background elements
const hero = document.querySelector('.hero');
for (let i = 0; i < 15; i++) {
  const element = document.createElement('div');
  element.classList.add('bg-element');
  
  // Random properties
  const size = Math.random() * 100 + 50;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const delay = Math.random() * 15;
  const duration = Math.random() * 15 + 10;
  
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.left = `${posX}%`;
  element.style.top = `${posY}%`;
  element.style.animationDelay = `${delay}s`;
  element.style.animationDuration = `${duration}s`;
  
  hero.appendChild(element);
}

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    
    // Update active tab button
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show corresponding content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === tabId) {
        content.classList.add('active');
      }
    });
  });
});
