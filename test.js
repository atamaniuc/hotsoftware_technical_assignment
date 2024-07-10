import { Worker } from 'worker_threads';
import assert from 'assert';

const testCases = [
    { a: 5, b: 7, c: 12, expected: 'YES' },
    { a: 5, b: 7, c: 13, expected: 'NO' },
    { a: 5, b: 7, c: 21, expected: 'NO' },
    { a: 5, b: 7, c: 22, expected: 'YES' },
    { a: 5, b: 7, c: 1, expected: 'Error: Please enter positive integers and ensure "c" >= "a" + "b".' },
    { a: 5, b: 7, c: -20, expected: 'Error: Please enter positive integers and ensure "c" >= "a" + "b".' }
];

const runTest = ({ a, b, c, expected }) => {
    return new Promise((resolve, reject) => {
        if (!isValidInput(a, b, c)) {
            try {
                assert.strictEqual('Error: Please enter positive integers and ensure "c" >= "a" + "b".', expected);
                console.log(`Test passed for a=${a}, b=${b}, c=${c}: Expected ${expected}, got ${expected}`);
                resolve();
            } catch (error) {
                console.error(`Test failed for a=${a}, b=${b}, c=${c}: Expected ${expected}, got Error`);
                reject(error);
            }
            return;
        }

        const worker = new Worker('./worker.js', { workerData: { a, b, c } });
        worker.on('message', (result) => {
            try {
                assert.strictEqual(result ? 'YES' : 'NO', expected);
                console.log(`Test passed for a=${a}, b=${b}, c=${c}: Expected ${expected}, got ${result ? 'YES' : 'NO'}`);
                resolve();
            } catch (error) {
                console.error(`Test failed for a=${a}, b=${b}, c=${c}: Expected ${expected}, got ${result ? 'YES' : 'NO'}`);
                reject(error);
            }
        });
        worker.on('error', (error) => {
            console.error(`Worker error for a=${a}, b=${b}, c=${c}: ${error}`);
            reject(error);
        });
    });
};

const isValidInput = (a, b, c) => {
    return !isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0 && b > 0 && c > 0 && c >= a + b;
};

const runTests = async () => {
    for (const testCase of testCases) {
        await runTest(testCase);
    }
    console.log('All tests completed.');
};

runTests().then(() => process.exit()).catch(() => process.exit(1));
