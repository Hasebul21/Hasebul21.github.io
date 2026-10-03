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

/* Masonry card grids: span each card over as many 1px rows as it is tall. */
(function () {
    var grids = document.querySelectorAll('.card-grid');
    if (!grids.length || !('ResizeObserver' in window)) return;
    var GAP = 20;
    var pending = false;

    function layout() {
        pending = false;
        grids.forEach(function (g) {
            var cols = getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length;
            var items = Array.prototype.slice.call(g.children);
            if (cols < 2) {
                g.classList.remove('is-masonry');
                items.forEach(function (c) { c.style.gridRowEnd = ''; });
                return;
            }
            g.classList.add('is-masonry');
            items.forEach(function (c) { c.style.alignSelf = ''; c.style.gridRowEnd = ''; });
            var spans = items.map(function (c) {
                return Math.ceil(c.getBoundingClientRect().height + GAP);
            });
            items.forEach(function (c, i) { c.style.gridRowEnd = 'span ' + spans[i]; });
            // A full-width card starts below the tallest column; stretch the last
            // card of every shorter column down to it so no hole is left above.
            var band = [];
            items.forEach(function (c, i) {
                if (getComputedStyle(c).gridColumnStart === '1' && getComputedStyle(c).gridColumnEnd === '-1') {
                    var bottoms = band.map(function (j) { return items[j].getBoundingClientRect().bottom; });
                    var max = Math.max.apply(null, bottoms.concat([0]));
                    var lastInCol = {};
                    band.forEach(function (j) { lastInCol[Math.round(items[j].getBoundingClientRect().left)] = j; });
                    Object.keys(lastInCol).forEach(function (k) {
                        var j = lastInCol[k];
                        var extra = Math.round(max - items[j].getBoundingClientRect().bottom);
                        if (extra > 0) {
                            items[j].style.gridRowEnd = 'span ' + (spans[j] + extra);
                            items[j].style.alignSelf = 'stretch';
                            items[j].style.marginBottom = GAP + 'px';
                        }
                    });
                    band = [];
                } else {
                    band.push(i);
                }
            });
        });
    }

    function schedule() {
        if (pending) return;
        pending = true;
        setTimeout(layout, 30);
    }

    var ro = new ResizeObserver(schedule);
    grids.forEach(function (g) {
        ro.observe(g);
        Array.prototype.forEach.call(g.children, function (c) { ro.observe(c); });
    });
    window.addEventListener('load', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    schedule();
})();
