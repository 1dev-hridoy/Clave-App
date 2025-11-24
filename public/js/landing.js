if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

const lenis = typeof Lenis !== 'undefined' ? new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
}) : null;

if (lenis) {
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

    tl.to(".hero-anim", {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.2
    });

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1
        });
    });

    gsap.utils.toArray('.bento-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1
        });
    });
}
