import * as readline from 'node:readline';
// import archy from 'archy';

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

                    // [Uncomment to render the tree]
                    // const tree = buildTree(a, b, c);
                    // console.log("\nTree of values:");
                    //
                    // if (!result) {
                    //     console.log('("c" was not found, the tree is drawn up to the maximum possible depth where "a" and "b" are less than or equal to "c".)');
                    // }
                    //
                    // console.log('\n' + archy(tree));
                } else {
                    console.error('Error: Please enter positive integers and ensure "c" >= "a" + "b".');
                }

                rl.close();
            });
        });
    });
}

const isValidInput = (a, b, c) => {
    return !isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0 && b > 0 && c > 0 && c >= a + b;
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

    const visited = new Set();
    const queue = [[a, b]];

    while (queue.length > 0) {
        const [currentA, currentB] = queue.shift();

        if (currentA === c || currentB === c) {
            return true;
        }

        const nextA = currentA + currentB;
        const nextB = currentB + currentA;

        if (nextA <= c && !visited.has(`${nextA},${currentB}`)) {
            visited.add(`${nextA},${currentB}`);
            queue.push([nextA, currentB]);
        }

        if (nextB <= c && !visited.has(`${currentA},${nextB}`)) {
            visited.add(`${currentA},${nextB}`);
            queue.push([currentA, nextB]);
        }
    }

    return false;
}

const buildTree = (a, b, c) => {
    const visited = new Set();
    const tree = { label: `${a}, ${b}`, nodes: [] };
    const queue = [[a, b, tree, 0]];

    let targetDepth = -1;

    while (queue.length > 0) {
        const [currentA, currentB, node, depth] = queue.shift();
        const key = `${currentA},${currentB}`;

        if (visited.has(key) || currentA > c || currentB > c) {
            continue;
        }

        visited.add(key);

        if ((currentA === c || currentB === c) && targetDepth === -1) {
            targetDepth = depth;
        }

        const child1 = { label: `${currentA + currentB}, ${currentB}`, nodes: [], depth: depth + 1 };
        const child2 = { label: `${currentA}, ${currentB + currentA}`, nodes: [], depth: depth + 1 };

        node.nodes.push(child1, child2);

        if (targetDepth === -1 || depth < targetDepth) {
            if (currentA + currentB <= c) queue.push([currentA + currentB, currentB, child1, depth + 1]);
            if (currentB + currentA <= c) queue.push([currentA, currentB + currentA, child2, depth + 1]);
        }
    }

    const pruneTree = (node, depth = 0) => {
        if (targetDepth !== -1 && depth > targetDepth) {
            return false;
        }
        node.nodes = node.nodes.filter(child => pruneTree(child, depth + 1));
        return true;
    }

    pruneTree(tree);
    return tree;
}

// Run the main function if the file is launched directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    main();
}

export { isValidInput, canReachSum };
