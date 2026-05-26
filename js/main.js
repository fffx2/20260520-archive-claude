/* ===================================================
   이하얀 archive — main.js
   인터랙션: 스크롤·필터·검색·카운트업·fadeUp
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV 스크롤 효과 ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── 2. 스크롤 투 탑 ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. Fade-up (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => io.observe(el));
  }

  /* ── 4. 숫자 카운트업 ── */
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countUp = (el, target, duration = 1200) => {
      const suffix = el.dataset.suffix || '';
      const isYear = target >= 2000;
      const startVal = isYear ? target - 5 : 0;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(startVal + (target - startVal) * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          countUp(e.target, parseInt(e.target.dataset.count));
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => io2.observe(el));
  }

  /* ── 5. 과목 바 애니메이션 ── */
  const bars = document.querySelectorAll('.subject-bar[data-width]');
  if (bars.length) {
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          io3.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(el => io3.observe(el));
  }

  /* ── 6. 필터 버튼 (data-filter / data-target) ── */
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group || 'default';
        // 같은 그룹 버튼 active 토글
        document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const targetSelector = btn.dataset.target || '.filter-item';
        const items = document.querySelectorAll(targetSelector);
        let visibleCount = 0;

        items.forEach(item => {
          const match = filter === 'all'
            || item.dataset.category === filter
            || item.dataset.year === filter
            || item.dataset.subject === filter;
          item.style.display = match ? '' : 'none';
          if (match) visibleCount++;
        });

        // 빈 결과 안내
        const empty = document.querySelector('.empty-state');
        if (empty) empty.classList.toggle('visible', visibleCount === 0);
      });
    });
  }

  /* ── 7. 검색 (수업자료 페이지) ── */
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      const items = document.querySelectorAll('.filter-item');
      let visibleCount = 0;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const match = text.includes(q);
        item.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      const empty = document.querySelector('.empty-state');
      if (empty) empty.classList.toggle('visible', visibleCount === 0);
    });
  }

  /* ── 8. NAV active 링크 (현재 페이지) ── */
  const currentPath = location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // 홈
    if (href.includes('index.html') && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      a.classList.add('active');
    } else if (!href.includes('index.html') && currentPath.includes(href.replace('../', '').replace('./', ''))) {
      a.classList.add('active');
    }
  });

});
