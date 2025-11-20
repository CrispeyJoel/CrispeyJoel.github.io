const tabs = document.querySelectorAll('.nav-tabs li');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    // Add active to clicked tab
    tab.classList.add('active');

    // Hide all content
    contents.forEach(c => c.classList.remove('active'));
    // Show selected content
    const selected = document.getElementById(tab.dataset.tab);
    selected.classList.add('active');
  });
});
