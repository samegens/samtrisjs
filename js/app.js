requirejs.config({
	baseUrl: "js/",
	shim : {
		'jquery' : {
			exports : '$'
		},
		"bootstrap" : {
			"deps" : ['jquery']
		},
		"angular": {
			"deps" : ["jquery"],
			exports: "angular"
		}
	},
	paths : {
		"jquery" : "lib/jquery.min",
		"bootstrap" : "lib/bootstrap.min",
		"angular": "lib/angular",
		"sprintf" : "lib/sprintf",
		"radio": "lib/radio.min"
	}
});

requirejs(["main"]);
