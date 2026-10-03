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

    // certificate lightbox: thumbnails link to the full image, so without
    // JS (or without <dialog> support) the link simply opens the JPEG
    var thumbs = document.querySelectorAll('a.cert-thumb');
    if (thumbs.length && typeof HTMLDialogElement === 'function') {
        var dialog = document.createElement('dialog');
        dialog.className = 'lightbox';
        dialog.setAttribute('aria-labelledby', 'lightboxCaption');

        var inner = document.createElement('div');
        inner.className = 'lightbox-inner';

        var bar = document.createElement('div');
        bar.className = 'lightbox-bar';
        var caption = document.createElement('p');
        caption.className = 'lightbox-caption';
        caption.id = 'lightboxCaption';
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'lightbox-close';
        closeBtn.textContent = 'Close';
        bar.appendChild(caption);
        bar.appendChild(closeBtn);

        var big = document.createElement('img');
        big.className = 'lightbox-img';
        big.alt = '';

        inner.appendChild(bar);
        inner.appendChild(big);
        dialog.appendChild(inner);
        document.body.appendChild(dialog);

        var opener = null;

        closeBtn.addEventListener('click', function () {
            dialog.close();
        });
        // a click on the backdrop targets the dialog element itself
        dialog.addEventListener('click', function (e) {
            if (e.target === dialog) dialog.close();
        });
        dialog.addEventListener('close', function () {
            big.removeAttribute('src');
            if (opener) opener.focus();
            opener = null;
        });

        thumbs.forEach(function (link) {
            link.addEventListener('click', function (e) {
                // let modified clicks open the image in a new tab as usual
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                var thumb = link.querySelector('img');
                opener = link;
                caption.textContent = link.getAttribute('data-caption') || (thumb ? thumb.alt : '');
                big.alt = thumb ? thumb.alt : '';
                big.src = link.getAttribute('href');
                dialog.showModal();
                closeBtn.focus();
            });
        });
    }
})();
