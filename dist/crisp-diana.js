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

	$crisp.push(["on", "message:sent", function(message) {
		if(localStorage.getItem("crisp_whats") === "asked") {
			localStorage.setItem("crisp_whats", "received");
			ga('send', {
			  hitType: 'event',
			  eventCategory: 'Crisp',
			  eventAction: 'user:phone:changed',
			  eventLabel: 'Phone Changed'
			});
			$crisp.push(["set", "user:phone", message.content.replace(/\D/g,'')]);
			askEmail();
		} else if(localStorage.getItem("crisp_email") === "asked") {
			localStorage.setItem("crisp_email", "received");
			$crisp.push(["do", "message:show", ["text", "Ok! Iremos tentar entrar em contato pelo Whats, caso a gente não consiga, entraremos em contato por e-mail ;)"]]);
			$crisp.push(["set", "user:email", message.content]);
		} else if(localStorage.getItem("crisp_whats") !== "received") {
			askWhats();
		} else if(!$crisp.is("website:available") && $crisp.is("session:ongoing")) {
			$crisp.push(["do", "message:show", ["text", "Nossos operadores estão todos ocupados, iremos te contactar assim que possível ;)"]]);
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
			if(!$crisp.is("session:ongoing")) {
				audio.play();
				$crisp.push(["do", "message:show", ["text", "Clique aqui para conversar com a gente!"]]);
			}
		}, 10000);
	}

	function askWhats() {
		setTimeout(function(){
			$crisp.push(["do", "message:show", ["text", "Tudo bem, qual é o número do seu Whats com DDD?"]]);
			localStorage.setItem("crisp_whats", "asked");
		}, 1500);
	}

	function askEmail() {
		$crisp.push(["do", "message:show", ["text", "E qual é o seu e-mail?"]]);
		localStorage.setItem("crisp_email", "asked");
	}

	function exitIntent() {
		if(!$crisp.is("session:ongoing")) {
			audio.play();
			$crisp.push(["do", "message:show", ["text", "Psiu! Você tem certeza que quer sair antes de conversar com a gente? :'("]]);
		}
	}
};

// https://cdn.jsdelivr.net/gh/goldfire/howler.js/dist/howler.min.js

// https://cdn.jsdelivr.net/gh/AMKohn/bounceback/dist/bounceback.min.js

// https://cdn.jsdelivr.net/combine/gh/goldfire/howler.js/dist/howler.min.js,gh/AMKohn/bounceback/dist/bounceback.min.js,gh/yuriolive/crisp-diana@v0.1.2/dist/crisp-diana.min.js