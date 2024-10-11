let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let currentMonsterIndex;
let monsterHealth;
let inventory = ["дрын"];
let stats = { username: '', battles: 0, exp: 0, win: '' };

const start = document.querySelector('#start');
const nameInput = document.querySelector('#username');
const body = document.querySelector('body');
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const inventoryItems = document.querySelector(".inventory__items");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'дрын', power: 5, src: './img/stick.png' },
  { name: 'кинжал', power: 30, src: './img/dagger.png' },
  { name: 'двойной топор', power: 50, src: './img/axe.png' },
  { name: 'меч убиения всего и вся', power: 100, src: './img/sword.png' }
];
const monsters = [
  { name: "гигантский слизень", level: 2, health: 15 },
  { name: "клыкастый монстр", level: 8, health: 60 },
  { name: "дракон", level: 20, health: 300 }
]
const locations = [
  {
    name: "town square",
    image: "url('./img/square.jpg')",
    buttonText: ["В лавку", "В пещеру", "Бить дракона!"],
    buttonFunctions: [() => {goToLocation(1)}, () => {goToLocation(2)}, () => {fightMonster(2)}],
    text: "Ты находишься на городской площади. Ты видишь вывеску \"Лавка\" и два указателя \"⇐ Пещера там\" и \"Не влезай, убьет(дракон) ⇒\". Куда ты направишься?"
  },
  {
    name: "store",
    image: "url('./img/store.jpg')",
    buttonText: ["Купить 10 здоровья (10 монет)", "Купить оружие (30 монет)", "Идти на площадь"],
    buttonFunctions: [buyHealth, buyWeapon, () => {goToLocation(0)}],
    text: "Ты зашел в лавку."
  },
  {
    name: "cave",
    image: "url('./img/cave.jpg')",
    buttonText: ["Бить слизня", "Бить клыкастого монстра", "Идти на площадь"],
    buttonFunctions: [() => {fightMonster(0)}, () => {fightMonster(1)}, () => {goToLocation(0)}],
    text: "Ты зашел в пещеру. Фу, чем тут воняет? Ты видишь несколько монстров."
  },
  {
    name: "fight",
    image: ["url('./img/slime.jpg')", "url('./img/beast.jpg')", "url('./img/dragon.jpg')"],
    buttonText: ["Атаковать", "Уклониться", "Сбежать (позорно)"],
    buttonFunctions: [attack, dodge, () => {goToLocation(0)}],
    text: "Битва с монстром началась."
  },
  {
    name: "kill monster",
    image: "url('./img/cave.jpg')",
    buttonText: ["Идти прямо", "Идти налево", "Идти направо"],
    buttonFunctions: [() => {goToLocation(0)}, () => {goToLocation(0)}, () => {goToLocation(0)}],
    text: 'Монстр заорал "Аргх!" и помер. Ты заработал очки опыта и, покопавшись под тушей монстра, нашел голду.'
  },
  {
    name: "lose",
    image: "url('./img/lose.jpg')",
    buttonText: ["ЗАНОВО?", "ЗАНОВО?", "ЗАНОВО?"],
    buttonFunctions: [restartGame, restartGame, restartGame],
    text: "Ты мертв (лох). &#x2620;"
  },
  {
    name: "win",
    image: "url('./img/win.jpg')",
    buttonText: ["ЗАНОВО?", "ЗАНОВО?", "ЗАНОВО?"],
    buttonFunctions: [restartGame, restartGame, restartGame],
    text: "&#x1F389; Ты сразил дракона! ТЫ ПОБЕДИЛ В ИГРЕ! Красава! Держи печеньку! &#127850;"
  },
  {
    name: "easter egg",
    image: "url('./img/easter-egg.jpg')",
    buttonText: ["2", "8", "Забить и идти на площадь"],
    buttonFunctions: [pickTwo, pickEight, () => {goToLocation(0)}],
    text: "По пути в город ты заблудился и случайно забрел в секретное казино. Выбери число сверху. Случайным образом будут выбраны десять чисел от 0 до 10. Если выбранное тобой число совпадает с одним из случайных чисел, ты выиграешь!"
  }
];

function updateInventory() {
  inventoryItems.innerHTML = '';
  inventory.forEach((el) => {
    const newWeapon = document.createElement('div');
    newWeapon.classList.add('inventory__item');
    const weapon = weapons.find(weapon => weapon.name === el);
    if (weapon) {
      newWeapon.innerHTML = `<img src="${weapon.src}" width="100" height="100" alt="${el}.">`;
    }
    if (el === inventory[inventory.length - 1]) {
      newWeapon.classList.add('current');
    }
    inventoryItems.append(newWeapon);
  });
}

function update(location) {
  monsterStats.style.display = "none";
  text.innerHTML = location.text;

  const buttons = [button1, button2, button3];
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerText = location.buttonText[i];
    buttons[i].onclick = location.buttonFunctions[i];
  }
}

function goToLocation(ind) {
  body.style.backgroundImage = locations[ind].image;
  update(locations[ind]);
}

function buyHealth() {
  body.style.backgroundImage = 'url("./img/health.jpg")';
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    text.innerText = "Ты выпил какую-то мутную жижу с надиписью \"Ыликсир здаровя\". Ты чувствуешь себя человеком";
  } else {
    text.innerText = "У тебя недостаточно голды, чтобы купить эликсир, нищеброд.";
  }
}

function buyWeapon() {
  body.style.backgroundImage = 'url("./img/weapon.jpg")';
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Теперь у тебя есть " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " У тебя в инвентаре: " + inventory;
    } else {
      text.innerText = "У тебя недостаточно голды, чтобы купить оружие, нищеброд.";
    }
  } else {
    text.innerText = "У тебя уже и так самое мощное оружие, что тебе еще надо, собака сутулая? Ну можешь продать лишнее";
    button2.innerText = "Продать оружие за 15 голды";
    button2.onclick = sellWeapon;
  }
  updateInventory();
  showWeapon();
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Ты продал " + currentWeapon + ".";
    text.innerText += " У тебя в инвентаре: " + inventory;
  } else {
    text.innerText = "Не продавай свое единственное оружие, ты чо!";
  }
  updateInventory();
  showWeapon();
}

function showWeapon() {
  document.querySelector('.weapon').textContent = inventory[inventory.length - 1];
}

function fightMonster(ind) {
  currentMonsterIndex = ind;
  goFight();
}

function goFight() {
  body.style.backgroundImage = locations[3].image[currentMonsterIndex];
  update(locations[3]);
  monsterHealth = monsters[currentMonsterIndex].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[currentMonsterIndex].name;
  monsterHealthText.innerText = monsterHealth;
  stats.battles++;
}

function attack() {
  text.innerText = monsters[currentMonsterIndex].name + " атакует.";
  text.innerText += " Ты взял свой " + weapons[currentWeapon].name + " и атакуешь.";
  health -= getMonsterAttackValue(monsters[currentMonsterIndex].level);

  if (health < 0) {
    health = 0;
  }

  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Ты промазал (лох).";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    loseGame();
  } else if (monsterHealth <= 0) {
    if (currentMonsterIndex === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += "\nУпс! Твой " + inventory.pop() + " сломался.";
    currentWeapon--;
    updateInventory();
    showWeapon();
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Ты уклонился. " + monsters[currentMonsterIndex].name + " не нанес тебе урона.";
}

function defeatMonster() {
  gold += Math.floor(monsters[currentMonsterIndex].level * 6.7);
  xp += monsters[currentMonsterIndex].level;
  stats.exp = xp;
  goldText.innerText = gold;
  xpText.innerText = xp;
  const randomIndex = Math.floor(Math.random() * 10);

  locations[4].buttonFunctions = [() => {goToLocation(0)}, () => {goToLocation(0)}, () => {goToLocation(0)}];

  if (randomIndex < 5) {
    const easterEggIndex = Math.floor(Math.random() * 3);
    locations[4].buttonFunctions[easterEggIndex] = easterEgg;
  } else {
    locations[4].buttonFunctions = [() => {goToLocation(0)}, () => {goToLocation(0)}, () => {goToLocation(0)}];
  }

  update(locations[4]);
}

function loseGame() {
  body.style.backgroundImage = locations[5].image;
  update(locations[5]);
  stats.win = 'Поражение'
  addGame(stats.username, stats.battles, stats.exp, stats.win);
  renderTournamentTable();
}

function winGame() {
  body.style.backgroundImage = locations[6].image;
  update(locations[6]);
  stats.win = 'Победа!';
  addGame(stats.username, stats.battles, stats.exp, stats.win);
  renderTournamentTable();
}

function restartGame() {
  stats = { username: '', battles: 0, exp: 0, win: '' };
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["дрын"];
  updateInventory();
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goToLocation(0);
  nameInput.value = '';
  start.classList.add('active');
}

function easterEgg() {
  body.style.backgroundImage = locations[7].image;
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Ты выбрал " + guess + ". Вот рандомные номера:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + " ";
  }
  if (numbers.includes(guess)) {
    text.innerText += "\nУгадал! Ты выиграл 20 голды!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "\nНе угадал (лох)! Потеряй 10 здоровья!";
    health -= 10;

    if (health < 0) {
      health = 0;
    }

    healthText.innerText = health;
    if (health <= 0) {
      loseGame();
    }
  }
}

// save name

function saveGames(games) {
  localStorage.setItem('games', JSON.stringify(games));
}

function loadGames() {
  const gamesData = localStorage.getItem('games');
  return gamesData ? JSON.parse(gamesData) : [];
}

function addGame(name, battles, experience, result) {
  const games = loadGames();

  if (games.length >= 10) {
    games.shift();
  }

  games.push({ name, battles, experience, result });
  saveGames(games);
}

function renderTournamentTable() {
  const data = loadGames();
  const valuesArray = data.map(obj => Object.values(obj));
  const rows = document.querySelectorAll('.row');

  for (let i = 0; i < valuesArray.length; i++) {
    for (let j = 0; j < valuesArray[0].length; j++) {
      const tds = rows[i].querySelectorAll('td');
      tds[j].textContent = valuesArray[i][j];
    }
  }
}

function startGame() {
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (nameInput.value === '') {
      stats.username = 'Аноним';
    } else {
      stats.username = nameInput.value;
    }
    start.classList.remove('active');
  });

  button1.onclick = () => goToLocation(1);
  button2.onclick = () => goToLocation(2);
  button3.onclick = () => fightMonster(2);
  updateInventory();
  goToLocation(0);
}

export {renderTournamentTable, startGame};