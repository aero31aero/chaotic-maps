img_utils.load_image();

var encrypt = (x, n, r) => {
	let boxes = sbox_factory({
		x: 0.6,
		n: 0.61,
		r: 4,
		count: 1000,
	});
	var x = img_utils.get_image_pixels('src-image');
	x = img_utils.encrypt(x, boxes);
	img_utils.paint_image_data(x, 'final-image');
}

var decrypt = () => {
	let boxes = sbox_factory({
		x: 0.6,
		n: 0.61,
		r: 4,
		count: 1000,
	});
	var x = img_utils.get_image_pixels('final-image');
	x = img_utils.decrypt(x, boxes);
	img_utils.paint_image_data(x, 'src-image');
	img_utils.paint_image_data(x, 'reverse-image');
}


xx = encrypt;
yy = decrypt;