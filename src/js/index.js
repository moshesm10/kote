import startSnakeGame from './snake';
import { disablePageScroll } from 'scroll-lock';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

const appealButton = document.querySelector('.appeal__button');
const appealMainVideo = document.querySelector('.main-video');
const snakeStartButton = document.querySelector('.snake__button');
const snakeParagraph = document.querySelector('.snake__paragraph');
const formButton = document.querySelector('.form__button');
const snakeGameBlock = document.querySelector('.snake');

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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

snakeStartButton.addEventListener('click', () => {
    console.dir(snakeGameBlock);//offsetTop
    window.scrollTo({
        top: snakeGameBlock.offsetTop,
        behavior: "smooth"
    });
    snakeStartButton.style.display = 'none';
    snakeParagraph.style.display = 'none';

    if (isMobile()) {
        disablePageScroll();
    }

    startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight, true, isMobile());
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
};
