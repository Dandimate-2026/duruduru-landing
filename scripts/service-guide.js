// 심사용 체험 진입 안내: 확인 전에는 서비스로 이동하지 않음.
(() => {
  const overlay = document.getElementById('demoOverlay');
  const confirm = document.getElementById('demoConfirm');
  const cancel = document.getElementById('demoCancel');
  let destination = 'https://43-201-73-60.sslip.io/';
  let lastFocus = null;
  document.querySelectorAll('a[data-demo-entry]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    destination = link.href;
    lastFocus = link;
    overlay.hidden = false;
    overlay.querySelector('.demo-guide').scrollTop = 0;
    document.body.style.overflow = 'hidden';
    overlay.querySelector('#demoTitle').setAttribute('tabindex', '-1');
    overlay.querySelector('#demoTitle').focus({
      preventScroll: true
    });
  }));
  const close = () => {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  cancel.addEventListener('click', close);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', e => {
    if (!overlay.hidden && e.key === 'Escape') close();
  });
  confirm.addEventListener('click', () => {
    window.open(destination, '_blank', 'noopener,noreferrer');
    close();
  });
})();
