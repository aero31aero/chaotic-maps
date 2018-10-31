var logistic_map = require('./logistic-map');

max = 10000000;
x = 0.5;

let calc = (r) => {
	cycle = logistic_map(x, r, max).cycle;
	console.log(`Cycle of x = ${x} and r = ${r} is ---->    \t${cycle}`);
}


// calc(3.100);
// calc(3.500);
// calc(3.550);
// calc(3.560);
// calc(3.567);
// calc(3.56969);
// calc(3.56989);
// calc(3.569943);

console.log(logistic_map(x, 3.56969, max).orbit);
console.log(logistic_map(x, 3.56968, max).orbit);