import { enablePageScroll } from 'scroll-lock';

const startSnakeGame = (width, height, status, isMobile) => {

    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');
    const snakeStartButton = document.querySelector('.snake__button');
    const img = new Image();
    img.src = '../img/test4.png';

    let getClosestInteger = (a, b, x = Math.trunc(a / b)) => a > b ? !(a % b) ? a : (b * (x + 1) - a) < (a - b * x) ? b * (x + 1) : b * x : 'Некорректный ввод данных';

    let grid = 0;
    let borderRadius = 0;

    if (width > 675) {
        grid = 48;
        borderRadius = 20;
    } else {
        grid = 36;
        borderRadius = 14;
    }

    const addTileToCanvas = (tpx, tpy, sx, sy) => {
        return context.drawImage(img, tpx * 128, tpy * 128, 128, 128, sx, sy, grid, grid);
    }

    const canvasWidth = getClosestInteger(width, grid) - grid;
    const canvasHeight = getClosestInteger(height, grid) - grid;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Служебная переменная, которая отвечает за скорость змейки
    let count = 0;

    let snake = {
        // Начальные координаты
        x: grid,
        y: grid,
        // Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
        dx: grid,
        dy: 0,
        // Тащим за собой хвост, который пока пустой
        cells: [],
        // Стартовая длина змейки — 4 клеточки
        maxCells: 4,
        direction: 'right',
        firstKeyEvent: 0
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // А это — еда (apple).
    let apple = {
        // Начальные координаты яблока
        x: getRandomInt(0, canvasWidth / grid) * grid,
        y: getRandomInt(0, canvasHeight / grid) * grid
    };

    // Игровой цикл — основной процесс, внутри которого будет всё происходить
    const loop = () => {
        // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
        let requestAnimationFrameNum = requestAnimationFrame(loop);

        let collision = false;

        // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет.
        if (++count < 7) {
            return;
        }
        // Обнуляем переменную скорости
        count = 0;
        // Очищаем игровое поле
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Двигаем змейку с нужной скоростью
        snake.x += snake.dx;
        snake.y += snake.dy;
        // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
        if (snake.x < 0) {
            collision = true;
            snake.x = canvas.width - grid;
        }
        else if (snake.x >= canvas.width) {
            collision = true;
            snake.x = 0;
        }
        // Делаем то же самое для движения по вертикали
        if (snake.y < 0) {
            collision = true;
            snake.y = canvas.height - grid;
        }
        else if (snake.y >= canvas.height) {
            collision = true;
            snake.y = 0;
        }
        // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку.
        snake.cells.unshift({ x: snake.x, y: snake.y });
        // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно особождает клетки после себя
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
        // Рисуем еду — красное яблоко
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(apple.x + (grid / 2), apple.y + (grid / 2), grid / 2, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        // Одно движение змейки — один новый нарисованный квадратик 
        
        // Обрабатываем каждый элемент змейки
        snake.cells.forEach((cell, index) => {
        let segment = cell;
        let segments = snake.cells
            let sx = segment.x;
            let sy = segment.y;

            let tilePosX = 0;
            let tilePosY = 0;

            if (index === 0) {
                // head
                let nSeg = segments[index + 1];
                if (nSeg.y > sy) {
                    // up
                    tilePosX = 3;
                    tilePosY = 0;
                    if (snake.direction === 'down') {
                        // down
                        tilePosX = 4;
                        tilePosY = 1;
                    }
                } else if (nSeg.x < sx) {
                    // right
                    tilePosX = 4;
                    tilePosY = 0;
                    if (snake.direction === 'left') {
                        // left
                        tilePosX = 3;
                        tilePosY = 1;
                    }
                } else if (nSeg.y < sy) {
                    // down
                    tilePosX = 4;
                    tilePosY = 1;
                    if (snake.direction === 'top') {
                        // up
                        tilePosX = 3;
                        tilePosY = 0;
                    }
                } else if (nSeg.x > sx) {
                    // left
                    tilePosX = 3;
                    tilePosY = 1;
                    if (snake.direction === 'right') {
                        // right
                        tilePosX = 4;
                        tilePosY = 0;
                    }
                }
            } else if (segments.length - 1 === index) {
                // tail
                let pSeg = segments[index - 1];
                if (pSeg.y < sy) {
                    // up
                    tilePosX = 3;
                    tilePosY = 2;
                    if (pSeg.y === 0 && sy > grid) {
                        // down
                        tilePosX = 4;
                        tilePosY = 3;
                    }
                } else if (pSeg.x > sx) {
                    // right
                    tilePosX = 4;
                    tilePosY = 2;
                    if (sx === 0 && pSeg.x > grid) {
                        // left
                        tilePosX = 3;
                        tilePosY = 3;
                    }
                } else if (pSeg.y > sy) {
                    // down
                    tilePosX = 4;
                    tilePosY = 3;
                    if (sy === 0 && pSeg.y > grid) {
                        // up
                        tilePosX = 3;
                        tilePosY = 2;
                    }
                } else if (pSeg.x < sx) {
                    // left
                    tilePosX = 3;
                    tilePosY = 3;
                    if (pSeg.x === 0 && sx > grid) {
                        // right
                        tilePosX = 4;
                        tilePosY = 2;
                    }
                }
            } else {
                // body 
                let pSeg = segments[index - 1];
                let nSeg = segments[index + 1];
                if (pSeg.x < sx && nSeg.x > sx || nSeg.x < sx && pSeg.x > sx) {
                    // left right
                    tilePosX = 1;
                    tilePosY = 0;
                    
                } else if (pSeg.x < sx && nSeg.y > sy || nSeg.x < sx && pSeg.y > sy) {
                    // left down
                    tilePosX = 2;
                    tilePosY = 0;
                } else if (pSeg.y < sy && nSeg.y > sy || nSeg.y < sy && pSeg.y > sy) {
                    // up down
                    tilePosX = 2;
                    tilePosY = 1;
                } else if (pSeg.y < sy && nSeg.x < sx || nSeg.y < sy && pSeg.x < sx) {
                    // top left
                    tilePosX = 2;
                    tilePosY = 2;
                } else if (pSeg.x > sx && nSeg.y < sy || nSeg.x > sx && pSeg.y < sy) {
                    //right up
                    tilePosX = 0;
                    tilePosY = 1;
                } else if (pSeg.y > sy && nSeg.x > sx || nSeg.y > sy && pSeg.x > sx) {
                    // down right
                    tilePosX = 0;
                    tilePosY = 0;
                } else {
                    // left right
                    if (pSeg.x < sx || pSeg.x > sx) {
                        tilePosX = 1;
                        tilePosY = 0;
                    }
                    // up down
                    if (pSeg.y < sy || pSeg.y > sy) {
                        tilePosX = 2;
                        tilePosY = 1;
                    }
                }
            }

            addTileToCanvas(tilePosX, tilePosY, sx, sy);

        // Если змейка добралась до яблока...
        if (cell.x === apple.x && cell.y === apple.y) {
            // увеличиваем длину змейки
            snake.maxCells++;
            // Рисуем новое яблочко
            // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
            apple.x = getRandomInt(0, canvasWidth / grid) * grid;
            apple.y = getRandomInt(0, canvasHeight/ grid) * grid;
        }
        // Проверяем, не столкнулась ли змея сама с собой
        // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
        for (let i = index + 1; i < snake.cells.length; i++) {
            // Если такие клетки есть — начинаем игру заново
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {

                 // Обрабатываем каждый элемент змейки
            snake.cells.forEach((cell, index) => {
                let segment = cell;
                let segments = snake.cells
                let sx = segment.x;
                let sy = segment.y;

                let tilePosX = 0;
                let tilePosY = 0;

                if (index === 0) {
                    // head
                    let nSeg = segments[index + 1];
                    if (nSeg.y > sy) {
                        // up
                        tilePosX = 3;
                        tilePosY = 0;
                        if (snake.direction === 'down') {
                            // down
                            tilePosX = 4;
                            tilePosY = 1;
                        }
                    } else if (nSeg.x < sx) {
                        // right
                        tilePosX = 4;
                        tilePosY = 0;
                        if (snake.direction === 'left') {
                            // left
                            tilePosX = 3;
                            tilePosY = 1;
                        }
                    } else if (nSeg.y < sy) {
                        // down
                        tilePosX = 4;
                        tilePosY = 1;
                        if (snake.direction === 'top') {
                            // up
                            tilePosX = 3;
                            tilePosY = 0;
                        }
                    } else if (nSeg.x > sx) {
                        // left
                        tilePosX = 3;
                        tilePosY = 1;
                        if (snake.direction === 'right') {
                            // right
                            tilePosX = 4;
                            tilePosY = 0;
                        }
                    }
                } else if (segments.length - 1 === index) {
                    // tail
                    let pSeg = segments[index - 1];
                    if (pSeg.y < sy) {
                        // up
                        tilePosX = 3;
                        tilePosY = 2;
                        if (pSeg.y === 0 && sy > grid) {
                            // down
                            tilePosX = 4;
                            tilePosY = 3;
                        }
                    } else if (pSeg.x > sx) {
                        // right
                        tilePosX = 4;
                        tilePosY = 2;
                        if (sx === 0 && pSeg.x > grid) {
                            // left
                            tilePosX = 3;
                            tilePosY = 3;
                        }
                    } else if (pSeg.y > sy) {
                        // down
                        tilePosX = 4;
                        tilePosY = 3;
                        if (sy === 0 && pSeg.y > grid) {
                            // up
                            tilePosX = 3;
                            tilePosY = 2;
                        }
                    } else if (pSeg.x < sx) {
                        // left
                        tilePosX = 3;
                        tilePosY = 3;
                        if (pSeg.x === 0 && sx > grid) {
                            // right
                            tilePosX = 4;
                            tilePosY = 2;
                        }
                    }
                } else {
                    // body 
                    let pSeg = segments[index - 1];
                    let nSeg = segments[index + 1];
                    if (pSeg.x < sx && nSeg.x > sx || nSeg.x < sx && pSeg.x > sx) {
                        // left right
                        tilePosX = 1;
                        tilePosY = 0;
                        
                    } else if (pSeg.x < sx && nSeg.y > sy || nSeg.x < sx && pSeg.y > sy) {
                        // left down
                        tilePosX = 2;
                        tilePosY = 0;
                    } else if (pSeg.y < sy && nSeg.y > sy || nSeg.y < sy && pSeg.y > sy) {
                        // up down
                        tilePosX = 2;
                        tilePosY = 1;
                    } else if (pSeg.y < sy && nSeg.x < sx || nSeg.y < sy && pSeg.x < sx) {
                        // top left
                        tilePosX = 2;
                        tilePosY = 2;
                    } else if (pSeg.x > sx && nSeg.y < sy || nSeg.x > sx && pSeg.y < sy) {
                        //right up
                        tilePosX = 0;
                        tilePosY = 1;
                    } else if (pSeg.y > sy && nSeg.x > sx || nSeg.y > sy && pSeg.x > sx) {
                        // down right
                        tilePosX = 0;
                        tilePosY = 0;
                    } else {
                        // left right
                        if (pSeg.x < sx || pSeg.x > sx) {
                            tilePosX = 1;
                            tilePosY = 0;
                        }
                        // up down
                        if (pSeg.y < sy || pSeg.y > sy) {
                            tilePosX = 2;
                            tilePosY = 1;
                        }
                    }
                }

                addTileToCanvas(tilePosX, tilePosY, sx, sy);
            });

                // Задаём стартовые параметры основным переменным
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                snake.firstKeyEvent = 0;
                // Ставим яблочко в случайное место
                apple.x = getRandomInt(0, canvasWidth / grid) * grid;
                apple.y = getRandomInt(0, canvasHeight/ grid) * grid;

                cancelAnimationFrame(requestAnimationFrameNum);
                if (isMobile) {
                    enablePageScroll();
                }
                snakeStartButton.innerText = 'ещё раз'
                snakeStartButton.style.display = '';
            }
        }
        });
    }
    let lastKey = 'right';
    // Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
    document.addEventListener('keydown', function (e) {
        // Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры.
        // Стрелка влево
        // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
        if (e.which === 37 && snake.dx === 0) {
            e.preventDefault();
            // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
            // Та же самая логика будет и в остальных кнопках
            snake.dx = -grid;
            snake.dy = 0;
            snake.direction = 'left';
            lastKey = 'left';
            snake.firstKeyEvent = 1;
        }
        // Стрелка вверх
        else if (e.which === 38 && snake.dy === 0) {
            e.preventDefault();
            snake.dy = -grid;
            snake.dx = 0;
            snake.direction = 'top';
            snake.firstKeyEvent = 1;
            lastKey = 'top';
        }
        // Стрелка вправо
        else if (e.which === 39 && snake.dx === 0) {
            e.preventDefault();
            snake.dx = grid;
            snake.dy = 0;
            snake.direction = 'right';
            snake.firstKeyEvent = 1;
            lastKey = 'right';
        }
        // Стрелка вниз
        else if (e.which === 40 && snake.dy === 0) {
            e.preventDefault();
            snake.dy = grid;
            snake.dx = 0;
            snake.direction = 'down';
            snake.firstKeyEvent = 1;
            lastKey = 'down';
        }
    });

    let initialPoint = 0;
    let finalPoint = 0;

    document.addEventListener('touchstart', function(event) {
        initialPoint = event.changedTouches[0];
    }, false);
    
    document.addEventListener('touchend', function(event) {
        finalPoint = event.changedTouches[0];
        const xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
        const yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
        if (xAbs > 10 || yAbs > 10) 
        {
            if (xAbs > yAbs) 
            {
                if (finalPoint.pageX < initialPoint.pageX) {
                    if (lastKey !== 'right') {
                        snake.dx = -grid;
                        snake.dy = 0;
                        snake.direction = 'left';
                        lastKey = 'left';
                    }
                } else {
                    if (lastKey !== 'left') {
                        snake.dx = grid;
                        snake.dy = 0;
                        snake.direction = 'right';
                        snake.firstKeyEvent = 1;
                        lastKey = 'right';
                    }
                };
            } else {
                if (finalPoint.pageY < initialPoint.pageY) {
                    if (lastKey !== 'down') {
                        snake.dy = -grid;
                        snake.dx = 0;
                        snake.direction = 'top';
                        snake.firstKeyEvent = 1;
                        lastKey = 'top';
                    }
                } else {
                    if (lastKey !== 'top') {
                        snake.dy = grid;
                        snake.dx = 0;
                        snake.direction = 'down';
                        snake.firstKeyEvent = 1;
                        lastKey = 'down'
                    }
                };
            }
        }
    }, false);

    if (status) {
        requestAnimationFrame(loop);
    }
}

export default startSnakeGame;