import startSnakeGame from './snake';
import coinAnimation from './coin-animation';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();
coinAnimation();

const appealMainVideo = document.querySelector('.main-video');
const formButton = document.querySelector('.form__button');
let snakeGameBlock = document.querySelector('.snake');

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    document.body.classList.add('mobile');
}

// Игра в змейку-котé
const canvasSnake = document.querySelector('#snake');
const img = new Image();
    img.src = '../img/tiles.png';

const img2 = new Image();
img2.src = '../img/extratiles.png';

startSnakeGame(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight, img, img2, false);


// Обработка и отправка формы
formButton.addEventListener('click', (e) => {
    e.preventDefault();
    const emailInputValue = document.querySelector('.email').value;
    const statusMessageBlock = document.querySelector('.status-message');

    statusMessageBlock.textContent = '';

    function validateEmail(email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return re.test(String(email).toLowerCase());
    }

    if (validateEmail(emailInputValue)) {
        const formData = new FormData(document.forms[0]);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', '/ajax/add_email.php');
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    statusMessageBlock.textContent = 'Мы добавили твой email';
                } else if (xmlhttp.status == 400) {
                    statusMessageBlock.textContent = 'Произошла ошибка, попробуй еще раз';
                }
            }
        };

        xmlhttp.send('email=' + formData.get('email'));
    } else {
        statusMessageBlock.textContent = 'Неправильно введен email, попробуй еще раз';
    }
    
});

// Автоматический запуск видео
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
                video.controls = false;
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
