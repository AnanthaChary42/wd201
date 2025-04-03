const args = process.argv;
const operation = args[2];
const num1 = parseInt(args[3]);
const num2 = parseInt(args[4]);

if (operation === 'add') {
    console.log(`The result is: ${num1 + num2}`);
} else if (operation === 'subtract') {
    console.log(`The result is: ${num1 - num2}`);
} else if (operation === 'multiply') {
    console.log(`The result is: ${num1 * num2}`);
} else {
    console.log('Unknown operation');
}