import startSnakeGame from './snake';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

const appealMainVideo = document.querySelector('.main-video');
const snakeStartButton = document.querySelector('.snake__button');
const snakeParagraph = document.querySelector('.snake__paragraph');
const formButton = document.querySelector('.form__button');
let snakeGameBlock = document.querySelector('.snake');

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const canvasSnake = document.querySelector('#snake');
startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight);
let timerId = 0;

window.addEventListener('resize', () => {
    if (timerId) {
        clearTimeout(timerId);
    }
    
    snakeGameBlock = document.querySelector('.snake');
    canvasSnake.style.opacity = '0';
    startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight);
    
    timerId = setTimeout(() => {
        canvasSnake.style.opacity = '1';
    }, 400);
    
});

formButton.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(document.forms[0]);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/ajax/add_email.php');
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                alert('Мы вас добавили');
            } else if (xmlhttp.status == 400) {
                alert('Произошла ошибка');
            }
        }
    };

    xmlhttp.send('email=' + formData.get('email'));
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

    const optionsBlock = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7
    };

    const observerBlock = new IntersectionObserver((block, observer) => {
            if (block[0].isIntersecting) {
                appealMainVideo.classList.remove('hidden');
                appealMainVideo.classList.add('active-video');
            } else {
                appealMainVideo.classList.add('hidden');
                appealMainVideo.classList.remove('active-video');
            }
    }, optionsBlock);

    const batmanBlock = document.querySelector('.appeal__video-wrapper');
    observerBlock.observe(batmanBlock);
};
