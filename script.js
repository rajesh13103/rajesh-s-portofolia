// ===== ANIMATED BACKGROUND (Matrix Rain + Particles) =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], matrixCols = [], animId;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initMatrix();
}

function mkParticle() {
  return {
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
    r: Math.random() * 1.2 + .3,
    a: Math.random() * .35 + .08,
    c: Math.random() > .5 ? '0,212,255' : '0,255,136'
  };
}

function initMatrix() {
  matrixCols = [];
  const cols = Math.floor(W / 20);
  for (let i = 0; i < cols; i++) {
    matrixCols.push({
      x: i * 20, y: Math.random() * H * -1,
      speed: Math.random() * 1 + .4,
      char: () => String.fromCharCode(0x30A0 + Math.random() * 96),
      alpha: Math.random() * .06 + .02
    });
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 45; i++) particles.push(mkParticle());
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  matrixCols.forEach(col => {
    ctx.font = '11px Share Tech Mono';
    ctx.fillStyle = `rgba(0,212,255,${col.alpha})`;
    ctx.fillText(col.char(), col.x, col.y);
    col.y += col.speed;
    if (col.y > H) col.y = -20;
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 110) * .08})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.c},${p.a})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  });
  animId = requestAnimationFrame(draw);
}

resize();
initParticles();
draw();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
document.addEventListener('visibilitychange', () => {
  document.hidden ? cancelAnimationFrame(animId) : draw();
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightNav();
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = Array.from(document.querySelectorAll('section[id]'));
const navAs = document.querySelectorAll('.nav-links a');
function highlightNav() {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  navAs.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}

// ===== TYPING ANIMATION =====
const roles = ['Web Developer','ECE Engineer','Problem Solver','Python Enthusiast','Frontend Creator'];
let ri = 0, ci = 0, del = false;
const typed = document.getElementById('typed-role');
function typeRole() {
  const cur = roles[ri];
  typed.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
  del ? ci-- : ci++;
  if (!del && ci === cur.length) { del = true; return setTimeout(typeRole, 1800); }
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(typeRole, del ? 55 : 95);
}
typeRole();

const tagEl = document.getElementById('typing-tag');
const tagTxt = 'Initializing profile...';
let ti = 0;
function typeTag() { if (ti < tagTxt.length) { tagEl.textContent += tagTxt[ti++]; setTimeout(typeTag, 55); } }
setTimeout(typeTag, 400);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isFloat = String(target).includes('.');
  const dur = 1500;
  let cur = 0, start = null;
  function tick(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    cur = target * p;
    el.textContent = isFloat ? cur.toFixed(2) : Math.floor(cur) + '+';
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = isFloat ? target.toFixed(2) : target + '+';
  }
  requestAnimationFrame(tick);
}

// ===== AOS =====
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      e.target.querySelectorAll('.score-fill[data-width],.skill-fill[data-width]').forEach(b => { b.style.width = b.dataset.width; });
      e.target.querySelectorAll('.info-row').forEach((row, i) => { setTimeout(() => row.classList.add('visible'), i * 80); });
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => aosObs.observe(el));

const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.score-fill[data-width],.skill-fill[data-width]').forEach(b => { b.style.width = b.dataset.width; });
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      e.target.querySelectorAll('.info-row').forEach((r, i) => { setTimeout(() => r.classList.add('visible'), i * 80); });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.timeline-card,.skill-card,.info-card').forEach(el => barObs.observe(el));

// ===== CERTIFICATE LIGHTBOX =====
function openCert(imgSrc, title) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const ttl = document.getElementById('lb-title');
  const noC = document.getElementById('lb-no-cert');
  ttl.textContent = title;
  img.style.display = 'none';
  noC.style.display = 'none';
  const testImg = new Image();
  testImg.onload = () => { img.src = imgSrc; img.style.display = 'block'; noC.style.display = 'none'; };
  testImg.onerror = () => { img.style.display = 'none'; noC.style.display = 'block'; };
  testImg.src = imgSrc;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===== PARTICIPATION SUMMARY TOGGLE =====
function toggleSummary(id) {
  document.getElementById(id).classList.toggle('open');
}

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  const mailtoLink = `mailto:bomalleenirajeshkumar@gmail.com?subject=${encodeURIComponent(this.subject.value || 'Portfolio Contact')}&body=${encodeURIComponent('Name: ' + this.name.value + '\nEmail: ' + this.email.value + '\n\n' + this.message.value)}`;
  window.location.href = mailtoLink;
  setTimeout(() => {
    status.textContent = '✓ Opening your email client...';
    status.className = 'form-status success';
    btn.innerHTML = orig;
    btn.disabled = false;
    this.reset();
  }, 800);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== PORTFOLIO DATA =====
const ADMIN_PASSWORD = 'rajesh2026';

function getDefaultData() {
  return {
    cgpa: '9.58',
    skills: 5,
    yearLabel: '3rd Year B.Tech',
    skills_list: [
      { name: 'HTML5',         level: 85, certFile: 'html-cert.jpg.jpeg',   status: 'Certified'   },
      { name: 'CSS3',          level: 80, certFile: 'css-cert.jpeg',        status: 'Certified'   },
      { name: 'JavaScript',    level: 70, certFile: 'js-cert.jpg',          status: 'On Progress' },
      { name: 'C Programming', level: 75, certFile: 'c-cert.jpg.jpeg',      status: 'On Progress' },
      { name: 'Python',        level: 72, certFile: 'python-cert.jpg.jpeg', status: 'Certified'   }
    ],
    participations: [
      { icon:'fas fa-trophy',      title:'Hackathons & Competitions', detail:'Participated in National-level Department Fest held at MITS deemed to be University',           summary:'Participated in inter-college hackathon events where teams collaborated to solve real-world problems within time constraints.',                                  certFile:'hackathon1.jpeg',    certTitle:'Hackathon Certificate' },
      { icon:'fas fa-laptop-code', title:'Workshops & Seminars',      detail:'Participated in Mini Project Expo held at Aditya College of Engineering and Organised by Dept of AI&DS', summary:'Attended hands-on workshops covering web development technologies, including HTML/CSS/JS frameworks.',                                                   certFile:'workshop-cert.jpeg', certTitle:'Workshop Certificate'  },
      { icon:'fas fa-university',  title:'Academic Activities',       detail:'Active participant in departmental events at Aditya College',                                  summary:'Actively participated in various departmental and college-level academic events including technical symposiums, paper presentations.',                          certFile:'academic-cert.jpeg', certTitle:'Academic Certificate'  },
      { icon:'fas fa-medal',       title:'Online Certifications',     detail:'Completed professional online courses and certifications',                                     summary:'Completed various online courses through platforms like Coursera, NPTEL, and similar platforms.',                                                             certFile:'extra-cert.jpeg',    certTitle:'Online Certification'  }
    ]
  };
}

function loadPortfolioData() {
  try {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? Object.assign({}, getDefaultData(), JSON.parse(saved)) : getDefaultData();
  } catch(e) { return getDefaultData(); }
}

function savePortfolioData(data) {
  localStorage.setItem('portfolio_data', JSON.stringify(data));
}

// ===== GITHUB INTEGRATION =====
// Uses a public CORS proxy (corsproxy.io) to avoid browser CORS restrictions.
// Your token is stored only in YOUR browser's localStorage — never exposed to visitors.

function getGHConfig() {
  return {
    token:  localStorage.getItem('gh_token')  || '',
    repo:   localStorage.getItem('gh_repo')   || '',
    branch: localStorage.getItem('gh_branch') || 'main',
    path:   localStorage.getItem('gh_path')   || 'data.json'
  };
}

// Fetch latest portfolio data from GitHub on every page load
async function fetchRemoteData() {
  const { repo, branch, path } = getGHConfig();
  if (!repo) return;
  try {
    // Use raw.githubusercontent.com — no auth needed, no CORS issues, publicly readable
    const url = 'https://raw.githubusercontent.com/' + repo + '/' + branch + '/' + path + '?t=' + Date.now();
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    if (data && typeof data === 'object') {
      const merged = Object.assign({}, getDefaultData(), data);
      localStorage.setItem('portfolio_data', JSON.stringify(merged));
      applyDataToPage(merged);
    }
  } catch(e) { /* silent — page still works with local data */ }
}

// Push portfolio data.json to GitHub via API
async function pushToGitHub(data) {
  const { token, repo, branch, path } = getGHConfig();
  if (!token) return { ok: false, error: 'GitHub Token is empty. Paste it above and click Save Settings.' };
  if (!repo)  return { ok: false, error: 'Repo is empty. Enter your repo (username/reponame) and click Save Settings.' };

  const apiUrl = 'https://api.github.com/repos/' + repo + '/contents/' + path;
  const headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };

  try {
    // Get current SHA (required to update existing file)
    let sha = null;
    const getRes = await fetch(apiUrl + '?ref=' + branch, { headers });
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    } else if (getRes.status === 401) {
      return { ok: false, error: 'Invalid token. Check your GitHub Personal Access Token.' };
    } else if (getRes.status === 404) {
      sha = null; // file doesn't exist yet — will be created
    } else {
      return { ok: false, error: 'GitHub error ' + getRes.status };
    }

    // Encode data as base64
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    const body = {
      message: '[portfolio] update data ' + new Date().toISOString().slice(0, 16),
      content: content,
      branch:  branch
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
      method:  'PUT',
      headers: headers,
      body:    JSON.stringify(body)
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      return { ok: false, error: err.message || 'GitHub PUT error ' + putRes.status };
    }
    return { ok: true };

  } catch(e) {
    return { ok: false, error: e.message };
  }
}

// ===== APPLY DATA TO PAGE =====
function applyDataToPage(data) {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    if (parseFloat(el.dataset.count) > 9) {
      el.dataset.count = data.cgpa;
      el.textContent   = data.cgpa;
    }
  });
  document.querySelectorAll('.stat').forEach(st => {
    const lbl = st.querySelector('.stat-label');
    const num = st.querySelector('.stat-num');
    if (lbl && lbl.textContent === 'Skills' && num) {
      num.dataset.count = data.skills;
      num.textContent   = data.skills + '+';
    }
  });
  document.querySelectorAll('.info-val.accent').forEach(el => {
    if (el.textContent.includes('9.') || el.textContent.includes('/')) {
      el.textContent = data.cgpa + ' / 10.0';
    }
  });
  const skillCards = document.querySelectorAll('.skill-card');
  (data.skills_list || []).forEach((sk, i) => {
    const card = skillCards[i]; if (!card) return;
    const nameEl = card.querySelector('.skill-name');
    const fill   = card.querySelector('.skill-fill');
    const lbl    = card.querySelector('.skill-cert-label');
    if (nameEl) nameEl.textContent = sk.name;
    if (fill)   { fill.style.width = sk.level + '%'; fill.dataset.width = sk.level + '%'; }
    if (lbl)    lbl.textContent = sk.status;
    card.onclick = () => openCert(sk.certFile, sk.name + ' Certificate');
  });
  const partCards = document.querySelectorAll('.part-card');
  (data.participations || []).forEach((p, i) => {
    const card = partCards[i]; if (!card) return;
    const titleEl   = card.querySelector('.part-title');
    const detailEl  = card.querySelector('.part-detail');
    const summaryEl = card.querySelector('.part-summary');
    const certBtn   = card.querySelector('.cert-btn');
    if (titleEl)   titleEl.textContent  = p.title;
    if (detailEl)  detailEl.textContent = p.detail;
    if (summaryEl) summaryEl.innerHTML  = '<p>' + p.summary + '</p>';
    if (certBtn)   certBtn.onclick = () => openCert(p.certFile, p.certTitle);
  });
}

// ===== ADMIN PANEL =====
function injectAdminCSS() {
  if (document.getElementById('admin-css')) return;
  const s = document.createElement('style');
  s.id = 'admin-css';
  s.textContent = `
    #admin-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:'Exo 2',sans-serif; }
    #admin-panel { background:#0d0d1a;border:1px solid #00d4ff44;border-radius:12px;width:min(92vw,640px);max-height:88vh;overflow-y:auto;padding:28px 32px;color:#cdd6f4;position:relative; }
    #admin-panel h2 { color:#00d4ff;font-size:1.2rem;margin:0 0 20px;font-family:'Orbitron',sans-serif;letter-spacing:2px; }
    .admin-section { margin-bottom:24px;border-top:1px solid #ffffff11;padding-top:16px; }
    .admin-section h3 { color:#00ff88;font-size:0.8rem;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px; }
    .admin-row { display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap; }
    .admin-row label { font-size:0.8rem;color:#888;min-width:120px; }
    .admin-row input,.admin-row textarea { flex:1;background:#0a0a14;border:1px solid #00d4ff33;border-radius:6px;color:#cdd6f4;padding:7px 10px;font-size:0.85rem;font-family:inherit;min-width:0; }
    .admin-row input:focus,.admin-row textarea:focus { outline:none;border-color:#00d4ff88; }
    .admin-btn { padding:8px 18px;border-radius:6px;border:none;cursor:pointer;font-size:0.82rem;font-family:inherit;font-weight:600;letter-spacing:0.5px;transition:opacity 0.2s; }
    .admin-btn:hover { opacity:0.8; }
    .admin-btn-primary { background:#00d4ff22;color:#00d4ff;border:1px solid #00d4ff55; }
    .admin-btn-danger  { background:#ff4d4d22;color:#ff4d4d;border:1px solid #ff4d4d44; }
    .admin-btn-success { background:#00ff8822;color:#00ff88;border:1px solid #00ff8844; }
    .admin-close { position:absolute;top:18px;right:20px;background:none;border:none;color:#888;font-size:1.4rem;cursor:pointer;line-height:1; }
    .admin-close:hover { color:#ff4d4d; }
    .admin-save-bar { display:flex;align-items:center;gap:10px;padding-top:16px;border-top:1px solid #ffffff11;flex-wrap:wrap; }
    .admin-save-msg { font-size:0.8rem;color:#00ff88;opacity:0;transition:opacity 0.3s; }
    .admin-skill-row,.admin-part-row { background:#ffffff06;border-radius:8px;padding:10px 12px;margin-bottom:8px;border:1px solid #ffffff0a; }
    #admin-pw-screen { text-align:center; }
    #admin-pw-screen h2 { margin-bottom:20px; }
    #admin-pw-input { display:block;margin:0 auto 14px;width:220px;text-align:center;font-size:1.1rem;letter-spacing:3px;background:#0a0a14;border:1px solid #00d4ff33;border-radius:6px;color:#cdd6f4;padding:10px; }
    #admin-pw-err { color:#ff4d4d;font-size:0.82rem;min-height:18px;margin-bottom:8px; }
    #gh-push-status { font-size:0.8rem;font-family:monospace;margin-top:10px;min-height:18px;line-height:1.5; }
  `;
  document.head.appendChild(s);
}

function buildAdminPanel() {
  const data   = loadPortfolioData();
  const cfg = getGHConfig();

  const skillRows = (data.skills_list || []).map((sk, i) => `
    <div class="admin-skill-row" id="skill-row-${i}">
      <div class="admin-row">
        <label>Skill name</label>
        <input type="text" id="sk-name-${i}" value="${sk.name}">
        <input type="number" id="sk-lvl-${i}" value="${sk.level}" min="0" max="100" style="width:70px;flex:none">
      </div>
      <div class="admin-row">
        <label>Cert file</label>
        <input type="text" id="sk-cert-${i}" value="${sk.certFile}" placeholder="html-cert.jpg">
        <input type="text" id="sk-status-${i}" value="${sk.status}" style="width:120px;flex:none">
      </div>
    </div>`).join('');

  const partRows = (data.participations || []).map((p, i) => `
    <div class="admin-part-row" id="part-row-${i}">
      <div class="admin-row"><label>Title</label><input type="text" id="pt-title-${i}" value="${p.title}"></div>
      <div class="admin-row"><label>Detail</label><input type="text" id="pt-detail-${i}" value="${p.detail}"></div>
      <div class="admin-row"><label>Cert file</label><input type="text" id="pt-cert-${i}" value="${p.certFile}"><input type="text" id="pt-certtitle-${i}" value="${p.certTitle}"></div>
      <div class="admin-row"><label>Summary</label><textarea id="pt-summary-${i}" rows="2">${p.summary}</textarea></div>
    </div>`).join('');

  return `
    <div id="admin-panel">
      <button class="admin-close" onclick="closeAdmin()">&#215;</button>
      <h2>&#9889; Portfolio Admin</h2>

      <div class="admin-section">
        <h3>Hero Stats</h3>
        <div class="admin-row"><label>CGPA</label><input type="text" id="adm-cgpa" value="${data.cgpa}"></div>
        <div class="admin-row"><label>Skills count</label><input type="number" id="adm-skills" value="${data.skills}" min="1" max="20"></div>
        <div class="admin-row"><label>Year label</label><input type="text" id="adm-year" value="${data.yearLabel}"></div>
      </div>

      <div class="admin-section">
        <h3>Skills &amp; Certificates</h3>
        ${skillRows}
        <button class="admin-btn admin-btn-success" onclick="addSkillRow()" style="margin-top:6px">+ Add Skill</button>
      </div>

      <div class="admin-section">
        <h3>Events &amp; Participations</h3>
        ${partRows}
        <button class="admin-btn admin-btn-success" onclick="addPartRow()" style="margin-top:6px">+ Add Event</button>
      </div>

      <div class="admin-section">
        <h3>&#128279; GitHub Settings</h3>
        <p style="font-size:0.78rem;color:#555;margin:0 0 14px">Your token is saved only in <strong style="color:#607a8f">your browser</strong> — never visible to anyone else. Fill in once, then just use Push Live every time.</p>
        <div class="admin-row">
          <label>Token</label>
          <input type="password" id="adm-gh-token" value="${cfg.token}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off">
        </div>
        <div class="admin-row">
          <label>Repo</label>
          <input type="text" id="adm-gh-repo" value="${cfg.repo}" placeholder="username/portfolio">
        </div>
        <div class="admin-row">
          <label>Branch</label>
          <input type="text" id="adm-gh-branch" value="${cfg.branch}" placeholder="main">
        </div>
        <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;align-items:center">
          <button class="admin-btn" style="background:#ffffff0a;color:#aaa;border:1px solid #ffffff15;font-size:0.78rem" onclick="saveGHSettings()">&#128190; Save Settings</button>
          <button class="admin-btn" style="background:#7b61ff22;color:#a895ff;border:1px solid #7b61ff44;font-size:0.78rem" onclick="testGHConnection()">&#128301; Test</button>
          <span id="gh-test-msg" style="font-size:0.78rem;opacity:0;transition:opacity 0.3s;color:#00ff88"></span>
        </div>
        <p style="font-size:0.72rem;color:#444;margin-top:12px;line-height:1.8">
          <strong style="color:#607a8f">How to create a token:</strong><br>
          1. Go to <span style="color:#00d4ff88">github.com</span> &#8594; Settings &#8594; Developer settings<br>
          2. Personal access tokens &#8594; Fine-grained tokens &#8594; Generate new token<br>
          3. Select your portfolio repo &#8594; Contents: <strong style="color:#607a8f">Read &amp; Write</strong><br>
          4. Generate &amp; paste the token above
        </p>
      </div>

      <div class="admin-section">
        <h3>Quick Notes (private)</h3>
        <textarea id="adm-notes" rows="3" style="width:100%;background:#0a0a14;border:1px solid #00d4ff22;border-radius:6px;color:#888;padding:8px 10px;font-size:0.82rem;box-sizing:border-box">${localStorage.getItem('portfolio_notes') || ''}</textarea>
      </div>

      <div class="admin-save-bar">
        <button class="admin-btn admin-btn-primary" onclick="saveAdmin()">&#128190; Save &amp; Preview</button>
        <button class="admin-btn admin-btn-success" onclick="pushLive()">&#128640; Push Live</button>
        <button class="admin-btn admin-btn-danger"  onclick="resetAdmin()">Reset</button>
        <span class="admin-save-msg" id="adm-save-msg">&#10003; Saved!</span>
      </div>
      <div id="gh-push-status"></div>
    </div>`;
}

function saveAdmin() {
  const data     = loadPortfolioData();
  data.cgpa      = document.getElementById('adm-cgpa').value.trim();
  data.skills    = parseInt(document.getElementById('adm-skills').value) || 5;
  data.yearLabel = document.getElementById('adm-year').value.trim();

  data.skills_list = Array.from(document.querySelectorAll('[id^="skill-row-"]')).map((_, i) => ({
    name:     document.getElementById('sk-name-'    + i)?.value || '',
    level:    parseInt(document.getElementById('sk-lvl-' + i)?.value) || 0,
    certFile: document.getElementById('sk-cert-'    + i)?.value || '',
    status:   document.getElementById('sk-status-'  + i)?.value || ''
  }));

  data.participations = Array.from(document.querySelectorAll('[id^="part-row-"]')).map((_, i) => ({
    icon:      (loadPortfolioData().participations[i] || {}).icon || 'fas fa-star',
    title:     document.getElementById('pt-title-'     + i)?.value || '',
    detail:    document.getElementById('pt-detail-'    + i)?.value || '',
    certFile:  document.getElementById('pt-cert-'      + i)?.value || '',
    certTitle: document.getElementById('pt-certtitle-' + i)?.value || '',
    summary:   document.getElementById('pt-summary-'   + i)?.value || ''
  }));

  savePortfolioData(data);
  localStorage.setItem('portfolio_notes', document.getElementById('adm-notes')?.value || '');
  applyDataToPage(data);

  const msg = document.getElementById('adm-save-msg');
  if (msg) { msg.style.opacity = '1'; setTimeout(() => msg.style.opacity = '0', 2500); }
}

function saveGHSettings() {
  const t = document.getElementById('adm-gh-token')?.value.trim();
  const g = document.getElementById('adm-gh-gist')?.value.trim();
  if (t) localStorage.setItem('gh_token',   t);
  if (g) localStorage.setItem('gh_gist_id', g);
  const m = document.getElementById('gh-test-msg');
  if (m) { m.style.color = '#00ff88'; m.textContent = '\u2713 Settings saved!'; m.style.opacity = '1'; setTimeout(() => m.style.opacity = '0', 2500); }
}

async function testGHConnection() {
  saveGHSettings();
  const m = document.getElementById('gh-test-msg');
  const { token } = getGHConfig();
  if (!token) {
    if (m) { m.style.color = '#ff6b6b'; m.textContent = '\u2717 Paste your token first'; m.style.opacity = '1'; setTimeout(() => m.style.opacity = '0', 3000); }
    return;
  }
  if (m) { m.style.color = '#607a8f'; m.textContent = 'Testing...'; m.style.opacity = '1'; }
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github+json' }
    });
    if (res.ok) {
      const user = await res.json();
      if (m) { m.style.color = '#00ff88'; m.textContent = '\u2713 Connected as ' + user.login + '!'; setTimeout(() => m.style.opacity = '0', 3000); }
    } else {
      const err = await res.json().catch(() => ({}));
      if (m) { m.style.color = '#ff6b6b'; m.textContent = '\u2717 ' + (err.message || 'Invalid token'); setTimeout(() => m.style.opacity = '0', 4000); }
    }
  } catch(e) {
    if (m) { m.style.color = '#ff6b6b'; m.textContent = '\u2717 ' + e.message; setTimeout(() => m.style.opacity = '0', 4000); }
  }
}

async function pushLive() {
  saveAdmin();
  saveGHSettings();

  const status = document.getElementById('gh-push-status');
  const { token } = getGHConfig();

  if (!token) {
    status.style.color = '#ff6b6b';
    status.textContent = '\u2717 Token is empty \u2014 paste your GitHub token above and click Save Settings.';
    return;
  }

  status.style.color = '#607a8f';
  status.textContent = '\u25e2 Pushing to GitHub Gist...';

  const data   = loadPortfolioData();
  const result = await pushToGist(data);

  if (result.ok) {
    if (result.created) {
      // Update the Gist ID field in the panel so user can see it
      const gistInput = document.getElementById('adm-gh-gist');
      if (gistInput) gistInput.value = result.gistId;
      status.style.color = '#00ff88';
      status.textContent = '\u2713 Gist created & data pushed! Everyone sees your portfolio now.';
    } else {
      status.style.color = '#00ff88';
      status.textContent = '\u2713 Pushed! Your portfolio is updated for everyone instantly.';
    }
    setTimeout(() => { status.textContent = ''; }, 7000);
  } else {
    status.style.color = '#ff6b6b';
    status.textContent = '\u2717 ' + result.error;
  }
}

function resetAdmin() {
  if (confirm('Reset all portfolio data to original defaults?')) {
    localStorage.removeItem('portfolio_data');
    closeAdmin();
    setTimeout(openAdmin, 200);
  }
}

function addSkillRow() {
  const data = loadPortfolioData();
  data.skills_list.push({ name: 'New Skill', level: 70, certFile: 'new-cert.jpg', status: 'Certified' });
  savePortfolioData(data);
  closeAdmin();
  setTimeout(openAdmin, 100);
}

function addPartRow() {
  const data = loadPortfolioData();
  data.participations.push({ icon:'fas fa-star', title:'New Event', detail:'Describe this event', summary:'Detailed summary here.', certFile:'new-cert.jpeg', certTitle:'Event Certificate' });
  savePortfolioData(data);
  closeAdmin();
  setTimeout(openAdmin, 100);
}

let adminUnlocked = false;
function openAdmin() {
  injectAdminCSS();
  const overlay = document.createElement('div');
  overlay.id = 'admin-overlay';
  if (!adminUnlocked) {
    overlay.innerHTML = `
      <div id="admin-panel">
        <button class="admin-close" onclick="closeAdmin()">&#215;</button>
        <div id="admin-pw-screen">
          <h2>&#9889; Admin Access</h2>
          <input id="admin-pw-input" type="password" placeholder="Enter password" autocomplete="off">
          <div id="admin-pw-err"></div>
          <button class="admin-btn admin-btn-primary" onclick="checkAdminPw()">Unlock</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('admin-pw-input').focus();
    document.getElementById('admin-pw-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') checkAdminPw();
    });
  } else {
    overlay.innerHTML = buildAdminPanel();
    document.body.appendChild(overlay);
  }
}

function checkAdminPw() {
  const val = document.getElementById('admin-pw-input').value;
  if (val === ADMIN_PASSWORD) {
    adminUnlocked = true;
    closeAdmin();
    setTimeout(openAdmin, 100);
  } else {
    document.getElementById('admin-pw-err').textContent = 'Incorrect password.';
    document.getElementById('admin-pw-input').value = '';
    document.getElementById('admin-pw-input').focus();
  }
}

function closeAdmin() {
  const el = document.getElementById('admin-overlay');
  if (el) el.remove();
}

// Keyboard shortcut: Ctrl + Shift + A
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    if (document.getElementById('admin-overlay')) closeAdmin();
    else openAdmin();
  }
});

// URL param: ?admin=true
if (new URLSearchParams(window.location.search).get('admin') === 'true') {
  window.addEventListener('load', openAdmin);
}

// On page load: apply local data, then fetch latest from GitHub
window.addEventListener('load', () => {
  const saved = localStorage.getItem('portfolio_data');
  if (saved) { try { applyDataToPage(JSON.parse(saved)); } catch(e) {} }
  fetchRemoteData();
});
