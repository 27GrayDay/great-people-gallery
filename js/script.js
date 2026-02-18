const grid = document.querySelector(".grid");
document.addEventListener("DOMContentLoaded", initHeroScroll);

fetch("data/data.json")
  .then(response => response.json())
  .then(people => {

    people.forEach(person => {

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image-container">
          <img src="${person.childImg}" class="child" alt="Детское фото ${person.name}">
          <img src="${person.adultImg}" class="adult" alt="Взрослое фото ${person.name}">
        </div>
        <div class="card-title">${person.name}</div>
      `;

      card.onclick = () => {
        location.href = `person.html?id=${person.id}`;
      };

      grid.appendChild(card);
    });

    initHoverEffects();
    initObserver();
  });

function initHoverEffects() {
  const containers = document.querySelectorAll(".image-container");

  containers.forEach(container => {
    const child = container.querySelector(".child");
    const adult = container.querySelector(".adult");

    container.addEventListener("mouseenter", () => {
      adult.style.opacity = 1;
      child.style.opacity = 0;
    });

    container.addEventListener("mouseleave", () => {
      adult.style.opacity = 0;
      child.style.opacity = 1;
    });

    container.addEventListener("touchstart", () => {
      adult.style.opacity = 1;
      child.style.opacity = 0;
    });

    container.addEventListener("touchend", () => {
      adult.style.opacity = 0;
      child.style.opacity = 1;
    });
  });
}

function initObserver() {
  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

function initHeroScroll() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    function handleScroll() {
        if (window.scrollY > 50) {
            hero.classList.add("shrink");
        } else {
            hero.classList.remove("shrink");
        }
    }

    window.addEventListener("scroll", handleScroll);
}

// person.html

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("data/data.json")
  .then(res => res.json())
  .then(people => {

    const person = people.find(p => p.id === id);
    if (!person) return;

    // Заголовок страницы
    document.title = person.name;
    document.getElementById("person-name").textContent = person.name;

    // Историческая справка
    const info = document.getElementById("historical-info");
    info.textContent = person.historicalInfo || "Информация находится в разработке.";

    // Фото
    document.getElementById("person-child").src = person.childImg;
    document.getElementById("person-adult").src = person.adultImg;

    // Факты
    const factsList = document.getElementById("facts-list");
    factsList.innerHTML = "";

    if (person.facts.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Факты будут добавлены редакторами.";
        factsList.appendChild(li);
    } else {
        person.facts.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.title}</strong>: ${item.fact}`;
            factsList.appendChild(li);
        });
    }

    // Цитаты
    const quotesContainer = document.getElementById("quotes-container");
    quotesContainer.innerHTML = "";

    if (person.quotes.length === 0) {
        quotesContainer.textContent = "Цитаты будут добавлены редакторами.";
    } else {
        person.quotes.forEach(q => {
            const block = document.createElement("blockquote");
            block.textContent = q;
            quotesContainer.appendChild(block);
        });
    }

    initImageHover();
  });


function initImageHover() {
    const container = document.querySelector(".image-container");
    const child = document.querySelector(".child");
    const adult = document.querySelector(".adult");

    container.addEventListener("mouseenter", () => {
        adult.style.opacity = 1;
        child.style.opacity = 0;
    });

    container.addEventListener("mouseleave", () => {
        adult.style.opacity = 0;
        child.style.opacity = 1;
    });

    container.addEventListener("touchstart", () => {
        adult.style.opacity = 1;
        child.style.opacity = 0;
    });

    container.addEventListener("touchend", () => {
        adult.style.opacity = 0;
        child.style.opacity = 1;
    });

    container.addEventListener("touchcancel", () => {
        adult.style.opacity = 0;
        child.style.opacity = 1;
    });
}