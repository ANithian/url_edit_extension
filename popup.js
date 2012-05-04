$(document).ready(documentReady);

//Get the current tab information by making a request to the background page
//which has the tab state via registering for tab events.			
chrome.extension.sendRequest({message: "get_tab"}, onMessageReceived);
var tab_id = 0;
var myTable = null;
var baseUrl = null;

function documentReady()
{
	$("#btnUpdateUrl").click(updateUrl);
	$('#container').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
	// myTable=$('#example').dataTable();
	myTable = $('#example').dataTable( {
		"bFilter":false,
		"bSort":false,
		"bStateSave": true,
        "aoColumns": [ {sTitle:"Param"},{sTitle:"Value"}]
    } );
}

function updateUrl()
{
	// alert("TAB=" + tab_id);
	var tableData = myTable.fnGetData();
	var newQueryString = "?";
	for(var i=0; i < tableData.length; i++)
	{
		newQueryString += (escape(tableData[i][0]) + "=" + escape(tableData[i][1]));
		if(i < tableData.length - 1)
		{
			newQueryString += "&";
		} 
	}
	var newUrl = baseUrl + newQueryString;
	chrome.tabs.update(tab_id,{url:newUrl});
}

function updateTable(url)
{
	var tableData = [];	
	var uri = new Uri(url);
	var query = uri.query();
	var params = query.getParams();
	var old_param=null;
	
	baseUrl = uri.protocol() + "://" + uri.host();
	if(uri.port().length > 0)
	{
		baseUrl = baseUrl + ":" + uri.port();
	}
	if(uri.path().length > 0)
	{
		baseUrl = baseUrl + uri.path();
	}
	
	for(var i=0; i < params.length; i++)
	{
		tableData.push([unescape(params[i][0]),unescape(params[i][1])]);
	}
	$('#base_url').html(baseUrl);
	myTable.fnClearTable();
    myTable.fnAddData(tableData);
    myTable.makeEditable({
    	sUpdateURL: function(value, settings)
                                {
                                        return(value);
                                }
                      	});	
}

function onMessageReceived(response)
{
	var tabUrl = response.current_url;
	tab_id = response.current_tab_id;
	updateTable(tabUrl);
}
