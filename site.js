function setThumb(img, src) { const m = /^assets\/posts\/(.+)\.webp$/.exec(src); if (!m) { img.removeAttribute('srcset'); img.src = src; return; } const b = 'assets/posts/thumb/' + m[1]; img.srcset = b + '-480.webp 480w, ' + b + '-800.webp 800w'; img.src = b + '-480.webp'; }
'use strict';
const stages = {
  infantil: {
    eyebrow: 'Educação Infantil / Mundinho Ação', title: 'O mundo começa\ncom uma descoberta.',
    description: 'Brincadeiras com propósito, experiências sensoriais e espaço para reconhecer emoções. No Mundinho Ação, o cotidiano da infância ganha oportunidades de aprender e se expressar.',
    features: ['BrincAção e desenvolvimento motor, criativo e socioemocional.', 'Roda das Emoções: reconhecer e colocar em palavras o que se sente.', 'Blocos, faz de conta e parede sensorial em atividades pedagógicas.'],
    photo: 'assets/posts/Dc1fgXICT9l-7.webp', alt: 'Crianças em uma atividade com blocos no Mundinho Ação', caption: 'Mundinho Ação · Unidade II',
    contact: 'https://wa.me/558420208901', contactLabel: 'Converse com o Mundinho', source: 'https://www.instagram.com/p/DXpAazfjpov/'
  },
  fundamental1: {
    eyebrow: 'Ensino Fundamental I / 1º ao 5º ano', title: 'Conhecer o mundo.\nConstruir autonomia.',
    description: 'Os anos iniciais conectam o aprendizado à vida cotidiana. A escola destaca acompanhamento próximo, autonomia e pensamento crítico nessa etapa.',
    features: ['Anos iniciais do 1º ao 5º ano.', 'Simulado Ação como parte da rotina de estudos.', 'Projetos de cidadania, como a educação para o trânsito.'],
    photo: 'assets/posts/Dcg07zmidqO-7.webp', alt: 'Sala de aula apresentada pelos alunos na Unidade I', caption: 'Colégio Ação · Unidade I',
    contact: 'https://wa.me/558432178902', contactLabel: 'Converse com o Colégio', source: 'https://www.instagram.com/p/DUbdz5mCfop/'
  },
  fundamental2: {
    eyebrow: 'Ensino Fundamental II / 6º ao 9º ano', title: 'Novas perguntas.\nNovos caminhos.',
    description: 'Uma fase para ampliar conhecimentos, participar de projetos e desenvolver a própria voz. A pesquisa, o diálogo e a convivência aparecem nas experiências dos anos finais.',
    features: ['Projeto do 8º ano “Derrubando muros, construindo pontes”, dedicado ao diálogo.', 'Leitura, debate, pesquisa e produção de textos e imagens.', 'Participação no Simulado Ação, do Fundamental ao Médio.'],
    photo: 'assets/posts/DYAyajiJlDT-1.webp', alt: 'Registro do projeto de diálogo realizado pelo 8º ano', caption: 'Pesquisa, expressão e convivência',
    contact: 'https://wa.me/558432178902', contactLabel: 'Converse com o Colégio', source: 'https://www.instagram.com/p/DYAyajiJlDT/'
  },
  medio: {
    eyebrow: 'Ensino Médio / Colégio Ação', title: 'Escolhas que abrem\npossibilidades.',
    description: 'Experiências de investigação científica, preparação para o ENEM e conversas sobre profissões ajudam a conectar os estudos aos próximos passos.',
    features: ['Práticas de microbiologia com a 2ª série.', 'Aulões de análise linguística, literatura e redação.', 'Rodas de conversa sobre carreiras com a 2ª e a 3ª séries.'],
    photo: 'assets/posts/DICYF0Pydmi-1.webp', alt: 'Atividade de microbiologia com alunos da 2ª série', caption: 'Ciência na prática · Ensino Médio',
    contact: 'https://wa.me/558432178902', contactLabel: 'Converse com o Colégio', source: 'https://www.instagram.com/p/Ddq-FRkuZmB/'
  }
};
const spaces = {
  colegio: { photo: 'assets/posts/Dcg07zmidqO-2.webp', alt: 'Fachada da Unidade I do Colégio Ação', label: 'UNIDADE I · NEÓPOLIS', title: 'Colégio Ação', source: 'https://www.instagram.com/p/Dcg07zmidqO/' },
  biblioteca: { photo: 'assets/posts/Dcg07zmidqO-5.webp', alt: 'Biblioteca do Colégio Ação, com estantes e livros', label: 'UNIDADE I · LEITURA E PESQUISA', title: 'Biblioteca', source: 'https://www.instagram.com/p/Dcg07zmidqO/' },
  laboratorio: { photo: 'assets/posts/Dcg07zmidqO-6.webp', alt: 'Laboratório do Colégio Ação, com bancadas e modelo anatômico', label: 'UNIDADE I · INVESTIGAÇÃO CIENTÍFICA', title: 'Laboratório', source: 'https://www.instagram.com/p/Dcg07zmidqO/' },
  quadra: { photo: 'assets/posts/Dcg07zmidqO-4.webp', alt: 'Quadra coberta do Colégio Ação, com traves, cestas e marcações esportivas', label: 'UNIDADE I · ESPORTE E MOVIMENTO', title: 'Quadra poliesportiva', source: 'https://www.instagram.com/p/Dcg07zmidqO/' },
  mundinho: { photo: 'assets/posts/Dc1fgXICT9l-2.webp', alt: 'Pátio com brinquedos e mural colorido no Mundinho Ação', label: 'UNIDADE II · EDUCAÇÃO INFANTIL', title: 'Mundinho Ação', source: 'https://www.instagram.com/p/Dc1fgXICT9l/' }
};
function multiline(element, text) {
  element.replaceChildren();
  text.split('\n').forEach((line, index) => {
    if (index) element.append(document.createElement('br'));
    element.append(document.createTextNode(line));
  });
}
function activateStage(button) {
  const stage = stages[button.dataset.stage];
  document.querySelectorAll('[data-stage]').forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.getElementById('etapa-conteudo').setAttribute('aria-labelledby', button.id);
  document.getElementById('stage-eyebrow').textContent = stage.eyebrow;
  multiline(document.getElementById('stage-title'), stage.title);
  document.getElementById('stage-description').textContent = stage.description;
  const list = document.getElementById('stage-features'); list.replaceChildren();
  stage.features.forEach(text => { const item = document.createElement('li'); item.textContent = text; list.append(item); });
  const photo = document.getElementById('stage-photo'); setThumb(photo, stage.photo); photo.alt = stage.alt;
  document.getElementById('stage-photo-caption').textContent = stage.caption;
  const contact = document.getElementById('stage-contact'); contact.href = stage.contact; contact.textContent = stage.contactLabel;
  document.getElementById('stage-source').href = stage.source;
}
function activateSpace(button) {
  const space = spaces[button.dataset.space];
  document.querySelectorAll('[data-space]').forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.getElementById('space-panel').setAttribute('aria-labelledby', button.id);
  const photo = document.getElementById('space-photo'); setThumb(photo, space.photo); photo.alt = space.alt;
  document.getElementById('space-label').textContent = space.label;
  document.getElementById('space-title').textContent = space.title;
  document.getElementById('space-source').href = space.source;
}
function setupTabs(selector, activate, vertical = false) {
  const tabs = [...document.querySelectorAll(selector)];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); activate(tabs[next]); tabs[next].focus();
    });
  });
}
setupTabs('[data-stage]', activateStage);
setupTabs('[data-space]', activateSpace, true);
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('navegacao');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const dialog = document.getElementById('video-dialog');
const video = dialog.querySelector('video');
const videoButton = document.querySelector('[data-video]');
videoButton.addEventListener('click', () => { video.src = videoButton.dataset.video; dialog.showModal(); video.play().catch(() => {}); });
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { video.pause(); video.removeAttribute('src'); video.load(); videoButton.focus(); });
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: .08 });
  document.querySelectorAll('.intro-grid, .section-head, .experience-card, .team-layout, .archive-banner, .contact-card, .map-layout, .facts-grid > div').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}
const units = {
  colegio: { title: 'Colégio Ação', query: 'Rua Inconfidentes 4710 Neópolis Natal RN' },
  mundinho: { title: 'Mundinho Ação', query: 'Rua Itapecerica 2960 Neópolis Natal RN' }
};
function activateUnit(button) {
  const unit = units[button.dataset.map];
  document.querySelectorAll('[data-map]').forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.getElementById('map-panel').setAttribute('aria-labelledby', button.id);
  const query = encodeURIComponent(unit.query);
  const frame = document.getElementById('map-iframe');
  frame.title = 'Mapa do Google com a localização do ' + unit.title;
  frame.src = 'https://maps.google.com/maps?q=' + query + '&hl=pt-BR&z=16&output=embed';
  document.getElementById('map-route').href = 'https://www.google.com/maps/dir/?api=1&destination=' + query;
}
setupTabs('[data-map]', activateUnit, true);
document.querySelectorAll('[data-goto-map]').forEach(link => link.addEventListener('click', () => activateUnit(document.querySelector('[data-map="' + link.dataset.gotoMap + '"]'))));
const header = document.querySelector('.header');
const syncHeader = () => header.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', syncHeader, { passive: true }); syncHeader();
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5, y = (event.clientY - box.top) / box.height - .5;
      card.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg'); card.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => { card.style.removeProperty('--ry'); card.style.removeProperty('--rx'); });
  });
}

// Um aviso por sessão, com dispensa persistida quando o visitante fecha ou clica.
const enrollmentNotice = document.getElementById('enrollment-notice');
if (enrollmentNotice) {
  const dismissalKey = 'acao-enrollment-dismissed';
  let dismissed = false;
  try { dismissed = sessionStorage.getItem(dismissalKey) === 'true'; } catch {}
  if (!dismissed) {
    window.setTimeout(() => { enrollmentNotice.hidden = false; }, 6500);
  }
  const dismissEnrollment = () => {
    if (enrollmentNotice.contains(document.activeElement)) {
      document.querySelector('.hero-actions a').focus({ preventScroll: true });
    }
    enrollmentNotice.hidden = true;
    try { sessionStorage.setItem(dismissalKey, 'true'); } catch {}
  };
  enrollmentNotice.querySelector('button').addEventListener('click', dismissEnrollment);
  enrollmentNotice.querySelector('a').addEventListener('click', dismissEnrollment);
  enrollmentNotice.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.stopPropagation(); dismissEnrollment(); }
  });
}
