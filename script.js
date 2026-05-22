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

// ===== HIDDEN ADMIN PANEL =====
// Access: Ctrl+Shift+A  (invisible to viewers)
// Password set below — change it!
const ADMIN_PASSWORD = 'rajesh2026';

// ---- Data helpers ----
const DATA_KEY = 'rk_portfolio_v2';

function defaultData() {
  return {
    cgpa: '9.58',
    skillsCount: 5,
    yearLabel: '3rd Year B.Tech',
    education: [
      { badge: '2024 – Present', degree: 'B.Tech — Electronics & Communication Engineering', school: 'Aditya College of Engineering, Madanapalle', detail: 'Currently Pursuing · 3rd Year', scoreLabel: 'CGPA', score: '9.58 / 10', scorePct: '95.8', certFile: 'btech-cert.jpeg', certTitle: 'B.Tech — Aditya College of Engineering' },
      { badge: 'Completed', degree: 'Intermediate (10+2) — MPC', school: 'Sri Siddhartha Junior College, Madanapalle', detail: 'Board of Intermediate Education, AP', scoreLabel: 'Percentage', score: '90%', scorePct: '90', certFile: 'inter-cert.jpg.jpeg', certTitle: 'Intermediate — Sri Siddhartha Junior College' },
      { badge: 'Completed', degree: 'Secondary School (SSC / Class X)', school: 'Vivekananda Municipal High School, Madanapalle', detail: 'Board of Secondary Education, AP', scoreLabel: 'Percentage', score: '84%', scorePct: '84', certFile: 'ssc-cert.jpg.jpeg', certTitle: 'SSC — Vivekananda Municipal High School' }
    ],
    skills: [
      { name: 'HTML5', icon: 'fab fa-html5', iconColor: '#e44d26', level: 85, certFile: 'html-cert.jpg.jpeg', status: 'Certified' },
      { name: 'CSS3', icon: 'fab fa-css3-alt', iconColor: '#264de4', level: 80, certFile: 'css-cert.jpeg', status: 'Certified' },
      { name: 'JavaScript', icon: 'fab fa-js', iconColor: '#f7df1e', level: 70, certFile: 'js-cert.jpg', status: 'On Progress' },
      { name: 'C Programming', icon: 'fas fa-memory', iconColor: '#a9c0d4', level: 75, certFile: 'c-cert.jpg.jpeg', status: 'On Progress' },
      { name: 'Python', icon: 'fab fa-python', iconColor: '#3776ab', level: 72, certFile: 'python-cert.jpg.jpeg', status: 'Certified' }
    ],
    participations: [
      { icon: 'fas fa-trophy', title: 'Hackathons & Competitions', detail: 'Participated in National-level Department Fest held at MITS deemed to be University', summary: 'Participated in inter-college hackathon events where teams collaborated to solve real-world problems within time constraints.', certFile: 'hackathon1.jpeg', certTitle: 'Hackathon Certificate' },
      { icon: 'fas fa-laptop-code', title: 'Workshops & Seminars', detail: 'Participated in Mini Project Expo held at Aditya College of Engineering and Organised by Dept of AI&DS', summary: 'Attended hands-on workshops covering web development technologies.', certFile: 'workshop-cert.jpeg', certTitle: 'Workshop Certificate' },
      { icon: 'fas fa-university', title: 'Academic Activities', detail: 'Active participant in departmental events at Aditya College', summary: 'Actively participated in various departmental and college-level academic events.', certFile: 'academic-cert.jpeg', certTitle: 'Academic Certificate' },
      { icon: 'fas fa-medal', title: 'Online Certifications', detail: 'Completed professional online courses and certifications', summary: 'Completed various online courses through platforms like Simplilearn, NPTEL.', certFile: 'extra-cert.jpeg', certTitle: 'Online Certification' }
    ]
  };
}

function loadData() {
  try { const s = localStorage.getItem(DATA_KEY); return s ? Object.assign(defaultData(), JSON.parse(s)) : defaultData(); }
  catch(e) { return defaultData(); }
}
function saveData(d) { localStorage.setItem(DATA_KEY, JSON.stringify(d)); }

// ---- Apply data to live page ----
function applyData(d) {
  // Hero stats
  document.querySelectorAll('.stat').forEach(st => {
    const lbl = st.querySelector('.stat-label');
    const num = st.querySelector('.stat-num');
    if (!lbl || !num) return;
    if (lbl.textContent.trim() === 'CGPA') { num.textContent = d.cgpa; num.dataset.count = d.cgpa; }
    if (lbl.textContent.trim() === 'Skills') { num.textContent = d.skillsCount + '+'; num.dataset.count = d.skillsCount; }
    if (lbl.textContent.includes('Year')) { num.textContent = d.yearLabel.split(' ')[0]; }
  });

  // About info card CGPA
  document.querySelectorAll('.info-val.accent').forEach(el => {
    if (el.textContent.includes('/')) el.textContent = d.cgpa + ' / 10.0';
  });

  // Education timeline cards
  const cards = document.querySelectorAll('.timeline-card');
  d.education.forEach((edu, i) => {
    const card = cards[i];
    if (!card) return;
    const badge = card.querySelector('.timeline-badge');
    const deg = card.querySelector('.timeline-degree');
    const school = card.querySelector('.timeline-school');
    const detail = card.querySelector('.timeline-detail');
    const scoreLabel = card.querySelector('.score-label');
    const fill = card.querySelector('.score-fill');
    if (badge) badge.textContent = edu.badge;
    if (deg) deg.textContent = edu.degree;
    if (school) school.innerHTML = `<i class="fas fa-university"></i> ${edu.school}`;
    if (detail) detail.textContent = edu.detail;
    if (scoreLabel) scoreLabel.innerHTML = `${edu.scoreLabel}: <span class="accent">${edu.score}</span>`;
    if (fill) { fill.style.width = edu.scorePct + '%'; fill.dataset.width = edu.scorePct + '%'; }
    card.onclick = () => openCert(edu.certFile, edu.certTitle);
  });

  // Skills
  const skillCards = document.querySelectorAll('.skill-card');
  d.skills.forEach((sk, i) => {
    const card = skillCards[i];
    if (!card) return;
    const nm = card.querySelector('.skill-name');
    const fill = card.querySelector('.skill-fill');
    const lbl = card.querySelector('.skill-cert-label');
    if (nm) nm.textContent = sk.name;
    if (fill) { fill.style.width = sk.level + '%'; fill.dataset.width = sk.level + '%'; }
    if (lbl) lbl.innerHTML = `<i class="fas fa-award"></i> ${sk.status}`;
    card.onclick = () => openCert(sk.certFile, sk.name + ' Certificate');
  });

  // Participations
  const partCards = document.querySelectorAll('.part-card');
  d.participations.forEach((p, i) => {
    const card = partCards[i];
    if (!card) return;
    const title = card.querySelector('.part-title');
    const detail = card.querySelector('.part-detail');
    const summaryEl = card.querySelector('.part-summary p');
    if (title) title.textContent = p.title;
    if (detail) detail.textContent = p.detail;
    if (summaryEl) summaryEl.textContent = p.summary;
    const certBtn = card.querySelector('.cert-btn');
    if (certBtn) certBtn.onclick = () => openCert(p.certFile, p.certTitle);
  });
}

// ---- Generate updated index.html with data baked in ----
function generateHTML(d) {
  // Get current page HTML
  const html = document.documentElement.outerHTML;

  // Build the data-inject script block
  const dataScript = `\n<script id="portfolio-data-inject">\n(function(){\n  const d = ${JSON.stringify(d, null, 2)};\n  window.__PORTFOLIO_DATA__ = d;\n})();\n<\/script>`;

  // Remove old inject block if present, insert before </head>
  const cleaned = html.replace(/<script id="portfolio-data-inject">[\s\S]*?<\/script>/g, '');
  return cleaned.replace('</head>', dataScript + '\n</head>');
}

function downloadHTML(d) {
  const blob = new Blob([generateHTML(d)], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'index.html';
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---- CSS ----
function injectAdminCSS() {
  if (document.getElementById('adm-css')) return;
  const s = document.createElement('style');
  s.id = 'adm-css';
  s.textContent = `
#adm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:'Exo 2',sans-serif}
#adm-panel{background:#0b0b1a;border:1px solid #00d4ff33;border-radius:14px;width:min(94vw,660px);max-height:90vh;overflow-y:auto;padding:28px 30px;color:#cdd6f4;position:relative}
#adm-panel h2{color:#00d4ff;font-size:1.15rem;margin:0 0 6px;font-family:'Orbitron',sans-serif;letter-spacing:2px}
.adm-hint{font-size:.75rem;color:#444;margin:0 0 18px}
.adm-sec{margin-bottom:22px;border-top:1px solid #ffffff0f;padding-top:16px}
.adm-sec h3{color:#00ff88;font-size:.75rem;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px}
.adm-row{display:flex;gap:8px;align-items:center;margin-bottom:9px;flex-wrap:wrap}
.adm-row label{font-size:.78rem;color:#777;min-width:110px}
.adm-row input,.adm-row textarea,.adm-row select{flex:1;background:#09091a;border:1px solid #00d4ff22;border-radius:6px;color:#cdd6f4;padding:6px 9px;font-size:.83rem;font-family:inherit;min-width:0}
.adm-row input:focus,.adm-row textarea:focus{outline:none;border-color:#00d4ff66}
.adm-item{background:#ffffff05;border-radius:8px;padding:12px 14px;margin-bottom:10px;border:1px solid #ffffff08}
.adm-item-title{font-size:.75rem;color:#00d4ff88;margin-bottom:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase}
.adm-btn{padding:7px 16px;border-radius:6px;border:none;cursor:pointer;font-size:.8rem;font-family:inherit;font-weight:600}
.adm-btn-blue{background:#00d4ff18;color:#00d4ff;border:1px solid #00d4ff44}
.adm-btn-blue:hover{background:#00d4ff28}
.adm-btn-green{background:#00ff8818;color:#00ff88;border:1px solid #00ff8844}
.adm-btn-green:hover{background:#00ff8828}
.adm-btn-red{background:#ff4d4d18;color:#ff4d4d;border:1px solid #ff4d4d44}
.adm-btn-red:hover{background:#ff4d4d28}
.adm-btn-gold{background:#ffcc0018;color:#ffcc00;border:1px solid #ffcc0044;font-size:.85rem;padding:9px 20px}
.adm-btn-gold:hover{background:#ffcc0028}
.adm-close{position:absolute;top:16px;right:18px;background:none;border:none;color:#666;font-size:1.4rem;cursor:pointer;line-height:1}
.adm-close:hover{color:#ff4d4d}
.adm-bar{display:flex;align-items:center;gap:10px;padding-top:16px;border-top:1px solid #ffffff0f;flex-wrap:wrap}
.adm-saved{font-size:.78rem;color:#00ff88;opacity:0;transition:opacity .3s}
#adm-pw-screen{text-align:center;padding:10px 0}
#adm-pw-screen h2{margin-bottom:18px}
#adm-pw-in{display:block;margin:0 auto 12px;width:200px;text-align:center;font-size:1rem;letter-spacing:3px;background:#09091a;border:1px solid #00d4ff33;border-radius:8px;color:#cdd6f4;padding:8px}
#adm-pw-err{color:#ff4d4d;font-size:.8rem;min-height:18px;margin-bottom:8px}
`;
  document.head.appendChild(s);
}

// ---- Panel HTML builder ----
function buildPanel() {
  const d = loadData();

  const eduRows = d.education.map((e, i) => `
    <div class="adm-item">
      <div class="adm-item-title">Education ${i+1}</div>
      <div class="adm-row"><label>Year/Badge</label><input id="ed-badge-${i}" value="${e.badge}"></div>
      <div class="adm-row"><label>Degree</label><input id="ed-deg-${i}" value="${e.degree}"></div>
      <div class="adm-row"><label>School</label><input id="ed-school-${i}" value="${e.school}"></div>
      <div class="adm-row"><label>Detail line</label><input id="ed-det-${i}" value="${e.detail}"></div>
      <div class="adm-row">
        <label>Score label</label><input id="ed-slbl-${i}" value="${e.scoreLabel}" style="max-width:100px">
        <input id="ed-score-${i}" value="${e.score}" placeholder="9.58 / 10" style="max-width:110px">
        <input id="ed-pct-${i}" value="${e.scorePct}" placeholder="95.8" style="max-width:70px" title="Bar %">
      </div>
      <div class="adm-row"><label>Cert filename</label><input id="ed-cert-${i}" value="${e.certFile}" placeholder="btech-cert.jpeg"></div>
    </div>`).join('');

  const skRows = d.skills.map((sk, i) => `
    <div class="adm-item">
      <div class="adm-item-title">Skill ${i+1}</div>
      <div class="adm-row">
        <label>Name</label><input id="sk-name-${i}" value="${sk.name}">
        <input id="sk-lvl-${i}" type="number" value="${sk.level}" min="0" max="100" style="width:64px;flex:none" title="Level %">
        <span style="font-size:.75rem;color:#666">%</span>
      </div>
      <div class="adm-row">
        <label>Cert file</label><input id="sk-cert-${i}" value="${sk.certFile}">
        <input id="sk-status-${i}" value="${sk.status}" style="width:110px;flex:none" title="Status text">
      </div>
    </div>`).join('');

  const ptRows = d.participations.map((p, i) => `
    <div class="adm-item">
      <div class="adm-item-title">Event ${i+1}</div>
      <div class="adm-row"><label>Title</label><input id="pt-title-${i}" value="${p.title}"></div>
      <div class="adm-row"><label>Detail</label><input id="pt-det-${i}" value="${p.detail}"></div>
      <div class="adm-row"><label>Summary</label><textarea id="pt-sum-${i}" rows="2">${p.summary}</textarea></div>
      <div class="adm-row">
        <label>Cert file</label><input id="pt-cert-${i}" value="${p.certFile}">
        <input id="pt-ctitle-${i}" value="${p.certTitle}" placeholder="Certificate title">
      </div>
    </div>`).join('');

  return `<div id="adm-panel">
    <button class="adm-close" onclick="closeAdmin()">×</button>
    <h2>⚡ Portfolio Admin</h2>
    <p class="adm-hint">Ctrl+Shift+A to toggle · Changes are permanent after Download</p>

    <div class="adm-sec">
      <h3>Hero Stats</h3>
      <div class="adm-row"><label>CGPA</label><input id="adm-cgpa" value="${d.cgpa}"></div>
      <div class="adm-row"><label>Skills count</label><input id="adm-skillscount" type="number" value="${d.skillsCount}" min="1" max="30"></div>
      <div class="adm-row"><label>Year label</label><input id="adm-year" value="${d.yearLabel}" placeholder="3rd Year B.Tech"></div>
    </div>

    <div class="adm-sec">
      <h3>Education</h3>
      ${eduRows}
      <button class="adm-btn adm-btn-green" onclick="addEdu()" style="margin-top:4px">+ Add Education</button>
    </div>

    <div class="adm-sec">
      <h3>Skills & Certificates</h3>
      <div id="adm-skills-wrap">${skRows}</div>
      <button class="adm-btn adm-btn-green" onclick="addSkill()" style="margin-top:4px">+ Add Skill</button>
    </div>

    <div class="adm-sec">
      <h3>Events & Participations</h3>
      <div id="adm-parts-wrap">${ptRows}</div>
      <button class="adm-btn adm-btn-green" onclick="addPart()" style="margin-top:4px">+ Add Event</button>
    </div>

    <div class="adm-bar">
      <button class="adm-btn adm-btn-gold" onclick="saveAndDownload()">💾 Save & Download index.html</button>
      <button class="adm-btn adm-btn-blue" onclick="previewAdmin()">👁 Preview only</button>
      <button class="adm-btn adm-btn-red" onclick="resetAdmin()">Reset</button>
      <span class="adm-saved" id="adm-saved-msg"></span>
    </div>
    <p style="font-size:.72rem;color:#333;margin-top:10px">
      After downloading: replace your old <code style="color:#00d4ff55">index.html</code> with the downloaded file. Changes are then permanent.
    </p>
  </div>`;
}

// ---- Collect form data ----
function collectFormData() {
  const d = loadData();
  d.cgpa = document.getElementById('adm-cgpa').value.trim();
  d.skillsCount = parseInt(document.getElementById('adm-skillscount').value) || 5;
  d.yearLabel = document.getElementById('adm-year').value.trim();

  d.education = d.education.map((_, i) => ({
    badge:      document.getElementById(`ed-badge-${i}`)?.value || '',
    degree:     document.getElementById(`ed-deg-${i}`)?.value || '',
    school:     document.getElementById(`ed-school-${i}`)?.value || '',
    detail:     document.getElementById(`ed-det-${i}`)?.value || '',
    scoreLabel: document.getElementById(`ed-slbl-${i}`)?.value || 'Score',
    score:      document.getElementById(`ed-score-${i}`)?.value || '',
    scorePct:   document.getElementById(`ed-pct-${i}`)?.value || '0',
    certFile:   document.getElementById(`ed-cert-${i}`)?.value || '',
    certTitle:  document.getElementById(`ed-badge-${i}`)?.value || ''
  }));

  d.skills = d.skills.map((_, i) => ({
    name:     document.getElementById(`sk-name-${i}`)?.value || '',
    icon:     (d.skills[i]||{}).icon || 'fas fa-code',
    iconColor:(d.skills[i]||{}).iconColor || '#00d4ff',
    level:    parseInt(document.getElementById(`sk-lvl-${i}`)?.value) || 0,
    certFile: document.getElementById(`sk-cert-${i}`)?.value || '',
    status:   document.getElementById(`sk-status-${i}`)?.value || ''
  }));

  d.participations = d.participations.map((p, i) => ({
    icon:      p.icon || 'fas fa-star',
    title:     document.getElementById(`pt-title-${i}`)?.value || '',
    detail:    document.getElementById(`pt-det-${i}`)?.value || '',
    summary:   document.getElementById(`pt-sum-${i}`)?.value || '',
    certFile:  document.getElementById(`pt-cert-${i}`)?.value || '',
    certTitle: document.getElementById(`pt-ctitle-${i}`)?.value || ''
  }));

  return d;
}

function previewAdmin() {
  const d = collectFormData();
  saveData(d);
  applyData(d);
  const msg = document.getElementById('adm-saved-msg');
  msg.textContent = '✓ Previewing on page!';
  msg.style.opacity = '1';
  setTimeout(() => msg.style.opacity = '0', 2500);
}

function saveAndDownload() {
  const d = collectFormData();
  saveData(d);
  applyData(d);
  downloadHTML(d);
  const msg = document.getElementById('adm-saved-msg');
  msg.textContent = '✓ Downloaded! Replace your index.html.';
  msg.style.opacity = '1';
  setTimeout(() => msg.style.opacity = '0', 4000);
}

function resetAdmin() {
  if (!confirm('Reset all changes to original defaults?')) return;
  localStorage.removeItem(DATA_KEY);
  closeAdmin();
  setTimeout(openAdmin, 150);
}

function addEdu() {
  const d = collectFormData();
  d.education.push({ badge: 'Completed', degree: 'New Qualification', school: 'School / College Name', detail: 'Board / University', scoreLabel: 'Percentage', score: '0%', scorePct: '0', certFile: 'cert.jpg', certTitle: 'Certificate' });
  saveData(d);
  closeAdmin(); setTimeout(openAdmin, 100);
}
function addSkill() {
  const d = collectFormData();
  d.skills.push({ name: 'New Skill', icon: 'fas fa-code', iconColor: '#00d4ff', level: 70, certFile: 'cert.jpg', status: 'Certified' });
  saveData(d);
  closeAdmin(); setTimeout(openAdmin, 100);
}
function addPart() {
  const d = collectFormData();
  d.participations.push({ icon: 'fas fa-star', title: 'New Event', detail: 'Event details', summary: 'Summary of participation.', certFile: 'cert.jpeg', certTitle: 'Event Certificate' });
  saveData(d);
  closeAdmin(); setTimeout(openAdmin, 100);
}

// ---- Open / close ----
let _adminUnlocked = false;
function openAdmin() {
  injectAdminCSS();
  const ov = document.createElement('div');
  ov.id = 'adm-overlay';
  if (!_adminUnlocked) {
    ov.innerHTML = `<div id="adm-panel"><button class="adm-close" onclick="closeAdmin()">×</button>
      <div id="adm-pw-screen">
        <h2>⚡ Admin Access</h2>
        <input id="adm-pw-in" type="password" placeholder="Password" autocomplete="off">
        <div id="adm-pw-err"></div>
        <button class="adm-btn adm-btn-blue" onclick="checkPw()">Unlock</button>
      </div></div>`;
    document.body.appendChild(ov);
    const inp = document.getElementById('adm-pw-in');
    inp.focus();
    inp.addEventListener('keydown', e => { if(e.key==='Enter') checkPw(); });
  } else {
    ov.innerHTML = buildPanel();
    document.body.appendChild(ov);
  }
}
function checkPw() {
  const v = document.getElementById('adm-pw-in').value;
  if (v === ADMIN_PASSWORD) { _adminUnlocked = true; closeAdmin(); setTimeout(openAdmin,100); }
  else { document.getElementById('adm-pw-err').textContent='Wrong password'; document.getElementById('adm-pw-in').value=''; }
}
function closeAdmin() { const el=document.getElementById('adm-overlay'); if(el) el.remove(); }

// Keyboard shortcut
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key==='A') {
    e.preventDefault();
    document.getElementById('adm-overlay') ? closeAdmin() : openAdmin();
  }
});

// Auto-apply saved data on load
window.addEventListener('load', () => {
  const saved = localStorage.getItem(DATA_KEY);
  if (saved) { try { applyData(JSON.parse(saved)); } catch(e){} }
});
