var keylock = (function () {
	var code = '',
		server = 'http://127.0.0.1:3000/';

	var pressKey = function (key) {
		if (key === 10) { // Knock
			$.ajax({
				type: 'GET',
				url: server + 'knock/'
			});
			return;
		} else if (key === 12) { // Leave message
			$('body').append(
				$('<div/>').attr('id', 'message-overlay').append(
					$('<textarea/>')
						.css({
							position: 'absolute',
							left: 0,
							top: -3,
							padding: '5px',
							width: '310px',
							height: '135px'
						})
						.attr('id', 'messagearea')
						.blur(function () {
							$(this).focus();
						})
					).append(
						$('<div/>')
							.css({
								position: 'absolute',
								top: '143px',
								left: 0,
								height: '60px',
								width: '160px',
								'background-color': '#ccc',
								border: '1px solid #aaa',
								'line-height': '60px',
								'text-align': 'center'
							})
							.text('Send')
							.click(function () {
								alert($('#messagearea').val());
								$('#message-overlay').remove();
							})
					).append(
						$('<div/>')
							.css({
								position: 'absolute',
								top: '143px',
								left: '160px',
								height: '60px',
								width: '160px',
								'background-color': '#ccc',
								border: '1px solid #aaa',
								'line-height': '60px',
								'text-align': 'center'
							})
							.text('Cancel')
							.click(function () {
								$('#message-overlay').remove();
							})
					).append(
						$('<div/>')
							.css({
								position: 'absolute',
								top: '205px',
								left: 0,
								height: '257px',
								width: '320px',
								'background-color': '#ccc'
							})
					)
			);
			$('#messagearea').focus();
			return;
		}

		code += key;

		$('#message').addClass('code');
		$('#message').html(Array(code.length + 1).join('&middot;'));

		if (code.length == 4) {
			$.ajax({
				type: 'GET',
				url: server + 'check_code/' + code,
				success: function (data) {
					if (data === 'you\'re in') {
						$('#message').attr('class', 'success');
						$('#message').text('Open');
						window.setTimeout(function () {
							$('#message').attr('class', 'error');
							$('#message').text('Locked');
						}, 3000);
					}
				},
				error: function (xhr, textStatus, errorThrown) {
					data = xhr.responseText;
					if (data === 'Fail.') {
						$('#message').attr('class', 'error');
						$('#message').text('Wrong code');
						window.setTimeout(function () {
							$('#message').attr('class', 'error');
							$('#message').text('Locked');
						}, 3000);
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
			$('#message').text('Wait ' + locked_for + ' seconds');
			if (locked_for === 0) {
				window.clearInterval(inter);
				$('#message').attr('class', 'error');
				$('#message').text('Locked');
			}
			code = '';
		}, 1000);
	};

	return {
		pressKey: pressKey
	};
})();

$(function () {
	var start = [10, 200],
		size = [100, 70];

	$('#main').bind('click', function (e) {
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