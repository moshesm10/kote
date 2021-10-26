import startSnakeGame from './snake';
import { disablePageScroll } from 'scroll-lock';

const appealButton = document.querySelector('.appeal__button');
const appealAccentVideo = document.querySelector('.accent-video');
const appealMainVideo = document.querySelector('.main-video');
const snakeStartButton = document.querySelector('.snake__button');
const snakeParagraph = document.querySelector('.snake__paragraph');

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
    snakeStartButton.style.display = 'none';
    snakeParagraph.style.display = 'none';
    disablePageScroll();
    startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight, true);
});
