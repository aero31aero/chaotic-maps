const logistic_map = () => {

	let _x = 0.5;
	let _r = 2;
	let _history = [];
	let _cycle = 0;

	let next = (x) => {
		if (x>1 || x<0) {
			throw new Error("X is out of bounds.");
		}
		let next_x = _r*(_x)*(1-_x);
		_cycle = getCycle(next_x);
		_x = next_x;
		_history.push(next_x);
		return next_x;
	};

	let set_values = (x, r) => {
		if (r>4 || r<0) {
			throw new Error("R is out of bounds");
		}
		_x = x;
		_r = r;
		_history = [];
		// reset the cycle count.
		_cycle = 0;
	};

	let getCycle = (next_x) => {
		let idx = _history.indexOf(next_x);
		if (idx == -1) {
			return 0;
		}
		return _history.length - idx;
	}

	let print_progress = (i, maxi) => {
		if (i == 0) return;
		let one_percent = Math.floor(maxi/100);
		if (i % one_percent == 0) {
			// console.log(`Progress: ${i/one_percent}%.`);
		}
	};

	let cycle = (x, r, maxi) => {
		x = x || 0.5;
		maxi = maxi || 10000;
		set_values(x, r);
		i = 0;
		while (i<maxi && _cycle == 0) {
			print_progress(i, maxi);
			next();
			i++;
		}
		// console.log(_history.slice(-20));
		if (_cycle == 0) {
			// console.error(`No cycle of < ${maxi} found.`);
		}
		return {cycle: _cycle, orbit: _history.slice(-_cycle), history: _history};
	}

	return cycle;
};

module.exports = logistic_map();