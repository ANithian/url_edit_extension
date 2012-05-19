var currentUrl = "Hello";
var currentTabId = 0;

/*
 * When a tab is activated, I only know the tab ID so I need to then
 * query chrome to get the URL of the tab that was recently activated.
 */
function tabActivated(eventInfo)
{
	// alert('activated');	
	// chrome.tabs.get(eventInfo.tabId, tabInfoCallback)
	chrome.tabs.getSelected(null,tabInfoCallback);
}

function tabInfoCallback(tab)
{
	currentUrl = tab.url;
	currentTabId = tab.id;
}

function tabChanged(tab_id,changeInfo,tab)
{
	currentTabId=tab_id;
	currentUrl=tab.url;
}

function windowFocusChanged(window_id)
{
	tabActivated(null);	
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      sendResponse({current_url: currentUrl,current_tab_id: currentTabId});
  });
  
chrome.tabs.onActivated.addListener(tabActivated);
chrome.tabs.onUpdated.addListener(tabChanged);
chrome.windows.onFocusChanged.addListener(windowFocusChanged);