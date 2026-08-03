// Hasebul Hassan Chowdhury — shared site script
(function () {
    // year stamp in footer
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    // mobile nav toggle
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // mark active nav link based on current page
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-link[data-page]').forEach(function (a) {
        if (a.getAttribute('data-page').toLowerCase() === path) a.classList.add('is-active');
    });
})();
