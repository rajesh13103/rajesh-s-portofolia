// ===== ANIMATED BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], matrixCols = [], animId;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; initMatrix(); }
function mkParticle() { return { x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r:Math.random()*1.2+.3, a:Math.random()*.35+.08, c:Math.random()>.5?'0,212,255':'0,255,136' }; }
function initMatrix() { matrixCols=[]; const cols=Math.floor(W/20); for(let i=0;i<cols;i++) matrixCols.push({x:i*20,y:Math.random()*H*-1,speed:Math.random()*1+.4,char:()=>String.fromCharCode(0x30A0+Math.random()*96),alpha:Math.random()*.06+.02}); }
function initParticles() { particles=[]; for(let i=0;i<45;i++) particles.push(mkParticle()); }
function draw() {
  ctx.clearRect(0,0,W,H);
  matrixCols.forEach(col=>{ ctx.font='11px Share Tech Mono'; ctx.fillStyle=`rgba(0,212,255,${col.alpha})`; ctx.fillText(col.char(),col.x,col.y); col.y+=col.speed; if(col.y>H) col.y=-20; });
  for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++) { const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<110){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(0,212,255,${(1-d/110)*.08})`;ctx.lineWidth=.5;ctx.stroke();} }
  particles.forEach(p=>{ ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.c},${p.a})`;ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1; });
  animId=requestAnimationFrame(draw);
}
resize(); initParticles(); draw();
window.addEventListener('resize',()=>{resize();initParticles();},{passive:true});
document.addEventListener('visibilitychange',()=>{ document.hidden?cancelAnimationFrame(animId):draw(); });

// ===== NAVBAR =====
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{ navbar.classList.toggle('scrolled',window.scrollY>40); highlightNav(); },{passive:true});
const hamburger=document.getElementById('hamburger'),mobileMenu=document.getElementById('mobile-menu');
hamburger.addEventListener('click',()=>{ hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });
function closeMobile(){ hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }
const sections=Array.from(document.querySelectorAll('section[id]')),navAs=document.querySelectorAll('.nav-links a');
function highlightNav(){ let cur=''; sections.forEach(s=>{if(window.scrollY>=s.offsetTop-80)cur=s.id;}); navAs.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+cur);}); }

// ===== TYPING =====
const roles=['Web Developer','ECE Engineer','Problem Solver','Python Enthusiast','Frontend Creator'];
let ri=0,ci=0,del=false;
const typed=document.getElementById('typed-role');
function typeRole(){ const cur=roles[ri]; typed.textContent=del?cur.slice(0,ci-1):cur.slice(0,ci+1); del?ci--:ci++; if(!del&&ci===cur.length){del=true;return setTimeout(typeRole,1800);} if(del&&ci===0){del=false;ri=(ri+1)%roles.length;} setTimeout(typeRole,del?55:95); }
typeRole();
const tagEl=document.getElementById('typing-tag'),tagTxt='Initializing profile...'; let ti=0;
function typeTag(){ if(ti<tagTxt.length){tagEl.textContent+=tagTxt[ti++];setTimeout(typeTag,55);} } setTimeout(typeTag,400);

// ===== COUNTER =====
function animateCounter(el){ const target=parseFloat(el.dataset.count),isFloat=String(target).includes('.'),dur=1500; let cur=0,start=null; function tick(ts){ if(!start)start=ts; const p=Math.min((ts-start)/dur,1); cur=target*p; el.textContent=isFloat?cur.toFixed(2):Math.floor(cur)+'+'; if(p<1)requestAnimationFrame(tick); else el.textContent=isFloat?target.toFixed(2):target+'+'; } requestAnimationFrame(tick); }

// ===== AOS =====
const aosEls=document.querySelectorAll('[data-aos]');
const aosObs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); e.target.querySelectorAll('[data-count]').forEach(animateCounter); e.target.querySelectorAll('.score-fill[data-width],.skill-fill[data-width]').forEach(b=>{b.style.width=b.dataset.width;}); e.target.querySelectorAll('.info-row').forEach((r,i)=>{setTimeout(()=>r.classList.add('visible'),i*80);}); } }); },{threshold:0.12});
aosEls.forEach(el=>aosObs.observe(el));
const barObs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.querySelectorAll('.score-fill[data-width],.skill-fill[data-width]').forEach(b=>{b.style.width=b.dataset.width;}); e.target.querySelectorAll('[data-count]').forEach(animateCounter); e.target.querySelectorAll('.info-row').forEach((r,i)=>{setTimeout(()=>r.classList.add('visible'),i*80);}); } }); },{threshold:0.1});
document.querySelectorAll('.timeline-card,.skill-card,.info-card').forEach(el=>barObs.observe(el));

// ===== LIGHTBOX =====
function openCert(imgSrc,title){ const lb=document.getElementById('lightbox'),img=document.getElementById('lb-img'),ttl=document.getElementById('lb-title'),noC=document.getElementById('lb-no-cert'); ttl.textContent=title; img.style.display='none'; noC.style.display='none'; const t=new Image(); t.onload=()=>{img.src=imgSrc;img.style.display='block';noC.style.display='none';}; t.onerror=()=>{img.style.display='none';noC.style.display='block';}; t.src=imgSrc; lb.classList.add('open'); document.body.style.overflow='hidden'; }
function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});
function toggleSummary(id){ document.getElementById(id).classList.toggle('open'); }

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit',function(e){ e.preventDefault(); const btn=this.querySelector('button[type="submit"]'),orig=btn.innerHTML; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled=true; window.location.href=`mailto:${document.querySelector('[data-field="contact-email"]')?.textContent||'bomalleenirajeshkumar@gmail.com'}?subject=${encodeURIComponent(this.subject.value||'Portfolio Contact')}&body=${encodeURIComponent('Name: '+this.name.value+'\nEmail: '+this.email.value+'\n\n'+this.message.value)}`; setTimeout(()=>{ document.getElementById('form-status').textContent='✓ Opening your email client...'; document.getElementById('form-status').className='form-status success'; btn.innerHTML=orig; btn.disabled=false; this.reset(); },800); });
document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click',e=>{ const t=document.querySelector(a.getAttribute('href')); if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});} }); });

// ===== DEFAULT DATA =====
const ADMIN_PASSWORD = 'rajesh13103';

function getDefaultData() {
  return {
    // Hero
    heroName: 'RAJESH KUMAR BOMALLEENI',
    heroDesc: 'Building efficient software solutions at the intersection of electronics engineering and web development. Passionate about turning ideas into clean, functional code.',
    cgpa: '9.52',
    skills: 5,
    yearLabel: '3rd Year B.Tech',
    resumeFile: 'resume.pdf.docx',
    // About
    aboutBio1: "Hey! I'm Rajesh Kumar Bomalleeni, a second-year Electronics & Communication Engineering student with a deep passion for software development and web technologies.",
    aboutBio2: 'I bridge the gap between hardware and software, applying my engineering mindset to build elegant digital solutions. Currently exploring the full web development stack while maintaining a stellar academic record of 9.58 CGPA.',
    aboutBio3: 'My objective is to leverage my electronics engineering background and strong interest in software development by applying programming, problem-solving, and analytical skills to build efficient software solutions.',
    // Personal Info card
    infoName: 'Rajesh Kumar Bomalleeni',
    infoDegree: 'B.Tech ECE (3rd Year)',
    infoCGPA: '9.52 / 10.0',
    infoCollege: 'Aditya College of Engineering',
    infoLocation: 'Madanapalle, AP',
    infoPhone: '+91 9391134330',
    infoEmail: 'bomalleenirajeshkumar@gmail.com',
    infoStatus: 'Available for Opportunities',
    // Social links
    socialGithub: 'https://github.com/',
    socialLinkedin: 'https://www.linkedin.com/in/rajesh-kumar-bomalleeni-b03341366',
    socialInstagram: 'https://www.instagram.com/rajesh_33__',
    socialWhatsapp: 'https://wa.me/919391134330',
    socialEmail: 'mailto:bomalleenirajeshkumar@gmail.com',
    // Education
    education: [
      { badge:'2024 – Present', degree:'B.Tech — Electronics & Communication Engineering', school:'Aditya College of Engineering, Madanapalle', detail:'Currently Pursuing · 3rd Year', score:'CGPA: 9.58 / 10', scoreVal:'9.58', scoreMax:'10', certFile:'btech-cert.jpeg', certTitle:"B.Tech — Aditya College of Engineering" },
      { badge:'Completed', degree:'Intermediate (10+2) — MPC', school:'Sri Siddhartha Junior College, Madanapalle', detail:'Board of Intermediate Education, AP', score:'Percentage: 90%', scoreVal:'90', scoreMax:'100', certFile:'inter-cert.jpg.jpeg', certTitle:"Intermediate — Sri Siddhartha Junior College" },
      { badge:'Completed', degree:'Secondary School (SSC / Class X)', school:'Vivekananda Municipal High School, Madanapalle', detail:'Board of Secondary Education, AP', score:'Percentage: 84%', scoreVal:'84', scoreMax:'100', certFile:'ssc-cert.jpg.jpeg', certTitle:"SSC — Vivekananda Municipal High School" }
    ],
    // Skills
    skills_list: [
      { name:'HTML5',         icon:'fab fa-html5',     iconColor:'#e44d26', level:'Markup Language',   proficiency:85, certFile:'html-cert.jpg.jpeg',   status:'Certified'   },
      { name:'CSS3',          icon:'fab fa-css3-alt',  iconColor:'#264de4', level:'Styling & Layout',  proficiency:80, certFile:'css-cert.jpeg',         status:'Certified'   },
      { name:'JavaScript',    icon:'fab fa-js',        iconColor:'#f7df1e', level:'Programming',       proficiency:70, certFile:'js-cert.jpg',           status:'On Progress' },
      { name:'C Programming', icon:'fas fa-memory',    iconColor:'#a9c0d4', level:'Systems Language',  proficiency:75, certFile:'c-cert.jpg.jpeg',       status:'On Progress' },
      { name:'Python',        icon:'fab fa-python',    iconColor:'#3776ab', level:'Programming',       proficiency:72, certFile:'python-cert.jpg.jpeg',  status:'Certified'   }
    ],
    // Soft skills
    softSkills: ['Good Communication','Team Player','Quick Learner','Analytical Thinking','Time Management'],
    // Projects
    projects: [
      { num:'01', icon:'fas fa-globe', title:'Personal Portfolio', desc:'A responsive personal portfolio website showcasing skills, education, and projects with a dark techy theme and smooth animations.', tags:['HTML','CSS','JavaScript'], githubUrl:'#', liveUrl:'#' },
      { num:'02', icon:'fas fa-code', title:'More Coming Soon', desc:'Exciting projects currently under active development. Stay tuned for new web and software applications.', tags:['In Progress'], githubUrl:'', liveUrl:'' }
    ],
    // Internship
    internshipStatus: 'empty', // 'empty' or 'filled'
    internships: [],
    // Participations
    participations: [
      { icon:'fas fa-trophy',      summaryId:'hack-sum', title:'Hackathons & Competitions', detail:'Participated in National-level Department Fest held at MITS deemed to be University',                  summary:'Participated in inter-college hackathon events where teams collaborated to solve real-world problems within time constraints. Demonstrated skills in rapid prototyping, teamwork, and creative problem-solving under pressure.', certFile:'hackathon1.jpeg',    certTitle:'Hackathon Certificate' },
      { icon:'fas fa-laptop-code', summaryId:'work-sum', title:'Workshops & Seminars',      detail:'Participated in Mini Project Expo held at Aditya College of Engineering and Organised by Dept of AI&DS', summary:'Attended hands-on workshops covering web development technologies, including HTML/CSS/JS frameworks. Gained practical exposure to industry tools and best practices through interactive sessions and live coding exercises.',    certFile:'workshop-cert.jpeg', certTitle:'Workshop Certificate'  },
      { icon:'fas fa-university',  summaryId:'acad-sum', title:'Academic Activities',       detail:'Active participant in departmental events at Aditya College',                                           summary:'Actively participated in various departmental and college-level academic events including technical symposiums, paper presentations, and cultural activities at Aditya College of Engineering, Madanapalle.',                  certFile:'academic-cert.jpeg', certTitle:'Academic Certificate'  },
      { icon:'fas fa-medal',       summaryId:'cert-sum', title:'Online Certifications',     detail:'Completed professional online courses and certifications',                                              summary:'Completed various online courses through platforms like Coursera, NPTEL, and similar platforms covering programming languages, web development, and computer science fundamentals.',                                           certFile:'extra-cert.jpeg',    certTitle:'Online Certification'  }
    ],
    // Contact
    contactEmail: 'bomalleenirajeshkumar@gmail.com',
    contactPhone: '+91 9391134330',
    contactLocation: 'Madanapalle, Andhra Pradesh',
    contactCollege: 'Aditya College of Engineering'
  };
}

function loadPortfolioData() {
  try {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? Object.assign({}, getDefaultData(), JSON.parse(saved)) : getDefaultData();
  } catch(e) { return getDefaultData(); }
}
function savePortfolioData(data) { localStorage.setItem('portfolio_data', JSON.stringify(data)); }

// ===== GITHUB GIST =====
function getGHConfig() {
  return { token: localStorage.getItem('gh_token')||'', gistId: localStorage.getItem('gh_gist_id')||'' };
}
async function fetchRemoteData() {
  const { gistId } = getGHConfig();
  if (!gistId) return;
  try {
    const res = await fetch('https://api.github.com/gists/' + gistId, { headers:{'Accept':'application/vnd.github+json'} });
    if (!res.ok) return;
    const gist = await res.json();
    const file = gist.files && (gist.files['portfolio.json'] || Object.values(gist.files)[0]);
    if (!file) return;
    const raw = await fetch(file.raw_url + '?t=' + Date.now());
    if (!raw.ok) return;
    const data = await raw.json();
    if (data && typeof data === 'object') {
      const merged = Object.assign({}, getDefaultData(), data);
      localStorage.setItem('portfolio_data', JSON.stringify(merged));
      applyDataToPage(merged);
    }
  } catch(e) {}
}
async function pushToGist(data) {
  const { token, gistId } = getGHConfig();
  if (!token) return { ok:false, error:'Token is empty. Paste your GitHub token and click Save Settings.' };
  const body = { description:'Portfolio data', public:true, files:{'portfolio.json':{content:JSON.stringify(data,null,2)}} };
  try {
    let res, json;
    if (!gistId) {
      res = await fetch('https://api.github.com/gists', { method:'POST', headers:{'Authorization':'token '+token,'Accept':'application/vnd.github+json','Content-Type':'application/json'}, body:JSON.stringify(body) });
      json = await res.json();
      if (!res.ok) return { ok:false, error:json.message||'Error '+res.status };
      localStorage.setItem('gh_gist_id', json.id);
      return { ok:true, created:true, gistId:json.id };
    } else {
      res = await fetch('https://api.github.com/gists/' + gistId, { method:'PATCH', headers:{'Authorization':'token '+token,'Accept':'application/vnd.github+json','Content-Type':'application/json'}, body:JSON.stringify({files:{'portfolio.json':{content:JSON.stringify(data,null,2)}}}) });
      json = await res.json();
      if (!res.ok) return { ok:false, error:json.message||'Error '+res.status };
      return { ok:true };
    }
  } catch(e) { return { ok:false, error:e.message }; }
}

// ===== APPLY ALL DATA TO PAGE =====
function setText(sel, val) { const el = document.querySelector(sel); if (el && val !== undefined) el.textContent = val; }
function setHTML(sel, val) { const el = document.querySelector(sel); if (el && val !== undefined) el.innerHTML = val; }
function setAttr(sel, attr, val) { const el = document.querySelector(sel); if (el && val !== undefined) el.setAttribute(attr, val); }
function setAll(sel, val) { document.querySelectorAll(sel).forEach(el => { if (val !== undefined) el.textContent = val; }); }

function applyDataToPage(d) {
  // ── HERO ──
  setText('.hero-name', d.heroName ? d.heroName.replace('BOMALLEENI','') + '\n' : undefined);
  // keep the accent span
  const heroNameEl = document.querySelector('.hero-name');
  if (heroNameEl && d.heroName) {
    const parts = d.heroName.split(' ');
    const last = parts.pop();
    heroNameEl.innerHTML = parts.join(' ') + '<br><span class="accent">' + last + '</span>';
  }
  setText('.hero-desc', d.heroDesc);
  setAttr('a[href="resume.pdf.docx"], a[href*="resume"]', 'href', d.resumeFile);

  // Hero stats
  document.querySelectorAll('.stat').forEach(st => {
    const lbl = st.querySelector('.stat-label');
    const num = st.querySelector('.stat-num');
    if (!lbl || !num) return;
    if (lbl.textContent === 'CGPA') { num.dataset.count = d.cgpa; num.textContent = d.cgpa; }
    if (lbl.textContent === 'Skills') { num.dataset.count = d.skills; num.textContent = d.skills + '+'; }
    if (lbl.textContent === 'Year B.Tech' || lbl.textContent.includes('Year')) { num.textContent = d.yearLabel.replace(' B.Tech','').replace(' Year','').replace('rd','').replace('th','').replace('st','') + (d.yearLabel.includes('3')? '3rd' : d.yearLabel.split(' ')[0]); lbl.textContent = 'Year B.Tech'; }
  });

  // ── ABOUT ──
  const aboutPs = document.querySelectorAll('.about-text p');
  if (aboutPs[0] && d.aboutBio1) aboutPs[0].innerHTML = d.aboutBio1.replace('Rajesh Kumar Bomalleeni', '<span class="highlight">Rajesh Kumar Bomalleeni</span>');
  if (aboutPs[1] && d.aboutBio2) aboutPs[1].innerHTML = d.aboutBio2.replace(d.cgpa + ' CGPA', '<span class="highlight">' + d.cgpa + ' CGPA</span>');
  if (aboutPs[2] && d.aboutBio3) aboutPs[2].textContent = d.aboutBio3;

  // ── INFO CARD ──
  const infoRows = document.querySelectorAll('.info-row .info-val');
  const infoKeys = document.querySelectorAll('.info-row .info-key');
  infoRows.forEach((el, i) => {
    const key = infoKeys[i] ? infoKeys[i].textContent.trim() : '';
    if (key === 'Name')     el.textContent = d.infoName;
    if (key === 'Degree')   el.textContent = d.infoDegree;
    if (key === 'CGPA')     el.textContent = d.infoCGPA;
    if (key === 'College')  el.textContent = d.infoCollege;
    if (key === 'Location') el.textContent = d.infoLocation;
    if (key === 'Phone')    el.textContent = d.infoPhone;
    if (key === 'Email')    el.textContent = d.infoEmail;
    if (key === 'Status')   el.textContent = d.infoStatus;
  });

  // ── SOCIAL LINKS ──
  document.querySelectorAll('.soc-btn.github').forEach(el => el.href = d.socialGithub);
  document.querySelectorAll('.soc-btn.linkedin').forEach(el => el.href = d.socialLinkedin);
  document.querySelectorAll('.soc-btn.instagram').forEach(el => el.href = d.socialInstagram);
  document.querySelectorAll('.soc-btn.whatsapp').forEach(el => el.href = d.socialWhatsapp);
  document.querySelectorAll('.soc-btn.email').forEach(el => el.href = d.socialEmail);

  // ── EDUCATION ──
  const timelineItems = document.querySelectorAll('.timeline-item');
  (d.education || []).forEach((edu, i) => {
    const item = timelineItems[i]; if (!item) return;
    const card = item.querySelector('.timeline-card');
    if (card) card.onclick = () => openCert(edu.certFile, edu.certTitle);
    const badgeEl   = item.querySelector('.timeline-badge');
    const degreeEl  = item.querySelector('.timeline-degree');
    const schoolEl  = item.querySelector('.timeline-school');
    const detailEl  = item.querySelector('.timeline-detail');
    const scoreLbl  = item.querySelector('.score-label');
    const scoreFill = item.querySelector('.score-fill');
    if (badgeEl)  badgeEl.textContent  = edu.badge;
    if (degreeEl) degreeEl.textContent = edu.degree;
    if (schoolEl) schoolEl.innerHTML   = '<i class="fas fa-university"></i> ' + edu.school;
    if (detailEl) detailEl.textContent = edu.detail;
    if (scoreLbl) scoreLbl.innerHTML   = edu.score.replace(edu.scoreVal, '<span class="accent">' + edu.scoreVal + (edu.scoreMax==='10'?' / 10':'%') + '</span>');
    if (scoreFill) { const pct = (parseFloat(edu.scoreVal)/parseFloat(edu.scoreMax)*100).toFixed(1)+'%'; scoreFill.dataset.width = pct; scoreFill.style.width = pct; }
  });

  // ── SKILLS ──
  const skillCards = document.querySelectorAll('.skill-card');
  (d.skills_list || []).forEach((sk, i) => {
    const card = skillCards[i]; if (!card) return;
    const nameEl = card.querySelector('.skill-name');
    const iconEl = card.querySelector('.skill-icon i');
    const levelEl = card.querySelector('.skill-level');
    const fill   = card.querySelector('.skill-fill');
    const lbl    = card.querySelector('.skill-cert-label');
    if (nameEl)  nameEl.textContent  = sk.name;
    if (iconEl && sk.icon)  { iconEl.className = sk.icon; iconEl.style.color = sk.iconColor || ''; }
    if (levelEl) levelEl.textContent = sk.level;
    if (fill)    { fill.style.width = sk.proficiency+'%'; fill.dataset.width = sk.proficiency+'%'; }
    if (lbl)     lbl.innerHTML = '<i class="fas fa-award"></i> ' + sk.status;
    card.onclick = sk.certFile ? () => openCert(sk.certFile, sk.name + ' Certificate') : null;
    if (sk.certFile) card.classList.add('clickable'); else card.classList.remove('clickable');
  });

  // Soft skills
  const softWrap = document.querySelector('.soft-tags');
  if (softWrap && d.softSkills) {
    softWrap.innerHTML = (d.softSkills).map(s => '<span class="soft-tag">' + s + '</span>').join('');
  }

  // ── PROJECTS ──
  const projGrid = document.querySelector('.projects-grid');
  if (projGrid && d.projects) {
    projGrid.innerHTML = d.projects.map(p => `
      <div class="project-card${p.tags.includes('In Progress')?'project-wip':''}" data-aos>
        <div class="project-num">${p.num}</div>
        <div class="project-top">
          <div class="project-icon"><i class="${p.icon}"></i></div>
          ${p.githubUrl||p.liveUrl ? `<div class="project-links">${p.githubUrl?`<a href="${p.githubUrl}" title="GitHub"><i class="fab fa-github"></i></a>`:''} ${p.liveUrl?`<a href="${p.liveUrl}" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`:''}</div>` : ''}
        </div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tags">${p.tags.map(t=>`<span class="ptag${t==='In Progress'?' ptag-muted':''}">${t}</span>`).join('')}</div>
      </div>`).join('');
    projGrid.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));
  }

  // ── INTERNSHIP ──
  const internSec = document.querySelector('#internship .container');
  if (internSec) {
    const existing = internSec.querySelector('.internship-empty,.internship-list');
    if (d.internships && d.internships.length > 0) {
      if (existing) existing.remove();
      let html = '<div class="internship-list" data-aos>';
      d.internships.forEach(intern => {
        html += `<div class="timeline-card" style="margin-bottom:20px">
          <div class="timeline-badge">${intern.period}</div>
          <div class="timeline-degree">${intern.role}</div>
          <div class="timeline-school"><i class="fas fa-building"></i> ${intern.company}</div>
          <div class="timeline-detail">${intern.detail}</div>
        </div>`;
      });
      html += '</div>';
      internSec.insertAdjacentHTML('beforeend', html);
    } else {
      if (!internSec.querySelector('.internship-empty')) {
        internSec.insertAdjacentHTML('beforeend', `
          <div class="internship-empty" data-aos>
            <div class="empty-icon"><i class="fas fa-briefcase"></i></div>
            <div class="empty-title">No Internships Yet</div>
            <div class="empty-sub">My future internships and work experience will appear here.</div>
            <div class="empty-badge">// - - Coming Soon - - //</div>
          </div>`);
      }
    }
  }

  // ── PARTICIPATIONS ──
  const partGrid = document.querySelector('.part-grid');
  if (partGrid && d.participations) {
    partGrid.innerHTML = (d.participations).map((p, i) => {
      const sid = p.summaryId || ('part-sum-' + i);
      return `
      <div class="part-card" data-aos>
        <div class="part-top">
          <div class="part-icon-wrap"><i class="${p.icon}"></i></div>
          <div class="part-info">
            <div class="part-title">${p.title}</div>
            <div class="part-detail">${p.detail}</div>
          </div>
        </div>
        <div class="part-actions">
          <button class="part-btn" onclick="toggleSummary('${sid}')"><i class="fas fa-align-left"></i> Summary</button>
          <button class="part-btn cert-btn" onclick="openCert('${p.certFile}','${p.certTitle}')"><i class="fas fa-certificate"></i> Certificate</button>
        </div>
        <div class="part-summary" id="${sid}"><p>${p.summary}</p></div>
      </div>`; }).join('');
    partGrid.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));
  }

  // ── CONTACT ──
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    const lbl = card.querySelector('.contact-label');
    const val = card.querySelector('.contact-val');
    if (!lbl || !val) return;
    if (lbl.textContent === 'Email')    val.textContent = d.contactEmail;
    if (lbl.textContent === 'Phone')    val.textContent = d.contactPhone;
    if (lbl.textContent === 'Location') val.textContent = d.contactLocation;
    if (lbl.textContent === 'College')  val.textContent = d.contactCollege;
  });
}

// ===== ADMIN PANEL CSS =====
function injectAdminCSS() {
  if (document.getElementById('admin-css')) return;
  const s = document.createElement('style');
  s.id = 'admin-css';
  s.textContent = `
    #admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:'Exo 2',sans-serif}
    #admin-panel{background:#0d0d1a;border:1px solid #00d4ff44;border-radius:12px;width:min(94vw,680px);max-height:90vh;overflow-y:auto;padding:24px 28px;color:#cdd6f4;position:relative}
    #admin-panel h2{color:#00d4ff;font-size:1.1rem;margin:0 0 18px;font-family:'Orbitron',sans-serif;letter-spacing:2px}
    .adm-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;border-bottom:1px solid #ffffff11;padding-bottom:12px}
    .adm-tab{padding:6px 14px;border-radius:6px;border:1px solid #ffffff15;background:#ffffff05;color:#888;cursor:pointer;font-size:0.78rem;font-family:inherit;transition:all .2s}
    .adm-tab.active{background:#00d4ff22;color:#00d4ff;border-color:#00d4ff44}
    .adm-pane{display:none}.adm-pane.active{display:block}
    .adm-section-title{color:#00ff88;font-size:0.75rem;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 10px;padding-top:14px;border-top:1px solid #ffffff0a}
    .adm-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap}
    .adm-row label{font-size:0.78rem;color:#888;min-width:110px}
    .adm-row input,.adm-row textarea,.adm-row select{flex:1;background:#0a0a14;border:1px solid #00d4ff22;border-radius:6px;color:#cdd6f4;padding:6px 10px;font-size:0.83rem;font-family:inherit;min-width:0}
    .adm-row input:focus,.adm-row textarea:focus{outline:none;border-color:#00d4ff88}
    .adm-card{background:#ffffff05;border-radius:8px;padding:10px 12px;margin-bottom:10px;border:1px solid #ffffff08}
    .adm-card-title{font-size:0.75rem;color:#607a8f;margin-bottom:8px;font-weight:600}
    .adm-btn{padding:7px 16px;border-radius:6px;border:none;cursor:pointer;font-size:0.8rem;font-family:inherit;font-weight:600;transition:opacity .2s}
    .adm-btn:hover{opacity:.8}
    .adm-btn-blue{background:#00d4ff22;color:#00d4ff;border:1px solid #00d4ff44}
    .adm-btn-green{background:#00ff8822;color:#00ff88;border:1px solid #00ff8844}
    .adm-btn-red{background:#ff4d4d22;color:#ff4d4d;border:1px solid #ff4d4d44}
    .adm-btn-gray{background:#ffffff0a;color:#aaa;border:1px solid #ffffff15}
    .adm-btn-purple{background:#7b61ff22;color:#a895ff;border:1px solid #7b61ff44}
    .adm-close{position:absolute;top:16px;right:18px;background:none;border:none;color:#888;font-size:1.3rem;cursor:pointer}
    .adm-close:hover{color:#ff4d4d}
    .adm-save-bar{display:flex;align-items:center;gap:8px;padding-top:14px;border-top:1px solid #ffffff11;flex-wrap:wrap;position:sticky;bottom:0;background:#0d0d1a;margin-top:10px}
    .adm-msg{font-size:0.78rem;color:#00ff88;opacity:0;transition:opacity .3s}
    #adm-push-status{font-size:0.78rem;font-family:monospace;margin-top:8px;min-height:16px}
    #admin-pw-screen{text-align:center;padding:20px 0}
    #admin-pw-screen h2{margin-bottom:20px}
    #admin-pw-input{display:block;margin:0 auto 12px;width:200px;text-align:center;font-size:1rem;letter-spacing:3px;background:#0a0a14;border:1px solid #00d4ff33;border-radius:6px;color:#cdd6f4;padding:10px}
    #admin-pw-err{color:#ff4d4d;font-size:0.8rem;min-height:16px;margin-bottom:8px}
  `;
  document.head.appendChild(s);
}

// ===== BUILD ADMIN PANEL =====
function buildAdminPanel() {
  const d   = loadPortfolioData();
  const cfg = getGHConfig();

  const eduCards = (d.education||[]).map((e,i) => `
    <div class="adm-card">
      <div class="adm-card-title">Education #${i+1}</div>
      <div class="adm-row"><label>Badge/Year</label><input id="edu-badge-${i}" value="${e.badge}"></div>
      <div class="adm-row"><label>Degree</label><input id="edu-degree-${i}" value="${e.degree}"></div>
      <div class="adm-row"><label>School</label><input id="edu-school-${i}" value="${e.school}"></div>
      <div class="adm-row"><label>Detail</label><input id="edu-detail-${i}" value="${e.detail}"></div>
      <div class="adm-row"><label>Score label</label><input id="edu-score-${i}" value="${e.score}"></div>
      <div class="adm-row"><label>Score value</label><input id="edu-scoreval-${i}" value="${e.scoreVal}" style="width:60px;flex:none"><label style="min-width:40px">/ Max</label><input id="edu-scoremax-${i}" value="${e.scoreMax}" style="width:60px;flex:none"></div>
      <div class="adm-row"><label>Cert file</label><input id="edu-cert-${i}" value="${e.certFile}"></div>
    </div>`).join('');

  const skillCards = (d.skills_list||[]).map((sk,i) => `
    <div class="adm-card">
      <div class="adm-card-title">Skill #${i+1}</div>
      <div class="adm-row"><label>Name</label><input id="sk-name-${i}" value="${sk.name}"></div>
      <div class="adm-row"><label>Level label</label><input id="sk-level-${i}" value="${sk.level}"></div>
      <div class="adm-row"><label>Proficiency %</label><input type="number" id="sk-prof-${i}" value="${sk.proficiency}" min="0" max="100" style="width:70px;flex:none"></div>
      <div class="adm-row"><label>Status</label><input id="sk-status-${i}" value="${sk.status}"></div>
      <div class="adm-row"><label>Cert file</label><input id="sk-cert-${i}" value="${sk.certFile}"></div>
    </div>`).join('');

  const projCards = (d.projects||[]).map((p,i) => `
    <div class="adm-card">
      <div class="adm-card-title">Project #${i+1}</div>
      <div class="adm-row"><label>Title</label><input id="proj-title-${i}" value="${p.title}"></div>
      <div class="adm-row"><label>Description</label><textarea id="proj-desc-${i}" rows="2">${p.desc}</textarea></div>
      <div class="adm-row"><label>Tags (comma)</label><input id="proj-tags-${i}" value="${p.tags.join(',')}"></div>
      <div class="adm-row"><label>GitHub URL</label><input id="proj-gh-${i}" value="${p.githubUrl||''}"></div>
      <div class="adm-row"><label>Live URL</label><input id="proj-live-${i}" value="${p.liveUrl||''}"></div>
    </div>`).join('');

  const internCards = (d.internships||[]).length > 0
    ? (d.internships||[]).map((n,i) => `
      <div class="adm-card">
        <div class="adm-card-title">Internship #${i+1}</div>
        <div class="adm-row"><label>Role</label><input id="int-role-${i}" value="${n.role}"></div>
        <div class="adm-row"><label>Company</label><input id="int-company-${i}" value="${n.company}"></div>
        <div class="adm-row"><label>Period</label><input id="int-period-${i}" value="${n.period}"></div>
        <div class="adm-row"><label>Detail</label><input id="int-detail-${i}" value="${n.detail}"></div>
      </div>`).join('')
    : '<p style="color:#555;font-size:0.8rem">No internships yet. Click + Add Internship to add one.</p>';

  const partCards = (d.participations||[]).map((p,i) => `
    <div class="adm-card">
      <div class="adm-card-title">Event #${i+1}</div>
      <div class="adm-row"><label>Title</label><input id="pt-title-${i}" value="${p.title}"></div>
      <div class="adm-row"><label>Detail</label><input id="pt-detail-${i}" value="${p.detail}"></div>
      <div class="adm-row"><label>Summary</label><textarea id="pt-summary-${i}" rows="2">${p.summary}</textarea></div>
      <div class="adm-row"><label>Cert file</label><input id="pt-cert-${i}" value="${p.certFile}"></div>
      <div class="adm-row"><label>Cert title</label><input id="pt-certtitle-${i}" value="${p.certTitle}"></div>
    </div>`).join('');

  const softVal = (d.softSkills||[]).join(', ');

  return `<div id="admin-panel">
    <button class="adm-close" onclick="closeAdmin()">&#215;</button>
    <h2>&#9889; Portfolio Admin</h2>
    <div class="adm-tabs">
      <button class="adm-tab active" onclick="admTab('hero',this)">Hero</button>
      <button class="adm-tab" onclick="admTab('about',this)">About</button>
      <button class="adm-tab" onclick="admTab('edu',this)">Education</button>
      <button class="adm-tab" onclick="admTab('skills',this)">Skills</button>
      <button class="adm-tab" onclick="admTab('projects',this)">Projects</button>
      <button class="adm-tab" onclick="admTab('internship',this)">Internship</button>
      <button class="adm-tab" onclick="admTab('events',this)">Events</button>
      <button class="adm-tab" onclick="admTab('contact',this)">Contact</button>
      <button class="adm-tab" onclick="admTab('github',this)">&#128279; GitHub</button>
    </div>

    <!-- HERO -->
    <div class="adm-pane active" id="adm-pane-hero">
      <div class="adm-row"><label>Full Name</label><input id="adm-heroname" value="${d.heroName}"></div>
      <div class="adm-row"><label>Description</label><textarea id="adm-herodesc" rows="3">${d.heroDesc}</textarea></div>
      <div class="adm-row"><label>CGPA</label><input id="adm-cgpa" value="${d.cgpa}"></div>
      <div class="adm-row"><label>Skills count</label><input type="number" id="adm-skills" value="${d.skills}" min="1" max="99" style="width:80px;flex:none"></div>
      <div class="adm-row"><label>Year label</label><input id="adm-yearlabel" value="${d.yearLabel}"></div>
      <div class="adm-row"><label>Resume file</label><input id="adm-resume" value="${d.resumeFile}"></div>
    </div>

    <!-- ABOUT -->
    <div class="adm-pane" id="adm-pane-about">
      <div class="adm-section-title">Bio Paragraphs</div>
      <div class="adm-row"><label>Bio 1</label><textarea id="adm-bio1" rows="3">${d.aboutBio1}</textarea></div>
      <div class="adm-row"><label>Bio 2</label><textarea id="adm-bio2" rows="3">${d.aboutBio2}</textarea></div>
      <div class="adm-row"><label>Bio 3</label><textarea id="adm-bio3" rows="3">${d.aboutBio3}</textarea></div>
      <div class="adm-section-title">Info Card</div>
      <div class="adm-row"><label>Name</label><input id="adm-infoname" value="${d.infoName}"></div>
      <div class="adm-row"><label>Degree</label><input id="adm-infodegree" value="${d.infoDegree}"></div>
      <div class="adm-row"><label>CGPA display</label><input id="adm-infocgpa" value="${d.infoCGPA}"></div>
      <div class="adm-row"><label>College</label><input id="adm-infocollege" value="${d.infoCollege}"></div>
      <div class="adm-row"><label>Location</label><input id="adm-infoloc" value="${d.infoLocation}"></div>
      <div class="adm-row"><label>Phone</label><input id="adm-infophone" value="${d.infoPhone}"></div>
      <div class="adm-row"><label>Email</label><input id="adm-infoemail" value="${d.infoEmail}"></div>
      <div class="adm-row"><label>Status</label><input id="adm-infostatus" value="${d.infoStatus}"></div>
      <div class="adm-section-title">Social Links</div>
      <div class="adm-row"><label>GitHub URL</label><input id="adm-soc-gh" value="${d.socialGithub}"></div>
      <div class="adm-row"><label>LinkedIn URL</label><input id="adm-soc-li" value="${d.socialLinkedin}"></div>
      <div class="adm-row"><label>Instagram URL</label><input id="adm-soc-ig" value="${d.socialInstagram}"></div>
      <div class="adm-row"><label>WhatsApp URL</label><input id="adm-soc-wa" value="${d.socialWhatsapp}"></div>
    </div>

    <!-- EDUCATION -->
    <div class="adm-pane" id="adm-pane-edu">
      ${eduCards}
      <button class="adm-btn adm-btn-green" onclick="admAddEdu()" style="margin-top:6px">+ Add Education</button>
    </div>

    <!-- SKILLS -->
    <div class="adm-pane" id="adm-pane-skills">
      ${skillCards}
      <button class="adm-btn adm-btn-green" onclick="admAddSkill()" style="margin-top:6px">+ Add Skill</button>
      <div class="adm-section-title">Soft Skills (comma separated)</div>
      <div class="adm-row"><label>Soft skills</label><input id="adm-soft" value="${softVal}"></div>
    </div>

    <!-- PROJECTS -->
    <div class="adm-pane" id="adm-pane-projects">
      ${projCards}
      <button class="adm-btn adm-btn-green" onclick="admAddProject()" style="margin-top:6px">+ Add Project</button>
    </div>

    <!-- INTERNSHIP -->
    <div class="adm-pane" id="adm-pane-internship">
      ${internCards}
      <button class="adm-btn adm-btn-green" onclick="admAddInternship()" style="margin-top:6px">+ Add Internship</button>
    </div>

    <!-- EVENTS -->
    <div class="adm-pane" id="adm-pane-events">
      ${partCards}
      <button class="adm-btn adm-btn-green" onclick="admAddEvent()" style="margin-top:6px">+ Add Event</button>
    </div>

    <!-- CONTACT -->
    <div class="adm-pane" id="adm-pane-contact">
      <div class="adm-row"><label>Email</label><input id="adm-cemail" value="${d.contactEmail}"></div>
      <div class="adm-row"><label>Phone</label><input id="adm-cphone" value="${d.contactPhone}"></div>
      <div class="adm-row"><label>Location</label><input id="adm-cloc" value="${d.contactLocation}"></div>
      <div class="adm-row"><label>College</label><input id="adm-ccollege" value="${d.contactCollege}"></div>
    </div>

    <!-- GITHUB -->
    <div class="adm-pane" id="adm-pane-github">
      <p style="font-size:0.78rem;color:#555;margin:0 0 14px">Token stored only in your browser. Uses GitHub Gist (no CORS issues). First Push Live auto-creates the Gist.</p>
      <div class="adm-row"><label>GitHub Token</label><input type="password" id="adm-gh-token" value="${cfg.token}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off"></div>
      <div class="adm-row"><label>Gist ID</label><input type="text" id="adm-gh-gist" value="${cfg.gistId}" placeholder="Auto-created on first push"></div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;align-items:center">
        <button class="adm-btn adm-btn-gray" onclick="saveGHSettings()">&#128190; Save Token</button>
        <button class="adm-btn adm-btn-purple" onclick="testGHConnection()">&#128301; Test</button>
        <span id="gh-test-msg" style="font-size:0.78rem;opacity:0;transition:opacity .3s;color:#00ff88"></span>
      </div>
      <p style="font-size:0.72rem;color:#444;margin-top:12px;line-height:1.9">
        <strong style="color:#607a8f">Create token:</strong><br>
        github.com &#8594; Settings &#8594; Developer settings &#8594; Tokens (classic)<br>
        Check only &#9745; <strong style="color:#00ff8899">gist</strong> &#8594; Generate &amp; paste above
      </p>
      <div id="adm-push-status"></div>
    </div>

    <div class="adm-save-bar">
      <button class="adm-btn adm-btn-blue" onclick="saveAdmin()">&#128190; Save &amp; Preview</button>
      <button class="adm-btn adm-btn-green" onclick="pushLive()">&#128640; Push Live</button>
      <button class="adm-btn adm-btn-red"   onclick="resetAdmin()">Reset All</button>
      <span class="adm-msg" id="adm-save-msg">&#10003; Saved!</span>
    </div>
  </div>`;
}

function admTab(name, btn) {
  document.querySelectorAll('.adm-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.adm-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('adm-pane-'+name).classList.add('active');
  btn.classList.add('active');
}

function collectAdminData() {
  const d = loadPortfolioData();
  // Hero
  const hn = document.getElementById('adm-heroname'); if(hn) d.heroName = hn.value;
  const hd = document.getElementById('adm-herodesc'); if(hd) d.heroDesc = hd.value;
  const cg = document.getElementById('adm-cgpa');     if(cg) d.cgpa = cg.value.trim();
  const sk = document.getElementById('adm-skills');   if(sk) d.skills = parseInt(sk.value)||5;
  const yl = document.getElementById('adm-yearlabel');if(yl) d.yearLabel = yl.value;
  const rf = document.getElementById('adm-resume');   if(rf) d.resumeFile = rf.value;
  // About
  const b1=document.getElementById('adm-bio1'); if(b1) d.aboutBio1=b1.value;
  const b2=document.getElementById('adm-bio2'); if(b2) d.aboutBio2=b2.value;
  const b3=document.getElementById('adm-bio3'); if(b3) d.aboutBio3=b3.value;
  const inf=['infoname','infodegree','infocgpa','infocollege','infoloc','infophone','infoemail','infostatus'];
  const dkeys=['infoName','infoDegree','infoCGPA','infoCollege','infoLocation','infoPhone','infoEmail','infoStatus'];
  inf.forEach((id,i)=>{ const el=document.getElementById('adm-'+id); if(el) d[dkeys[i]]=el.value; });
  const soc=['gh','li','ig','wa']; const socKeys=['socialGithub','socialLinkedin','socialInstagram','socialWhatsapp'];
  soc.forEach((id,i)=>{ const el=document.getElementById('adm-soc-'+id); if(el) d[socKeys[i]]=el.value; });
  // Education
  const eduEls = document.querySelectorAll('[id^="edu-badge-"]');
  if (eduEls.length) {
    d.education = Array.from(eduEls).map((_,i)=>({
      badge:     document.getElementById('edu-badge-'+i)?.value||'',
      degree:    document.getElementById('edu-degree-'+i)?.value||'',
      school:    document.getElementById('edu-school-'+i)?.value||'',
      detail:    document.getElementById('edu-detail-'+i)?.value||'',
      score:     document.getElementById('edu-score-'+i)?.value||'',
      scoreVal:  document.getElementById('edu-scoreval-'+i)?.value||'',
      scoreMax:  document.getElementById('edu-scoremax-'+i)?.value||'10',
      certFile:  document.getElementById('edu-cert-'+i)?.value||'',
      certTitle: (document.getElementById('edu-degree-'+i)?.value||'')
    }));
  }
  // Skills
  const skEls = document.querySelectorAll('[id^="sk-name-"]');
  if (skEls.length) {
    d.skills_list = Array.from(skEls).map((_,i)=>({
      name:        document.getElementById('sk-name-'+i)?.value||'',
      icon:        (d.skills_list[i]||{}).icon||'fas fa-code',
      iconColor:   (d.skills_list[i]||{}).iconColor||'#00d4ff',
      level:       document.getElementById('sk-level-'+i)?.value||'',
      proficiency: parseInt(document.getElementById('sk-prof-'+i)?.value)||0,
      status:      document.getElementById('sk-status-'+i)?.value||'',
      certFile:    document.getElementById('sk-cert-'+i)?.value||''
    }));
  }
  const softEl = document.getElementById('adm-soft');
  if (softEl) d.softSkills = softEl.value.split(',').map(s=>s.trim()).filter(Boolean);
  // Projects
  const prEls = document.querySelectorAll('[id^="proj-title-"]');
  if (prEls.length) {
    d.projects = Array.from(prEls).map((_,i)=>({
      num:      (d.projects[i]||{}).num || String(i+1).padStart(2,'0'),
      icon:     (d.projects[i]||{}).icon||'fas fa-code',
      title:    document.getElementById('proj-title-'+i)?.value||'',
      desc:     document.getElementById('proj-desc-'+i)?.value||'',
      tags:     (document.getElementById('proj-tags-'+i)?.value||'').split(',').map(t=>t.trim()).filter(Boolean),
      githubUrl:document.getElementById('proj-gh-'+i)?.value||'',
      liveUrl:  document.getElementById('proj-live-'+i)?.value||''
    }));
  }
  // Internships
  const intEls = document.querySelectorAll('[id^="int-role-"]');
  if (intEls.length) {
    d.internships = Array.from(intEls).map((_,i)=>({
      role:    document.getElementById('int-role-'+i)?.value||'',
      company: document.getElementById('int-company-'+i)?.value||'',
      period:  document.getElementById('int-period-'+i)?.value||'',
      detail:  document.getElementById('int-detail-'+i)?.value||''
    }));
  }
  // Participations
  const ptEls = document.querySelectorAll('[id^="pt-title-"]');
  if (ptEls.length) {
    d.participations = Array.from(ptEls).map((_,i)=>({
      icon:      (d.participations[i]||{}).icon||'fas fa-star',
      summaryId: (d.participations[i]||{}).summaryId||('part-sum-'+i),
      title:     document.getElementById('pt-title-'+i)?.value||'',
      detail:    document.getElementById('pt-detail-'+i)?.value||'',
      summary:   document.getElementById('pt-summary-'+i)?.value||'',
      certFile:  document.getElementById('pt-cert-'+i)?.value||'',
      certTitle: document.getElementById('pt-certtitle-'+i)?.value||''
    }));
  }
  // Contact
  const ce=document.getElementById('adm-cemail');   if(ce) d.contactEmail    = ce.value;
  const cp=document.getElementById('adm-cphone');   if(cp) d.contactPhone    = cp.value;
  const cl=document.getElementById('adm-cloc');     if(cl) d.contactLocation = cl.value;
  const cc=document.getElementById('adm-ccollege'); if(cc) d.contactCollege  = cc.value;
  return d;
}

function saveAdmin() {
  const data = collectAdminData();
  savePortfolioData(data);
  applyDataToPage(data);
  const msg = document.getElementById('adm-save-msg');
  if (msg) { msg.style.opacity='1'; setTimeout(()=>msg.style.opacity='0',2500); }
}

function saveGHSettings() {
  const t = document.getElementById('adm-gh-token')?.value.trim();
  const g = document.getElementById('adm-gh-gist')?.value.trim();
  if (t) localStorage.setItem('gh_token', t);
  if (g) localStorage.setItem('gh_gist_id', g);
  const m = document.getElementById('gh-test-msg');
  if (m) { m.style.color='#00ff88'; m.textContent='\u2713 Saved!'; m.style.opacity='1'; setTimeout(()=>m.style.opacity='0',2000); }
}

async function testGHConnection() {
  saveGHSettings();
  const m = document.getElementById('gh-test-msg');
  const { token } = getGHConfig();
  if (!token) { if(m){m.style.color='#ff6b6b';m.textContent='\u2717 Paste token first';m.style.opacity='1';setTimeout(()=>m.style.opacity='0',3000);} return; }
  if (m) { m.style.color='#607a8f'; m.textContent='Testing...'; m.style.opacity='1'; }
  try {
    const res = await fetch('https://api.github.com/user', { headers:{'Authorization':'token '+token,'Accept':'application/vnd.github+json'} });
    if (res.ok) { const u=await res.json(); if(m){m.style.color='#00ff88';m.textContent='\u2713 Connected as '+u.login+'!';setTimeout(()=>m.style.opacity='0',3000);} }
    else { const e=await res.json().catch(()=>({})); if(m){m.style.color='#ff6b6b';m.textContent='\u2717 '+(e.message||'Invalid token');setTimeout(()=>m.style.opacity='0',4000);} }
  } catch(e) { if(m){m.style.color='#ff6b6b';m.textContent='\u2717 '+e.message;setTimeout(()=>m.style.opacity='0',4000);} }
}

async function pushLive() {
  saveAdmin();
  saveGHSettings();
  const status = document.getElementById('adm-push-status');
  if (!status) { admTab('github', document.querySelector('.adm-tab:last-child')); return; }
  const { token } = getGHConfig();
  if (!token) { status.style.color='#ff6b6b'; status.textContent='\u2717 Token empty \u2014 go to GitHub tab and paste your token.'; return; }
  status.style.color='#607a8f'; status.textContent='\u25e2 Pushing to GitHub Gist...';
  const result = await pushToGist(loadPortfolioData());
  if (result.ok) {
    if (result.created) { const gi=document.getElementById('adm-gh-gist'); if(gi)gi.value=result.gistId; }
    status.style.color='#00ff88'; status.textContent='\u2713 Live! Everyone sees your updated portfolio now.';
    setTimeout(()=>{ status.textContent=''; },7000);
  } else { status.style.color='#ff6b6b'; status.textContent='\u2717 '+result.error; }
}

function resetAdmin() { if(confirm('Reset ALL portfolio data to defaults?')){ localStorage.removeItem('portfolio_data'); closeAdmin(); setTimeout(openAdmin,200); } }

function admAddEdu() {
  const d=loadPortfolioData(); d.education.push({badge:'Year',degree:'Degree Name',school:'School Name',detail:'Detail',score:'Score: 0',scoreVal:'0',scoreMax:'100',certFile:'cert.jpg',certTitle:'Certificate'});
  savePortfolioData(d); closeAdmin(); setTimeout(()=>{openAdmin();admTab('edu',document.querySelectorAll('.adm-tab')[2]);},150);
}
function admAddSkill() {
  const d=loadPortfolioData(); d.skills_list.push({name:'New Skill',icon:'fas fa-code',iconColor:'#00d4ff',level:'Programming',proficiency:70,certFile:'cert.jpg',status:'Certified'});
  savePortfolioData(d); closeAdmin(); setTimeout(()=>{openAdmin();admTab('skills',document.querySelectorAll('.adm-tab')[3]);},150);
}
function admAddProject() {
  const d=loadPortfolioData(); const n=d.projects.length+1; d.projects.push({num:String(n).padStart(2,'0'),icon:'fas fa-code',title:'New Project',desc:'Project description.',tags:['HTML','CSS'],githubUrl:'#',liveUrl:'#'});
  savePortfolioData(d); closeAdmin(); setTimeout(()=>{openAdmin();admTab('projects',document.querySelectorAll('.adm-tab')[4]);},150);
}
function admAddInternship() {
  const d=loadPortfolioData(); d.internships=d.internships||[]; d.internships.push({role:'Role / Position',company:'Company Name',period:'Month Year – Month Year',detail:'Description of work done.'});
  savePortfolioData(d); closeAdmin(); setTimeout(()=>{openAdmin();admTab('internship',document.querySelectorAll('.adm-tab')[5]);},150);
}
function admAddEvent() {
  const d=loadPortfolioData(); d.participations.push({icon:'fas fa-star',summaryId:'part-sum-'+Date.now(),title:'New Event',detail:'Event detail',summary:'Event summary.',certFile:'cert.jpeg',certTitle:'Certificate'});
  savePortfolioData(d); closeAdmin(); setTimeout(()=>{openAdmin();admTab('events',document.querySelectorAll('.adm-tab')[6]);},150);
}

let adminUnlocked = false;
function openAdmin() {
  injectAdminCSS();
  const overlay = document.createElement('div');
  overlay.id = 'admin-overlay';
  if (!adminUnlocked) {
    overlay.innerHTML = `<div id="admin-panel"><button class="adm-close" onclick="closeAdmin()">&#215;</button><div id="admin-pw-screen"><h2>&#9889; Admin Access</h2><input id="admin-pw-input" type="password" placeholder="Password" autocomplete="off"><div id="admin-pw-err"></div><button class="adm-btn adm-btn-blue" onclick="checkAdminPw()">Unlock</button></div></div>`;
    document.body.appendChild(overlay);
    document.getElementById('admin-pw-input').focus();
    document.getElementById('admin-pw-input').addEventListener('keydown',e=>{if(e.key==='Enter')checkAdminPw();});
  } else {
    overlay.innerHTML = buildAdminPanel();
    document.body.appendChild(overlay);
  }
}
function checkAdminPw() {
  if (document.getElementById('admin-pw-input').value === ADMIN_PASSWORD) {
    adminUnlocked = true; closeAdmin(); setTimeout(openAdmin,100);
  } else { document.getElementById('admin-pw-err').textContent='Incorrect password.'; document.getElementById('admin-pw-input').value=''; document.getElementById('admin-pw-input').focus(); }
}
function closeAdmin() { const el=document.getElementById('admin-overlay'); if(el)el.remove(); }

document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.key==='A'){e.preventDefault();document.getElementById('admin-overlay')?closeAdmin():openAdmin();} });
if(new URLSearchParams(window.location.search).get('admin')==='true') window.addEventListener('load',openAdmin);

window.addEventListener('load',()=>{
  const saved=localStorage.getItem('portfolio_data');
  if(saved){try{applyDataToPage(JSON.parse(saved));}catch(e){}}
  fetchRemoteData();
});
