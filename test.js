import {canReachSum, isValidInput} from './app.js';

// ANSI colors escape codes
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m"
};
const testDataProvider = [
    [5, 7, 12, 'YES'],
    [5, 7, 13, 'NO'],
    [5, 7, 21, 'NO'],
    [5, 7, 22, 'YES'],
    [5, 7, 1, 'Error: Please enter positive integers and ensure "c" >= "a" + "b".'],
    [5, 7, -20, 'Error: Please enter positive integers and ensure "c" >= "a" + "b".'],
];

const runTests = () => {
    testDataProvider.forEach((testCase, index) => {
        const [a, b, c, expected] = testCase;

        console.log(`Running test case ${index + 1}: asserting that canReachSum(${a}, ${b}, ${c}) will return '${expected}'`);

        if (isValidInput(a, b, c)) {
            const result = canReachSum(a, b, c) ? 'YES' : 'NO';
            if (result === expected) {
                console.log(`${colors.green}✓${colors.reset} Test case ${index + 1} passed.\n`);
            } else {
                console.error(`${colors.red}✗${colors.reset} Test case ${index + 1} failed. Expected: ${expected}, but got: ${result}\n`);
            }
        } else {
            const result = 'Error: Please enter positive integers and ensure "c" >= "a" + "b".';
            if (result === expected) {
                console.log(`${colors.green}✓${colors.reset} Test case ${index + 1} passed.\n`);
            } else {
                console.error(`${colors.red}✗${colors.reset} Test case ${index + 1} failed. Expected: ${expected}, but got: ${result}\n`);
            }
        }
    });
    console.log('All tests completed.');
}

runTests();
process.exit();
