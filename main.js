'use strict'

const start= document.querySelector('.game_btn');
const Timer= document.querySelector('.game_time');
const Score= document.querySelector('.game_score');
const gameField= document.querySelector('.game_field');
const fieldRect= gameField.getBoundingClientRect();
const popUp= document.querySelector('.pop_up');
const popUpMessage= document.querySelector('.message');
const popUpRefresh= document.querySelector('.refresh_btn');

const carrotSize= 80;
const carrotCount= 5;
const bugCount= 5;
const gameDuration= 5;
const carrotSound= new Audio('./carrot/sound/carrot_pull.mp3');
const alertSound= new Audio('./carrot/sound/alert.wav');
const bgSound= new Audio('./carrot/sound/bg.mp3');
const bugSound= new Audio('./carrot/sound/bug_pull.mp3');
const winSound= new Audio('./carrot/sound/game_win.mp3');

let started= false;
let score= 0;
let timer= undefined;

function gameStart() {
    started= true;
    score= 0;
    gameField.innerHTML= '';
    Score.innerHTML= carrotCount;
    spreadItem('carrot')
    spreadItem('bug');
    showStopBtn();
    showTimeandScore();
    startGameTimer();
    playSound(bgSound);
}

function gameStop() {
    started= false;
    stopGameTimer();
    hideGameBtn();
    showPopup('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);
}

function showStopBtn() {
    const icon= start.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    start.style.visibility= 'visible';
}

function hideGameBtn() {
    start.style.visibility= 'hidden';
}

function showTimeandScore() {
    Timer.style.visibility= 'visible';
    Score.style.visibility= 'visible';
}

function startGameTimer() {
    let remainingTime= gameDuration;
    updateTimerText(remainingTime);
    timer= setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            finishGame(false);
            return;
        }
        else {
            remainingTime--;
            updateTimerText(remainingTime);
        }
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const min= parseInt(time / 60);
    const sec= time % 60;
    Timer.innerHTML= `${min}:${sec}`;
}

function showPopup(text) {
    popUpMessage.innerHTML= text;
    popUp.classList.remove('pop_up-hide');
}

function hidePopUp() {
    popUp.classList.add('pop_up-hide');
}

function onFieldClick(event) {
    if (!started) {
        return;
    }
    const target= event.target;
    if (target.matches('.carrot')) {
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if (score === carrotCount) {
            finishGame(true);
        }
    }
    else if (target.matches('.bug')) {
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime= 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}

function finishGame(win) {
    started= false;
    hideGameBtn();
    if (win) {
        playSound(winSound);
    }
    else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopup(win ? 'You won' : 'You lost');
}

function updateScoreBoard() {
    Score.innerHTML= carrotCount - score;
}

function createItem(text) {
    switch (text) {
        case 'carrot':
            const carrotBtn= document.createElement('img');
            carrotBtn.setAttribute('class', 'carrot');
            carrotBtn.setAttribute('src', 'carrot/img/carrot.png');
            return carrotBtn;
        case 'bug':
            const bugBtn= document.createElement('img');
            bugBtn.setAttribute('class', 'bug');
            bugBtn.setAttribute('src', 'carrot/img/bug.png');
            return bugBtn;
    }
}

function randomNumber(min, max) {
    return Math.random() * (max-min) + min;
}

function spreadItem(text) {
    const x1= 0;
    const y1= 0;
    const x2= fieldRect.width - carrotSize;
    const y2= fieldRect.height - carrotSize;
    for (let i=0; i < 5; i++) {
        const newItem= createItem(text);
        newItem.style.position= 'absolute';
        const x= randomNumber(x1, x2);
        const y= randomNumber(y1, y2);
        newItem.style.transform= `translate(${x}px, ${y}px)`;
        gameField.appendChild(newItem);
    }
}

start.addEventListener('click', () => {
    if (started) {
        gameStop();
    }
    else {
        gameStart();
    }
});

gameField.addEventListener('click', onFieldClick);

popUpRefresh.addEventListener('click', () => {
    gameStart();
    hidePopUp();
});