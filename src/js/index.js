import startSnakeGame from './snake';
import { disablePageScroll } from 'scroll-lock';

const appealButton = document.querySelector('.appeal__button');
const appealAccentVideo = document.querySelector('.accent-video');
const appealMainVideo = document.querySelector('.main-video');
const snakeStartButton = document.querySelector('.snake__button');
const snakeParagraph = document.querySelector('.snake__paragraph');
const formButton = document.querySelector('.form__button');

appealButton.addEventListener('click', () => {
    appealButton.style.display = 'none';

    appealMainVideo.classList.remove('hidden');
    appealMainVideo.classList.add('active-video');

    setTimeout(() => {
        appealButton.style.display = '';

        appealMainVideo.classList.add('hidden');
        appealMainVideo.classList.remove('active-video');
    }, 10000);
});

const snakeGameBlock = document.querySelector('.snake');

snakeStartButton.addEventListener('click', () => {
    snakeStartButton.style.display = 'none';
    snakeParagraph.style.display = 'none';
    disablePageScroll();
    startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight, true);
});

formButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms[0]);
    console.log(formData.get('email'));

});

window.onload = () => {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;

                video.play();
                observer.unobserve(video);
            }
        })
    }, options);

    const arr = document.querySelectorAll('video');
    arr.forEach(i => {
        observer.observe(i);
    });
};