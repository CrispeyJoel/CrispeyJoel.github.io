const skillsList = document.getElementById("skills-list");
const form = document.getElementById("new-skill-form");
const input = document.getElementById("skill-name");

let skills = JSON.parse(localStorage.getItem("skills")) || [];

function save() {
  localStorage.setItem("skills", JSON.stringify(skills));
}

function render() {
  skillsList.innerHTML = "";
  skills.forEach((skill, index) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="skill-header">
        <span>${skill.name}</span>
        <span>${skill.progress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress" style="width:${skill.progress}%"></div>
      </div>
      <input type="range" min="0" max="100" value="${skill.progress}" class="range" data-index="${index}">
    `;
    skillsList.appendChild(card);
  });

  document.querySelectorAll(".range").forEach(slider => {
    slider.addEventListener("input", e => {
      const idx = e.target.dataset.index;
      skills[idx].progress = e.target.value;
      save();
      render();
    });
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  skills.push({ name, progress: 0 });
  input.value = "";
  save();
  render();
});

render();
