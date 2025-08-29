// Calisthenics Tracker — localStorage-based
<div class="small">${s.progress}%</div>
<button class="icon-btn edit-btn" title="Edit name">✏️</button>
<button class="icon-btn delete-btn" title="Delete">🗑️</button>
</div>
</div>
<div class="progress-bar" aria-hidden>
<div class="progress" style="width:${s.progress}%;"></div>
</div>
</div>
<div class="controls">
<input type="range" min="0" max="100" value="${s.progress}" data-id="${s.id}" class="range" aria-label="${escapeHtml(s.name)} progress">
</div>
`;


// attach listeners
const range = card.querySelector('.range');
const del = card.querySelector('.delete-btn');
const edit = card.querySelector('.edit-btn');
const nameEl = card.querySelector('.skill-name');
const percentLabel = card.querySelector('.small');
const progressEl = card.querySelector('.progress');


range.addEventListener('input', (e)=>{
const val = Number(e.target.value);
const id = e.target.dataset.id;
const item = skills.find(x => x.id === id);
if(!item) return;
item.progress = val;
percentLabel.textContent = val + '%';
progressEl.style.width = val + '%';
});


range.addEventListener('change', ()=>{ save(); });


del.addEventListener('click', ()=>{
if(!confirm(`Delete "${s.name}"?`)) return;
skills = skills.filter(x => x.id !== s.id);
save(); render();
});


edit.addEventListener('click', ()=>{
const input = document.createElement('input');
input.type = 'text'; input.maxLength = 30; input.value = s.name; input.className = 'inline-edit';
nameEl.replaceWith(input);
input.focus();
input.select();
input.addEventListener('blur', ()=>{ finishEdit(input, s.id); });
input.addEventListener('keydown', (ev)=>{ if(ev.key === 'Enter') input.blur(); if(ev.key === 'Escape'){ input.value = s.name; input.blur(); } });
});


skillsList.appendChild(card);
});
}


function finishEdit(input, id){
const newVal = input.value.trim() || 'Untitled';
const item = skills.find(x=>x.id===id);
if(item) item.name = newVal;
save();
render();
}


function escapeHtml(str){ return String(str).replace(/[&<>"']/g, (m)=>({
'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
}[m])); }


// Form handling
newForm.addEventListener('submit', (e)=>{
e.preventDefault();
const name = nameInput.value.trim();
if(!name) return;
skills.unshift({ id: genId(), name, progress: 0 });
nameInput.value = '';
save(); render();
});


// initial render
render();
