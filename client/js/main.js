var keylock = (function () {
	var code = '';

	var pressKey = function (key) {
		code += key;
		if (code.length == 4) {
			alert(code);
			code = '';
		}
	};

	return {
		pressKey: pressKey
	};
})();

$(function () {
	var start = [10, 200],
		size = [100, 70];

	$('body').mousedown(function (e) {
		var column = parseInt((e.offsetX - start[0]) / size[0], 10),
			row = (e.offsetY - start[1]) / size[1];
		if (row < 0) {
			row = -1;
		}
		row = parseInt(row, 10);

		var keyPressed = row * 3 + (column + 1);

		if (keyPressed == 11) {
			keyPressed = 0;
		}
		if (keyPressed >= 0) {
			keylock.pressKey(keyPressed);
		}
	});
});