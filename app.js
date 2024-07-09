import * as readline from 'node:readline';
import archy from 'archy';

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
                    const result = canReachSum(a, b, c);
                    console.log(`\n${result ? 'YES' : 'NO'}`);

                    const tree = buildTree(a, b, c);
                    console.log("\nTree of values:");

                    if (!result) {
                        console.log('("c" was not found, the tree is drawn up to the maximum possible depth where "a" and "b are less than or equal to "c".)');
                    }

                    console.log('\n' + archy(tree));
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

const canReachSum = (a, b, c) => {
    const visited = new Set();
    let found = false;

    const dfsCanReachSum = (a, b) => {
        const key = `${a},${b}`;
        if (visited.has(key) || a > c || b > c) {
            return;
        }

        visited.add(key);

        if (a === c || b === c) {
            found = true;
            return;
        }

        dfsCanReachSum(a + b, b);
        dfsCanReachSum(a, b + a);
    }

    dfsCanReachSum(a, b);
    return found;
}

const buildTree = (a, b, c) => {
    const visited = new Set();
    const tree = {label: `${a}, ${b}`, nodes: []};
    let targetDepth = -1;

    const dfsBuildTree = (a, b, node, depth = 0) => {
        const key = `${a},${b}`;
        if (visited.has(key) || a > c || b > c) {
            return;
        }

        visited.add(key);

        if ((a === c || b === c) && targetDepth === -1) {
            targetDepth = depth;
        }

        const child1 = {label: `${a + b}, ${b}`, nodes: []};
        const child2 = {label: `${a}, ${b + a}`, nodes: []};
        node.nodes.push(child1, child2);

        if (targetDepth === -1 || depth < targetDepth) {
            dfsBuildTree(a + b, b, child1, depth + 1);
            dfsBuildTree(a, b + a, child2, depth + 1);
        }
    }

    dfsBuildTree(a, b, tree);

    // Remove unnecessary nodes after finding a solution
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

export {isValidInput, canReachSum};
