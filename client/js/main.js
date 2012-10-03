var keylock = (function () {
	var code = '',
		server = 'http://localhost:3000/check_code/';

	var pressKey = function (key) {
		code += key;

		$('#message').addClass('code');
		$('#message').html(Array(code.length + 1).join('&middot;'));

		if (code.length == 4) {
			$.ajax({
				type: 'GET',
				url: server+code,
				success: function (data) {
					if (data === 'you\'re in') {
						$('#message').attr('class', 'success');
						$('#message').text('Open');
					}
				},
				error: function (xhr, textStatus, errorThrown) {
					data = xhr.responseText;
					if (data === 'Fail.') {
						$('#message').attr('class', 'error');
						$('#message').text('Wrong code');
					} else if (data.indexOf('wait_') != -1) {
						$('#message').attr('class', 'error');
						$('#message').text('Wrong code');
						locked_for = data.substr(5);
						initCountdown();
					}
				}
			});
			code = '';
		}
	};

	initCountdown = function() {
		inter = window.setInterval(function () {
			locked_for -= 1;
			$('#message').attr('class', 'wait');
			$('#message').text('Wait ' + locked_for + ' seconds.');
			if (locked_for === 0) {
				window.clearInterval(inter);
				$('#message').attr('class', 'error');
				$('#message').text('Locked');
			}
		}, 1000);
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