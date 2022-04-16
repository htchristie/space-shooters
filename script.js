const SHIP_START_LEFT = '280px';

const gameArea = document.querySelector('#game-area');
const shipElem = document.querySelector('#ship');
const scoreElem = document.querySelector('#score');
const startScreen = document.querySelector('#start-game');
const gameOverScreen = document.querySelector('#game-over');
const alienSprites = ['imgs/alien1.png', 'imgs/alien2.png', 'imgs/alien3.png', 'imgs/alien4.png']

let score;

document.addEventListener("keydown", startGame, { once: true });


/* MOVIMENTAÇÃO DO JOGADOR */

function moveShip(event) {
  if(event.key === 'ArrowLeft' || event.key === 'a') {
      event.preventDefault();
      moveLeft();
  } else if(event.key === 'ArrowRight' || event.key === 'd') {
    event.preventDefault();
    moveRight();
  } else if(event.key === 'ArrowUp' || event.key === " " || event.key === 'w') {
      event.preventDefault();
      fireLaser();
  }
}

function moveLeft() {
  let left = getProperty(shipElem, "left");
  if (left === "-10px") {
    return;
  }

  let position = parseInt(left);
  position -= 20;
  shipElem.style.left = `${position}px`;
}

function moveRight() {
  let left = getProperty(shipElem, "left");
  if (left ===  "590px") {
    return;
  }

  let position = parseInt(left);
  position += 20;
  shipElem.style.left = `${position}px`;
}


/* ELEMENTO LASER */

function fireLaser() {
  const laser = createLaser();
  updateLaser(laser);
}

function createLaser() {
  const shipX = parseInt(getProperty(shipElem, 'left'));
  const shipY = parseInt(getProperty(shipElem, 'top'));
  const laser = document.createElement('img');

  laser.src = 'imgs/laser-beam.png';
  laser.classList.add('laser-beam');
  laser.style.left = `${shipX + 25}px`;
  laser.style.top = `${shipY - 30}px`;

  gameArea.appendChild(laser);
  return laser;
}

function updateLaser(laser) {
  laserInterval = setInterval(() => {
    const laserY = parseInt(laser.style.top);
    const laserRect = getRect(laser);
    const aliens = document.querySelectorAll('.alien');

    aliens.forEach((alien) => {
      const alienRect = getRect(alien);

      if(checkCollision(laserRect, alienRect)) {
        alien.src = 'imgs/explosion.png';
        laser.remove();
        alien.classList.remove('alien');
        alien.classList.add('dead-alien');

        score += 10;
        updateScore();

        let transition = setInterval(() => {
          alienOpacity = parseFloat(getProperty(alien, 'opacity'));
          console.log(alienOpacity);

          alien.style.opacity = alienOpacity - 0.05;

          if(alien.style.opacity <= 0) {
            clearInterval(transition);
            alien.remove();
          }
        }, 10);
      }
    });

    if(laserY <= -20) {
      laser.remove();
    }

    laser.style.top = `${laserY - 8}px`;
  }, 10);
}



/* ELEMENTO ALIEN */

function createAlien() {
  const alien = document.createElement('img');
  const sprite = alienSprites[Math.floor(Math.random() * alienSprites.length)];

  alien.src = sprite;
  alien.classList.add('alien');
  alien.style.top = '0px';
  alien.style.left = `${Math.floor(Math.random() * 580) + 20}px`;

  gameArea.appendChild (alien);
  updateAlien(alien);
}

function updateAlien(alien) {
  updateAlienInterval = setInterval(() => {
    let alienY = parseInt(getProperty(alien, 'top'));

    if (alienY >= 400) {
      if(Array.from(alien.classList).includes('dead-alien')) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.top = `${alienY + 4}px`;
    }
  }, 30);
}



/* FUNÇÕES GERAIS */

function startGame() {
  score = 0;
  updateScore();

  startScreen.classList.add('hide');
  gameOverScreen.classList.add('hide');
  window.addEventListener('keydown', moveShip);

  alienInterval = setInterval(() => {
    createAlien();
  }, 2000);
}

function checkCollision(rect1, rect2) {
  return (
    rect1.left >= rect2.left &&
    rect1.top <= rect2.top &&
    rect1.right <= rect2.right &&
    rect1.bottom <= rect2.bottom
  );
}

function updateScore() {
  scoreElem.textContent = score;
}

function gameOver() {
  const aliens = document.querySelectorAll('.alien');
  const bullets = document.querySelectorAll('.laser-beam');

  setTimeout(() => {
    document.addEventListener("keydown", startGame, { once: true });
    gameOverScreen.classList.remove('hide');
  }, 100);


  window.removeEventListener('keydown', moveShip);

  clearInterval(alienInterval);

  aliens.forEach((alien) => {
    alien.remove();
  })

  bullets.forEach((bullet) => {
    bullet.remove();
  })

  shipElem.style.left = '290px';

}



/* MANIPULAÇÃO DAS PROPRIEDADES CSS */

/* pega valor da propriedade */
function getProperty(elem, prop) {
  return getComputedStyle(elem).getPropertyValue(prop) || 0;
}


/* HITBOX DOS ELEMENTOS */

function getRect(elem) {
  return elem.getBoundingClientRect();
}




