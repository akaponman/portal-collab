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
    youtubeChannelId: 'UC1dbbwy-RbesfO0Wq0xMAow',
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
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:none;position:absolute;inset:0;z-index:2;';
    container.style.position = 'relative';
    container.appendChild(iframe);

    // ステータス更新
    const overlay = container.querySelector('.stream-offline-overlay');
    if (overlay) {
      overlay.querySelector('.stream-offline-status').textContent = 'LIVE';
      overlay.style.background = 'transparent';
    }
  }

  async function pollLiveStatus() {
    // Twitch check
    try {
      const resp = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(`https://www.twitch.tv/${CONFIG.twitchUsername}`)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await resp.json();
      if (data && data.title && !data.error) {
        showLiveStream('twitch');
        showInlineStream('twitch');
        return;
      }
    } catch { /* offline */ }

    // YouTube check
    try {
      const resp = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/channel/${CONFIG.youtubeChannelId}/live`)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await resp.json();
      if (data && data.title && !data.error) {
        showLiveStream('youtube');
        showInlineStream('youtube');
        return;
      }
    } catch { /* offline */ }
  }

  pollLiveStatus();
  setInterval(pollLiveStatus, CONFIG.liveCheckInterval);

  // ===========================
  // Blog: WP REST APIから最新記事を取得
  // ===========================
  const BLOG_API = 'https://akahara-vlab.com/wp-json/wp/v2/posts?per_page=3&_embed=wp:featuredmedia&_fields=title,link,date,excerpt,_links';
  const blogGrid = document.getElementById('blog-grid');

  async function loadLatestPosts() {
    try {
      const res = await fetch(BLOG_API);
      if (!res.ok) throw new Error(res.status);
      const posts = await res.json();

      const animations = ['scroll-slide-left', '', 'scroll-slide-right'];
      const delays = [100, 250, 400];

      blogGrid.innerHTML = posts.map((post, i) => {
        const title = post.title.rendered;
        const link = post.link;
        const date = new Date(post.date);
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim().slice(0, 80);
        const media = post._embedded && post._embedded['wp:featuredmedia'];
        const thumb = media && media[0] && media[0].source_url ? media[0].source_url : '';
        const animClass = animations[i] ? ' ' + animations[i] : '';

        return `<a href="${link}" target="_blank" rel="noopener" class="blog-card scroll-reveal${animClass}" data-delay="${delays[i]}">
          <div class="blog-card-thumb">
            ${thumb ? `<img src="${thumb}" alt="" loading="lazy">` : '<div style="height:100%;background:var(--bg-alt)"></div>'}
          </div>
          <div class="blog-card-body">
            <time class="blog-card-date">${dateStr}</time>
            <h3 class="blog-card-title">${title}</h3>
            <p class="blog-card-excerpt">${excerpt}</p>
          </div>
        </a>`;
      }).join('');

      blogGrid.querySelectorAll('.scroll-reveal').forEach((el) => revealObserver.observe(el));
    } catch (e) {
      blogGrid.innerHTML = '<p style="text-align:center;color:var(--text-sub)">記事の読み込みに失敗しました。<a href="https://akahara-vlab.com" target="_blank">ブログを直接見る</a></p>';
    }
  }

  loadLatestPosts();

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
  // Easter egg: キャラクリック
  // ===========================
  const speeches = {
    akahara: ['やっほー！', 'いらっしゃい！', '配信見にきてね！', 'わさびー！', 'テクノロジーだいすき'],
    wasabi: ['よろしくね', '僕が記事書いてます', 'Claude最高', 'ちゃんと読んでね', 'いそがしいんだけど'],
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
})();
