(function () {
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots img');
  var current = 0;
  var timer;

  function goTo(index) {
    slides[current].classList.remove('hero-slide--active');
    dots[current].src = 'image/Vector.svg';
    current = index;
    slides[current].classList.add('hero-slide--active');
    dots[current].src = 'image/1Vector.svg';
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(function () { goTo((current + 1) % slides.length); }, 4000);
    });
  });

  dots[0].src = 'image/1Vector.svg';
  timer = setInterval(function () { goTo((current + 1) % slides.length); }, 4000);
})();

(function () {
  if (window.matchMedia('(max-width: 480px)').matches) return;

  var items = document.querySelectorAll('.how-item');
  var phone = document.querySelector('.how-phone');

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      items.forEach(function (i) {
        i.classList.remove('how-item--active');
        i.classList.add('how-item--dimmed');
      });
      item.classList.remove('how-item--dimmed');
      item.classList.add('how-item--active');

      var newSrc = item.dataset.image;
      if (newSrc) {
        phone.style.opacity = '0';
        setTimeout(function () {
          phone.src = newSrc;
          phone.style.opacity = '1';
        }, 200);
      }
    });
  });

  document.querySelector('.how-items').addEventListener('mouseleave', function () {
    items.forEach(function (i) {
      i.classList.remove('how-item--active', 'how-item--dimmed');
      i.classList.add('how-item--dimmed');
    });
    items[0].classList.remove('how-item--dimmed');
    items[0].classList.add('how-item--active');

    phone.style.opacity = '0';
    setTimeout(function () {
      phone.src = items[0].dataset.image;
      phone.style.opacity = '1';
    }, 200);
  });
})();

(function () {
  var resultItems = document.querySelectorAll('.results-item');
  var floatEl = document.querySelector('.results-float');
  var floatImg = document.querySelector('.results-float-img');
  var listWrap = document.querySelector('.results-list-wrap');
  var cardTitle = document.querySelector('.results-card-title');
  var cardNote = document.querySelector('.results-card-note');
  var cardNum = document.querySelector('.results-card-num');

  function activateItem(item) {
    resultItems.forEach(function (i) {
      i.classList.remove('results-item--active');
      i.classList.add('results-item--dimmed');
    });
    item.classList.remove('results-item--dimmed');
    item.classList.add('results-item--active');

    var newSrc = item.dataset.image;
    if (newSrc && floatImg.src.indexOf(newSrc) === -1) {
      floatImg.style.opacity = '0';
      setTimeout(function () {
        floatImg.src = newSrc;
        floatImg.style.opacity = '1';
      }, 200);
    }

    var nameEl = item.querySelector('.results-item-name');
    var noteEl = item.querySelector('.results-item-note');
    var numEl  = item.querySelector('.results-item-num');
    if (cardTitle && nameEl) cardTitle.textContent = nameEl.childNodes[0].textContent.trim();
    if (cardNote  && noteEl) cardNote.textContent  = noteEl.textContent.trim().replace(/\s+/g, ' ');
    if (cardNum   && numEl)  cardNum.textContent   = numEl.textContent.trim();

    floatEl.style.opacity = '1';
  }

  if (!window.matchMedia('(max-width: 480px)').matches) {
    resultItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        activateItem(item);
      });
    });

    listWrap.addEventListener('mouseleave', function () {
      activateItem(resultItems[2]);
      floatEl.style.opacity = '1';
    });

    activateItem(resultItems[2]);
  }
})();

(function () {
  var reviews = [
    { left: 'image/Frame 37934.svg',  right: 'image/Frame 37933.svg',  tag: 'Стиральная машина Indesit' },
    { left: 'image/Frame1137934.svg', right: 'image/Frame1237981.svg', tag: 'Холодильник Samsung' },
    { left: 'image/Frame1337983.svg', right: 'image/Fram1437982.svg',  tag: 'Кондиционер LG' }
  ];

  var leftImg = document.getElementById('review-left');
  var rightImg = document.getElementById('review-right');
  var tagEl   = document.getElementById('review-tag');
  var dots    = document.querySelectorAll('.review-dots img');
  var current  = 0;
  var timer;
  var busy     = false;
  var isMobile = window.matchMedia('(max-width: 480px)').matches;

  function setTx(x, animate) {
    var t = animate ? 'transform 0.3s ease' : 'none';
    leftImg.style.transition  = t;
    rightImg.style.transition = t;
    leftImg.style.transform   = 'translateX(' + x + 'px)';
    rightImg.style.transform  = 'translateX(' + x + 'px)';
  }

  function resetTr() {
    leftImg.style.transition  = 'opacity 0.4s ease';
    rightImg.style.transition = 'opacity 0.4s ease';
    leftImg.style.transform   = 'translateX(0)';
    rightImg.style.transform  = 'translateX(0)';
  }

  function updateDots(next) {
    dots[current].src = 'image/Vector.svg';
    current = next;
    dots[current].src = 'image/1Vector.svg';
  }

  /* Physical slide: dir -1 = forward (left), dir 1 = backward (right) */
  function slideTo(next, dir) {
    if (busy || next === current) return;
    busy = true;
    var r = reviews[next];
    var W = window.innerWidth;

    setTx(dir * W, true);

    setTimeout(function () {
      leftImg.style.transition  = 'none';
      rightImg.style.transition = 'none';
      leftImg.src  = r.left;
      rightImg.src = r.right;
      if (tagEl) tagEl.textContent = r.tag;
      updateDots(next);
      leftImg.style.transform  = 'translateX(' + (-dir * W) + 'px)';
      rightImg.style.transform = 'translateX(' + (-dir * W) + 'px)';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTx(0, true);
          setTimeout(function () { resetTr(); busy = false; }, 320);
        });
      });
    }, 300);
  }

  /* Opacity fade for desktop */
  function fadeTo(next) {
    if (busy || next === current) return;
    busy = true;
    var r = reviews[next];
    leftImg.style.opacity  = '0';
    rightImg.style.opacity = '0';
    if (tagEl) tagEl.style.opacity = '0';
    setTimeout(function () {
      leftImg.src  = r.left;
      rightImg.src = r.right;
      if (tagEl) tagEl.textContent = r.tag;
      updateDots(next);
      leftImg.style.opacity  = '1';
      rightImg.style.opacity = '1';
      if (tagEl) tagEl.style.opacity = '1';
      busy = false;
    }, 400);
  }

  function navigate(next) {
    if (window.matchMedia('(max-width: 480px)').matches) {
      slideTo(next, next > current ? -1 : 1);
    } else {
      fadeTo(next);
    }
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(timer);
      navigate(i);
      if (!isMobile) timer = setInterval(function () { navigate((current + 1) % reviews.length); }, 4000);
    });
  });

  leftImg.style.transition  = 'opacity 0.4s ease';
  rightImg.style.transition = 'opacity 0.4s ease';
  if (tagEl) tagEl.style.transition = 'opacity 0.4s ease';

  if (!isMobile) timer = setInterval(function () { navigate((current + 1) % reviews.length); }, 4000);

  /* ── Touch swipe ── */
  var section  = document.querySelector('.review');
  var startX   = 0;
  var dragging = false;

  section.addEventListener('touchstart', function (e) {
    if (busy) return;
    startX   = e.touches[0].clientX;
    dragging = true;
    leftImg.style.transition  = 'none';
    rightImg.style.transition = 'none';
  }, { passive: true });

  section.addEventListener('touchmove', function (e) {
    if (!dragging || busy) return;
    var dx = e.touches[0].clientX - startX;
    leftImg.style.transform  = 'translateX(' + dx + 'px)';
    rightImg.style.transform = 'translateX(' + dx + 'px)';
  }, { passive: true });

  section.addEventListener('touchend', function (e) {
    if (!dragging) return;
    dragging = false;
    var dx = e.changedTouches[0].clientX - startX;

    if (Math.abs(dx) < 50 || busy) {
      setTx(0, true);
      setTimeout(resetTr, 320);
      return;
    }

    busy = true;
    clearInterval(timer);

    var goLeft = dx < 0;
    var next = goLeft
      ? (current + 1) % reviews.length
      : (current - 1 + reviews.length) % reviews.length;
    var W = window.innerWidth;
    var r = reviews[next];

    setTx(goLeft ? -W : W, true);

    setTimeout(function () {
      leftImg.style.transition  = 'none';
      rightImg.style.transition = 'none';
      leftImg.src  = r.left;
      rightImg.src = r.right;
      if (tagEl) tagEl.textContent = r.tag;
      updateDots(next);
      leftImg.style.transform  = 'translateX(' + (goLeft ? W : -W) + 'px)';
      rightImg.style.transform = 'translateX(' + (goLeft ? W : -W) + 'px)';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTx(0, true);
          setTimeout(function () {
            resetTr();
            busy = false;
            if (!isMobile) timer = setInterval(function () { navigate((current + 1) % reviews.length); }, 4000);
          }, 320);
        });
      });
    }, 300);
  }, { passive: true });
})();

(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('faq-item--open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('faq-item--open');
      });
      if (!isOpen) item.classList.add('faq-item--open');
    });
  });
})();
