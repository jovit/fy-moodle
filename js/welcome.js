function getMessages(){
  let thanks = chrome.i18n.getMessage('welcome_page_thanks')
  let start = chrome.i18n.getMessage('welcome_page_instructions_start')
  let explain = chrome.i18n.getMessage('welcome_page_instructions_explaination')
  let git = chrome.i18n.getMessage('welcome_page_git')

  document.getElementById("welcome_page_thanks").innerHTML = thanks;
  document.getElementById("welcome_page_instructions_start").innerHTML = start;
  document.getElementById("welcome_page_instructions_explaination").innerHTML = explain;
  document.getElementById("welcome_page_git").innerHTML = git;
}

getMessages()
