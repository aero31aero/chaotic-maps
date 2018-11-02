var logistic_map = require('./logistic-map');

max = 10000000;
x = 0.5;
r = 3.569945;

let calc = (r) => {
	cycle = logistic_map(x, r, max).cycle;
	console.log(`Cycle of x = ${x} and r = ${r} is ---->    \t${cycle}`);
}
let diffcalc = (x1, x2) => {
	r = 4; max = 10000;
	his1 = logistic_map(x1, r, max).history;
	his2 = logistic_map(x2, r, max).history;
	console.log(his1, his2);
	let diff10 = 0;
	let diff50 = 0;
	for(i=0;i<his1.length;i++) {
		let diff = (his1[i]-his2[i])*100;
		// diff = (his1[i])*100;
		// diff = diff.toFixed(2);
		let msg = `${i+1}:\t${his1[i]}\t${his2[i]}\tDiff: ${diff}%`
		if (Math.abs(diff) < 100/256) {
			diff10++;
		}
		if (Math.abs(diff) > 20){
			diff50++;
		}
		// console.log(msg);
	}
	// console.log(his2);
	console.log(`For: ${x1}\t${x2}`);
	console.log(`% nums with diff < 100/256%: ${diff10*100/max}%.`)
	console.log(`% nums with diff > 50%: ${diff50*100/max}%.`)
	let u = (1/10) * Math.log(Math.abs((his2[9]-his1[9])/(his2[0]-his1[0])));
	console.log(`Liapunov Exponent: ${u}`);
	console.log();
};

console.log();
diffcalc(.8, 0.8 + 5552e-20);
diffcalc(.8, 0.8000000000000001);
diffcalc(.8, 0.80000000000001);
diffcalc(.3, 0.300001);
diffcalc(.232434, 0.56564);

let getNext = (n) => {
	let n0 = n[n.length-1]; // last
	let y = n0.split('').map(m => parseInt(m));
	let newbit = y[0] ^ y[2] ^ y[3] ^ y[6];
	let n1 = n0.slice(1,8) + newbit.toString();
	n.push(n1);
	return n;
}

x = logistic_map(0.3, 3.99, 256).history;
x = x.map(n => Math.floor(n*256));
x = x.map(n => n.toString(2));
x = x.map(n => {
	let l = 8 - n.length;
	while(l--) n = '0' + n;
	return n;
});
x = x.map(n => [n]);
x = x.map(n => getNext(n));
x = x.map(n => {
	n0 = n[0];
	n1 = n[1];
	let xor = (a,b) => {
		let x = parseInt(a) ^ parseInt(b);
		return x.toString();
	};
	let i = 0;
	let n2 = [];
	while(i++ < 8) {
		n2.push(xor(n0[i], n1[i]));
	}
	return n2;
	// return n2.join('');
});
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => getNext(n));
// x = x.map(n => n.map(m => m.split('')));
console.log(x.slice(0,1));

 calc(2.6)
 calc(3.1);
 calc(3.5);
 calc(3.55);
 calc(3.56);
 calc(3.567);
 calc(3.56969);
 calc(3.56989);
 calc(3.569899);
 calc(3.569943);
 calc(3.569945);
