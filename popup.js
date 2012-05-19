$(document).ready(documentReady);

var tab_id = 0;
var myTable = null;
var baseUrl = null;

function documentReady()
{
	//Get the current tab information
	chrome.tabs.getSelected(null,tabInfoCallback);
	
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

function tabInfoCallback(tab)
{
	tab_id=tab.id;
	updateTable(tab.url);
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
	var url_object = parseUrl(url);
	
	var old_param=null;
	var sKey=null,sValue=null;
	baseUrl = url_object.baseUrl;
	var params = url_object.url_params;
	for(var i=0; i < params.length; i++)
	{
		sKey = params[i][0];
		sValue = params[i][1];
		tableData.push([sKey,sValue]);
	}
	$('#base_url').html(baseUrl);
	myTable.fnClearTable();
    myTable.fnAddData(tableData);
    myTable.makeEditable({
    	aoColumns:[
    	           {
    	           },
    	           {
    	        	   placeholder:"&nbsp;",
    	        	   type: 'textarea',
    	        	   onblur:'submit'
    	           }
    	],
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
