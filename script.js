const tabs = document.querySelectorAll('.nav-tabs li');
const contents = document.querySelectorAll('.tab-content');
const cards = document.querySelectorAll('.card');
const modules = document.querySelectorAll('.module-card');

// Tab click functionality
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.remove('active'));
    const selected = document.getElementById(tab.dataset.tab);
    selected.classList.add('active');
  });
});

// Make homepage cards clickable to go to section
cards.forEach(card => {
  card.addEventListener('click', () => {
    const tabId = card.dataset.tab;
    const tab = document.querySelector(`.nav-tabs li[data-tab="${tabId}"]`);
    tab.click(); // simulate tab click
  });
});

// Make modules clickable
modules.forEach(module => {
  module.addEventListener('click', () => {
    alert(`Starting module: ${module.textContent}`);
    // Here you can replace alert with loading the actual exercise
  });
});
