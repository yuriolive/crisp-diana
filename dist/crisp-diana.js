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
			if($crisp.is("website:available")) {
				$crisp.push(["do", "message:show", ["text", "Ok! Iremos tentar entrar em contato pelo Whats, fica mais fácil por lá ;)"]]);
			} else {
				$crisp.push(["do", "message:show", ["text", "Ok! Nossos operadores estão um pouco ocupados no momento, iremos tentar entrar em contato pelo Whats assim que possível ;)"]]);
			}
			askEmail();
		} else if(localStorage.getItem("crisp_email") === "asked") {
			localStorage.setItem("crisp_email", "received");
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
			$crisp.push(["do", "message:show", ["text", "Tudo bem, nós enviamos o nosso catálogo com os preços atualizados de atacado ou varejo pelo WhatsApp. Qual é o seu número com DDD?"]]);
			localStorage.setItem("crisp_whats", "asked");
		}, 3000);
	}

	function askEmail() {
		setTimeout(function(){
			$crisp.push(["do", "message:show", ["text", "Caso queira, responda com o seu e-mail para receber nossas promoções e novidades!"]]);
		}, 2500);
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
