const tg = window.Telegram.WebApp;
tg.expand();

// 👤 админ
const ADMIN_USERNAME = "@xkkdl";

// 🔥 база бойцов
const fighters = [{
        name: "Israel Adesanya",
        image: "https://drop-assets.ea.com/images/6zBYAINyekFqjXkdzG67F9/f16b61605967611f73c71f5220bf4fa9/5star16x9-israel.jpg?im=AspectCrop=(1,1),xPosition=0.5541666666666667,yPosition=0.43425925925925923;Resize=(600)&q=85",
        stance: "Разносторонняя",
        special: ["Question Mark Kick", "Feint Jab"],
        alterEgo: "Stylebender"
    },
    {
        name: "Alex Pereira",
        image: "https://drop-assets.ea.com/images/2wQf4iaRyQaB7LqgTmoSgE/7c3b2f604749f4e1c9d652bc70808200/alex-pereira-lhvw.jpg?im=AspectCrop=(1,1),xPosition=0.5120481927710844,yPosition=0.46785714285714286;Resize=(600)&q=85",
        stance: "Ортодокс",
        special: ["Left Hook from Hell"],
        alterEgo: null
    }
];

const container = document.getElementById("fighters");

fighters.forEach(f => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
    <img src="${f.image}">
    <h2>${f.name}</h2>
    <p><b>Стойка:</b> ${f.stance}</p>
    <p><b>Необычные удары:</b> ${f.special.join(", ")}</p>
    ${f.alterEgo ? `<span class="tag">${f.alterEgo}</span>` : ""}
  `;

  container.appendChild(card);
});