// --- Player Stats ---
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// --- DOM Elements ---
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.getElementById("text");
const xpText = document.getElementById("xpText");
const healthText = document.getElementById("healthText");
const goldText = document.getElementById("goldText");
const monsterStats = document.getElementById("monsterStats");
const monsterName = document.getElementById("monsterName");
const monsterHealthText = document.getElementById("monsterHealth");

// --- Weapons ---
const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];

// --- Monsters ---
const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 },
];

// --- Locations ---
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\". Where do you want to go? Use the buttons above.",
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [() => goFight(0), () => goFight(1), goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Defeated!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️",
  },
  {
    name: "win",
    "button text": ["PLAY AGAIN!", "PLAY AGAIN!", "PLAY AGAIN!"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN! 🎉 Go play again?",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret cave with a number game. Pick a number above. If it's random number between 1 and 10 is equal to the number you picked, you win 20 gold!",
  },
];

// --- Initialise ---
function init() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  fighting = undefined;
  monsterHealth = undefined;
  update(xpText, xp);
  update(healthText, health);
  update(goldText, gold);
  goTown();
}

// --- Update stat display ---
function update(el, val) {
  el.innerText = val;
}

// --- Navigate to a location ---
function goLocation(location) {
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

// --- Navigation functions ---
function goTown() {
  monsterStats.style.display = "none";
  goLocation(locations[0]);
}

function goStore() {
  goLocation(locations[1]);
}

function goCave() {
  goLocation(locations[2]);
}

function fightDragon() {
  goFight(2);
}

function goFight(monsterIndex) {
  fighting = monsterIndex;
  monsterHealth = monsters[monsterIndex].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[monsterIndex].name;
  monsterHealthText.innerText = monsterHealth;
  goLocation(locations[3]);
  text.innerText = "You are fighting a " + monsters[monsterIndex].name + ".";
}

// --- Store functions ---
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    update(goldText, gold);
    update(healthText, health);
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      update(goldText, gold);
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon! Sell it for 15 gold?";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    update(goldText, gold);
    let soldWeapon = inventory.shift();
    text.innerText = "You sold a " + soldWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// --- Combat functions ---
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

  // Player hits monster
  let hit = getPlayerAttack();
  monsterHealth -= hit;
  monsterHealthText.innerText = monsterHealth;

  // Monster hits player
  health -= getMonsterAttack();
  update(healthText, health);

  if (health <= 0) {
    goLocation(locations[5]); // lose
    monsterStats.style.display = "none";
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      goLocation(locations[6]); // win (dragon)
    } else {
      killMonster();
    }
    monsterStats.style.display = "none";
  }
}

function getPlayerAttack() {
  return Math.floor(Math.random() * weapons[currentWeapon].power) + weapons[currentWeapon].power / 2;
}

function getMonsterAttack() {
  let monsterLevel = monsters[fighting].level;
  return Math.floor(Math.random() * monsterLevel * 3) + 1;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name + "!";
}

function killMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  update(goldText, gold);
  update(xpText, xp);
  goLocation(locations[4]);
  text.innerText = locations[4].text;
  text.innerText += " You gain " + monsters[fighting].level + " XP and find gold.";
}

// --- Easter egg ---
function easterEgg() {
  goLocation(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  let num = Math.floor(Math.random() * 11);
  text.innerText = "You picked " + guess + ". Here is a random number: " + num;
  if (num === guess) {
    text.innerText += " You win 20 gold!";
    gold += 20;
    update(goldText, gold);
  } else {
    text.innerText += " You lose 2 health!";
    health -= 2;
    update(healthText, health);
    if (health <= 0) {
      goLocation(locations[5]);
    }
  }
}

// --- Restart ---
function restart() {
  init();
}

// --- Easter egg trigger: click XP stat 3 times ---
let xpClickCount = 0;
xpText.parentElement.addEventListener("click", () => {
  xpClickCount++;
  if (xpClickCount >= 3) {
    xpClickCount = 0;
    easterEgg();
  }
});

// --- Weapon break chance ---
const originalAttack = attack;
// Wrap attack to add weapon break mechanic
button1.addEventListener("click", () => {}, false);

// Override attack to add weapon breaking
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

  // Chance weapon breaks
  if (Math.random() <= 0.1 && inventory.length > 1) {
    let brokenWeapon = inventory.pop();
    text.innerText += " Your " + brokenWeapon + " breaks!";
    currentWeapon--;
  }

  let hit = getPlayerAttack();
  monsterHealth -= hit;
  monsterHealthText.innerText = monsterHealth;

  health -= getMonsterAttack();
  update(healthText, health);

  if (health <= 0) {
    goLocation(locations[5]);
    monsterStats.style.display = "none";
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      goLocation(locations[6]);
    } else {
      killMonster();
    }
    monsterStats.style.display = "none";
  }
}

// --- Start the game ---
init();