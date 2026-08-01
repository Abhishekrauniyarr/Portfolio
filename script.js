document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  /* ---------- Theme ---------- */
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  const toggleTheme = () => {
    const isDark = body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  };

  document.getElementById('themeToggleDesktop').addEventListener('click', toggleTheme);
  document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme);

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(el.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      menuToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  document.getElementById('scrollDown').addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Typing effect ---------- */
  const typedTextEl = document.getElementById('typedText');
  const textToType = "I'm a Student Developer";
  let charIndex = 0;

  const typeNext = () => {
    if (charIndex < textToType.length) {
      typedTextEl.textContent += textToType[charIndex];
      charIndex++;
      setTimeout(typeNext, 150);
    }
  };
  typeNext();

  /* ---------- Scroll-triggered fade-in + progress bars ---------- */
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.progress-bar').forEach((bar) => {
          bar.style.width = bar.getAttribute('data-width');
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.about-animate, .contact-animate').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formspreeId = form.dataset.formspreeId;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      } else {
        errorMsg.style.display = 'block';
        console.error('Error sending email:', result.error);
      }
    } catch (err) {
      errorMsg.style.display = 'block';
      console.error('Network error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
});
