document.addEventListener("DOMContentLoaded", init);

async function init() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    try {
        const res = await fetch("data/data.json");
        const people = await res.json();

        const person = people.find(p => p.id === id);
        if (!person) return;

        renderPerson(person);
        initImageHover();
        initRevealObserver();

    } catch (err) {
        console.error("Ошибка загрузки данных:", err);
    }
}


function renderPerson(person) {

    // Заголовок
    document.title = person.name;
    const titleEl = document.getElementById("person-name");
    if (titleEl) titleEl.textContent = person.name;

    // Историческая справка
    const info = document.getElementById("historical-info");
    info.innerHTML = person.historicalInfo || "Информация находится в разработке.";

    // Фото
    document.getElementById("person-child").src = person.childImg;
    document.getElementById("person-adult").src = person.adultImg;

    renderFacts(person.facts);
    renderQuotes(person.quotes);
}


function renderFacts(facts) {

    const container = document.getElementById("facts-container");
    container.innerHTML = "";

    if (!facts || facts.length === 0) {
        container.appendChild(createCard("fact-card", "Факты будут добавлены редакторами."));
        return;
    }

    facts.forEach(item => {

        const card = document.createElement("div");
        card.className = "fact-card reveal";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const text = document.createElement("p");
        text.textContent = item.fact;

        card.appendChild(title);
        card.appendChild(text);
        container.appendChild(card);
    });
}


function renderQuotes(quotes) {

    const container = document.getElementById("quotes-container");
    container.innerHTML = "";

    if (!quotes || quotes.length === 0) {
        container.appendChild(createCard("quote-card", "Цитаты будут добавлены редакторами."));
        return;
    }

    quotes.forEach(q => {

        const card = document.createElement("div");
        card.className = "quote-card reveal";

        const text = document.createElement("p");
        text.textContent = `«${q}»`;

        card.appendChild(text);
        container.appendChild(card);
    });
}


function createCard(className, text) {
    const card = document.createElement("div");
    card.className = className;
    card.textContent = text;
    return card;
}


function initRevealObserver() {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("active", entry.isIntersecting);
        });
    }, {
        threshold: 0.10
    });

    elements.forEach(el => observer.observe(el));
}


function initImageHover() {

    const container = document.querySelector(".image-person-container");
    if (!container) return;

    const child = document.querySelector(".child");
    const adult = document.querySelector(".adult");

    adult.style.opacity = 0;

    const showAdult = () => {
        adult.style.opacity = 1;
        child.style.opacity = 0;
    };

    const showChild = () => {
        adult.style.opacity = 0;
        child.style.opacity = 1;
    };

    container.addEventListener("mouseenter", showAdult);
    container.addEventListener("mouseleave", showChild);

    container.addEventListener("touchstart", showAdult);
    container.addEventListener("touchend", showChild);
    container.addEventListener("touchcancel", showChild);
}
