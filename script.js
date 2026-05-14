document.addEventListener('DOMContentLoaded', () => {
    const bodyPage = document.body.dataset.page;
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a[data-page-link]');
    const revealItems = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-progress');
    const contactItems = document.querySelectorAll('[data-copy]');
    const toast = document.querySelector('.toast');
    const backToTop = document.querySelector('.back-to-top');

    const closeMenu = () => {
        if (!hamburger || !navMenu) return;
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });
    }

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.pageLink === bodyPage);
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('click', (event) => {
        if (!navMenu || !hamburger || !navMenu.classList.contains('active')) return;
        if (event.target instanceof Node && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    if (revealItems.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const animateSkillBars = () => {
        skillBars.forEach((bar) => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = bar.getAttribute('data-progress') || '75';
                bar.style.width = `${progress}%`;
            }
        });
    };

    contactItems.forEach((item) => {
        item.addEventListener('click', async () => {
            const text = item.getAttribute('data-copy');
            if (!text) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const input = document.createElement('input');
                    input.value = text;
                    input.setAttribute('readonly', 'readonly');
                    input.style.position = 'fixed';
                    input.style.opacity = '0';
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    input.remove();
                }
                showToast(`已复制到剪贴板：${text}`);
            } catch (error) {
                showToast('复制失败，请手动复制');
            }
        });
    });

    const updateBackToTop = () => {
        if (!backToTop) return;
        backToTop.classList.toggle('visible', window.scrollY > 300);
    };

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            animateSkillBars();
            updateBackToTop();
            ticking = false;
        });
    }, { passive: true });

    animateSkillBars();
    updateBackToTop();
});
