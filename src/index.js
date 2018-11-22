img_utils.load_image();

var load_params = () => {
	let opt = {};
	opt.x = parseFloat(document.getElementById('X').value);
	opt.n = parseFloat(document.getElementById('N').value);
	opt.r = parseFloat(document.getElementById('R').value);
	return opt;
}

handle_upload = function(e) {
	console.log("HERE");
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
    let img = document.getElementById("src-img");
    img.src = url;
    img.onload = img_utils.load_image;
};

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
var input_field = document.getElementById('img-upload');
input_field.onchange = handle_upload;