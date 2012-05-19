function parseUrl(urlString) {
	/*
	 * Basic premise is to loop over the string and find the first ?. Everything before is the "base url". After
	 * this point, we will alternate between two states: param_name and param_value. The '=' denotes the end of the
	 * param_name state and the beginning of the param_value state. The '&' denotes the end of the param_value state
	 * and the beginning of the param_name state repeating until the end of the string or the '#' indicating the start of the fragment id.
	 */'use strict';
	var BASE_URL = 0;
	var PARAM_NAME = 1;
	var PARAM_VALUE = 2;
	var currentState = BASE_URL;
	var lastStopPos = 0;
	var fragmentFound = false;
	var currentParam = [];
	var urlParams = [];
	var baseUrl = urlString;

	for(var i = 0; i < urlString.length && !fragmentFound; i++) {
		if(urlString[i] == '#') {
			fragmentFound = true;
		} else if(urlString[i] == '?' && currentState == BASE_URL) {
			baseUrl = urlString.substr(0, i);
			currentState = PARAM_NAME;
			lastStopPos = i+1;
		} else if(urlString[i] == '=' && currentState == PARAM_NAME) {
			currentParam[0] = urlString.substr(lastStopPos, (i - lastStopPos));
			currentParam[0]=cleanString(currentParam[0]);
			lastStopPos = i+1;
			currentState = PARAM_VALUE;
		} else if(urlString[i] == '&' && currentState == PARAM_VALUE) {
			currentParam[1] = urlString.substr(lastStopPos, (i - lastStopPos));
			currentParam[1]=cleanString(currentParam[1]);
			lastStopPos = i+1;
			currentState = PARAM_NAME;
			urlParams.push(currentParam);
			currentParam=[];
		}
	}
	if(currentState == PARAM_VALUE)
	{
		currentParam[1] = urlString.substr(lastStopPos, (i - lastStopPos));
		currentParam[1]=cleanString(currentParam[1]);
		urlParams.push(currentParam);		
	}
	return {
		baseUrl : baseUrl,
		url_params : urlParams
	};
}

function cleanString(input)
{
	var output=unescape(input);
	output = output.replace(/\+/g," ");
	return output;
}
