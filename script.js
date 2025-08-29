const skillForm = document.getElementById("skill-form");
const skillNameInput = document.getElementById("skill-name");
const skillsList = document.getElementById("skills-list");

const checkpoints = [
  { value: 0, label: "Not even close" },
  { value: 20, label: "Easier progression" },
  { value: 40, label: "Harder progression" },
  { value: 60, label: "Shaky 0.5s holds" },
  { value: 80, label: "Longer holds" },
  { value: 100, label: "Got it" }
];

let skills = JSON.parse(localStorage.getItem("skills")) || [];

function saveSkills() {
  localStorage.setItem("skills", JSON.stringify(skills));
}

function renderSkills() {
  skillsList.innerHTML = "";
  skills.forEach((skill, index) => {
    const card = document.createElement("div");
    card.classList.add("skill-card");

    card.innerHTML = `
      <div class="skill-header">
        <h2>${skill.name}</h2>
        <button class="delete-btn" onclick="deleteSkill(${index})">✖</button>
      </div>
      <div class="progress-bar">
        <div class="progress" style="width:${skill.progress}%;"></div>
      </div>
      <div class="checkpoints">
        ${checkpoints.map(c => `
          <button class="checkpoint ${skill.progress >= c.value ? "active" : ""}" 
                  onclick="updateSkill(${index}, ${c.value})">
            ${c.label}
          </button>
        `).join("")}
      </div>
    `;

    skillsList.appendChild(card);
  });
}

function addSkill(name) {
  skills.push({ name, progress: 0 });
  saveSkills();
  renderSkills();
}

function updateSkill(index, value) {
  skills[index].progress = value;
  saveSkills();
  renderSkills();
}

function deleteSkill(index) {
  skills.splice(index, 1);
  saveSkills();
  renderSkills();
}

skillForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = skillNameInput.value.trim();
  if (name) {
    addSkill(name);
    skillNameInput.value = "";
  }
});

renderSkills();
