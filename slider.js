document.addEventListener("DOMContentLoaded", () => {
    /* Swiper varsa başlat (kullanmıyorsan bu blok kalabilir / sorun çıkarmaz) */
    if (window.Swiper) {
        try {
            new Swiper(".swiper", {
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 1,
                loop: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
            });
        } catch (_) { }
    }

    /* Reveal: .hidden -> .show (başlık kartları vb.) */
    const revealIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("show");
                revealIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".hidden").forEach(el => revealIO.observe(el));

    /* KPI COUNTERS (sayfada varsa) */
    const counters = document.querySelectorAll(".count");
    if (!counters.length) return;

    const DURATION = 1400;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCount(el) {
        const target = parseFloat(el.dataset.target || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const suffix = el.dataset.suffix || "";
        const t0 = performance.now();

        function frame(now) {
            const p = Math.min(1, (now - t0) / DURATION);
            const val = target * easeOut(p);
            el.textContent = val.toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const countIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCount(e.target);
                countIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.35 });

    counters.forEach(el => {
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        el.textContent = (0).toFixed(decimals) + (el.dataset.suffix || "");
        countIO.observe(el);
    });
});
