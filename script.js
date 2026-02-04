const envelopeWrapper = document.querySelector('.envelope-wrapper');
const envelope = document.getElementById('envelope');
const seal = document.querySelector('.wax-seal');
const letterHandle = document.getElementById('letter-handle');
const letterContent = document.getElementById('letter-content');

// 1. 왁스 클릭 시 봉투 열기
seal.addEventListener('click', () => {
  envelope.classList.add('open');
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 100 });
});

// 하트 폭죽 함수
function shootHeart() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['heart'],
    colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#C71585'],
    zIndex: 2000,
  };
  confetti({ ...defaults, particleCount: 30, scalar: 2, origin: { y: 0.5 } });
}

// 2. 드래그 로직 (마우스 + 터치 공용)
let isDragging = false;
let startY = 0;
let savedY = 0;
let isFinished = false;

// 드래그 시작 공통 함수
function startDrag(clientY) {
  if (!envelope.classList.contains('open') || isFinished) return;
  if (navigator.vibrate) navigator.vibrate(10);
  isDragging = true;
  startY = clientY;
  letterHandle.style.cursor = 'grabbing';
  letterHandle.style.transition = 'none';
}

// 드래그 중 공통 함수
function onDrag(clientY) {
  if (!isDragging || isFinished) return;
  const deltaY = clientY - startY;
  const newY = Math.min(0, Math.max(-350, savedY + deltaY));
  letterHandle.style.transform = `translateX(-50%) translateY(${newY}px)`;

  // 편지를 충분히 당겼을 때 (모바일을 고려해 기준 완화: -200px)
  if (newY < -200) {
    if (navigator.vibrate) navigator.vibrate(40);
    isDragging = false;
    isFinished = true;
    envelopeWrapper.classList.add('hidden');
    letterHandle.classList.add('hidden');
    // 하트 폭죽 4연발
    setTimeout(shootHeart, 0);
    setTimeout(shootHeart, 150);
    setTimeout(shootHeart, 300);
    setTimeout(shootHeart, 450);
    // 편지 본문 등장
    setTimeout(() => {
      letterContent.classList.add('show');
    }, 600);
  }
}

// 드래그 종료 공통 함수
function endDrag(clientY) {
  if (!isDragging) return;
  isDragging = false;
  letterHandle.style.cursor = 'grab';
  const deltaY = clientY - startY;
  savedY = Math.min(0, Math.max(-350, savedY + deltaY));
  letterHandle.style.transition = 'transform 0.3s ease-out';
}

// --- 이벤트 리스너 등록 (마우스 & 터치) ---

// 마우스 이벤트
letterHandle.addEventListener('mousedown', (e) => startDrag(e.clientY));
window.addEventListener('mousemove', (e) => onDrag(e.clientY));
window.addEventListener('mouseup', (e) => endDrag(e.clientY));

// 터치 이벤트 (모바일용)
letterHandle.addEventListener(
  'touchstart',
  (e) => {
    if (e.cancelable) e.preventDefault(); // 스크롤 방지
    startDrag(e.touches[0].clientY);
  },
  { passive: false }
);

window.addEventListener(
  'touchmove',
  (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault(); // 스크롤 방지
    onDrag(e.touches[0].clientY);
  },
  { passive: false }
);

window.addEventListener('touchend', (e) => {
  // touchend는 changedTouches를 사용
  endDrag(e.changedTouches[0].clientY);
});
