img_utils.load_image();

var load_params = () => {
	let opt = {};
	opt.x = parseFloat(document.getElementById('X').value);
	opt.n = parseFloat(document.getElementById('N').value);
	opt.r = parseFloat(document.getElementById('R').value);
	return opt;
}

var encrypt = () => {
	let opt = load_params();
	opt.count = 1000;
	let boxes = sbox_factory(opt);
	var x = img_utils.get_image_pixels('src-image');
	x = img_utils.encrypt(x, boxes);
	img_utils.paint_image_data(x, 'final-image');
}

var decrypt = () => {
	let opt = load_params();
	opt.count = 1000;
	let boxes = sbox_factory(opt);
	var x = img_utils.get_image_pixels('final-image');
	x = img_utils.decrypt(x, boxes);
	// img_utils.paint_image_data(x, 'src-image');
	img_utils.paint_image_data(x, 'reverse-image');
}

xx = encrypt;
yy = decrypt;