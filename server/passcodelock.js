var passcodelock = (function () {
	var express					= require('express'),
		app						= express(),
		wrongtries				= 0,
		waittill				= 0,
		application_root		= __dirname,
		path					= require('path'),
		pub_dir					= path.join(application_root, '../client'),
		curcode					= '1234';

	var run = function () {
		app.listen(3000);
		console.log('Listening on port 3000');
	};

	var handle_open = function () {
		// Do the Arduino stuff
		return;
	};

	app.configure(function () {
		app.use(express.static(pub_dir));
	});

	app.get('/check_code/:code', function (req, res) {
		if (wrongtries >= 5) {
			var timediff = waittill - parseInt(new Date().getTime() / 1000, 10);
			if (timediff > 0) {
				res.send(403, 'wait_' + timediff);
				return;
			}
		}

		var code = req.params.code;
		if (code.length !== 4) {
			res.send(500, 'Wrong code length');
			return;
		} else if (code === curcode) {
			wrongtries = 0;
			res.send(200, 'you\'re in');
			handle_open();
			return;
		} else {
			var curtime = parseInt(new Date().getTime() / 1000, 10);
			waittill = curtime + 60;
			switch (wrongtries) {
				case 5:
					waittill = curtime + 60*5;
					break;
				case 6:
					waittill = curtime + 60*10;
					break;
				case 7:
					waittill = curtime + 60*30;
					break;
				case 8:
					waittill = curtime + 60*60;
					break;
				case 9:
					waittill = curtime + 60*60*24;
					break;
			}
			wrongtries += 1;
			res.send(403, 'Fail.');
			return;
		}
	});

	return {
		run: run
	};
})();

passcodelock.run();