const checkpoints = [
  { value: 0, label: "Not even close" },
  { value: 20, label: "Easier prog." },
  { value: 40, label: "Harder prog." },
  { value: 60, label: "Shaky holds" },
  { value: 80, label: "Longer holds" },
  { value: 100, label: "Got it" }
];

let skills = JSON.parse(localStorage.getItem("skills")) || [];

function saveSkills() {
  localStorage.setItem("skills", JSON.stringify(skills));
}

function addSkill() {
  const input = document.getElementById("skillInput");
  const name = input.value.trim();
  if (!name) return;
  skills.push({ name, progress: 0 });
  input.value = "";
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

function renderSkills() {
  const inProgressList = document.getElementById("skillsList");
  const completedList = document.getElementById("completedList");
  inProgressList.innerHTML = "";
  completedList.innerHTML = "";

  skills.forEach((skill, i) => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "skill";

    skillDiv.innerHTML = `
      <div class="skill-header">
        <div>${skill.name}</div>
        <button class="delete-btn" onclick="deleteSkill(${i})">✖</button>
      </div>
      <div class="checkpoints">
        ${checkpoints.map(c => `
          <button class="checkpoint ${skill.progress >= c.value ? "active" : ""}" 
                  onclick="updateSkill(${i}, ${c.value})">
            ${c.label}
          </button>
        `).join("")}
      </div>
    `;

    if (skill.progress >= 100) {
      skillDiv.classList.add("completed-section");
      completedList.appendChild(skillDiv);
    } else {
      inProgressList.appendChild(skillDiv);
    }
  });
}

renderSkills();
