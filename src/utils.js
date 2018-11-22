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
		return arr;
	}
	return {main, get_init_array,};
}();

let print = function () {
	let print_final = (final) => {
		console.log("=========================================================================================");
		final.forEach((elem) => {
			let str = ''
			elem.forEach((e) => {
				str += e + '\t';
			});
			console.log(str);
		});
		console.log("=========================================================================================");
	}
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
		print_final(final);
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
		print_final(final);
	};
	return {sbox, sbox_diff,};
}();

let sbox_factory = function () {
	let main = (opt) => {
		let {x, n, r, count} = opt
		let arr = [];
		while (count--) {
			arr.push(sbox_maker.main(x, n, r));
			x += 0.000233;
			x = x % 1;
		}
		return arr;
	}
	return main;
}();

let lyapunov = function () {
	let calc = (opt) => {
		let {x1, x2, count, map, param} = opt;
		let x1_orig = x1;
		let x2_orig = x2;
		for (let i = 0; i < count; i++) {
			x1 = map(x1, param);
			x2 = map(x2, param);
		}
		let exp = (1/count) *  Math.log(Math.abs((x2 - x1) / (x2_orig - x1_orig)));
		return exp;
	};
	return calc;
}();

let test_suite = function () {
	let adjacency = (arr) => {
		let percentage_adjacent = 0;
		let avg_distance = 0;
		for (let i=0; i<arr.length-1; i++) {
			let diff = Math.abs(arr[i] - arr[i+1])
			if (diff == 1) {
				percentage_adjacent++;
			}
			avg_distance += diff;
		}
		percentage_adjacent *= 100 / arr.length;
		avg_distance /= arr.length;
		return {percentage_adjacent, avg_distance};
	}

	let non_linearity = (arr) => {
		let bit_bias_data = [0,0,0,0,0,0,0,0];
		arr.forEach(elem => {
			let num = elem.toString(2);
			let l = 8 - num.length;
			while(l--) num = '0' + num;
			num.split('').forEach((digit, index) => {
				if (digit == 1) {
					bit_bias_data[index]++;
				}
			})
		});
		let bias_data = [];
		bit_bias_data.forEach(elem => {
			// console.log(elem);
			let bias = Math.pow(2,8) - 2 * elem;
			bias_data.push(bias);
		});
		return bias_data;
	}
	return {adjacency,non_linearity,};
}();

let random = function () {
	let print_avg_adjacency_for_boxes = (boxes, str) => {
		let avg_pcnt = 0;
		let avg_dist = 0;
		boxes.forEach((elem,idx) => {
			let data = test_suite.adjacency(elem);
			// console.log(`Adjacency Test (SB-\t${idx}):`, data);
			avg_pcnt += data.percentage_adjacent;
			avg_dist += data.avg_distance;
		});
		avg_dist/=boxes.length;
		avg_pcnt/=boxes.length;
		console.log(`Adjacency Test (${str}):`, {percentage_adjacent: avg_pcnt, avg_distance: avg_dist});
	};

	let get_random_sboxes = (count) => {
		let boxes = [];
		for (let i=0; i<count; i++) {
			let arr = sbox_maker.get_init_array(256);
			arr = fy_shuffle(arr);
			boxes.push(arr);
		}
		return boxes;
	};

	return {print_avg_adjacency_for_boxes, get_random_sboxes,};
}();

boxes = sbox_factory({
	x: 0.5,
	n: 0.6,
	r: 4,
	count: 1000,
});

// print.sbox(boxes[0]);
// console.log("Adjacency Test (SB0):", test_suite.adjacency(boxes[0]));
// print.sbox(boxes[1]);
// console.log("Adjacency Test (SB1):", test_suite.adjacency(boxes[1]));

// let aes_sbox =
//  [0x63 ,0x7c ,0x77 ,0x7b ,0xf2 ,0x6b ,0x6f ,0xc5 ,0x30 ,0x01 ,0x67 ,0x2b ,0xfe ,0xd7 ,0xab ,0x76
//  ,0xca ,0x82 ,0xc9 ,0x7d ,0xfa ,0x59 ,0x47 ,0xf0 ,0xad ,0xd4 ,0xa2 ,0xaf ,0x9c ,0xa4 ,0x72 ,0xc0
//  ,0xb7 ,0xfd ,0x93 ,0x26 ,0x36 ,0x3f ,0xf7 ,0xcc ,0x34 ,0xa5 ,0xe5 ,0xf1 ,0x71 ,0xd8 ,0x31 ,0x15
//  ,0x04 ,0xc7 ,0x23 ,0xc3 ,0x18 ,0x96 ,0x05 ,0x9a ,0x07 ,0x12 ,0x80 ,0xe2 ,0xeb ,0x27 ,0xb2 ,0x75
//  ,0x09 ,0x83 ,0x2c ,0x1a ,0x1b ,0x6e ,0x5a ,0xa0 ,0x52 ,0x3b ,0xd6 ,0xb3 ,0x29 ,0xe3 ,0x2f ,0x84
//  ,0x53 ,0xd1 ,0x00 ,0xed ,0x20 ,0xfc ,0xb1 ,0x5b ,0x6a ,0xcb ,0xbe ,0x39 ,0x4a ,0x4c ,0x58 ,0xcf
//  ,0xd0 ,0xef ,0xaa ,0xfb ,0x43 ,0x4d ,0x33 ,0x85 ,0x45 ,0xf9 ,0x02 ,0x7f ,0x50 ,0x3c ,0x9f ,0xa8
//  ,0x51 ,0xa3 ,0x40 ,0x8f ,0x92 ,0x9d ,0x38 ,0xf5 ,0xbc ,0xb6 ,0xda ,0x21 ,0x10 ,0xff ,0xf3 ,0xd2
//  ,0xcd ,0x0c ,0x13 ,0xec ,0x5f ,0x97 ,0x44 ,0x17 ,0xc4 ,0xa7 ,0x7e ,0x3d ,0x64 ,0x5d ,0x19 ,0x73
//  ,0x60 ,0x81 ,0x4f ,0xdc ,0x22 ,0x2a ,0x90 ,0x88 ,0x46 ,0xee ,0xb8 ,0x14 ,0xde ,0x5e ,0x0b ,0xdb
//  ,0xe0 ,0x32 ,0x3a ,0x0a ,0x49 ,0x06 ,0x24 ,0x5c ,0xc2 ,0xd3 ,0xac ,0x62 ,0x91 ,0x95 ,0xe4 ,0x79
//  ,0xe7 ,0xc8 ,0x37 ,0x6d ,0x8d ,0xd5 ,0x4e ,0xa9 ,0x6c ,0x56 ,0xf4 ,0xea ,0x65 ,0x7a ,0xae ,0x08
//  ,0xba ,0x78 ,0x25 ,0x2e ,0x1c ,0xa6 ,0xb4 ,0xc6 ,0xe8 ,0xdd ,0x74 ,0x1f ,0x4b ,0xbd ,0x8b ,0x8a
//  ,0x70 ,0x3e ,0xb5 ,0x66 ,0x48 ,0x03 ,0xf6 ,0x0e ,0x61 ,0x35 ,0x57 ,0xb9 ,0x86 ,0xc1 ,0x1d ,0x9e
//  ,0xe1 ,0xf8 ,0x98 ,0x11 ,0x69 ,0xd9 ,0x8e ,0x94 ,0x9b ,0x1e ,0x87 ,0xe9 ,0xce ,0x55 ,0x28 ,0xdf
//  ,0x8c ,0xa1 ,0x89 ,0x0d ,0xbf ,0xe6 ,0x42 ,0x68 ,0x41 ,0x99 ,0x2d ,0x0f ,0xb0 ,0x54 ,0xbb ,0x16];

// print.sbox(aes_sbox);
// console.log("Adjacency Test (AES):", test_suite.adjacency(aes_sbox));

// random.print_avg_adjacency_for_boxes(boxes, "OUR");

// random_boxes = random.get_random_sboxes(1);
// random.print_avg_adjacency_for_boxes(random_boxes, "RNDM");
// let exp = lyapunov({
// 	x1: 0.8,
// 	x2: 0.80000000000001,
// 	param: 4,
// 	count: 10,
// 	map: logistic_map,
// });
// console.log("Lyapunov: Logistic:", exp);

// exp = lyapunov({
// 	x1: 0.8,
// 	x2: 0.80000000000001,
// 	param: 0.6,
// 	count: 10,
// 	map: pwlc_map,
// });
// console.log("Lyapunov: Skew Tent:", exp);

// console.log(test_suite.non_linearity(boxes[0]))
// console.log(test_suite.non_linearity(aes_sbox))
