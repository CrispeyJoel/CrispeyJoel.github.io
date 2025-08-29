const checkpoints = [
  { value: 0, label: "Not even close" },
  { value: 20, label: "Easier prog." },
  { value: 40, label: "Harder prog." },
  { value: 60, label: "Shaky holds" },
  { value: 80, label: "Longer holds" },
  { value: 100, label: "Got it" }
];

// Load skills
let skills = JSON.parse(localStorage.getItem("skills")) || [];

// ensure every skill has unique ID
skills.forEach(s => { if(!s.id) s.id = Math.random().toString(36).substr(2,9); });

function saveSkills() {
  localStorage.setItem("skills", JSON.stringify(skills));
}

function addSkill() {
  const input = document.getElementById("skillInput");
  const name = input.value.trim();
  if(!name) return;
  skills.push({ id: Math.random().toString(36).substr(2,9), name, progress: 0 });
  input.value = "";
  saveSkills();
  renderSkills();
}

function updateSkill(id, value) {
  const skill = skills.find(s => s.id === id);
  if(!skill) return;
  skill.progress = value;
  saveSkills();
  renderSkills();
}

function deleteSkill(id) {
  skills = skills.filter(s => s.id !== id);
  saveSkills();
  renderSkills();
}

function renderSkills() {
  const inProgressList = document.getElementById("skillsList");
  const completedList = document.getElementById("completedList");
  inProgressList.innerHTML = "";
  completedList.innerHTML = "";

  skills.forEach(skill => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "skill";
    if(skill.progress >= 100) skillDiv.classList.add("completed-section");

    // skill HTML
    skillDiv.innerHTML = `
      <div class="skill-header">
        <div>${skill.name}</div>
        <button class="delete-btn">✖</button>
      </div>
      <div class="checkpoints"></div>
    `;

    // delete button
    skillDiv.querySelector(".delete-btn").addEventListener("click", () => {
      deleteSkill(skill.id);
    });

    // add checkpoints
    const cpContainer = skillDiv.querySelector(".checkpoints");
    checkpoints.forEach(cp => {
      const btn = document.createElement("button");
      btn.className = "checkpoint";
      if(skill.progress >= cp.value) btn.classList.add("active");
      btn.textContent = cp.label;
      btn.addEventListener("click", () => updateSkill(skill.id, cp.value));
      cpContainer.appendChild(btn);
    });

    // append to proper section
    if(skill.progress >= 100) completedList.appendChild(skillDiv);
    else inProgressList.appendChild(skillDiv);
  });
}

renderSkills();
saveSkills();
