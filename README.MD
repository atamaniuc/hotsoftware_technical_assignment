### Тестовое задание: Проверка достижимости значения путем сложения двух чисел
```
Даны три целые числа a, b, c больше 0. Есть два варианта либо добавлять b к a (a+=b), либо добавлять a к b (b+=a).  
В результате получаются новые значение а и b. 
Напишите программу на NODE JS, которая выведет YES или NO в зависимости от того можете ли получить значение c, добавляя a к b или b к a друг к другу.

P.S. где с не ограничено большое значение
```
![img.png](img.png)

### Установка и запуск
1. `git clone git@github.com:atamaniuc/hotsoftware_technical_assignment.git` или `gh repo clone atamaniuc/hotsoftware_technical_assignment`
2. `cd technical_assignment`
3. `nvm use v20.11.1` (такой у меня уже был установлен)
4. `npm i`
5. `node app.js`

![img_2.png](img_2.png)

6. `node test.js`

![img_3.png](img_3.png)

# Описание работы

В данном проекте используется алгоритм для проверки возможности получения значения `c` путем последовательного сложения двух чисел `a` и `b`. Алгоритм реализован с использованием `worker threads` для повышения производительности.

## Принцип работы алгоритма

### Алгоритм Евклида

Определяется наибольший общий делитель (НОД) чисел `a` и `b`. Если `c` не делится на НОД `a` и `b`, то получить `c` невозможно, и функция сразу возвращает `NO`.

### Поиск в ширину (BFS)

- Используется очередь для обработки пар чисел. Начинаем с пары (a, b).
- Для каждой пары проверяем, можно ли получить `c`. Если да, то возвращаем `YES`.
- Если нет, добавляем в очередь новые пары, полученные путем сложения текущих чисел.
- Используется множество для хранения посещенных пар, чтобы избежать бесконечных циклов.

## Реализация с использованием `worker threads`

Для повышения производительности и оптимизации вычислений используется модуль `worker_threads`.

### Главный поток

- Считывает входные данные (a, b, c).
- Проверяет корректность ввода.
- Запускает воркер с переданными данными.
- Ожидает результат от воркера и выводит его.

### Воркер

- Выполняет основные вычисления: алгоритм Евклида и BFS.
- Возвращает результат главному потоку через канал сообщений.

## Основной код (app.js)

```javascript
import { Worker } from 'worker_threads';
import * as readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = () => {
    rl.question('Input "a": ', (a) => {
        rl.question('Input "b": ', (b) => {
            rl.question('Input "c": ', (c) => {
                a = parseInt(a);
                b = parseInt(b);
                c = parseInt(c);

                if (isValidInput(a, b, c)) {
                    console.time('Execution Time');
                    const worker = new Worker('./worker.js', { workerData: { a, b, c } });
                    worker.on('message', (result) => {
                        console.log(`\n${result ? 'YES' : 'NO'}`);
                        console.timeEnd('Execution Time');
                        rl.close();
                    });
                    worker.on('error', (error) => {
                        console.error('Worker error:', error);
                        rl.close();
                    });
                } else {
                    console.error('Error: Please enter positive integers and ensure "c" >= "a" + "b".');
                    rl.close();
                }
            });
        });
    });
}

const isValidInput = (a, b, c) => {
    return !isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0 && b > 0 && c > 0 && c >= a + b;
}

// Run the main function if the file is launched directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    main();
}

export { isValidInput };
```

# Скорость выполнения: обрабатывает c=20000 за ~ 25sec
```
node app.js
Input "a": 5
Input "b": 7
Input "c": 20000

YES
Execution Time: 24.930s
```
