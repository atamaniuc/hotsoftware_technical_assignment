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
