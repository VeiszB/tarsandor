$(document).ready(() => {


	/******************/
	/*** START CHAT ***/
	/******************/


	// set visitor name
	let $userName = "Tom";

	// start chatbox
	$("#form-start").on("submit", (event) => {
		event.preventDefault();
		$userName = $("#username").val();
		$("#landing").slideUp(300);
		setTimeout(() => {
			$("#start-chat").html("Beszélgetés folytatása")
		}, 300);
	});




	/*****************/
	/*** USER CHAT ***/
	/*****************/


	// Post a message to the board
	function $postMessage() {
		$("#message").find("br").remove();
		let $message = $("#message").html().trim(); // get text from text box
		$message = $message.replace(/<div>/, "<br>").replace(/<div>/g, "").replace(/<\/div>/g, "<br>").replace(/<br>/g, " ").trim();
		if ($message) { // if text is not empty
			const html = `<div class="post post-user">${$message + timeStamp()}</span></div>`; // convert post to html
			$("#message-board").append(html); // add post to board
			$scrollDown(); // stay at bottom of chat
			botReply($message);
		};
		$("#message").empty();
	};

	// Chat input
	$("#message").on("keyup", (event) => {
		if (event.which === 13) $postMessage(); // Use enter to send
	}).on("focus", () => {
		$("#message").addClass("focus");
	}).on("blur", () => {
		$("#message").removeClass("focus");
	});
	$("#send").on("click", $postMessage);




	/**********************/
	/*** AUTO REPLY BOT ***/
	/**********************/


	function botReply(userMessage) {
		const reply = generateReply(userMessage);
		if (typeof reply === "string") postBotReply(reply);
		else reply.forEach((str) => postBotReply(str));
	};

	function generateReply(userMessage) {
		const message = userMessage.toLowerCase();
		let reply = [`Sajnálom, nem értem.`, `Próbáld újra!`];

		// Generate some different replies
		if (/^hi$|^hell?o|^howdy|^hoi|^hey|^ola|^szia|^üdv|^adj|^jó|^csókolom|^jancsi|^szevasz|^csá|^csőcsdumicsá|^haligali|^szeva/.test(message)) 
		reply = [`Szia ${$userName}!`, `De, jó, hogy segítesz! Gyorsan elmondom, amit kell, aztán tűzök. Tudod a Csapágyműben még most is nekem szólnak, ha valami olyan baj van, és akkor menni kell, nincs idő nyomozni. Hiába van péntek, ma is behívtak. De azért, ha valami van, mondjad. Itt mindig üzenhetsz nekem.`, 
		`Szóval ahhoz, hogy ki tudd nyomozni, hova lett az úrvacsorára szánt bor, keresd Piroskát! Vele jól lehet beszélgetni, el lehet mondani mindent, ami az embert nyomja. Meg aztán nála sok mindenki megfordul. Hátha tud segíteni neked. `,
		`A házszámot nem nagyon tudják errefelé, ne is kérdezd. Van, aki még a sajátját se, Kiss néni azt mondta a múltkor az orvosnak, hogy drága doktor úr, hazatalálok én magamtól is, nem kell nekem tudni, hogy hány szám alatt lakok. Hívd inkább telefonon! Nézz körül a Facebook profilomban, ott meg kell lennie a számnak!`];

		//else if (/test/.test(message)) reply = [`Ok`, `Feel free to test as much as you want`];
		else if (/tipp|segíts|segítség|sos/.test(message)) reply = [`Illik először köszönni, nemde?`];

		else if (/^dorogi|^hesz|^vida/.test(message)) reply = [`Na, látom, tudott segíteni Piroska.`,
		`Megtaláltad a tiszteletest is. Rettenetes a kézírása, még szerencse, hogy te ki tudtad olvasni.`,
		`Akiket felsoroltál, Dorogi, Vida, Hesz, Béres, mind nagy iszákos rajtam kívül. Közülük bárki lehetett. Ráírok Sudákra, hátha tud valamit. A buszmegállóban birkózott az alumíniumoszloppal, mikor indultam a Csapágyba. Részegen őszinte, még ha goromba is. Pillanat.`,
		`Ezt válaszolta:`,
		`tfaa űő z qn üvűi... ösisxű!`,
		`Úgy látom, megint összeakadt a nyelve a bortól. Én nem megyek vele semmire, hátha te igen. Na, sikerült dekódolni? Ha igen, másold be!`,
		`Ha elakadtál, keresgélj a facebookon!`
	];


		else if (/^húzz|^misibe!/.test(message)) reply = [`Hű, ez jó ötlet!`,
		`A presszó becsületes nevét most kapásból nem tudom megmondani, mi helybeliek nem használjuk. De rajzoltam egy térképet, amiből kiderítheted! Ha megvan a név, írd le nekem is! `,
		`link az útvesztőről`,];

		else if (/orgona|orgona presszó/.test(message)) reply = [`Á, tényleg! A presszó tulaja egy kockás füzetbe vezeti a tartozásokat. Régen csak a pultban tartotta, aztán egyszerre bepöccent és elzárta egy számzáras diplomatatáskába. Senki se érti, mi ütött belé. Szimatolj egy kicsit a presszó fészbookján. Az hátha nyújt valami támpontot a számzár megfejtéséhez. Ha megvan a kód, írd meg nekem! Én addig elcsenem a táskát.`,];
		
		else if (/596576|596 576|596-576|569|576/.test(message)) reply = [`Ez ügyes volt! Egyedül biztos meg nem fejtettem volna. Nézd csak, ezt tudtam levideózni:`,
		`<a href="https://www.youtube.com/watch?v=a2JkgiM_DYI" target="_blank">Táska</a>`,
		`Rémes, milyen macskakaparással ír ez a Misi! Segíts, én nem tudom kiolvasni! Kinek van túl sok tartozása ahhoz, hogy ne lehessen több hitele?`];

		else if (/^béres/.test(message)) reply = [`Akkor lehet, hogy ő volt? Illik a karaktérébe? Keresgélj a játék honlapján!`];

		else if (/^nem/.test(message)) reply = [`Én már semmit se értek. Akkor mégis ki lehetett? Nem pusmogtak semmit a népek a Misiben?`];

		else if (/^jézus/.test(message)) reply = [`Hát őt meg anyósom látta is! Mindig a hármassal érkezik. De hanyassal indul a városba? Ezt nem hallottad véletlen? Emlékezz, mit mondott Piroska! Mert akkor a menetrendből kiderítheted, mikor érkezik Debrecenbe, hogy elfogják. Viszont a menetrendet mindig összetépi valaki. Próbáld kirakni a darabkákat! Írd be a választ!`,
		`<a href="https://veiszb.github.io/tarsandor/jatek/puzzle/puzzle" target="_blank">Menetrend</a>`,];

		else if (/17.28|1728|17 28|^28/.test(message)) reply = [`Hívtam a rendőrséget!`, 
		
		`GRATULÁLOK!!! Nélküled nem jártunk volna sikerrel.`,
		`Majd csekkolom, hogy az összes megmaradt bor visszajusson a tiszteleteshez, egy korty se vesszen kárba… vagyis… izé… jusson el az úrvacsorára.`,
		`A "hiteles" elszámolás végett írd meg, hogy hány üveg és korty bort sikerült megmentened. A pontos adathoz állítsd le a számlálót.`
	];


		else if (/bor|üveg|korty/.test(message)) reply = [`Képzeld, este már a rádió is bemondta:`,
		`A mai napon a rendőrség közleménye alapján letartóztatásba került egy fiatal férfi, akit egy vidéki református lelkész kirablásával vádolnak. A feltételezett elkövető egy héten keresztül minden nap felkereste a parókiát, hogy értéktárgyakat lopjon, de végül csak az úrvacsorára szánt bort töltötte át műanyag flakonokba, és hogy ne bukjon le azonnal, vízzel pótolta a hiányt. A férfi korábban a helybéli presszó tulajdonosával is összekülönbözött és fizetés nélkül távozott a helyszínről. A károsult tiszteletestől megtudtuk, hogy a hét elején egy hosszú hajú fiatalember azzal a szokatlan hírrel állított be hozzá mezítláb, hogy ő Jézus Krisztus. A tiszteletes megkínálta lebbencslevessel, amit az vonakodás nélkül elfogadott, majd megkérdezte tőle, hogy melyik busszal érkezett. Később úgy vélte, Krisztussal mégis inkább a katolikus papnak kell törődni, és kellő tisztelettel átirányította a másik parókiára. Riporterünknek kifejtette, hogy azért különös, hogy a Megváltó tanulóbérlettel közlekedik, a tizenöt órás buszra ugyanis csak azzal lehet felszállni.`,
		`Köszönöm, hogy segítettél! Ha máskor is erre jársz, köszönj be az utcánkba. A viszontlátásra!`];



		//else if (/class\=\"fa/.test(message)) reply = [`I see you've found the smileys`, `Cool! <span class="far fa-grin-beam fa-2x"></span>`, `Did you need something?`];
		//else if (/how|what|why/.test(message)) reply = userMessage + " what?";
		//else if (/^huh+|boring|lame|wtf|pff/.test(message)) reply = [`<span class="far fa-dizzy fa-2x"></span>`, `I'm sorry you feel that way`, `How can I make it better?`];
		//else if (/bye|ciao|adieu|salu/.test(message)) reply = [`Ok, bye :)`];
        else if (/link/.test(message)) reply = [`<a href="https://hexdocs.pm/linkify/Linkify.html" target="_blank">blabla</a>`];

		return reply;
	};

	function postBotReply(reply) {
		const html = `<div class="post post-bot">${reply + timeStamp()}</div>`;
		const timeTyping = 500 + Math.floor(Math.random() * 2000);
		$("#message-board").append(html);
		$scrollDown();
	};



	/******************/
	/*** TIMESTAMPS ***/
	/******************/


	function timeStamp() {
		const timestamp = new Date();
		const hours = timestamp.getHours();
		let minutes = timestamp.getMinutes();
		if (minutes < 10) minutes = "0" + minutes;
		const html = `<span class="timestamp">${hours}:${minutes}</span>`;
		return html;
	};




	/***************/
	/*** CHAT UI ***/
	/***************/


	// Back arrow button
	$("#back-button").on("click", () => {
		$("#landing").show();
	});


	// Menu - navigation
	$("#nav-icon").on("click", () => {
		$("#nav-container").show();
	});

	$("#nav-container").on("mouseleave", () => {
		$("#nav-container").hide();
	});

	$(".nav-link").on("click", () => {
		$("#nav-container").slideToggle(200);
	});

	// Clear history
	$("#clear-history").on("click", () => {
		$("#message-board").empty();
		$("#message").empty();
	});

	// Sign out
	$("#sign-out").on("click", () => {
		$("#message-board").empty();
		$("#message").empty();
		$("#landing").show();
		$("#username").val("");
		$("#start-chat").html("Köszönj Jancsinak!");
	});




	/*********************/
	/*** SCROLL TO END ***/
	/*********************/


	function $scrollDown() {
		const $container = $("#message-board");
		const $maxHeight = $container.height();
		const $scrollHeight = $container[0].scrollHeight;
		if ($scrollHeight > $maxHeight) $container.scrollTop($scrollHeight);
	}




	/***************/
	/*** EMOIJIS ***/
	/***************/


	// toggle emoijis
	$("#emoi").on("click", () => {
		$("#emoijis").slideToggle(300);
		$("#emoi").toggleClass("fa fa-grin far fa-chevron-down");
	});

	// add emoiji to message
	$(".smiley").on("click", (event) => {
		const $smiley = $(event.currentTarget).clone().contents().addClass("fa-lg");
		$("#message").append($smiley);
		$("#message").select(); // ==> BUG: message field not selected after adding smiley !! 
	});





});
