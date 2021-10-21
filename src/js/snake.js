CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }        
}

const startSnakeGame = (width, height, status) => {

    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');

    let getClosestInteger = (a, b, x = Math.trunc(a / b)) => a > b ? !(a % b) ? a : (b * (x + 1) - a) < (a - b * x) ? b * (x + 1) : b * x : 'Некорректный ввод данных';

    // Размер одной клеточки на поле — 16 пикселей
    const grid = 32;

    const canvasWidth = getClosestInteger(width, grid) - 32;
    const canvasHeight = getClosestInteger(height, grid) - 32;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Служебная переменная, которая отвечает за скорость змейки
    let count = 0;

    let snake = {
        // Начальные координаты
        x: 160,
        y: 160,
        // Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
        dx: grid,
        dy: 0,
        // Тащим за собой хвост, который пока пустой
        cells: [],
        // Стартовая длина змейки — 4 клеточки
        maxCells: 4,
        direction: 'left',
        firstKeyEvent: 0
    };

    // А это — еда (apple).
    let apple = {
        // Начальные координаты яблока
        x: 320,
        y: 320
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Игровой цикл — основной процесс, внутри которого будет всё происходить
    const loop = () => {
        // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
        requestAnimationFrame(loop);
        // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет.
        if (++count < 5) {
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
        context.fillStyle = 'white';
        context.roundRect(apple.x, apple.y, grid, grid, 20, 'white');
        // Одно движение змейки — один новый нарисованный квадратик 
        
        // Обрабатываем каждый элемент змейки
        snake.cells.forEach((cell, index) => {
        if (index == 0) {
            if (snake.firstKeyEvent == 0) {
                context.roundRect(cell.x - (grid / 2), cell.y, grid, grid, 20, 'white');
            } else {
                if (snake.direction == 'left') {
                    context.roundRect(cell.x + (grid / 2), cell.y, grid, grid, 20, 'white');
                }
            }

            if (snake.direction == 'right') {
                context.roundRect(cell.x - (grid / 2), cell.y, grid, grid, 20, 'white');
            }
            if (snake.direction == 'top') {
                context.roundRect(cell.x, cell.y + (grid / 2), grid, grid, 20, 'white');
            }
            if (snake.direction == 'down') {
                context.roundRect(cell.x, cell.y - (grid / 2), grid, grid, 20, 'white');
            }
        } 
        // else if (index == (snake.cells.length - 1)) 
        else {
            context.fillRect(cell.x, cell.y, grid, grid);
        }
        
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
            }
        }
        });
    }

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
        }
        // Стрелка вверх
        else if (e.which === 38 && snake.dy === 0) {
            e.preventDefault();
            snake.dy = -grid;
            snake.dx = 0;
            snake.direction = 'top';
            snake.firstKeyEvent = 1;
        }
        // Стрелка вправо
        else if (e.which === 39 && snake.dx === 0) {
            e.preventDefault();
            snake.dx = grid;
            snake.dy = 0;
            snake.direction = 'right';
            snake.firstKeyEvent = 1;
        }
        // Стрелка вниз
        else if (e.which === 40 && snake.dy === 0) {
            e.preventDefault();
            snake.dy = grid;
            snake.dx = 0;
            snake.direction = 'down';
            snake.firstKeyEvent = 1;
        }
    });

    let initialPoint = 0;
    let finalPoint = 0;

    document.addEventListener('touchstart', function(event) {
        if (status) {
            event.preventDefault();
            event.stopPropagation();
            initialPoint = event.changedTouches[0];
        }
    }, false);
    
    document.addEventListener('touchend', function(event) {
        if (status) {
            event.preventDefault();
            event.stopPropagation();
            finalPoint = event.changedTouches[0];
            const xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
            const yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
            if (xAbs > 20 || yAbs > 20) 
            {
                if (xAbs > yAbs) 
                {
                    if (finalPoint.pageX < initialPoint.pageX) {
                        snake.dx = -grid;
                        snake.dy = 0;
                        snake.direction = 'left';
                    } else {
                        snake.dx = grid;
                        snake.dy = 0;
                        snake.direction = 'right';
                        snake.firstKeyEvent = 1;
                    };
                }
                else
                {
                    if(finalPoint.pageY < initialPoint.pageY) {
                        snake.dy = -grid;
                        snake.dx = 0;
                        snake.direction = 'top';
                        snake.firstKeyEvent = 1;
                    } else {
                        snake.dy = grid;
                        snake.dx = 0;
                        snake.direction = 'down';
                        snake.firstKeyEvent = 1;
                    };
                }
            }
        }
    }, false);

    if (status) {
        requestAnimationFrame(loop);
    }
}

export default startSnakeGame;