document.addEventListener('DOMContentLoaded', init);

async function init() {
  initHeroFade();
  await loadPeople();
}

async function loadPeople() {
  const grid = document.querySelector('.grid');
  if (!grid) return;

  try {
    const response = await fetch('data/data.json');
    const people = await response.json();

    const sortedPeople = [...people].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    const fragment = document.createDocumentFragment();

    sortedPeople.forEach(person => {
      fragment.appendChild(createCard(person));
    });

    grid.appendChild(fragment);

    initObserver();
    initNameReveal(grid);

  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

function createCard(person) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = person.id;

  card.innerHTML = `
    <div class="image-container">
      <img src="${person.childImg}" class="child" alt="Детское фото">
      <img src="${person.adultImg}" class="adult" alt="Взрослое фото">
      <div class="card-title hidden-name">${person.name}</div>
    </div>
  `;

  card.addEventListener('click', () => {
    window.location.href = `person.html?id=${person.id}`;
  });

  return card;
}

function initNameReveal(grid) {
    grid.addEventListener('touchstart', (e) => {
        const container = e.target.closest('.image-container');
        if (!container) return;

        // если это короткий тап — идём по ссылке
        container.pressTimer = setTimeout(() => {
            container.classList.add('show-name'); // показываем ФИО
        }, 600); // 600ms — стандартная длительность long press
    });

    grid.addEventListener('touchend', (e) => {
        const container = e.target.closest('.image-container');
        if (!container) return;

        clearTimeout(container.pressTimer);

        // если класс show-name уже есть — убираем через короткое время
        if (container.classList.contains('show-name')) {
            setTimeout(() => container.classList.remove('show-name'), 1500);
            e.preventDefault(); // отменяем переход на другую страницу
        }
    });
}

function initObserver() {
  const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

function initHeroFade() {
  const hero = document.querySelector('.title');
  const content = document.querySelector('.title-content');
  if (!hero || !content) return;

  const maxScroll = window.innerHeight * 0.8;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / maxScroll, 1);

    hero.style.opacity = 1 - progress;
    hero.style.transform = `translateY(-${scrollY * 0.95}px)`;

    const scale = 1 - progress * 0.3;
    content.style.transform = `scale(${scale})`;
  });
}