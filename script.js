// Theme handling, particles, UI interactions, counters, skills, testimonials, FAQ, contact actions
(function(){
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Theme: default dark
  const saved = localStorage.getItem('theme');
  if(saved) html.setAttribute('data-theme', saved);
  else html.setAttribute('data-theme','dark');

  function setTheme(t){
    html.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    themeToggle.setAttribute('aria-pressed', t==='light');
  }
  themeToggle.addEventListener('click', ()=> setTheme(html.getAttribute('data-theme')==='dark'? 'light' : 'dark'));

  // Mobile menu
  hamburger.addEventListener('click', ()=>{
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    navLinks.style.display = open ? 'none' : 'flex';
  });

  // Smooth scrolling and active nav
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const el = document.querySelector(href);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  // IntersectionObserver for section highlighting
  const navItems = document.querySelectorAll('.nav-item');
  const sections = Array.from(navItems).map(i => document.querySelector(i.getAttribute('href')) ).filter(Boolean);
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id = '#'+entry.target.id;
      const link = document.querySelector('.nav-item[href="'+id+'"]');
      if(link) link.classList.toggle('active', entry.isIntersecting);
    });
  },{threshold:0.45});
  sections.forEach(s=>obs.observe(s));

  // Particles (lightweight)
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
  const particles=[]; const PCOUNT=60;
  function rand(a,b){return Math.random()*(b-a)+a}
  function create(){for(let i=0;i<PCOUNT;i++){particles.push({x:rand(0,w),y:rand(0,h),r:rand(0.6,2.4),vx:rand(-0.2,0.2),vy:rand(-0.2,0.2),alpha:rand(0.06,0.35)})}}
  function onResize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight}
  addEventListener('resize', onResize);
  create();
  function loop(){ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.fillStyle='rgba(96,165,250,'+p.alpha+')'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();}); requestAnimationFrame(loop)}
  loop();

  // Parallax blobs follow mouse a bit
  document.addEventListener('mousemove', e=>{
    const bx = (e.clientX/window.innerWidth - .5) * 40;
    const by = (e.clientY/window.innerHeight - .5) * 40;
    document.querySelectorAll('.blob').forEach((b,i)=>{ b.style.transform = `translate(${bx*(i+1)/6}px, ${by*(i+1)/6}px)` })
  });

  // Counters
  const statEls = document.querySelectorAll('.stat');
  const statObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ const el = entry.target; const target = +el.dataset.target; const span = el.querySelector('.stat-value'); let v=0; const step = Math.max(1, Math.floor(target/60)); const iv = setInterval(()=>{ v+=step; if(v>=target){ v=target; clearInterval(iv)} span.textContent = v + (target>=10?'+':''); },18); statObs.unobserve(el); }
    });
  },{threshold:0.6}); statEls.forEach(s=>statObs.observe(s));

  // Skills progress on reveal
  const skillEls = document.querySelectorAll('.skill');
  const skillObs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ const p = entry.target.querySelector('.progress span'); const val = entry.target.querySelector('.progress').dataset.value; p.style.width = val + '%'; skillObs.unobserve(entry.target); }
    });
  },{threshold:0.35}); skillEls.forEach(s=>skillObs.observe(s));

  // Testimonials slider simple auto-scroll
  const slider = document.querySelector('.testimonials-slider');
  if(slider){ let idx=0; setInterval(()=>{ idx=(idx+1)%slider.children.length; slider.style.transform = `translateX(-${idx*(320)}px)`; slider.style.transition='transform .6s cubic-bezier(.2,.9,.3,1)'; },4200)}

  // Accordion keyboard accessible
  document.querySelectorAll('.accordion-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> toggleAccordion(btn));
    btn.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleAccordion(btn); } });
  });
  function toggleAccordion(btn){ const expanded = btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded', String(!expanded)); const panel = btn.nextElementSibling; if(!expanded){ panel.style.maxHeight = panel.scrollHeight+'px' } else { panel.style.maxHeight = 0 }}

  // Contact interactions
  const copyBtn = document.getElementById('copyEmail');
  const toast = document.getElementById('toast');
  copyBtn.addEventListener('click', async ()=>{
    const email = document.getElementById('contactEmail').textContent.trim();
    try{ await navigator.clipboard.writeText(email); showToast('Email copied to clipboard') }catch(e){ showToast('Unable to copy — ' + email) }
  });

  const quotes = [
    "Ship often, learn quickly.",
    "Build small ideas into big things.",
    "Automate what you understand.",
    "Iterate, measure, improve.",
    "Curiosity beats comfort.",
  ];
  document.getElementById('motivateBtn').addEventListener('click', ()=>{
    const q = quotes[Math.floor(Math.random()*quotes.length)]; showToast(q);
  });

  function showToast(msg, timeout=2400){ toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), timeout) }

  // Back to top
  const backTop = document.getElementById('backTop'); backTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // Set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Magnetic button effect
  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const rect = btn.getBoundingClientRect(); const x = e.clientX - rect.left - rect.width/2; const y = e.clientY - rect.top - rect.height/2; btn.style.transform = `translate(${x*0.08}px, ${y*0.08}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', ()=> btn.style.transform = '');
  });

  // Simple reveal on scroll for fade-up
  const reveal = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; reveal.unobserve(e.target) } }); },{threshold:0.2});
  document.querySelectorAll('section, .glass, .project-card').forEach(el=>{ el.style.opacity=0; el.style.transform='translateY(18px)'; reveal.observe(el); });

})();
