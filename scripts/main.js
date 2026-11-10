const COLORS = ['AZ', 'FO', 'RA', 'CA', 'LI', 'FM', 'TE', 'PU'];
const fl = (c, s) => `<svg width="${s}" height="${s}" style="color:var(--${c})"><use href="#f"/></svg>`;
// HERO
const hero = document.getElementById('hero'),
  row = document.getElementById('flRow'),
  box = document.getElementById('logoBox');
row.innerHTML = COLORS.map((c, i) => `<svg width="28" height="28" style="color:var(--${c});animation-delay:${1 + i * .12}s,${1.6 + i * .12}s"><use href="#f"/></svg>`).join('');
for (let i = 0; i < 7; i++) {
  const p = document.createElement('span');
  p.className = 'petal';
  p.style.left = 5 + i * 14 + '%';
  p.style.top = Math.random() * 30 + '%';
  p.style.animationDelay = 1 + i * .8 + 's';
  box.appendChild(p);
}
requestAnimationFrame(() => hero.classList.add('play'));
// HOW
const steps = [...document.querySelectorAll('.step')],
  scenes = [...document.querySelectorAll('.scene')];
let cur = 0,
  tt = [];
const later = (ms, f) => tt.push(setTimeout(f, ms));
function restart(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = '';
}
function press(id) {
  const b = document.getElementById(id);
  b.classList.add('pressed');
  setTimeout(() => b.classList.remove('pressed'), 180);
}
const H = [8, 12, 16, 10, 18, 22, 14, 20, 24, 12, 8, 10, 8, 10, 8, 10];
document.getElementById('wave').innerHTML = H.map((height, i) => '<i style="height:' + height + 'px;animation-delay:' + i % 5 * .08 + 's"></i>').join('');
const setup = [() => {
  const tm = document.getElementById('tm'),
    bars = [...document.querySelectorAll('#wave i')];
  bars.forEach(b => b.classList.remove('on'));
  for (let s = 0; s <= 13; s++) later(s * 380, () => {
    tm.textContent = '0 : ' + String(s).padStart(2, '0') + ' / 1 : 00';
    bars.forEach((b, k) => b.classList.toggle('on', k < Math.round(s * bars.length / 16)));
  });
}, () => {
  const o = document.getElementById('lockOpen');
  o.style.transition = 'none';
  o.style.opacity = 0;
  later(1700, () => press('addBtn'));
  later(2200, () => {
    o.style.transition = 'opacity .5s';
    o.style.opacity = 1;
  });
}, () => {}, () => {}, () => {}];
function go(i) {
  cur = i;
  tt.forEach(clearTimeout);
  tt = [];
  steps.forEach((s, k) => s.classList.toggle('on', k === i));
  scenes.forEach((s, k) => {
    s.classList.toggle('on', k === i);
    if (k === i) s.querySelectorAll('*').forEach(restart);
  });
  const progress = steps[i].querySelector('.bar i');
  restart(progress);
  if (progress && typeof howDur !== 'undefined') progress.style.animationDuration = howDur[i] / 1000 + 's';
  setup[i]();
}
const howDur = [6500, 6500, 6500, 6500, 7500];
let autoHow,
  howSeen = false;
function startHowAuto() {
  clearTimeout(autoHow);
  autoHow = setTimeout(function tick() {
    go((cur + 1) % steps.length);
    autoHow = setTimeout(tick, howDur[cur]);
  }, howDur[Math.max(cur, 0)] || howDur[0]);
}
steps.forEach((s, k) => s.onclick = () => {
  go(k);
  startHowAuto();
});
cur = -1;
go(0);
new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    if (!howSeen) {
      howSeen = true;
      go(0);
    }
    startHowAuto();
  } else {
    clearTimeout(autoHow);
  }
}), {
  threshold: .45
}).observe(document.querySelector('.phone'));
// 섹션 등장 + 오른쪽 점 내비
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('in');
}), {
  threshold: .25
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
const secs = [['hero', '처음'], ['why', '여행 다녀온 뒤'], ['how', '이렇게 써요'], ['features', '기능'], ['start', '시작하기']];
const dots = document.getElementById('dots');
dots.innerHTML = secs.map(([id, l]) => `<a href="#${id}" aria-label="${l}"></a>`).join('');
const dio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    const k = secs.findIndex(s => s[0] === e.target.id);
    [...dots.children].forEach((d, n) => d.classList.toggle('on', n === k));
  }
}), {
  rootMargin: '-50% 0px -50% 0px'
});
secs.forEach(([id]) => {
  const el = document.getElementById(id);
  el && dio.observe(el);
});
// 기능 소개: 템플릿 고르기 (누를 때만), 별점은 한 번만
document.querySelectorAll('.ppl svg').forEach((s, i) => s.style.animationDelay = .2 + i * .08 + 's');
const tplPrev = document.getElementById('tplPrev');
const tplCard = document.querySelector('.tpl-c');
const tplStrip = tplCard.querySelector('.tpls');
const tplBtns = [...tplStrip.querySelectorAll('.tpl')];
const tplTrack = document.createElement('div');
tplTrack.className = 'tpl-slide-track';
tplBtns.forEach((b, i) => {
  const panel = document.createElement('div');
  panel.className = 'tpl-slide';
  panel.style.backgroundImage = b.style.backgroundImage;
  panel.setAttribute('aria-hidden', 'true');
  tplTrack.appendChild(panel);
  b.setAttribute('aria-label', b.dataset.n + ' 템플릿 보기');
});
const tplFirst = tplTrack.firstElementChild.cloneNode(true);
const tplLast = tplTrack.lastElementChild.cloneNode(true);
tplTrack.prepend(tplLast);
tplTrack.appendChild(tplFirst);
tplTrack.style.transition = 'none';
tplTrack.style.transform = 'translate3d(-100%,0,0)';
tplPrev.prepend(tplTrack);
tplPrev.style.backgroundImage = 'none';
const tplName = document.getElementById('tplName');
const tplPlan = document.getElementById('tplPlan');
const makeTplArrow = (label, cls) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tpl-arrow ' + cls;
  button.setAttribute('aria-label', label);
  const path = cls === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6';
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  tplPrev.appendChild(button);
  return button;
};
const tplBack = makeTplArrow('이전 템플릿', 'left');
const tplNext = makeTplArrow('다음 템플릿', 'right');
let tplActive = 0,
  tplVisible = false,
  tplTimer = null,
  tplManualUntil = 0,
  tplWrapTimer = null;
const tplReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
function showTpl(next, manual = false) {
  const count = tplBtns.length;
  const old = tplActive;
  tplActive = (next + count) % count;
  clearTimeout(tplWrapTimer);
  const wrapNext = old === count - 1 && next === count;
  const wrapPrev = old === 0 && next === -1;
  const panelIndex = wrapNext ? count + 1 : wrapPrev ? 0 : tplActive + 1;
  tplTrack.style.transform = `translate3d(-${panelIndex * 100}%,0,0)`;
  if (wrapNext || wrapPrev) {
    tplWrapTimer = setTimeout(() => {
      tplTrack.style.transition = 'none';
      tplTrack.style.transform = `translate3d(-${(tplActive + 1) * 100}%,0,0)`;
      void tplTrack.offsetWidth;
      tplTrack.style.transition = '';
    }, 720);
  }
  tplBtns.forEach((b, i) => {
    b.classList.toggle('on', i === tplActive);
    b.setAttribute('aria-pressed', String(i === tplActive));
  });
  tplName.textContent = tplBtns[tplActive].dataset.n;
  tplPlan.textContent = tplBtns[tplActive].dataset.p;
  if (manual) {
    tplManualUntil = Date.now() + 5500;
  }
  // 작은 화면에서 현재 템플릿도 함께 보이도록 썸네일을 가로 스크롤
  const b = tplBtns[tplActive],
    stripRect = tplStrip.getBoundingClientRect(),
    rect = b.getBoundingClientRect();
  const target = tplStrip.scrollLeft + (rect.left - stripRect.left) - (tplStrip.clientWidth - b.offsetWidth) / 2;
  tplStrip.scrollTo({
    left: Math.max(0, target),
    behavior: manual ? 'smooth' : 'auto'
  });
}
function scheduleTpl() {
  clearTimeout(tplTimer);
  if (!tplVisible || document.hidden || tplReduced.matches) return;
  tplTimer = setTimeout(() => {
    if (Date.now() < tplManualUntil) {
      scheduleTpl();
      return;
    }
    showTpl(tplActive + 1);
    scheduleTpl();
  }, 3500);
}
tplBtns.forEach((b, i) => b.addEventListener('click', () => {
  showTpl(i, true);
  scheduleTpl();
}));
tplBack.addEventListener('click', () => {
  showTpl(tplActive - 1, true);
  scheduleTpl();
});
tplNext.addEventListener('click', () => {
  showTpl(tplActive + 1, true);
  scheduleTpl();
});
tplCard.addEventListener('mouseleave', scheduleTpl);
document.addEventListener('visibilitychange', scheduleTpl);
const tplObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    tplVisible = e.isIntersecting;
    if (tplVisible) scheduleTpl();else clearTimeout(tplTimer);
  });
}, {
  threshold: .2
});
tplObserver.observe(tplCard);
showTpl(0);
requestAnimationFrame(() => {
  tplTrack.style.transition = '';
});
document.querySelectorAll('#dots5 button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#dots5 button').forEach(x => {
    x.classList.toggle('on', x === b);
    x.setAttribute('aria-pressed', String(x === b));
  });
  const v = +b.dataset.v;
  document.getElementById('rateMsg').innerHTML = v <= 2 ? '다르게 느껴졌군요 · <b>다시 엮기</b>로 고칠 수 있어요' : v === 3 ? '고마워요, 반영할게요' : '다행이에요! 두루마리에 그대로 남겨요';
});
const recordRegion = document.getElementById('recordRegion'),
  summarySheet = document.querySelector('.memory-sheet'),
  summaryEmpty = document.querySelector('.summary-empty');
function openAndong() {
  summarySheet.hidden = false;
  summaryEmpty.hidden = true;
  document.querySelector('.andong-pin').classList.add('chosen');
  if (innerWidth < 861) document.getElementById('memorySummary').scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'nearest'
  });
}
document.querySelector('.andong-pin').addEventListener('click', openAndong);
document.querySelector('.memory-sheet-close').addEventListener('click', () => {
  summarySheet.hidden = true;
  summaryEmpty.hidden = false;
  document.querySelector('.andong-pin').classList.remove('chosen');
});
function zoomRecordMap(zoom) {
  recordRegion.classList.toggle('place-mode', zoom);
  recordRegion.querySelector('.record-city-pins').hidden = zoom;
  recordRegion.querySelector('.record-place-pins').hidden = !zoom;
  document.getElementById('recordMapMinus').disabled = !zoom;
  document.getElementById('recordMapPlus').disabled = zoom;
  document.getElementById('recordMapReset').hidden = !zoom;
  document.getElementById('memoryMapHint').textContent = zoom ? '안동의 장소 핀을 눌러 기록을 확인해 보세요' : '안동 꽃을 눌러, 그곳의 기억을 만나 보세요';
}
document.getElementById('recordMapPlus').addEventListener('click', () => {
  zoomRecordMap(true);
  openAndong();
});
document.getElementById('recordMapMinus').addEventListener('click', () => zoomRecordMap(false));
document.getElementById('recordMapReset').addEventListener('click', () => zoomRecordMap(false));
document.getElementById('expandCitySummary').addEventListener('click', e => {
  const more = document.querySelector('.summary-more');
  more.hidden = !more.hidden;
  e.currentTarget.setAttribute('aria-expanded', String(!more.hidden));
  e.currentTarget.textContent = more.hidden ? '요약 전체 보기' : '요약 접기';
});
document.querySelectorAll('[data-memory-place]').forEach(button => button.addEventListener('click', () => {
  openAndong();
  const detail = document.querySelector('.memory-place-detail');
  detail.hidden = false;
  detail.textContent = button.dataset.memoryPlace === '하회탈 전시' ? '하회탈 전시 · 커다란 하회탈 앞에서 웃는 얼굴을 따라 하며 장난쳤어요.' : '안동찜닭 · 따끈한 찜닭을 앞에 두고 각자 좋아하는 재료부터 골라 먹었어요.';
}));
const duruSamples = {
  memory: {
    question: '경주에서 어떤 추억을 남겼어?',
    answer: '경주에서는 월정교를 따라 걷던 밤 산책, 카페에서 케이크를 나눠 먹으며 다음 장소를 고르던 시간, 분홍빛으로 물든 첨성대를 바라본 순간이 추억으로 남았어요.',
    quote: '불빛을 따라 걷던 월정교가 물 위에 길게 비쳐서 밤 산책이 더 특별했어요.',
    photo: 'travel-woljeong.svg'
  },
  food: {
    question: '카페에서는 뭘 했더라?',
    answer: '잠시 쉬어 간 카페에서 케이크와 아이스 음료를 나눠 먹었어요. 함께 쉬면서 다음에 갈 곳을 골랐다고 남겨 주셨어요.',
    quote: '잠시 쉬어 간 카페에서 케이크를 나눠 먹으며 다음에 갈 곳을 골랐어요.',
    photo: 'travel-cafe.svg'
  }
};
let duruTimeout,
  duruTyping,
  duruStarted = false;
function askDuru(key) {
  duruStarted = true;
  clearTimeout(duruTimeout);
  clearInterval(duruTyping);
  const data = duruSamples[key],
    question = document.getElementById('duruQuestion'),
    thinking = document.querySelector('.duru-chat-thinking'),
    answer = document.querySelector('.duru-answer');
  question.hidden = false;
  question.textContent = data.question;
  thinking.hidden = false;
  answer.hidden = true;
  document.querySelectorAll('[data-duru-question]').forEach(button => button.classList.toggle('selected', button.dataset.duruQuestion === key));
  duruTimeout = setTimeout(() => {
    thinking.hidden = true;
    answer.hidden = false;
    document.getElementById('duruQuote').textContent = '“' + data.quote + '”';
    document.getElementById('duruSourcePhoto').src = './assets/' + data.photo;
    document.getElementById('duruSourcePhoto').alt = key === 'food' ? '기록에 담긴 카페 사진' : '기록에 담긴 월정교 사진';
    const text = document.getElementById('duruAnswerText');
    text.textContent = '';
    let n = 0;
    const chars = [...data.answer];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) text.textContent = data.answer;else duruTyping = setInterval(() => {
      text.textContent = chars.slice(0, ++n).join('');
      if (n >= chars.length) clearInterval(duruTyping);
    }, 24);
  }, 1100);
}
document.querySelectorAll('[data-duru-question]').forEach(button => button.addEventListener('click', () => askDuru(button.dataset.duruQuestion)));
const duruObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    if (!duruStarted) askDuru('memory');
    duruObserver.disconnect();
  }
}, {
  threshold: .25
});
duruObserver.observe(document.getElementById('duruChatDemo'));
const unrollTrigger = document.querySelector('.unroll-trigger'),
  unrollContent = document.querySelector('.unroll-content');
unrollTrigger.addEventListener('click', () => {
  unrollTrigger.setAttribute('aria-expanded', 'true');
  unrollTrigger.hidden = true;
  unrollContent.hidden = false;
});
document.querySelector('.unroll-reset').addEventListener('click', () => {
  unrollTrigger.setAttribute('aria-expanded', 'false');
  unrollTrigger.hidden = false;
  unrollContent.hidden = true;
});
const flowerDemo = document.querySelector('.branch-animation');
if (flowerDemo) {
  const obs = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      flowerDemo.classList.add('bloom');
      obs.disconnect();
    }
  }, {
    threshold: .3
  });
  obs.observe(flowerDemo);
}
// 안내는 랜딩 자체가 아니라 실제 서비스 주소에서 설치하도록 제공해요.
const isheet = document.getElementById('isheet');
const setOS = os => {
  isheet.querySelectorAll('.iseg button').forEach(x => {
    const selected = x.dataset.os === os;
    x.classList.toggle('on', selected);
    x.setAttribute('aria-pressed', String(selected));
  });
  isheet.querySelectorAll('.iflow').forEach(f => {
    f.hidden = f.dataset.os !== os;
    if (!f.hidden) f.querySelectorAll('.istep').forEach(restart);
  });
};
isheet.querySelectorAll('.iseg button').forEach(b => b.onclick = () => setOS(b.dataset.os));
isheet.querySelectorAll('[data-close]').forEach(b => b.onclick = () => {
  isheet.hidden = true;
});
addEventListener('keydown', e => {
  if (e.key === 'Escape') isheet.hidden = true;
});
document.getElementById('instBtn').onclick = () => {
  isheet.hidden = false;
  setOS(/android/i.test(navigator.userAgent) ? 'and' : 'ios');
};
