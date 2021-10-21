import startSnakeGame from './snake';

const appealButton = document.querySelector('.appeal__button');
const appealAccentVideo = document.querySelector('.accent-video');
const appealMainVideo = document.querySelector('.main-video');
const snakeStartButton = document.querySelector('.snake__button');

appealButton.addEventListener('click', () => {
    appealButton.style.display = 'none';

    appealMainVideo.classList.remove('hidden');
    appealMainVideo.classList.add('active-video');

    setTimeout(() => {
        appealButton.style.display = '';

        appealMainVideo.classList.add('hidden');
        appealMainVideo.classList.remove('active-video');
    }, 10000)
});

const snakeGameBlock = document.querySelector('.snake');
snakeStartButton.addEventListener('click', () => {
    snakeStartButton.classList.add('hidden');
    startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight, true);
});