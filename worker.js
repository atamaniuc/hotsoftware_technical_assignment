import { parentPort, workerData } from 'worker_threads';
import FastPriorityQueue from 'fastpriorityqueue';

const { a, b, c } = workerData;

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

    const visited = new Set();
    const queue = new FastPriorityQueue((x, y) => Math.max(x.a, x.b) < Math.max(y.a, y.b));

    queue.add({ a, b });

    while (!queue.isEmpty()) {
        const { a: currentA, b: currentB } = queue.poll();

        if (currentA === c || currentB === c) {
            return true;
        }

        const nextA = currentA + currentB;
        const nextB = currentA + currentB;

        if (nextA <= c && !visited.has(`${nextA},${currentB}`)) {
            visited.add(`${nextA},${currentB}`);
            queue.add({ a: nextA, b: currentB });
        }

        if (nextB <= c && !visited.has(`${currentA},${nextB}`)) {
            visited.add(`${currentA},${nextB}`);
            queue.add({ a: currentA, b: nextB });
        }
    }

    return false;
}

const result = canReachSum(a, b, c);
parentPort.postMessage(result);
