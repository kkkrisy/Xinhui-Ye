/* Xinhui Ye — site interactions */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Accordions (Education / Work on the About page)
  document.querySelectorAll('.accordion__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.accordion__item');
      item.classList.toggle('is-open');
      var open = item.classList.contains('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      var sign = head.querySelector('.accordion__sign');
      if (sign) sign.textContent = open ? '–' : '+';
    });
  });

  // Minimal carousel: clicking a dot just updates the highlighted dot.
  // (Real image swapping is wired once you add high-res images.)
  document.querySelectorAll('.dots').forEach(function (group) {
    group.querySelectorAll('.dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        group.querySelectorAll('.dot').forEach(function (d) { d.classList.remove('dot--on'); });
        dot.classList.add('dot--on');
      });
    });
  });

  // Contact form — no backend yet. Shows a confirmation in place.
  document.querySelectorAll('.form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form__status');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form__status form__note';
        form.appendChild(note);
      }
      note.textContent = 'Thanks — connect a form service (e.g. Formspree) to actually receive this. See the README.';
    });
  });
})();
