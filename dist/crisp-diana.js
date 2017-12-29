// This callback gets executed once $crisp is fully loaded and all methods (not only $crisp.push()) are available
window.CRISP_READY_TRIGGER = function() {
	var lsActive = false;
	var audio = new Howl({
		src: ['https://client.crisp.chat/static/sounds/events/chat-message-receive.oga?be3c3d3']
	});

	Bounceback.init(); // Exit Intent Detection

	if (typeof(Storage) !== "undefined") {
	    lsActive = true;
	    if(localStorage.getItem("crisp_trigged") !== "true") {
	    	triggers();
	    }
	} else {
		triggers();
	}

	$crisp.push(["on", "message:received", function() {
		if(localStorage.getItem("crisp_whats") !== "received") {
			askWhats();
		} else {
			if(!$crisp.is("website:available")) {
				$crisp.push(["do", "message:send", ["text", "Nossos operadores estão todos ocupados, iremos te contactar assim que possível ;)"]]);
			}
		}
	}]);

	$crisp.push(["on", "user:phone:changed", function () {
		if(lsActive) {
			localStorage.setItem("crisp_whats", "received");
			if(localStorage.getItem("crisp_mail") !== "received") {
				askEmail();
			} else {
				$crisp.push(["do", "message:send", ["text", "Ok! Iremos tentar entrar em contato pelo Whats, caso não a gente não consiga, iremos entrar em contato por e-mail!"]]);
			}
		}
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Crisp',
		  eventAction: 'user:phone:changed',
		  eventLabel: 'Phone Changed'
		});
	}]);

	$crisp.push(["on", "user:email:changed", function () {
		if(lsActive) {
			localStorage.setItem("crisp_mail", "received");
			if(localStorage.getItem("crisp_whats") !== "received") {
				askWhats();
			} else {
				$crisp.push(["do", "message:send", ["text", "Ok! Iremos tentar entrar em contato pelo Whats, caso não a gente não consiga, iremos entrar em contato por e-mail!"]]);
			}
		}
	}]);

	Bounceback.init({
		onBounce: function() {
			exitIntent();
		}
	});

	function triggers() {
		setTimeout(function(){
			audio.play();
			$crisp.push(["do", "message:show", ["text", "Oi! Como posso ajudar?"]]);
			localStorage.setItem("crisp_trigged", "true");
		}, 1000);

		setTimeout(function(){
			audio.play();
			$crisp.push(["do", "message:show", ["text", "Clique aqui para conversar com a gente!"]]);
		}, 10000);
	}

	function askWhats() {
		$crisp.push(["do", "message:send", ["field", { "id": "phone-field", "text": "Qual é o seu Whats?", "explain": "Digite aqui seu número..." }]]);
	}

	function askEmail() {
		$crisp.push(["do", "message:send", ["field", { "id": "mail-field", "text": "E qual é o seu E-mail?", "explain": "Digite aqui seu e-mail..." }]]);
	}

	function exitIntent() {
		if(!lsActive || !$crisp.is("session:ongoing")) {
			audio.play();
			$crisp.push(["do", "message:show", ["text", "Psiu! Você tem certeza que quer sair antes de conversar com a gente?"]]);
		}
	}
};

// https://cdn.jsdelivr.net/gh/goldfire/howler.js/dist/howler.min.js

// https://cdn.jsdelivr.net/gh/AMKohn/bounceback/dist/bounceback.min.js

// https://cdn.jsdelivr.net/combine/gh/goldfire/howler.js/dist/howler.min.js,gh/AMKohn/bounceback/dist/bounceback.min.js,gh/yuriolive/crisp-diana@v0.1.2/dist/crisp-diana.min.js