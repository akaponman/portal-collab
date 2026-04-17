/* ===========================
   あかはらVラボ ポータル
   わさび × あかはら。
   =========================== */

(function () {
  'use strict';

  // ===========================
  // Config
  // ===========================
  const CONFIG = {
    youtubeChannelId: 'UCuLg47YLddcJEN8gmOqRu4A',
    twitchUsername: 'akahara_genious',
    liveCheckInterval: 60000,
    // ヒーロー背景用: 配信中でなければこのアーカイブ動画IDを使う
    youtubeArchiveVideoId: 'Yp34bPiTBpw',
    particles: {
      count: 35,
      colors: ['#6C63FF', '#FF6B9D', '#FFD93D', '#6ECFBD', '#74C0FC'],
      minSize: 3,
      maxSize: 8,
      speed: 0.3,
    },
  };

  // ===========================
  // Navigation
  // ===========================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // ===========================
  // Scroll Reveal (with slide/scale variants)
  // ===========================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // ===========================
  // Parallax on scroll
  // ===========================
  const parallaxImages = document.querySelectorAll('.parallax-img');
  const parallaxBgs = document.querySelectorAll('.parallax-bg');

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      const speed = parseFloat(img.dataset.speed) || 0.05;
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed;
      img.style.transform = `translateY(${offset}px)`;
    });

    parallaxBgs.forEach((bg) => {
      const speed = parseFloat(bg.dataset.speed) || 0.2;
      const offset = scrollY * speed;
      bg.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  // ===========================
  // Gallery: マウスホイールで横スクロール + ドラッグ
  // ===========================
  const galleryStrip = document.querySelector('.gallery-strip');
  if (galleryStrip) {
    // ホイールを横スクロールに変換
    galleryStrip.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        galleryStrip.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // ドラッグでスクロール
    let isDragging = false;
    let startX, scrollStart;
    galleryStrip.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX;
      scrollStart = galleryStrip.scrollLeft;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      galleryStrip.scrollLeft = scrollStart - (e.pageX - startX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
  }

  // ===========================
  // Kawaii Particles
  // ===========================
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = CONFIG.particles.minSize + Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize);
      this.speedX = (Math.random() - 0.5) * CONFIG.particles.speed;
      this.speedY = (Math.random() - 0.5) * CONFIG.particles.speed;
      this.color = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
      this.opacity = 0.15 + Math.random() * 0.25;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.01 + Math.random() * 0.02;
      this.shape = Math.random() < 0.6 ? 'circle' : Math.random() < 0.5 ? 'star' : 'heart';
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.3;
      this.y += this.speedY + Math.cos(this.wobble) * 0.2;
      if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'star') {
        this.drawStar(this.size);
      } else {
        this.drawHeart(this.size);
      }
      ctx.restore();
    }
    drawStar(size) {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? size : size * 0.45;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    drawHeart(size) {
      const s = size * 0.6;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s * 1.2, 0, -s * 0.5);
      ctx.bezierCurveTo(s * 0.5, -s * 1.2, s, -s * 0.5, 0, s * 0.3);
      ctx.fill();
    }
  }

  particles = Array.from({ length: CONFIG.particles.count }, () => new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===========================
  // Hero Video Background
  // ===========================
  const heroVideoBg = document.getElementById('hero-video-bg');
  const heroVideoPlayer = document.getElementById('hero-video-player');
  const heroEl = document.getElementById('hero');

  function setHeroVideo(src) {
    if (!heroVideoPlayer) return;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.tabIndex = -1;
    iframe.setAttribute('aria-hidden', 'true');
    heroVideoPlayer.innerHTML = '';
    heroVideoPlayer.appendChild(iframe);
    heroEl.classList.add('has-video');
  }

  // 配信中→ライブ映像、非配信→アーカイブ
  async function initHeroVideo() {
    const parent = window.location.hostname || 'localhost';

    // 1. Twitchライブチェック
    try {
      const resp = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(`https://www.twitch.tv/${CONFIG.twitchUsername}`)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await resp.json();
      if (data && data.title && !data.error) {
        setHeroVideo(`https://player.twitch.tv/?channel=${CONFIG.twitchUsername}&parent=${parent}&muted=true&autoplay=true`);
        return;
      }
    } catch { /* not live */ }

    // 2. YouTubeライブチェック
    try {
      const resp = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/channel/${CONFIG.youtubeChannelId}/live`)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await resp.json();
      if (data && data.title && !data.error) {
        setHeroVideo(`https://www.youtube.com/embed/live_stream?channel=${CONFIG.youtubeChannelId}&autoplay=1&mute=1&controls=0&showinfo=0`);
        return;
      }
    } catch { /* not live */ }

    // 3. アーカイブ動画をフォールバック
    if (CONFIG.youtubeArchiveVideoId) {
      setHeroVideo(`https://www.youtube.com/embed/${CONFIG.youtubeArchiveVideoId}?autoplay=1&mute=1&loop=1&playlist=${CONFIG.youtubeArchiveVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1`);
    }
  }

  initHeroVideo();

  // ===========================
  // Live Stream Detection (inline cards)
  // ===========================
  const liveBg = document.getElementById('live-bg');
  const livePlayer = document.getElementById('live-player');
  const twitchEmbed = document.getElementById('twitch-embed');
  const youtubeEmbed = document.getElementById('youtube-embed');
  let isLive = false;

  function getParentDomain() {
    const host = window.location.hostname;
    return host || 'localhost';
  }

  function showLiveStream(platform) {
    if (isLive) return;
    isLive = true;
    liveBg.classList.remove('hidden');

    let src;
    const parent = getParentDomain();
    if (platform === 'twitch') {
      src = `https://player.twitch.tv/?channel=${CONFIG.twitchUsername}&parent=${parent}&muted=true&autoplay=true`;
    } else {
      src = `https://www.youtube.com/embed/live_stream?channel=${CONFIG.youtubeChannelId}&autoplay=1&mute=1`;
    }

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    livePlayer.innerHTML = '';
    livePlayer.appendChild(iframe);
    document.querySelector('.hero').style.background = 'transparent';
  }

  function showInlineStream(platform) {
    const parent = getParentDomain();
    let container, src;

    if (platform === 'twitch') {
      container = twitchEmbed;
      src = `https://player.twitch.tv/?channel=${CONFIG.twitchUsername}&parent=${parent}&muted=true`;
    } else {
      container = youtubeEmbed;
      src = `https://www.youtube.com/embed/live_stream?channel=${CONFIG.youtubeChannelId}&mute=1`;
    }

    if (!container) return;
    if (container.querySelector('iframe')) return; // 既にiframe挿入済み
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:none;position:absolute;inset:0;z-index:2;';
    container.style.position = 'relative';
    container.appendChild(iframe);
  }

  function updateStreamStatus(platform, isLive) {
    const embedId = platform === 'twitch' ? 'twitch-embed' : 'youtube-embed';
    const card = document.getElementById(embedId)?.closest('.terminal-card');
    if (!card) return;
    const statusEl = card.querySelector('.t-value.t-offline, .t-value.t-online');
    if (!statusEl) return;
    if (isLive) {
      statusEl.textContent = 'LIVE';
      statusEl.classList.remove('t-offline');
      statusEl.classList.add('t-online');
    } else {
      statusEl.textContent = 'OFFLINE';
      statusEl.classList.remove('t-online');
      statusEl.classList.add('t-offline');
    }
  }

  async function pollLiveStatus() {
    // Twitch: WPキャッシュ経由（Twitch Helix APIで5分おきに更新済み）
    try {
      const resp = await fetch(
        'https://akahara-vlab.com/wp-json/akahara/v1/twitch-live',
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await resp.json();
      if (data && data.live) {
        updateStreamStatus('twitch', true);
        showLiveStream('twitch');
        showInlineStream('twitch');
        return;
      }
      updateStreamStatus('twitch', false);
    } catch { /* offline */ }

    // YouTube check (noembed fallback)
    try {
      const resp = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/channel/${CONFIG.youtubeChannelId}/live`)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await resp.json();
      if (data && data.title && !data.error) {
        updateStreamStatus('youtube', true);
        showLiveStream('youtube');
        showInlineStream('youtube');
        return;
      }
      updateStreamStatus('youtube', false);
    } catch { /* offline */ }
  }

  pollLiveStatus();
  setInterval(pollLiveStatus, CONFIG.liveCheckInterval);

  // ===========================
  // Blog: WP REST APIから最新記事を取得
  // ===========================
  async function loadLatestPosts() {
    const sources = [
      { api: 'https://akahara-vlab.com/wp-json/wp/v2/posts?per_page=4&_embed', colId: 'blog-col-vlab', variant: 'vlab', source: 'akahara-vlab.com' },
      { api: 'https://wasabigarden.tech/wp-json/wp/v2/posts?per_page=4&_embed', colId: 'blog-col-ow', variant: 'ow', source: 'wasabigarden.tech' },
    ];
    await Promise.all(sources.map(async ({ api, colId, variant, source }) => {
      const col = document.getElementById(colId);
      if (!col) return;
      try {
        const res = await fetch(api);
        if (!res.ok) throw new Error();
        const posts = await res.json();
        if (!posts.length) throw new Error();
        col.innerHTML = posts.map(p => {
          const media = p._embedded?.['wp:featuredmedia']?.[0];
          const thumb = media?.media_details?.sizes?.medium?.source_url || media?.source_url || '';
          const title = p.title.rendered.replace(/<[^>]*>/g, '');
          const d = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const img = thumb
            ? `<img class="clipping-thumb" src="${thumb}" alt="" loading="lazy">`
            : `<div class="clipping-thumb clipping-thumb--placeholder"></div>`;
          return `<a href="${p.link}" target="_blank" rel="noopener" class="clipping clipping--${variant}">
            <div class="clipping-thumb-wrap">${img}</div>
            <div class="clipping-body">
              <time class="clipping-date">${d}</time>
              <p class="clipping-title">${title}</p>
            </div>
            <div class="clipping-source">${source}</div>
          </a>`;
        }).join('');
      } catch (_) {
        col.innerHTML = '<p class="articles-loading">取得できませんでした</p>';
      }
    }));
  }

  loadLatestPosts();

  // ===========================
  // Twitch VODs: WPキャッシュからアーカイブサムネイルを取得
  // ===========================
  const VOD_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function toJST(date) {
    return new Date(date.getTime() + 9 * 3600 * 1000);
  }
  function fmtHHMM(date) {
    const j = toJST(date);
    return `${String(j.getUTCHours()).padStart(2, '0')}:${String(j.getUTCMinutes()).padStart(2, '0')}`;
  }
  function fmtDateDay(isoStr) {
    const j = toJST(new Date(isoStr));
    const mm  = String(j.getUTCMonth() + 1).padStart(2, '0');
    const dd  = String(j.getUTCDate()).padStart(2, '0');
    const dow = VOD_DAYS[j.getUTCDay()];
    return `${mm}/${dd} ${dow}`;
  }
  function parseDurationSec(dur) {
    const m = dur.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
  }

  async function loadTwitchVods() {
    const container = document.getElementById('twitch-vods');
    if (!container) return;
    try {
      const res = await fetch('https://akahara-vlab.com/wp-json/akahara/v1/twitch-vods',
        { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return;
      const vods = await res.json();
      if (!Array.isArray(vods) || vods.length === 0) return;

      // ── メイン画像: 最新 VOD サムネイル + 日時・タイトルオーバーレイ ──
      const mainWrap = document.getElementById('twitch-embed');
      if (mainWrap && !mainWrap.querySelector('iframe')) {
        const v0    = vods[0];
        const start = new Date(v0.created_at);
        const end   = new Date(start.getTime() + parseDurationSec(v0.duration) * 1000);
        const j0    = toJST(start);
        const mm    = String(j0.getUTCMonth() + 1).padStart(2, '0');
        const dd    = String(j0.getUTCDate()).padStart(2, '0');
        const dow   = VOD_DAYS[j0.getUTCDay()];
        const timeRange = `${mm}/${dd} ${dow}  ${fmtHHMM(start)}〜${fmtHHMM(end)}`;

        const mainImg = mainWrap.querySelector('img');
        if (mainImg) { mainImg.src = v0.thumbnail; mainImg.alt = v0.title; }

        const info = document.createElement('div');
        info.className = 'terminal-latest-info';
        info.innerHTML = `<span class="terminal-latest-time">${timeRange}</span>`
                       + `<span class="terminal-latest-title">${v0.title}</span>`;
        mainWrap.appendChild(info);

        mainWrap.style.cursor = 'pointer';
        mainWrap.addEventListener('click', () => window.open(v0.url, '_blank', 'noopener'));
      }

      // ── アーカイブ一覧: 日付+曜日 ──
      const label = document.createElement('p');
      label.className = 'terminal-vods-label';
      label.textContent = `archives: (${vods.length})`;
      container.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'terminal-vods-grid';
      vods.forEach((v) => {
        const item = document.createElement('div');
        item.className = 'terminal-vod-item';

        const a = document.createElement('a');
        a.className = 'terminal-vod-thumb';
        a.href = v.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.title = v.title;
        const img = document.createElement('img');
        img.src = v.thumbnail;
        img.alt = v.title;
        img.loading = 'lazy';
        a.appendChild(img);

        const date = document.createElement('span');
        date.className = 'terminal-vod-date';
        date.textContent = fmtDateDay(v.created_at);

        item.appendChild(a);
        item.appendChild(date);
        grid.appendChild(item);
      });
      container.appendChild(grid);
    } catch { /* キャッシュなし or ネットワークエラーは無視 */ }
  }

  // loadTwitchVods() はターミナルセクション到達時に呼び出す（下部 initTerminalBoot 参照）

  // ===========================
  // YouTube Shorts: WPキャッシュからサムネイルを取得
  // ===========================
  async function loadYoutubeShorts() {
    const container = document.getElementById('youtube-shorts');
    if (!container) return;
    try {
      const res = await fetch('https://akahara-vlab.com/wp-json/akahara/v1/youtube-shorts',
        { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return;
      const data = await res.json();
      const banner = data.banner || '';
      const shorts = Array.isArray(data.shorts) ? data.shorts : (Array.isArray(data) ? data : []);
      if (shorts.length === 0) return;

      // メイン画像: チャンネルバナーに差し替え
      const mainWrap = document.getElementById('youtube-embed');
      if (mainWrap && !mainWrap.querySelector('iframe')) {
        const mainImg = mainWrap.querySelector('img');
        if (mainImg && banner) {
          mainImg.src = banner;
          mainImg.alt = 'あかはら。チャンネルバナー';
        }
        mainWrap.style.cursor = 'pointer';
        mainWrap.addEventListener('click', () => window.open('https://www.youtube.com/@akahara_genious2', '_blank', 'noopener'));
      }

      // アーカイブ一覧
      const label = document.createElement('p');
      label.className = 'terminal-vods-label';
      label.textContent = `shorts: (${shorts.length})`;
      container.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'terminal-vods-grid';
      shorts.forEach((s) => {
        const item = document.createElement('div');
        item.className = 'terminal-vod-item';

        const a = document.createElement('a');
        a.className = 'terminal-vod-thumb';
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.title = s.title;
        const img = document.createElement('img');
        img.src = s.thumbnail;
        img.alt = s.title;
        img.loading = 'lazy';
        a.appendChild(img);

        const date = document.createElement('span');
        date.className = 'terminal-vod-date';
        date.textContent = fmtDateDay(s.published_at);

        item.appendChild(a);
        item.appendChild(date);
        grid.appendChild(item);
      });
      container.appendChild(grid);
    } catch { /* キャッシュなし or ネットワークエラーは無視 */ }
  }

  // loadYoutubeShorts() はターミナルセクション到達時に呼び出す（下部 initTerminalBoot 参照）

  // ===========================
  // About: Bubble + Shell Float (unlimited, continuous)
  // ===========================
  function initAboutBubbles() {
    const section = document.getElementById('about');
    if (!section) return;

    const SHELL_SVG_BLUE = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linejoin="round"/>
      <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
      <line x1="4" y1="9" x2="28" y2="23" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
      <line x1="28" y1="9" x2="4" y2="23" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
    </svg>`;
    const SHELL_SVG_PINK = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(255,180,210,0.18)" stroke="rgba(255,180,210,0.85)" stroke-width="1.5" stroke-linejoin="round"/>
      <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(255,180,210,0.65)" stroke-width="1"/>
      <line x1="4" y1="9" x2="28" y2="23" stroke="rgba(255,180,210,0.65)" stroke-width="1"/>
      <line x1="28" y1="9" x2="4" y2="23" stroke="rgba(255,180,210,0.65)" stroke-width="1"/>
    </svg>`;

    const layer = document.createElement('div');
    layer.className = 'about-float-layer';
    section.insertBefore(layer, section.firstChild);

    // カード形状の波紋 + 近くの泡を揺らす
    function spawnCardRipple(targetEl) {
      const sRect = section.getBoundingClientRect();
      const cRect = targetEl.getBoundingClientRect();
      const cx = cRect.left - sRect.left + cRect.width  / 2;
      const cy = cRect.top  - sRect.top  + cRect.height / 2;

      const ripple = document.createElement('div');
      ripple.className = 'about-card-ripple';
      ripple.style.width  = `${cRect.width}px`;
      ripple.style.height = `${cRect.height}px`;
      ripple.style.left   = `${cx}px`;
      ripple.style.top    = `${cy}px`;
      section.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());

      const leftPct = (cx / sRect.width) * 100;
      layer.querySelectorAll('.about-float-item').forEach((el) => {
        const elLeft = parseFloat(el.style.left);
        const dist = Math.abs(elLeft - leftPct);
        if (dist > 30) return;
        const strength = 1 - dist / 30;
        const pushDir  = elLeft >= leftPct ? 1 : -1;
        const push     = pushDir * (4 + Math.random() * 8) * strength;
        el.style.filter = `brightness(${1.5 + strength})`;
        el.style.transition = 'filter 0.08s ease-in';
        setTimeout(() => {
          el.style.transition = 'filter 0.7s ease-out, left 0.5s ease-out';
          el.style.filter = 'brightness(1)';
          el.style.left   = `${Math.max(1, Math.min(99, elLeft + push))}%`;
        }, 80);
        setTimeout(() => { el.style.filter = ''; el.style.transition = ''; }, 900);
      });
    }

    [...section.querySelectorAll('.about-card'), section.querySelector('.about-together')]
      .filter(Boolean)
      .forEach((el) => el.addEventListener('mouseenter', () => spawnCardRipple(el)));

    function createItem(delayOverride) {
      const isShell = Math.random() < 0.3;
      const el = document.createElement('div');
      el.className = 'about-float-item';

      const dur = 14 + Math.random() * 16;
      const delay = delayOverride !== undefined ? delayOverride : 0;

      el.style.left = `${Math.random() * 100}%`;
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay = `${delay}s`;

      if (isShell) {
        el.classList.add('about-float-item--shell');
        const size = 22 + Math.random() * 20;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.innerHTML = Math.random() < 0.5 ? SHELL_SVG_BLUE : SHELL_SVG_PINK;
      } else {
        el.classList.add('about-float-item--bubble');
        const size = 8 + Math.random() * 22;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        if (Math.random() < 0.3) {
          el.style.background = 'rgba(255,180,210,0.18)';
          el.style.borderColor = 'rgba(255,180,210,0.8)';
        }
      }

      // 各ループの最初にX座標を変えて自然な流れに
      el.addEventListener('animationiteration', () => {
        el.style.left = `${Math.random() * 100}%`;
      });

      layer.appendChild(el);
    }

    // about-together のテキストを1文字ずつ<span>に分割してwave適用
    const togetherP = section.querySelector('.about-together p');
    if (togetherP) {
      const nodes = [...togetherP.childNodes];
      togetherP.innerHTML = '';
      let charIndex = 0;
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          [...node.textContent].forEach((char) => {
            const span = document.createElement('span');
            span.className = 'char-wave';
            span.textContent = char;
            span.style.animationDelay = `${-(charIndex * 0.06)}s`;
            togetherP.appendChild(span);
            charIndex++;
          });
        } else {
          togetherP.appendChild(node.cloneNode(true));
        }
      });
    }

    // 初期バッチ：負の遅延でロード直後から画面内に分散配置
    for (let i = 0; i < 60; i++) {
      const dur = 14 + Math.random() * 16;
      createItem(-(Math.random() * dur));
    }
    // 追加バッチ：少し遅らせて追加
    for (let i = 0; i < 30; i++) {
      createItem(Math.random() * 6);
    }
  }

  initAboutBubbles();

  // ===========================
  // Smooth scroll
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===========================
  // Button: water-float + ripple on hover
  // ===========================
  document.querySelectorAll('.about-card').forEach((card) => {
    card.addEventListener('mouseover', (e) => {
      // 子要素から子要素への移動は無視
      if (e.relatedTarget && card.contains(e.relatedTarget)) return;
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ===========================
  // Hero Wave: マウス追従インタラクション
  // ===========================
  (function () {
    const wavePath = document.querySelector('.hero-wave path');
    const hero     = document.getElementById('hero');
    if (!wavePath || !hero) return;

    const W = 1440, H = 120;
    const N = 9;
    // 元のwave形状を近似したベースY値
    const BASE = [60, 72, 88, 68, 25, 10, 46, 57, 60];
    const pts = BASE.map((by, i) => ({
      x: (i / (N - 1)) * W,
      y: by, vy: 0, base: by,
    }));

    let targetMX = 0.5, smoothMX = 0.5, isHovering = false;

    hero.addEventListener('mousemove', (e) => {
      isHovering = true;
      targetMX = (e.clientX - hero.getBoundingClientRect().left) / hero.offsetWidth;
    });
    hero.addEventListener('mouseleave', () => { isHovering = false; });

    // Catmull-Rom → SVG cubic bezier
    function buildD() {
      let d = `M0,${pts[0].y.toFixed(2)}`;
      for (let i = 0; i < N - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(N - 1, i + 2)];
        const cp1x = (p1.x + (p2.x - p0.x) / 6).toFixed(2);
        const cp1y = (p1.y + (p2.y - p0.y) / 6).toFixed(2);
        const cp2x = (p2.x - (p3.x - p1.x) / 6).toFixed(2);
        const cp2y = (p2.y - (p3.y - p1.y) / 6).toFixed(2);
        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y.toFixed(2)}`;
      }
      return d + ` L${W},${H} L0,${H} Z`;
    }

    const SPRING = 140;   // バネ定数 (px/s²)
    const DAMP   = 10;    // ダンピング係数 (1/s)
    const PULL   = 45;    // 引き寄せ量 (px)
    const SIGMA  = 0.20;  // ガウス幅 (正規化座標)

    let last = performance.now();
    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isHovering) smoothMX += (targetMX - smoothMX) * 0.15;

      pts.forEach((p) => {
        const pull   = isHovering
          ? Math.exp(-((p.x / W - smoothMX) ** 2) / (2 * SIGMA * SIGMA)) * PULL
          : 0;
        const target = p.base + pull;  // +でwaveが下方向に凹む（水面を押す感覚）
        p.vy += (target - p.y) * SPRING * dt;
        p.vy -= p.vy * DAMP * dt;
        p.y  += p.vy * dt;
      });

      wavePath.setAttribute('d', buildD());
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  // ===========================
  // About Wave: マウス追従インタラクション
  // ===========================
  (function () {
    const wavePath = document.querySelector('.about-wave path');
    const waveEl   = document.querySelector('.about-wave');
    const section  = document.getElementById('about');
    if (!wavePath || !waveEl || !section) return;

    const W = 1440, H = 80, N = 9;
    const BASE = [0, 18, 38, 21, 29, 24, 36, 19, 0];
    const pts = BASE.map((by, i) => ({ x: (i / (N - 1)) * W, y: by, vy: 0, base: by }));

    let targetMX = 0.5, smoothMX = 0.5, isHovering = false;

    section.addEventListener('mousemove', (e) => {
      isHovering = true;
      targetMX = (e.clientX - section.getBoundingClientRect().left) / section.offsetWidth;
    });
    section.addEventListener('mouseleave', () => { isHovering = false; });

    const SPRING = 140, DAMP = 10, PULL = 22, SIGMA = 0.20;

    function buildD() {
      let d = `M0,${pts[0].y.toFixed(2)}`;
      for (let i = 0; i < N - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(N - 1, i + 2)];
        const cp1x = (p1.x + (p2.x - p0.x) / 6).toFixed(2);
        const cp1y = (p1.y + (p2.y - p0.y) / 6).toFixed(2);
        const cp2x = (p2.x - (p3.x - p1.x) / 6).toFixed(2);
        const cp2y = (p2.y - (p3.y - p1.y) / 6).toFixed(2);
        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y.toFixed(2)}`;
      }
      return d + ` L${W},${H + 5} L0,${H + 5} Z`;
    }

    // 雫: 波の下辺から落下
    let dropLastSpawn = 0;
    function spawnDrop(normX) {
      const rect  = waveEl.getBoundingClientRect();
      const size  = 21 + Math.random() * 30;
      const jitter = (Math.random() - 0.5) * 20;
      const drop  = document.createElement('div');
      drop.className = 'wave-droplet';
      drop.style.width  = `${size}px`;
      drop.style.height = `${size * 1.45}px`;
      drop.style.left   = `${rect.left + normX * rect.width + jitter - size / 2}px`;
      drop.style.top    = `${rect.bottom - 2}px`;   // 波の下辺
      document.body.appendChild(drop);
      drop.addEventListener('animationend', () => drop.remove());
    }

    let last = performance.now();
    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isHovering) smoothMX += (targetMX - smoothMX) * 0.15;

      pts.forEach((p) => {
        const pull   = isHovering
          ? Math.exp(-((p.x / W - smoothMX) ** 2) / (2 * SIGMA * SIGMA)) * PULL
          : 0;
        const target = p.base + pull;
        p.vy += (target - p.y) * SPRING * dt;
        p.vy -= p.vy * DAMP * dt;
        p.y  += p.vy * dt;
      });

      // 波の速度が閾値を超えたら雫を落とす
      if (isHovering && now - dropLastSpawn > 350) {
        const nearest = pts.reduce((best, p) =>
          Math.abs(p.x / W - smoothMX) < Math.abs(best.x / W - smoothMX) ? p : best
        );
        if (Math.abs(nearest.vy) > 30) {
          dropLastSpawn = now;
          const count = Math.random() < 0.35 ? 2 : 1;
          for (let i = 0; i < count; i++) spawnDrop(smoothMX);
        }
      }

      wavePath.setAttribute('d', buildD());
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();


  // ===========================
  // Easter egg: キャラクリック
  // ===========================
  const speeches = {
    akahara: ['おっす', '眠い', 'よく来たね', '崇めてくれ', '奉ってくれ', '崇拝してくれ', '仕事辞めたい', '養って'],
    wasabi: ['やぁ', '勉強こそ命', '文字は友達', 'ClaudeCodeが一番楽', '全部読んでくれ', '案件くれ', '仕事ください'],
  };

  function randomSpeech(charClass, key) {
    const el = document.querySelector(`.${charClass}`);
    if (!el) return;
    el.addEventListener('click', () => {
      const speech = el.querySelector('.char-speech');
      const msgs = speeches[key];
      speech.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      speech.style.animation = 'none';
      speech.offsetHeight;
      speech.style.animation = 'speech-bounce 0.4s ease';
    });
  }
  randomSpeech('hero-char-akahara', 'akahara');
  randomSpeech('hero-char-wasabi', 'wasabi');

  // ===========================
  // 全プラットフォーム石：ホバーゆれ / 落下 / 投げ
  // ===========================
  (function stonePhysics() {
    const AIR_DRAG      = 1.8;   // XY空気抵抗（大きいほど早く減速）
    const THROW_MIN     = 350;   // 投げ判定の最低速度 px/s
    const THROW_MAX     = 700;   // 初速上限 px/s

    let grab = null;            // 現在掴んでいる石の情報
    let preventNextClick = false;

    /* ---- ホバーアニメーション ---- */
    function attachHover(card) {
      card.addEventListener('mouseenter', () => {
        if (grab && grab.el === card) return;
        card.classList.remove('stone-dropping');
        card.classList.add('stone-hovering');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('stone-hovering');
        card.classList.add('stone-dropping');
        card.addEventListener('animationend', () => {
          card.classList.remove('stone-dropping');
        }, { once: true });
      });
    }

    /* ---- 速度計算 ---- */
    function calcVel(positions) {
      const now = performance.now();
      const recent = positions.filter(p => now - p.t < 100);
      if (recent.length < 2) return { vx: 0, vy: 0 };
      const dt = (recent[recent.length - 1].t - recent[0].t) / 1000;
      if (!dt) return { vx: 0, vy: 0 };
      return {
        vx: (recent[recent.length - 1].x - recent[0].x) / dt,
        vy: (recent[recent.length - 1].y - recent[0].y) / dt,
      };
    }

    /* ---- 高度に応じたリアルタイム影 ---- */
    function calcShadow(heightAboveFloor, vx) {
      const t = Math.min(Math.max(heightAboveFloor, 0) / (window.innerHeight * 0.55), 1);
      const blur    = 6  + t * 42;          // 遠いほどぼやける
      const offsetY = 4  + t * 22;          // 遠いほど下にずれる
      const offsetX = vx * t * 0.012;       // 飛行方向に少し横ずれ
      const opacity = 0.75 - t * 0.42;      // 遠いほど薄い
      const scaleX  = 1   - t * 0.25;       // 遠いほど横に広がる
      return { blur, offsetY, offsetX, opacity, scaleX };
    }

    function applyShadow(el, sh) {
      el.style.filter = `drop-shadow(${sh.offsetX.toFixed(1)}px ${sh.offsetY.toFixed(1)}px ${sh.blur.toFixed(1)}px rgba(0,0,0,${sh.opacity.toFixed(2)}))`;
    }

    /* ---- 石を投げる（ghostFixed=true のときは sourceEl がすでに fixed 済み） ---- */
    function throwStone(sourceEl, vx0, vy0, ghostFixed) {
      const rect = sourceEl.getBoundingClientRect();
      const rotStr = getComputedStyle(sourceEl).getPropertyValue('--card-rot').trim();
      let rot0 = parseFloat(rotStr) || 0;
      if (!rot0) {
        // 着地石の場合 style.transform から取得
        const m = (sourceEl.style.transform || '').match(/rotate\(([-\d.]+)deg\)/);
        if (m) rot0 = parseFloat(m[1]);
      }
      const cx0 = rect.left + rect.width  / 2;
      const cy0 = rect.top  + rect.height / 2;
      const W   = rect.width, H = rect.height;

      let clone;
      if (ghostFixed) {
        // ゴーストをそのまま使う（新規クローン不要）
        clone = sourceEl;
        clone.classList.remove('stone-grabbed');
        clone.classList.add('stone-thrown');
      } else {
        clone = sourceEl.cloneNode(true);
        clone.classList.remove('scroll-reveal','scroll-scale','revealed',
                               'stone-hovering','stone-dropping','stone-grabbed','stone-in-flight');
        clone.classList.add('stone-thrown');
        clone.style.cssText = [
          `position:fixed`,
          `left:${cx0 - W/2}px`,
          `top:${cy0  - H/2}px`,
          `width:${W}px`,
          `height:${H}px`,
          `margin:0`,
          `z-index:8800`,
          `pointer-events:none`,
          `transition:none`,
          `animation:none`,
          `transform-origin:center`,
          `border-radius:${getComputedStyle(sourceEl).borderRadius}`,
        ].join(';');
        document.body.appendChild(clone);
      }

      // 物理状態（XY飛行 → 背景に着地・フルサイズで定着）
      let cx = cx0, cy = cy0;
      let vx = vx0, vy = vy0;
      let rot  = rot0;
      let rotV = vx0 * 0.06;
      let last = null;

      function tick(ts) {
        if (!last) last = ts;
        const dt = Math.min((ts - last) / 1000, 0.04);
        last = ts;

        // XY：空気抵抗で減速
        vx *= (1 - AIR_DRAG * dt);
        vy *= (1 - AIR_DRAG * dt);
        cx += vx * dt;
        cy += vy * dt;

        // 回転も減速
        rotV *= (1 - 1.2 * dt);
        rot  += rotV * dt;

        // 速度が十分落ちたら背景に静止 → absolute に切り替えてスクロール追従
        if (Math.abs(vx) < 25 && Math.abs(vy) < 25) {
          applyPose();
          // fixed → absolute（ページにめり込む）、nav より下に
          clone.style.position = 'absolute';
          clone.style.left    = `${cx - W/2 + window.scrollX}px`;
          clone.style.top     = `${cy - H/2 + window.scrollY}px`;
          clone.style.zIndex  = '999';
          clone.style.pointerEvents = 'auto';
          clone.style.cursor = 'grab';
          clone.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clone.style.cursor = 'grabbing';
            // absolute → fixed に戻してドラッグ中は viewport 追従
            const r = clone.getBoundingClientRect();
            clone.style.position = 'fixed';
            clone.style.left = `${r.left}px`;
            clone.style.top  = `${r.top}px`;
            grab = {
              el: clone, ghost: null, W, H,
              offsetX: e.clientX - (r.left + W/2),
              offsetY: e.clientY - (r.top  + H/2),
              positions: [{ x: e.clientX, y: e.clientY, t: performance.now() }],
              isFloating: true
            };
          });
          return;
        }

        applyPose();
        requestAnimationFrame(tick);
      }

      function applyPose() {
        const sh = calcShadow(80, vx);
        clone.style.left      = `${cx - W/2}px`;
        clone.style.top       = `${cy - H/2}px`;
        clone.style.transform = `rotate(${rot.toFixed(2)}deg) scale(1)`;
        clone.style.opacity   = '1';
        clone.style.filter    = `drop-shadow(${sh.offsetX.toFixed(1)}px ${sh.offsetY.toFixed(1)}px ${sh.blur.toFixed(1)}px rgba(0,0,0,${sh.opacity.toFixed(2)}))`;
      }

      requestAnimationFrame(tick);
    }


    /* ---- グローバル mousemove / mouseup ---- */
    document.addEventListener('mousemove', (e) => {
      if (!grab) return;
      grab.positions.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (grab.positions.length > 40) grab.positions.shift();

      // マウスに追従（ゴースト or 着地石）
      const { ghost, el, offsetX, offsetY, W, H, isFloating } = grab;
      if (ghost) {
        ghost.style.left = `${e.clientX - offsetX - W/2}px`;
        ghost.style.top  = `${e.clientY - offsetY - H/2}px`;
      } else if (isFloating) {
        el.style.left = `${e.clientX - offsetX - W/2}px`;
        el.style.top  = `${e.clientY - offsetY - H/2}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (!grab) return;
      const { el, ghost, positions, isFloating, W, H } = grab;
      grab = null;

      const vel   = calcVel(positions);
      const speed = Math.hypot(vel.vx, vel.vy);

      const clampedSpeed = Math.min(speed, THROW_MAX);
      const ratio = speed > 0 ? clampedSpeed / speed : 1;

      if (speed > THROW_MIN) {
        if (isFloating) {
          // 着地石を再投げ
          el.style.pointerEvents = 'none';
          el.style.cursor = '';
          throwStone(el, vel.vx * ratio, vel.vy * ratio, true);
        } else {
          // グリッドカードを投げる
          el.classList.add('stone-in-flight');
          el.style.pointerEvents = 'none';
          throwStone(ghost, vel.vx * ratio, vel.vy * ratio, true);
        }
      } else {
        if (isFloating) {
          // 着地石：投げなかった → absolute に戻してスクロール追従
          const r = el.getBoundingClientRect();
          el.style.position = 'absolute';
          el.style.left = `${r.left + window.scrollX}px`;
          el.style.top  = `${r.top  + window.scrollY}px`;
          el.style.cursor = 'grab';
          if (speed < 80) {
            const href   = el.getAttribute('href');
            const target = el.getAttribute('target') || '_self';
            if (href) window.open(href, target);
          }
        } else {
          // グリッドカードをリリース → 復元
          el.style.visibility = '';
          el.style.pointerEvents = '';
          if (ghost) ghost.remove();
          if (speed < 80) {
            const href   = el.getAttribute('href');
            const target = el.getAttribute('target') || '_self';
            if (href) window.open(href, target);
          }
        }
      }
    });


    /* ---- グリッドカードに登録 ---- */
    document.querySelectorAll('.platform-grid .platform-card').forEach((card) => {
      attachHover(card);

      card.setAttribute('draggable', 'false');
      card.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));

      // ネイティブ <a> 遷移を常に抑制（遷移は mouseup で window.open に一本化）
      card.addEventListener('click', (e) => e.preventDefault());

      card.addEventListener('mousedown', (e) => {
        e.preventDefault();
        card.classList.remove('stone-hovering', 'stone-dropping');

        const rect = card.getBoundingClientRect();
        const W = rect.width, H = rect.height;

        // ゴースト：マウス追従用クローン
        const ghost = card.cloneNode(true);
        ghost.classList.remove('scroll-reveal','scroll-scale','revealed',
                               'stone-hovering','stone-dropping');
        ghost.classList.add('stone-grabbed');
        ghost.style.cssText = [
          'position:fixed',
          `left:${rect.left}px`,
          `top:${rect.top}px`,
          `width:${W}px`,
          `height:${H}px`,
          'margin:0',
          'z-index:8900',
          'pointer-events:none',
          'transition:none',
          'animation:none',
          'transform-origin:center',
          `border-radius:${getComputedStyle(card).borderRadius}`,
        ].join(';');
        document.body.appendChild(ghost);

        // 元カードはグリッドスペースを保持したまま非表示
        card.style.visibility = 'hidden';
        card.style.pointerEvents = 'none';

        grab = {
          el: card, ghost, W, H,
          offsetX: e.clientX - (rect.left + W/2),
          offsetY: e.clientY - (rect.top  + H/2),
          positions: [{ x: e.clientX, y: e.clientY, t: performance.now() }],
          isFloating: false
        };
      });
    });
  })();

  // ===========================
  // イモリ ASCII アニメーション（まばたき＋歩き）
  // ===========================
  function initNewtAnimation() {
    const pre = document.querySelector('.terminal-newt-art');
    if (!pre || pre._newtAnimated) return;
    pre._newtAnimated = true;

    // フレーム定義（ライン番号で管理）
    const EYE_OPEN   = '         ▄█   █  ██████  █   █▄';
    const EYE_HALF   = '         ▄█   ▄  ██████  ▄   █▄';
    const EYE_CLOSED = '         ▄█      ██████      █▄';
    const FEET = [
      '                  ▀▀▀   ▀▀▀',   // neutral
      '                   ▀▀   ▀▀▀',   // 左足上げ
      '                  ▀▀▀   ▀▀▀',   // neutral
      '                  ▀▀▀    ▀▀',   // 右足上げ
    ];

    function getLines() { return pre.textContent.split('\n'); }
    function setLine(idx, text) {
      const ls = getLines();
      ls[idx] = text;
      pre.textContent = ls.join('\n');
    }

    // まばたき: open→half→closed→half→open
    function doBlink() {
      setLine(1, EYE_HALF);
      setTimeout(() => {
        setLine(1, EYE_CLOSED);
        setTimeout(() => {
          setLine(1, EYE_HALF);
          setTimeout(() => setLine(1, EYE_OPEN), 80);
        }, 100);
      }, 80);
    }
    function scheduleBlink() {
      setTimeout(() => { doBlink(); scheduleBlink(); }, 3000 + Math.random() * 2500);
    }
    scheduleBlink();

    // 歩き: 足フレームを 400ms ごとに切り替え
    let step = 0;
    setInterval(() => {
      step = (step + 1) % FEET.length;
      setLine(12, FEET[step]);
    }, 400);
  }

  // ===========================
  // ターミナルブートアニメーション
  // ===========================
  let _restartTerminal = null; // initWindowControls / nav から呼び出し可能にする

  (function initTerminalBoot() {
    const win    = document.querySelector('.terminal-window');
    const boot   = document.getElementById('tboot');
    const result = document.getElementById('tboot-result');
    if (!win || !boot || !result) return;

    const tbootU      = document.getElementById('tboot-u');
    const tbootBanner = document.getElementById('tboot-banner');
    const tbootCur1   = document.getElementById('tboot-cur1');
    const loading     = document.getElementById('tboot-loading');
    const loginDiv    = document.getElementById('tboot-login');

    const USERNAME = 'akahara_genious';

    const BOOT_LINES = [
      { ts: '   0.000', msg: 'Initializing stream portal...',        ok: true   },
      { ts: '   0.341', msg: 'akahara is ?? ... special',            ok: true   },
      { ts: '   0.724', msg: 'who has go voice ?? ... akahara',      ok: true   },
      { ts: '   1.189', msg: 'Mounting is Nosikakari',               ok: true   },
      { ts: '   1.803', msg: 'Configuring stream ok!! maybe...',     ok: true   },
      { ts: '   2.415', msg: 'U have to show my Twitch Stream ...',  ok: true   },
      { ts: '   3.067', msg: 'U have to show my Youtube Video ...',  ok: true   },
      { ts: '   3.812', msg: 'U have to love newt ...',              ok: true   },
      { ts: '   4.531', msg: "u have to be akahara's fan ...",       ok: ' Sure ' },
      { ts: '   5.102', msg: 'akahara become new version',           ok: true   },
    ];
    const BOOT_DELAYS = [0, 100, 180, 280, 430, 590, 730, 920, 1110, 1250];

    function wait(ms, cb) { setTimeout(cb, ms); }
    function type(el, text, msPer, cb) {
      let i = 0;
      const id = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(id); if (cb) cb(); }
      }, msPer);
    }

    function startBoot() {
      // ── フェーズ1: ローディングメッセージを順番に表示 ──
      BOOT_LINES.forEach((line, i) => {
        wait(BOOT_DELAYS[i], () => {
          const p = document.createElement('p');
          p.className = 'tboot-line';
          const okLabel = line.ok === true ? '  OK  ' : line.ok;
          p.innerHTML = `<span class="tboot-ts">[${line.ts}]</span> <span class="tboot-msg">${line.msg}</span>`
            + (line.ok ? ` <span class="tboot-ok">[ ${okLabel} ]</span>` : '');
          loading.appendChild(p);
        });
      });

      // ── フェーズ2: ログインプロンプト → バナー → カード ──
      wait(BOOT_DELAYS[BOOT_DELAYS.length - 1] + 180, () => {
        loginDiv.style.display = '';
        wait(250, () => {
          tbootCur1.style.display = 'none';
          type(tbootU, USERNAME, 18, () => {
            wait(120, () => {
              tbootBanner.style.display = '';
              initNewtAnimation();
              wait(250, () => {
                result.style.display = '';
                result.querySelectorAll('.terminal-card').forEach((card, i) => {
                  wait(i * 380 + 80, () => { card.classList.remove('tcard-hidden'); });
                });
              });
            });
          });
        });
      });
    }

    // ブートをリセットして最初から再生
    function resetAndRestart() {
      win.style.display = '';
      win.classList.remove('tw-minimized', 'tw-closed');
      loading.innerHTML = '';
      loginDiv.style.display = 'none';
      tbootBanner.style.display = 'none';
      tbootCur1.style.display = '';
      tbootU.textContent = '';
      result.style.display = 'none';
      result.querySelectorAll('.terminal-card').forEach(c => c.classList.add('tcard-hidden'));
      startBoot();
    }
    _restartTerminal = resetAndRestart;

    // terminal-window に revealed クラスが付いたら開始
    let vodsLoaded = false;
    function onSectionReached() {
      startBoot();
      if (!vodsLoaded) {
        vodsLoaded = true;
        loadTwitchVods();
        loadYoutubeShorts();
      }
    }

    const mo = new MutationObserver(() => {
      if (win.classList.contains('revealed')) {
        mo.disconnect();
        onSectionReached();
      }
    });
    mo.observe(win, { attributes: true, attributeFilter: ['class'] });
    if (win.classList.contains('revealed')) onSectionReached();
  })();

  // ===========================
  // ターミナル ウィンドウコントロール（赤・黄・緑ドット）
  // ===========================
  (function initWindowControls() {
    const win = document.querySelector('.terminal-window');
    if (!win) return;
    const dotRed    = win.querySelector('.dot-red');
    const dotYellow = win.querySelector('.dot-yellow');
    const dotGreen  = win.querySelector('.dot-green');
    if (!dotRed || !dotYellow || !dotGreen) return;

    // 赤: ウィンドウごと非表示（ナビの「活動」で復活）
    dotRed.addEventListener('click', () => {
      win.style.display = 'none';
    });

    // 黄: タイトルバーのみに最小化
    dotYellow.addEventListener('click', () => {
      win.classList.add('tw-minimized');
      win.classList.remove('tw-closed');
    });

    // 緑: 最小化状態から全表示に戻す
    dotGreen.addEventListener('click', () => {
      win.classList.remove('tw-minimized', 'tw-closed');
    });

    // ナビ「活動」クリック → ウィンドウが非表示なら最初からリスタート
    const activitiesLink = document.querySelector('a[href="#activities"]');
    if (activitiesLink) {
      activitiesLink.addEventListener('click', () => {
        if (win.style.display === 'none' && _restartTerminal) {
          _restartTerminal();
        }
      });
    }
  })();

  // ===========================
  // 草原ブレード アニメーション
  // ===========================
  (function initGrass() {
    const container = document.getElementById('platforms-moss');
    if (!container) return;
    const r  = (n) => Math.random() * n;
    const ri = (n) => Math.floor(r(n));
    const colors = [
      '#3a8c1a','#4aa020','#2e7012','#56b828',
      '#3d9918','#2a6512','#48a81e','#5ab224',
      '#328a16','#3f9a1a',
    ];

    let bladeData = [];
    let rafId     = null;
    let lastMX    = null;
    const REACH   = 90;   // 影響半径 px
    const PUSH    = 0.14; // マウス速度→角度 係数
    const DECAY   = 0.87; // バネ戻り係数（フレームごと）

    function build() {
      container.innerHTML = '';
      bladeData = [];
      const W       = container.offsetWidth || window.innerWidth;
      const SPACING = 10;
      const COUNT   = Math.ceil(W / SPACING) + 4;
      for (let i = 0; i < COUNT; i++) {
        const el    = document.createElement('div');
        el.className = 'grass-blade';
        const w     = 10 + r(7);
        const h     = 20 + r(28);
        const x     = -8 + (i / (COUNT - 1)) * (W + 16);
        const lean  = parseFloat((-12 + r(24)).toFixed(1));
        const dur   = (1.8 + r(2.2)).toFixed(2);
        const delay = r(4).toFixed(2);
        const color = colors[ri(colors.length)];
        el.style.cssText = [
          `left:${x.toFixed(0)}px`,
          `width:${w.toFixed(0)}px`,
          `height:${h.toFixed(0)}px`,
          `background:linear-gradient(to bottom,${color} 0%,${color}cc 55%,${color}22 100%)`,
          `--lean:${lean}deg`,
          `animation-duration:${dur}s`,
          `animation-delay:-${delay}s`,
        ].join(';');
        container.appendChild(el);
        bladeData.push({ el, lean0: lean, push: 0, cx: x + w / 2 });
      }
    }

    // バネ戻りループ
    function tick() {
      let any = false;
      for (const b of bladeData) {
        if (Math.abs(b.push) > 0.3) {
          b.push *= DECAY;
          b.el.style.setProperty('--lean', `${(b.lean0 + b.push).toFixed(1)}deg`);
          any = true;
        } else if (b.push !== 0) {
          b.push = 0;
          b.el.style.setProperty('--lean', `${b.lean0}deg`);
        }
      }
      rafId = any ? requestAnimationFrame(tick) : null;
    }

    // マウスで撫でる
    document.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      if (e.clientY < rect.top - 40 || e.clientY > rect.bottom + 20) {
        lastMX = null;
        return;
      }
      const mx    = e.clientX - rect.left;
      const delta = lastMX !== null ? e.clientX - lastMX : 0;
      lastMX = e.clientX;
      if (Math.abs(delta) < 1) return;

      for (const b of bladeData) {
        const dist = Math.abs(mx - b.cx);
        if (dist < REACH) {
          const inf = 1 - dist / REACH;
          b.push = Math.max(-50, Math.min(50, b.push + delta * PUSH * inf * inf));
          b.el.style.setProperty('--lean', `${(b.lean0 + b.push).toFixed(1)}deg`);
        }
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    build();
    let _rt;
    window.addEventListener('resize', () => { clearTimeout(_rt); _rt = setTimeout(build, 150); });
  })();

// ===========================
  // ブログカード: 最新アイキャッチを動的取得
  // ===========================
  (async function initBlogHeaders() {
    const blogs = [
      { api: 'https://akahara-vlab.com/wp-json/wp/v2/posts?per_page=1&_embed', imgId: 'card-header-vlab' },
      { api: 'https://wasabigarden.tech/wp-json/wp/v2/posts?per_page=1&_embed', imgId: 'card-header-ow' },
    ];
    for (const { api, imgId } of blogs) {
      try {
        const res = await fetch(api);
        if (!res.ok) continue;
        const [post] = await res.json();
        const url = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        if (url) document.getElementById(imgId).src = url;
      } catch (_) { /* フォールバック画像のまま */ }
    }
  })();

  // ===========================
  // GifMon — 追従フロートCTA
  // ===========================
  (function gifmonFloatCta() {
    var cta = document.getElementById('gifmon-float-cta');
    var section = document.getElementById('gifmon');
    if (!cta || !section) return;

    var observer = new IntersectionObserver(function (entries) {
      // セクションが見えていたら非表示、見えていなければ表示
      cta.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0 });

    observer.observe(section);
  })();

  // ===========================
  // GifMon — 期間限定無料バナー
  // ===========================
  (function gifmonFreeBanner() {
    var deadline = new Date('2026-04-20T00:00:00+09:00'); // 4/19 23:59 JST まで
    var banner = document.getElementById('gifmon-free-banner');
    var until  = document.getElementById('gifmon-free-until');
    var floatFree = document.getElementById('gifmon-float-free');
    if (!banner) return;

    function update() {
      var now = new Date();
      if (now >= deadline) {
        banner.style.display = 'none';
        if (floatFree) floatFree.style.display = 'none';
        return;
      }
      banner.style.display = '';
      if (floatFree) floatFree.style.display = '';
      var diff = deadline - now;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var parts = [];
      if (d > 0) parts.push(d + '日');
      parts.push(h + '時間' + m + '分');
      until.textContent = '残り ' + parts.join('') + '（4/19まで）';
    }

    update();
    setInterval(update, 60000);
  })();

  // ===========================
  // GifMon Demo — fake metrics
  // ===========================
  (function gifmonDemo() {
    if (!document.getElementById('gm-demo-mini')) return;

    function rnd(min, max) { return min + Math.random() * (max - min); }
    function cls(el, v, w, d) {
      el.classList.remove('gm-warn', 'gm-danger');
      if (v >= d) el.classList.add('gm-danger');
      else if (v >= w) el.classList.add('gm-warn');
    }

    function tick() {
      var cpu = rnd(30, 72), gpu = rnd(25, 68), ram = rnd(55, 78);
      var ping = rnd(8, 35), up = rnd(2, 8), dl = rnd(8, 22);
      var mic = rnd(10, 55), audio = rnd(4, 18), pkt = rnd(0, 0.15), drop = rnd(0, 0.08);

      // Mini
      var mc = document.getElementById('gm-mini-cpu');
      mc.textContent = cpu.toFixed(0) + '%'; cls(mc, cpu, 65, 80);
      var mg = document.getElementById('gm-mini-gpu');
      mg.textContent = gpu.toFixed(0) + '%'; cls(mg, gpu, 70, 85);
      var mr = document.getElementById('gm-mini-ram');
      mr.textContent = ram.toFixed(0) + '%'; cls(mr, ram, 75, 90);
      var mp = document.getElementById('gm-mini-ping');
      mp.textContent = ping.toFixed(0) + 'ms'; cls(mp, ping, 100, 200);
      document.getElementById('gm-mini-up').textContent = up.toFixed(1) + 'M';
      document.getElementById('gm-mini-dl').textContent = dl.toFixed(1) + 'M';

      // Float mini
      var fc = document.getElementById('gm-float-cpu');
      if (fc) {
        fc.textContent = cpu.toFixed(0) + '%'; cls(fc, cpu, 65, 80);
        var fg = document.getElementById('gm-float-gpu');
        fg.textContent = gpu.toFixed(0) + '%'; cls(fg, gpu, 70, 85);
        var fr = document.getElementById('gm-float-ram');
        fr.textContent = ram.toFixed(0) + '%'; cls(fr, ram, 75, 90);
        var fpp = document.getElementById('gm-float-ping');
        fpp.textContent = ping.toFixed(0) + 'ms'; cls(fpp, ping, 100, 200);
        document.getElementById('gm-float-up').textContent = up.toFixed(1) + 'M';
        document.getElementById('gm-float-dl').textContent = dl.toFixed(1) + 'M';
      }

      // Full
      function bar(barId, valId, v, w, d, suffix) {
        var b = document.getElementById(barId);
        var e = document.getElementById(valId);
        b.style.width = Math.min(100, v) + '%';
        e.textContent = v.toFixed(1) + (suffix || '%');
        b.classList.remove('gm-warn', 'gm-danger');
        e.classList.remove('gm-warn', 'gm-danger');
        if (v >= d) { b.classList.add('gm-danger'); e.classList.add('gm-danger'); }
        else if (v >= w) { b.classList.add('gm-warn'); e.classList.add('gm-warn'); }
      }
      bar('gm-full-bar-cpu', 'gm-full-cpu', cpu, 65, 80);
      bar('gm-full-bar-gpu', 'gm-full-gpu', gpu, 70, 85);
      bar('gm-full-bar-ram', 'gm-full-ram', ram, 75, 90);
      bar('gm-full-bar-mic', 'gm-full-mic', mic, 80, 95);

      document.getElementById('gm-full-up').textContent = up.toFixed(2) + ' MB/s';
      document.getElementById('gm-full-dl').textContent = dl.toFixed(2) + ' MB/s';
      var fp = document.getElementById('gm-full-ping');
      fp.textContent = ping.toFixed(0) + ' ms'; cls(fp, ping, 100, 200);
      document.getElementById('gm-full-pkt').textContent = pkt.toFixed(2) + '%';
      document.getElementById('gm-full-audio').textContent = audio.toFixed(0) + ' ms';
      document.getElementById('gm-full-drop').textContent = drop.toFixed(2) + '%';
    }

    tick();
    setInterval(tick, 2000);
  })();

})();
