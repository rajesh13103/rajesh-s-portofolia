// ===== ANIMATED BACKGROUND (Matrix Rain + Particles) =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], matrixCols = [], animId;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initMatrix();
}

// Particles
function mkParticle() {
  return {
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
    r: Math.random() * 1.2 + .3,
    a: Math.random() * .35 + .08,
    c: Math.random() > .5 ? '0,212,255' : '0,255,136'
  };
}

// Matrix columns
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

  // Matrix rain (very subtle)
  matrixCols.forEach(col => {
    ctx.font = '11px Share Tech Mono';
    ctx.fillStyle = `rgba(0,212,255,${col.alpha})`;
    ctx.fillText(col.char(), col.x, col.y);
    col.y += col.speed;
    if (col.y > H) col.y = -20;
  });

  // Particle connections
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

  // Particles
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

// Hero tag
const tagEl = document.getElementById('typing-tag');
const tagTxt = 'Initializing profile...';
let ti = 0;
function typeTag() { if (ti < tagTxt.length) { tagEl.textContent += tagTxt[ti++]; setTimeout(typeTag, 55); } }
setTimeout(typeTag, 400);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isFloat = String(target).includes('.');
  const dur = 1500, step = 16;
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

// ===== AOS (Animate on Scroll) =====
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // animate counters
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      // animate score bars
      e.target.querySelectorAll('.score-fill[data-width],.skill-fill[data-width]').forEach(b => {
        b.style.width = b.dataset.width;
      });
      // animate info rows
      e.target.querySelectorAll('.info-row').forEach((row, i) => {
        setTimeout(() => row.classList.add('visible'), i * 80);
      });
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => aosObs.observe(el));

// Also trigger bars on scroll since they're not inside [data-aos] wrappers
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.score-fill[data-width],.skill-fill[data-width]').forEach(b => {
        b.style.width = b.dataset.width;
      });
      e.target.querySelectorAll('[data-count]').forEach(animateCounter);
      e.target.querySelectorAll('.info-row').forEach((r, i) => {
        setTimeout(() => r.classList.add('visible'), i * 80);
      });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.timeline-card,.skill-card,.info-card').forEach(el => barObs.observe(el));

// ===== CERTIFICATE LIGHTBOX (static - reads from certs/ folder) =====
function openCert(imgSrc, title) {
  const lb   = document.getElementById('lightbox');
  const img  = document.getElementById('lb-img');
  const ttl  = document.getElementById('lb-title');
  const noC  = document.getElementById('lb-no-cert');

  ttl.textContent = title;
  img.style.display = 'none';
  noC.style.display = 'none';

  // Try loading the static image
  const testImg = new Image();
  testImg.onload = () => {
    img.src = imgSrc;
    img.style.display = 'block';
    noC.style.display = 'none';
  };
  testImg.onerror = () => {
    img.style.display = 'none';
    noC.style.display = 'block';
  };
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
  const el = document.getElementById(id);
  el.classList.toggle('open');
}

// ===== CONTACT FORM — EmailJS integration =====
// To make form actually send emails:
// 1. Sign up at https://www.emailjs.com (free)
// 2. Create a service + template
// 3. Replace the values below with yours
// 4. Uncomment the emailjs lines

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const orig = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  const data = {
    from_name: this.name.value,
    reply_to: this.email.value,
    subject: this.subject.value,
    message: this.message.value,
    to_name: 'Rajesh Kumar'
  };

  // --- Option A: EmailJS (recommended) ---
  // emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data, EMAILJS_PUBLIC_KEY)
  //   .then(() => {
  //     status.textContent = '✓ Message sent successfully! I will reply soon.';
  //     status.className = 'form-status success';
  //     this.reset();
  //   })
  //   .catch(() => {
  //     status.textContent = '✗ Failed to send. Please email me directly.';
  //     status.className = 'form-status error';
  //   })
  //   .finally(() => { btn.innerHTML = orig; btn.disabled = false; });

  // --- Option B: mailto fallback (works offline, opens email client) ---
  const mailtoLink = `mailto:bomalleenirajeshkumar@gmail.com?subject=${encodeURIComponent(data.subject || 'Portfolio Contact')}&body=${encodeURIComponent('Name: ' + data.from_name + '\nEmail: ' + data.reply_to + '\n\n' + data.message)}`;
  window.location.href = mailtoLink;
  setTimeout(() => {
    status.textContent = '✓ Opening your email client... Alternatively email me directly!';
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

// ===== HIDDEN ADMIN PANEL =====
// Access: Press Ctrl+Shift+A  (invisible to viewers)
// Or visit: yourportfolio.html?admin=true
// Password is set below — change it to your own!

const ADMIN_PASSWORD = 'rajesh2026'; // <-- CHANGE THIS

// Data store — persists in localStorage
function loadPortfolioData() {
  const defaults = {
    cgpa: '9.58',
    skills: 5,
    yearLabel: '3rd Year B.Tech',
    aboutDesc: "Hey! I'm <span class='highlight'>Rajesh Kumar Bomalleeni</span>, a second-year Electronics & Communication Engineering student with a deep passion for software development and web technologies.",
    skills_list: [
      { name: 'HTML5', level: 85, certFile: 'html-cert.jpg.jpeg', status: 'Certified' },
      { name: 'CSS3', level: 80, certFile: 'css-cert.jpeg', status: 'Certified' },
      { name: 'JavaScript', level: 70, certFile: 'js-cert.jpg', status: 'On Progress' },
      { name: 'C Programming', level: 75, certFile: 'c-cert.jpg.jpeg', status: 'On Progress' },
      { name: 'Python', level: 72, certFile: 'python-cert.jpg.jpeg', status: 'Certified' }
    ],
    participations: [
      {
        icon: 'fas fa-trophy',
        title: 'Hackathons & Competitions',
        detail: 'Participated in National-level Department Fest held at MITS deemed to be University',
        summary: 'Participated in inter-college hackathon events where teams collaborated to solve real-world problems within time constraints.',
        certFile: 'hackathon1.jpeg',
        certTitle: 'Hackathon Certificate'
      },
      {
        icon: 'fas fa-laptop-code',
        title: 'Workshops & Seminars',
        detail: 'Participated in Mini Project Expo held at Aditya College of Engineering and Organised by Dept of AI&DS',
        summary: 'Attended hands-on workshops covering web development technologies, including HTML/CSS/JS frameworks.',
        certFile: 'workshop-cert.jpeg',
        certTitle: 'Workshop Certificate'
      },
      {
        icon: 'fas fa-university',
        title: 'Academic Activities',
        detail: 'Active participant in departmental events at Aditya College',
        summary: 'Actively participated in various departmental and college-level academic events including technical symposiums, paper presentations.',
        certFile: 'academic-cert.jpeg',
        certTitle: 'Academic Certificate'
      },
      {
        icon: 'fas fa-medal',
        title: 'Online Certifications',
        detail: 'Completed professional online courses and certifications',
        summary: 'Completed various online courses through platforms like Coursera, NPTEL, and similar platforms.',
        certFile: 'extra-cert.jpeg',
        certTitle: 'Online Certification'
      }
    ]
  };
  try {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? Object.assign({}, defaults, JSON.parse(saved)) : defaults;
  } catch(e) { return defaults; }
}

function savePortfolioData(data) {
  localStorage.setItem('portfolio_data', JSON.stringify(data));
}

// Inject admin CSS once
function injectAdminCSS() {
  if (document.getElementById('admin-css')) return;
  const s = document.createElement('style');
  s.id = 'admin-css';
  s.textContent = `
    #admin-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      z-index: 99999; display: flex; align-items: center; justify-content: center;
      font-family: 'Exo 2', sans-serif;
    }
    #admin-panel {
      background: #0d0d1a; border: 1px solid #00d4ff44; border-radius: 12px;
      width: min(92vw, 640px); max-height: 88vh; overflow-y: auto;
      padding: 28px 32px; color: #cdd6f4; position: relative;
    }
    #admin-panel h2 { color: #00d4ff; font-size: 1.2rem; margin: 0 0 20px;
      font-family: 'Orbitron', sans-serif; letter-spacing: 2px; }
    .admin-section { margin-bottom: 24px; border-top: 1px solid #ffffff11; padding-top: 16px; }
    .admin-section h3 { color: #00ff88; font-size: 0.8rem; letter-spacing: 1.5px;
      text-transform: uppercase; margin: 0 0 12px; }
    .admin-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
    .admin-row label { font-size: 0.8rem; color: #888; min-width: 120px; }
    .admin-row input, .admin-row textarea, .admin-row select {
      flex: 1; background: #0a0a14; border: 1px solid #00d4ff33; border-radius: 6px;
      color: #cdd6f4; padding: 7px 10px; font-size: 0.85rem; font-family: inherit; min-width: 0;
    }
    .admin-row input:focus, .admin-row textarea:focus { outline: none; border-color: #00d4ff88; }
    .admin-btn {
      padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer;
      font-size: 0.82rem; font-family: inherit; font-weight: 600; letter-spacing: 0.5px;
    }
    .admin-btn-primary { background: #00d4ff22; color: #00d4ff; border: 1px solid #00d4ff55; }
    .admin-btn-primary:hover { background: #00d4ff33; }
    .admin-btn-danger { background: #ff4d4d22; color: #ff4d4d; border: 1px solid #ff4d4d44; }
    .admin-btn-danger:hover { background: #ff4d4d33; }
    .admin-btn-success { background: #00ff8822; color: #00ff88; border: 1px solid #00ff8844; }
    .admin-btn-success:hover { background: #00ff8833; }
    .admin-close { position: absolute; top: 18px; right: 20px; background: none;
      border: none; color: #888; font-size: 1.4rem; cursor: pointer; line-height: 1; }
    .admin-close:hover { color: #ff4d4d; }
    .admin-save-bar { display: flex; align-items: center; gap: 12px; padding-top: 16px;
      border-top: 1px solid #ffffff11; }
    .admin-save-msg { font-size: 0.8rem; color: #00ff88; opacity: 0; transition: opacity 0.3s; }
    .admin-skill-row { background: #ffffff06; border-radius: 8px; padding: 10px 12px;
      margin-bottom: 8px; border: 1px solid #ffffff0a; }
    .admin-part-row { background: #ffffff06; border-radius: 8px; padding: 12px 14px;
      margin-bottom: 10px; border: 1px solid #ffffff0a; }
    .admin-part-row input { margin-bottom: 6px; width: 100%; box-sizing: border-box; }
    .admin-tag { display: inline-block; background: #00d4ff11; color: #00d4ff88;
      font-size: 0.7rem; border-radius: 4px; padding: 2px 8px; margin-right: 6px; }
    #admin-pw-screen { text-align: center; }
    #admin-pw-screen h2 { margin-bottom: 20px; }
    #admin-pw-input { display: block; margin: 0 auto 14px; width: 220px; text-align: center;
      font-size: 1.1rem; letter-spacing: 3px; }
    #admin-pw-err { color: #ff4d4d; font-size: 0.82rem; min-height: 18px; margin-bottom: 8px; }
  `;
  document.head.appendChild(s);
}

// Build admin panel HTML
function buildAdminPanel() {
  const data = loadPortfolioData();

  const skillRows = (data.skills_list || []).map((sk, i) => `
    <div class="admin-skill-row" id="skill-row-${i}">
      <div class="admin-row">
        <label>Skill name</label>
        <input type="text" id="sk-name-${i}" value="${sk.name}">
        <input type="number" id="sk-lvl-${i}" value="${sk.level}" min="0" max="100" style="width:70px;flex:none">
        <span class="admin-tag">%</span>
      </div>
      <div class="admin-row">
        <label>Cert filename</label>
        <input type="text" id="sk-cert-${i}" value="${sk.certFile}" placeholder="e.g. html-cert.jpg">
        <input type="text" id="sk-status-${i}" value="${sk.status}" style="width:120px;flex:none">
      </div>
    </div>`).join('');

  const partRows = (data.participations || []).map((p, i) => `
    <div class="admin-part-row" id="part-row-${i}">
      <div class="admin-row" style="margin-bottom:6px">
        <label>Title</label>
        <input type="text" id="pt-title-${i}" value="${p.title}">
      </div>
      <div class="admin-row" style="margin-bottom:6px">
        <label>Detail</label>
        <input type="text" id="pt-detail-${i}" value="${p.detail}">
      </div>
      <div class="admin-row" style="margin-bottom:6px">
        <label>Cert file</label>
        <input type="text" id="pt-cert-${i}" value="${p.certFile}" placeholder="e.g. hackathon1.jpeg">
        <input type="text" id="pt-certtitle-${i}" value="${p.certTitle}" placeholder="Certificate title">
      </div>
      <div class="admin-row">
        <label>Summary</label>
        <textarea id="pt-summary-${i}" rows="2">${p.summary}</textarea>
      </div>
    </div>`).join('');

  return `
    <div id="admin-panel">
      <button class="admin-close" onclick="closeAdmin()">×</button>
      <h2>⚡ Portfolio Admin</h2>

      <div class="admin-section">
        <h3>Hero Stats</h3>
        <div class="admin-row">
          <label>CGPA</label>
          <input type="text" id="adm-cgpa" value="${data.cgpa}" placeholder="9.58">
        </div>
        <div class="admin-row">
          <label>Skills count</label>
          <input type="number" id="adm-skills" value="${data.skills}" min="1" max="20">
        </div>
        <div class="admin-row">
          <label>Year label</label>
          <input type="text" id="adm-year" value="${data.yearLabel}" placeholder="3rd Year B.Tech">
        </div>
      </div>

      <div class="admin-section">
        <h3>Skills & Certificates</h3>
        <p style="font-size:0.78rem;color:#666;margin:0 0 12px">Update skill levels (0–100) and certificate filenames. Files must be in the <code style="color:#00d4ff88">certs/</code> folder.</p>
        ${skillRows}
        <button class="admin-btn admin-btn-success" onclick="addSkillRow()" style="margin-top:6px">+ Add Skill</button>
      </div>

      <div class="admin-section">
        <h3>Events & Participations</h3>
        <p style="font-size:0.78rem;color:#666;margin:0 0 12px">Update event details and certificate filenames.</p>
        ${partRows}
        <button class="admin-btn admin-btn-success" onclick="addPartRow()" style="margin-top:6px">+ Add Event</button>
      </div>

      <div class="admin-section">
        <h3>Quick Notes (private)</h3>
        <textarea id="adm-notes" rows="3" style="width:100%;background:#0a0a14;border:1px solid #00d4ff22;border-radius:6px;color:#888;padding:8px 10px;font-size:0.82rem;box-sizing:border-box">${localStorage.getItem('portfolio_notes') || ''}</textarea>
        <p style="font-size:0.72rem;color:#444;margin:4px 0 0">Private — never shown to visitors. Use for reminders about what to update.</p>
      </div>

      <div class="admin-save-bar">
        <button class="admin-btn admin-btn-primary" onclick="saveAdmin()">💾 Save & Apply</button>
        <button class="admin-btn admin-btn-danger" onclick="resetAdmin()">Reset to Defaults</button>
        <span class="admin-save-msg" id="adm-save-msg">✓ Saved!</span>
      </div>
    </div>`;
}

// Save and apply changes live
function saveAdmin() {
  const data = loadPortfolioData();

  data.cgpa = document.getElementById('adm-cgpa').value.trim();
  data.skills = parseInt(document.getElementById('adm-skills').value) || 5;
  data.yearLabel = document.getElementById('adm-year').value.trim();

  // Skills
  const skRows = document.querySelectorAll('[id^="skill-row-"]');
  data.skills_list = Array.from(skRows).map((_, i) => ({
    name: document.getElementById(`sk-name-${i}`)?.value || '',
    level: parseInt(document.getElementById(`sk-lvl-${i}`)?.value) || 0,
    certFile: document.getElementById(`sk-cert-${i}`)?.value || '',
    status: document.getElementById(`sk-status-${i}`)?.value || ''
  }));

  // Participations
  const ptRows = document.querySelectorAll('[id^="part-row-"]');
  data.participations = Array.from(ptRows).map((_, i) => ({
    icon: (data.participations[i] || {}).icon || 'fas fa-star',
    title: document.getElementById(`pt-title-${i}`)?.value || '',
    detail: document.getElementById(`pt-detail-${i}`)?.value || '',
    certFile: document.getElementById(`pt-cert-${i}`)?.value || '',
    certTitle: document.getElementById(`pt-certtitle-${i}`)?.value || '',
    summary: document.getElementById(`pt-summary-${i}`)?.value || ''
  }));

  savePortfolioData(data);
  localStorage.setItem('portfolio_notes', document.getElementById('adm-notes').value);

  applyDataToPage(data);

  const msg = document.getElementById('adm-save-msg');
  msg.style.opacity = '1';
  setTimeout(() => msg.style.opacity = '0', 2500);
}

// Apply saved data to the visible page
function applyDataToPage(data) {
  // Stats
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    if (el.dataset.count && parseFloat(el.dataset.count) > 9) {
      el.dataset.count = data.cgpa;
      el.textContent = data.cgpa;
    }
  });
  document.querySelectorAll('.stat').forEach(st => {
    const lbl = st.querySelector('.stat-label');
    const num = st.querySelector('.stat-num');
    if (lbl && lbl.textContent === 'Skills' && num) {
      num.dataset.count = data.skills;
      num.textContent = data.skills + '+';
    }
    if (lbl && lbl.textContent === 'Year B.Tech' && num) {
      num.textContent = data.yearLabel.replace(' B.Tech','');
      lbl.textContent = 'Year B.Tech';
    }
  });

  // Skill bars
  const skillCards = document.querySelectorAll('.skill-card');
  data.skills_list.forEach((sk, i) => {
    const card = skillCards[i];
    if (!card) return;
    const nameEl = card.querySelector('.skill-name');
    const fill = card.querySelector('.skill-fill');
    const lbl = card.querySelector('.skill-cert-label');
    if (nameEl) nameEl.textContent = sk.name;
    if (fill) { fill.style.width = sk.level + '%'; fill.dataset.width = sk.level + '%'; }
    if (lbl) lbl.textContent = sk.status;
    card.onclick = () => openCert(sk.certFile, sk.name + ' Certificate');
  });

  // Info card CGPA
  document.querySelectorAll('.info-val.accent').forEach(el => {
    if (el.textContent.includes('9.') || el.textContent.includes('/')) {
      el.textContent = data.cgpa + ' / 10.0';
    }
  });
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
  data.participations.push({
    icon: 'fas fa-star',
    title: 'New Event',
    detail: 'Describe this event',
    summary: 'Detailed summary here.',
    certFile: 'new-cert.jpeg',
    certTitle: 'Event Certificate'
  });
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
        <button class="admin-close" onclick="closeAdmin()">×</button>
        <div id="admin-pw-screen">
          <h2>⚡ Admin Access</h2>
          <input class="admin-row input" id="admin-pw-input" type="password" placeholder="Enter password" autocomplete="off">
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

// Auto-apply any saved data on page load
window.addEventListener('load', () => {
  const saved = localStorage.getItem('portfolio_data');
  if (saved) {
    try { applyDataToPage(JSON.parse(saved)); } catch(e) {}
  }
});
