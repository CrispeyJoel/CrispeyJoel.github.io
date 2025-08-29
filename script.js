# script.js
cat > script.js <<'JS'
/* Calisthenics Tracker — Checkpoint system
   - 6 checkpoints: 0,20,40,60,80,100
   - Click a checkpoint to set progress
   - Add / edit name / delete skill
   - Export / Import JSON
*/

const LS_KEY = 'calis-tracker:v2';
const CHECKPOINTS = [
  { value: 0, label: 'Not even close' },
  { value: 20, label: 'Easier progression' },
  { value: 40, label: 'More progression' },
  { value: 60, label: 'Shaky 0.5s holds' },
  { value: 80, label: 'Longer holds' },
  { value: 100, label: 'Got it' }
];

// DOM
const skillsListEl = document.getElementById('skills-list');
const form = document.getElementById('new-skill-form');
const nameInput = document.getElementById('skill-name');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');

let skills = load();

function genId(){ return Math.random().toString(36).slice(2,9); }
function load(){
  try{ const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : defaultSkills(); }catch(e){ return defaultSkills(); }
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(skills)); }
function defaultSkills(){
  return [
    { id: genId(), name: 'Pull-ups', progress: 70 },
    { id: genId(), name: 'Push-ups', progress: 85 },
    { id: genId(), name: 'Handstand', progress: 50 },
    { id: genId(), name: 'Planche', progress: 20 }
  ];
}

// render
function render(){
  skillsListEl.innerHTML = '';
  if(skills.length === 0){
    const empty = document.createElement('div'); empty.className = 'small'; empty.style.textAlign = 'center'; empty.style.padding = '18px'; empty.textContent = 'No skills yet — add one above.';
    skillsListEl.appendChild(empty); return;
  }

  skills.forEach((s, idx) => {
    const card = document.createElement('div'); card.className = 'skill-card';

    // top row
    const top = document.createElement('div'); top.className = 'card-top';
    const name = document.createElement('div'); name.className = 'skill-name'; name.textContent = s.name;

    const meta = document.createElement('div'); meta.className = 'skill-meta';
    const percent = document.createElement('div'); percent.className = 'small'; percent.textContent = s.progress + '%';
    const actions = document.createElement('div'); actions.className = 'card-actions';

    const editBtn = document.createElement('button'); editBtn.className = 'icon-btn'; editBtn.title = 'Edit'; editBtn.innerText = '✏️';
    const delBtn = document.createElement('button'); delBtn.className = 'icon-btn'; delBtn.title = 'Delete'; delBtn.innerText = '🗑️';

    actions.append(editBtn, delBtn);
    meta.append(percent, actions);
    top.append(name, meta);

    // progress bar
    const progWrap = document.createElement('div'); progWrap.className = 'progress-wrap';
    const prog = document.createElement('div'); prog.className = 'progress'; prog.style.width = s.progress + '%';
    progWrap.appendChild(prog);

    // checkpoints
    const cpWrap = document.createElement('div'); cpWrap.className = 'checkpoints';
    CHECKPOINTS.forEach(cp => {
      const btn = document.createElement('button'); btn.className = 'checkpoint';
      if(s.progress >= cp.value) btn.classList.add('active');
      btn.dataset.value = cp.value; btn.textContent = cp.label;
      btn.addEventListener('click', ()=>{
        updateProgress(s.id, cp.value);
      });
      cpWrap.appendChild(btn);
    });

    // assemble
    card.append(top, progWrap, cpWrap);
    skillsListEl.appendChild(card);

    // listeners for edit/delete
    editBtn.addEventListener('click', ()=>{ inlineEditName(s.id, name); });
    delBtn.addEventListener('click', ()=>{ if(confirm(\`Delete "\${s.name}"?\`)){ skills = skills.filter(x=>x.id!==s.id); save(); render(); } });
  });
}

function updateProgress(id, val){
  const item = skills.find(x=>x.id===id); if(!item) return;
  item.progress = val;
  save(); render();
}

function inlineEditName(id, nameEl){
  const item = skills.find(x=>x.id===id); if(!item) return;
  const input = document.createElement('input'); input.type = 'text'; input.value = item.name; input.maxLength = 40; input.style.width = '100%'; input.style.padding = '6px';
  nameEl.replaceWith(input); input.focus(); input.select();
  function finish(){ item.name = input.value.trim() || 'Untitled'; save(); render(); }
  input.addEventListener('blur', finish);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') input.blur(); if(e.key==='Escape'){ render(); } });
}

// form
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = nameInput.value.trim(); if(!name) return;
  skills.unshift({ id: genId(), name, progress: 0 });
  nameInput.value = '';
  save(); render();
});

// export/import
exportBtn.addEventListener('click', ()=>{
  const data = JSON.stringify(skills, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'calisthenics-skills.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', ()=>{ importFile.click(); });
importFile.addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return; const reader = new FileReader();
  reader.onload = ()=>{
    try{ const parsed = JSON.parse(reader.result); if(Array.isArray(parsed)){
      // basic validation
      const ok = parsed.every(p=>p.id && typeof p.name==='string' && typeof p.progress === 'number');
      if(ok){ skills = parsed; save(); render(); alert('Imported successfully'); } else throw new Error('Invalid format');
    } else throw new Error('Not an array'); }catch(err){ alert('Import failed: invalid file'); }
  };
  reader.readAsText(file);
  importFile.value = '';
});

// theme toggle (simple)
(function(){ const t = localStorage.getItem('theme') || 'dark'; setTheme(t); })();
themeToggle.addEventListener('click', ()=>{ const cur = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; setTheme(cur === 'dark' ? 'light' : 'dark'); });
function setTheme(name){ document.documentElement.dataset.theme = name; localStorage.setItem('theme', name); themeToggle.textContent = name === 'dark' ? '☀️' : '🌙'; document.body.style.background = name === 'dark' ? 'var(--bg)' : '#0f1724'; }

// initial render
render();
JS
