let logistic_map = function () {
	let get_next = function (x, r) {
		let x_next = r * x * (1 - x);
		return x_next;
	};
	return get_next;
}();

let pwlc_map = function () {
	let get_next = (y, p) => {
		let y_next = y/p;
		if (y_next > 1) {
			y_next = (1-y)/(1-p);
		}
		return y_next;
	};
	return get_next;
}();

let fy_shuffle = function () {
	let do_shuffle = (arr) => {
		let i = arr.length -1;
		while (i-- > 0) {
			let j = Math.floor(Math.random() * i) + 1;
			let temp = arr[j];
			arr[j] = arr[i];
			arr[i] = temp;
		}
		return arr;
	};
	return do_shuffle;
}();

let sbox_maker = function () {
	let get_init_array = (lim) => {
		let arr = [];
		for(let i = 0; i < lim; i++) {
			arr.push(i);
		}
		return arr;
	};

	let iterate_pwlcm = (x, n, count) => {
		for (let i =0; i<count; i++) {
			x = pwlc_map(x, n);
		}
		return x;
	};

	let loop_thingy = (opt) => {
		let {x, r, arr, n, cnt} = opt;
		x = logistic_map(x, r);
		let k = arr.length - cnt;
		let m = (Math.floor(x * 10e10 ) % k);
		let temp = arr[k];
		arr[k] = arr[m];
		arr[m] = temp;
		cnt++;
		return {x, r, arr, n, cnt};
	};

	let main = (x, n, r) => {
		arr = get_init_array(256);
		x = iterate_pwlcm(x, n, 1000);
		let cnt = 1;
		let data = {};
		while (cnt < 256) {
			data = loop_thingy({x, n, r, cnt, arr});
			({x, n, r, cnt, arr} = data);
		}
		arr = data.arr;

		arr = fy_shuffle(arr);
		return arr;
	}
	return main;
}();

let print = function () {
	let sbox = (arr) => {
		let final = [];
		let row = [];
		arr.forEach((elem) => {
			row.push(elem);
			if (row.length == 16) {
				final.push(row);
				row = [];
			}
		});
		console.log("=========================================================================================");
		final.forEach((elem) => {
			let str = ''
			elem.forEach((e) => {
				str += e + '\t';
			});
			console.log(str);
		});
		console.log("=========================================================================================");
	};
	let sbox_diff = (a,b) => {
		let final = [];
		let row = [];
		a.forEach((elem, idx) => {
			let temp = elem - b[idx];
			row.push(temp);
			if (row.length == 16) {
				final.push(row);
				row = [];
			}
		});
		console.log("=========================================================================================");
		final.forEach((elem) => {
			let str = ''
			elem.forEach((e) => {
				str += e + '\t';
			});
			console.log(str);
		});
		console.log("=========================================================================================");
	};
	return {sbox, sbox_diff,};
}();

let sbox_factory = function () {
	let main = (opt) => {
		let {x, n, r, count} = opt
		let arr = [];
		while (count--) {
			arr.push(sbox_maker(x, n, r));
			x += 0.000233;
			x = x % 1;
		}
		return arr;
	}
	return main;
}();

boxes = sbox_factory({
	x: 0.5,
	n: 0.6,
	r: 3.9,
	count: 1000,
});

print.sbox(boxes[0]);
print.sbox(boxes[1]);
