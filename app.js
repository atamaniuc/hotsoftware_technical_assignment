import * as readline from 'node:readline';
import * as path from 'node:path';
import { Deque } from './deque.js';

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
                    const result = canReachSum(a, b, c);
                    console.log(`\n${result ? 'YES' : 'NO'}`);
                    console.timeEnd('Execution Time');
                } else {
                    console.error('Error: Please enter positive integers and ensure "c" >= "a" + "b".');
                }

                rl.close();
            });
        });
    });
}

const isValidInput = (a, b, c) => {
    return !isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0 && b > 0 && c >= a + b;
}

const gcd = (x, y) => {
    while (y !== 0) {
        [x, y] = [y, x % y];
    }
    return x;
}

const canReachSum = (a, b, c) => {
    if (c % gcd(a, b) !== 0) {
        return false;
    }

    const visited = {};
    const deque = new Deque();

    deque.addBack([a, b]);

    while (deque.size() > 0) {
        let [currentA, currentB] = deque.removeFront();
        const key = `${currentA},${currentB}`;

        if (currentA === c || currentB === c) {
            return true;
        }

        if (!visited[key]) {
            visited[key] = true;

            if (currentA + currentB <= c) {
                deque.addBack([currentA + currentB, currentB]);
                deque.addBack([currentA, currentA + currentB]);
            }
        }
    }

    return false;
}

if (path.basename(process.argv[1]) === path.basename(new URL(import.meta.url).pathname)) {
    main();
}

export { isValidInput, canReachSum };
