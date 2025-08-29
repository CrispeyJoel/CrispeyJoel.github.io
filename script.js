const checkpoints = [
  { value: 0, label: "Not even close" },
  { value: 20, label: "2 prog. below" },
  { value: 40, label: "1 prog below." },
  { value: 60, label: "Shaky holds" },
  { value: 80, label: "Longer holds" },
  { value: 100, label: "Got it" }
];

// Load skills
let skills = JSON.parse(localStorage.getItem("skills")) || [];

// Ensure unique IDs
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
    if(skill.progress >= 100) skillDiv.classList.add("completed");

    // Header with delete
    const header = document.createElement("div");
    header.className = "skill-header";
    const title = document.createElement("div");
    title.textContent = skill.name;
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "✖";
    delBtn.addEventListener("click", () => deleteSkill(skill.id));
    header.append(title, delBtn);
    skillDiv.appendChild(header);

    // Checkpoints
    const cpDiv = document.createElement("div");
    cpDiv.className = "checkpoints";
    checkpoints.forEach(cp => {
      const btn = document.createElement("button");
      btn.className = "checkpoint";
      btn.textContent = cp.label;
      if(skill.progress >= cp.value) btn.classList.add("active");
      btn.addEventListener("click", () => updateSkill(skill.id, cp.value));
      cpDiv.appendChild(btn);
    });
    skillDiv.appendChild(cpDiv);

    // Append to right section
    if(skill.progress >= 100) completedList.appendChild(skillDiv);
    else inProgressList.appendChild(skillDiv);
  });
}

renderSkills();
saveSkills();
