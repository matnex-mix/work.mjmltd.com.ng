
// JAX Object

var JAX = {

	//AJAX response processor
	processResponse: function ($text, $type) {

		if($type&& $type.toUpperCase() == "JSON") {
			//Process as JSON

			try {

				return JSON.parse($text);

			} catch (ex) {

				console.log("An Error Occurred While Processing Response as JSON "+ex+" "+console.trace());

			}

		} else if($type&& $type.toUpperCase() == "HTML") {
			// Use an HTML element as the overall parent

			$doc = document.createElement("markup");

			$doc.innerHTML = $text;

			return $doc;

		} else if($type&& $type.toUpperCase() == "JAXHTML") {

			var $working = JSON.parse($text), $compiled = "";

		}

		return $text;

	},

	// Function that adds or return the url
	URL: function($mixed, $query, $method, $success, $failure, $endres){

		if(typeof $mixed == "number") {

			//return the url if argument is number
			return JAX.URLS[$mixed];

		} else if (typeof $mixed == "string") {

			if( RegExp(/.*/).test($mixed) ) {

				// Test url if string and add to container
				$url_obj = {
					mixed: $mixed,
					query: $query,
					method: $method,
					success: $success,
					failure: $failure,
					endres: $endres
				}
				JAX.URLS.push($url_obj);

				return JAX.URLS.length-1;

			}

		}

		// Not Successfull
		return false;

	},

	GET: function($mixed, $query, $method, $success, $failure, $endres) {

		$index = 0;

		//Retrieve Already Stored Request
		if(typeof $mixed == "number") {

			$index = $mixed;

			$$ = JAX.URL($mixed);

			$mixed = $$.mixed
			$method = $method||$$.method;
			$query = $query||$$.query;
			$success = $success||$$.success;
			$failure = $failure||$$.failure;
			$endres = $endres||$$.endres;

		}

		JAX.runLoader($index);

		//Check if the Query is object
		if(typeof $query != "object") return console.log("Expected  object, "+typeof $query+" given on line: "+console.trace());

		$server = new XMLHttpRequest();

		//Form the original query string
		$query_string = "?";
		$query_string2 = "";

		for ($param in $query) {

			$query_string += "&"+$param+"="+$query[$param];

		}

		//if post, interchange values
		if ($method.toUpperCase() == "POST") {

			$query_string2 = $query_string.substring(1);
			$query_string = "";

		}

		if($query_string == "?") $query_string = "";

		$server.onreadystatechange = function () {

			if(this.readyState == 4 && this.status == 200) {

				JAX.runLoader($index);

				$response = JAX.processResponse(this.responseText, $endres);

				!$success||$success($response);

			} else if(this.readyState == 4 && this.status == 400) {

				!$failure||$failure(this.responseText);

				JAX.runLoader($index);

			}

		}

		$server.open($method, ((typeof $mixed == "number")? JAX.URL($mixed) : $mixed)+$query_string, true);

		if($query_string2) {

			$server.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		}

		$server.send($query_string2);

	},

	// Register Loader For JAX requests
	registerLoader: function ($id_html_obj, $class, $index) {

		$loader = $id_html_obj;

		if( typeof $id_html_obj == "string") {

			$loader = document.getElementById($id_html_obj.replace("#", "", 1));

		}

		if(!$index) $index = 0;

		$loader.setAttribute("JAX-LOADER-CLASS", $class);

		JAX.Loader[$index] = $loader;

	},

	// Run JAX Loader
	runLoader: function ($index) {

		try {
		$class = JAX.Loader[$index].getAttribute("JAX-LOADER-CLASS");

		JAX.Loader[$index].classList.toggle($class);}catch(e){console.error(e);}

	},

	CyclicRequest: function ($url, $method, $query, $delay) {

		this.url = $url||console.log("Unable to continue: URL not specified");
		this.method = $method||"GET";
		this.query = $query||console.log("Query Must Be an Object");
		this.delay = $delay||5000;
		this.holded = false;
		this.index = 0;

	},

	sendForm: function ($index, $form) {

		$elements = $form.elements;
		$end_data = {};

		for ($i = 0; $i < $elements.length; $i++) {

			if($elements[$i] && $elements[$i].type == "radio") {

				if ($elements[$i].checked == true) $end_data[$elements[$i].name] = $elements[$i].value;
				else continue;

			}

			!$elements[$i]||($end_data[$elements[$i].name] = $elements[$i].value);

			if($elements[$i] && $elements[$i].type == "checkbox") $end_data[$elements[$i].name] = $elements[$i].checked;

		}

		JAX.GET($index, $end_data);

	},

	// Container that holds JAX registered urls
	URLS: [],
	Loader: {}

}

JAX.CyclicRequest.prototype.start = function() {

	!this.oncyclestart||this.oncyclestart();

	JAX.GET(this.url, this.query, this.method, this.onsuccess, this.onfailure, this.parsetype);

	$this = this;

	if(this.holded !== true) { this.index++; setTimeout(function() { $this.start(); }, this.delay); }

	!this.oncycleend||this.oncycleend();

}

JAX.CyclicRequest.prototype.hold = function() {

	this.holded = true;

}

JAX.CyclicRequest.prototype.unhold = function() {

	this.holded = false;
	this.start();

}