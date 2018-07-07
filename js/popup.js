function getMessages(){
  let git = chrome.i18n.getMessage('popup_message')

  document.getElementById("popup_message").innerHTML = git;
}

getMessages()
