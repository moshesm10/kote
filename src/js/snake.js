// import { enablePageScroll, disablePageScroll, addScrollableTarget } from 'scroll-lock';


const startSnakeGame = (width, height, img, img2, isGameStart) => {

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    const isMobileBool = isMobile();

    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');
    const snakeStartButton = document.querySelector('.snake__button');
    const snakeParagraph = document.querySelector('.snake__paragraph');
    const snakeGameBlock = document.querySelector('.snake');

    let getClosestInteger = (a, b, x = Math.trunc(a / b)) => a > b ? !(a % b) ? a : (b * (x + 1) - a) < (a - b * x) ? b * (x + 1) : b * x : 'err';

    let grid = 0;

    if (width > 1600) {
        grid = 70;
    } else if (width > 675) {
        grid = 52;
    } else {
        grid = 36;
    }

    while (width % grid >= 10) {
        grid--;
    }

    const addTileToCanvas = (tpx, tpy, sx, sy) => {
        return context.drawImage(img, tpx * 128, tpy * 128, 128, 128, sx, sy, grid, grid);
    }

    const addTileToCanvas147 = (tpx, tpy, sx, sy) => {
        return context.drawImage(img2, tpx * 147, tpy * 147, 147, 147, sx, sy, grid, grid);
    }

    let canvasWidth = getClosestInteger(width, grid);
    let canvasHeight = getClosestInteger(height, grid);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Служебная переменная, которая отвечает за скорость змейки
    let count = 0;

    // Очки
    let result = 1;
    let isApple = 0;

    let speed = 10;

    let snake = {
        // Начальные координаты
        x: grid * 2,
        y: grid * 4,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 10,
        direction: 'right',
        firstKeyEvent: 0
    };

    let requestAnimationFrameNum;

    let appleAnimCount = 0;

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    let apple = {
        // Начальные координаты яблока
        x: getRandomInt(0, canvasWidth / grid) * grid,
        y: getRandomInt(0, canvasHeight / grid) * grid
    };

    const initGameSettings = (width, height) => {
        // Настройка параметров
        if (width > 1600) {
            grid = 70;
        } else if (width > 675) {
            grid = 52;
        } else {
            grid = 36;
        }

        while (width % grid >= 10) {
            grid--;
        }
        canvasWidth = getClosestInteger(width, grid);
        canvasHeight = getClosestInteger(height, grid);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Задаём стартовые параметры основным переменным
        snake.x = grid * 2;
        snake.y = grid * 4;
        snake.cells = [];
        snake.maxCells = 3;
        snake.dx = grid;
        snake.dy = 0;
        snake.firstKeyEvent = 0;
        result = 1;
        speed = 10;
        snake.direction = 'right';
        // Ставим яблочко в случайное место
        apple.x = getRandomInt(0, canvasWidth / grid) * grid;
        apple.y = getRandomInt(0, canvasHeight / grid) * grid;

        if (!isGameStart) {
            for (let i = 0; i < 4; i++) {
                loop();
            }
        }
    }

    window.addEventListener('resize', () => {
        initGameSettings(snakeGameBlock.clientWidth, snakeGameBlock.clientHeight);
    });

    // Игровой цикл
    const loop = () => {
        requestAnimationFrameNum = requestAnimationFrame(loop);

        if (result % 5 == 0 && speed > 1 && isApple) {
            speed -= 0.1;
        }
        // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет.
        if (++count < speed) {
            return;
        }

        isApple = 0;
        // Обнуляем переменную скорости
        count = 0;
        // Очищаем игровое поле
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Двигаем змейку с нужной скоростью
        snake.x += snake.dx;
        snake.y += snake.dy;
        // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
        if (snake.x < 0) {
            snake.x = canvas.width - grid;
        }
        else if (snake.x >= canvas.width) {
            snake.x = 0;
        }
        // Делаем то же самое для движения по вертикали
        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        }
        else if (snake.y >= canvas.height) {
            snake.y = 0;
        }
        // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку.
        snake.cells.unshift({ x: snake.x, y: snake.y });
        // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно особождает клетки после себя
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
        // Рисуем еду — красное яблоко
        if (appleAnimCount < 3) {
            addTileToCanvas(5 + appleAnimCount, 3, apple.x, apple.y);
            appleAnimCount++;
        } else {
            addTileToCanvas(5 + appleAnimCount, 3, apple.x, apple.y);
            appleAnimCount = 0;
        }
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
            if (nSeg) {
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
                // console.log('left right')
            } else if (pSeg.x < sx && nSeg.y > sy || nSeg.x < sx && pSeg.y > sy) {
                // left down
                tilePosX = 2;
                tilePosY = 0;

                // console.log('left down')
            } else if (pSeg.y < sy && nSeg.y > sy || nSeg.y < sy && pSeg.y > sy) {
                // up down
                tilePosX = 2;
                tilePosY = 1;
                
                // console.log('up down', pSeg.y, sy)
            } else if (pSeg.y < sy && nSeg.x < sx || nSeg.y < sy && pSeg.x < sx) {
                // top left
                tilePosX = 2;
                tilePosY = 2;
                // console.log('top left')
            } else if (pSeg.x > sx && nSeg.y < sy || nSeg.x > sx && pSeg.y < sy) {
                //right up
                tilePosX = 0;
                tilePosY = 1;

                if (sx === 0 && pSeg.y !== sy) {
                    tilePosX = 2;
                    tilePosY = 2;
                }
            } else if (pSeg.y > sy && nSeg.x > sx || nSeg.y > sy && pSeg.x > sx) {
                // down right
                tilePosX = 0;
                tilePosY = 0;

                if (sx === 0 && pSeg.y !== sy) {
                    // tilePosX = 4;
                    // tilePosY = 1;
                    tilePosX = 2;
                    tilePosY = 0;
                    
                }
                console.log(pSeg.y, sy, grid)
                
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

        if (cell.x === apple.x && cell.y === apple.y) {
            if (index === 0) {
                if (tilePosX == 3 || tilePosX == 5) {
                    tilePosX = 0;
                } else if (tilePosX == 4 || tilePosX == 6) {
                    tilePosX = 1;
                }

                addTileToCanvas147(tilePosX, tilePosY, sx, sy)
            } 
            else {
                addTileToCanvas(tilePosX, tilePosY, sx, sy);
            }
        } else {
            if (index === 0) {
                if (cell.x - grid === apple.x && cell.y - grid === apple.y || cell.x - grid === apple.x && cell.y + grid === apple.y || cell.x + grid === apple.x && cell.y - grid === apple.y || cell.x + grid === apple.x && cell.y + grid === apple.y || cell.x === apple.x && cell.y + grid === apple.y || cell.x + grid === apple.x && cell.y === apple.y || cell.x === apple.x && cell.y - grid === apple.y || cell.x - grid === apple.x && cell.y === apple.y) {
                    tilePosX += 2;
                }
            }
            addTileToCanvas(tilePosX, tilePosY, sx, sy);
        }
        

        // Если змейка добралась до яблока...
        if (cell.x === apple.x && cell.y === apple.y) {
            isApple = 1;
            result++;
            // увеличиваем длину змейки
            snake.maxCells++;
            // Рисуем новое яблоко
            apple.x = getRandomInt(0, canvasWidth / grid) * grid;
            apple.y = getRandomInt(0, canvasHeight/ grid) * grid;
        }

        // Проверяем, не столкнулась ли змея сама с собой
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
                snake.x = grid * 2;
                snake.y = grid * 2;
                snake.cells = [];
                snake.maxCells = 3;
                snake.dx = grid;
                snake.dy = 0;
                snake.firstKeyEvent = 0;
                result = 1;
                speed = 10;
                snake.direction = 'right';
                // Ставим яблочко в случайное место
                apple.x = getRandomInt(0, canvasWidth / grid) * grid;
                apple.y = getRandomInt(0, canvasHeight / grid) * grid;

                cancelAnimationFrame(requestAnimationFrameNum);
                if (isMobileBool) {
                    // enablePageScroll(snakeGameBlock);
                }
                snakeStartButton.innerText = 'ещё раз'
                snakeStartButton.style.display = '';
            }
        }
        });

        if (!isGameStart) {
            cancelAnimationFrame(requestAnimationFrameNum);
        }
    }

    // Обработка нажатий на клавиши
    let lastKey = 'right';

    document.addEventListener('keydown', function (e) {
        if (e.which === 37 && snake.dx === 0) {
            e.preventDefault();
            
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

    canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();
        initialPoint = event.changedTouches[0];
    }, false);
    
    canvas.addEventListener('touchend', function(event) {
        event.preventDefault();
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

    
    if (!isGameStart) {
        for (let i = 0; i < 4; i++) {
            loop();
        }
    }

    snakeStartButton.addEventListener('click', () => {
        window.scrollTo({
            top: snakeGameBlock.offsetTop,
            behavior: "smooth"
        });
        snakeStartButton.style.display = 'none';
        snakeParagraph.style.display = 'none';
    
        if (isMobile()) {
            // addScrollableTarget(document.querySelector('body'))
            // disablePageScroll(snakeGameBlock);
        }
    
        isGameStart = true;
        loop();
    });
}

export default startSnakeGame;