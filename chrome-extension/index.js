function saveJson(emotesJson){
  window.emotesJson = emotesJson;
}

//Classchanged function for the MutationObserver for active conversation
function classChanged() {
	var act = document.getElementsByClassName("_1ht2")[0];
    window.convoSwitchOB.observe(act, {
      attributes: true,
      attributeFilter: ["class"]
    });

  //implementing the observe for newMessageob
  var newMOBSetter = setInterval(function(){
      if(document.getElementsByClassName("_2k8v")[0] != null){
        window.newMesssageOb.observe(document.getElementsByClassName("_2k8v")[0].nextSibling ,{
          childList: true,
          subtree: true
        });
        clearInterval(newMOBSetter);
      }
  }, 100);
}

//replace all emotes
function replaceEmotes(){
  console.log("Emotes Successfully Replaced");
  if(window.messageList.length <= 0){
    setTimeout(function(){replaceEmotes();}, 500);
  }
  else{
    for(i = 0; i < window.messageList.length; i++){
      if(!window.messageList[i].hasAttribute("EmoteChecked")){
        for (j = 0; j < window.emotesJson.emotes.length; j++){
          // console.log(window.messageList[i].innerHTML + ", " + window.emotesJson.emotes[j].name + ', ' + window.emotesJson.emotes[j].url);
          var emoteName = window.emotesJson.emotes[j].name;
          var emoteURL = window.emotesJson.emotes[j].url;

          var str = window.messageList[i].innerHTML;
          var res = str.replace(emoteName, "<img src=\"" + emoteURL + "\">");
          window.messageList[i].innerHTML = res;
          var att = document.createAttribute("EmoteChecked");
          window.messageList[i].setAttributeNode(att);
        }
      }
    }
  }
}

//to load at the start of the DOM after it has been dynamically built
var start = setInterval(function(){
    console.log("Twitch Emotes Loading...");

    if(document.getElementsByClassName("_6-xl _6-xm").length > 0){

      //set the messageList HTMLCollection
      window.messageList = document.getElementsByClassName("_3oh- _58nk");

      //get the emotes json
      const jsonUrl = chrome.runtime.getURL('emotes.json');
      fetch(jsonUrl)
          .then((response) => response.json()) //assuming file contains json
          .then((json) => saveJson(json));

      //MutationObserver for switching conversations
      window.convoSwitchOB = new MutationObserver(function() {
        setTimeout(function(){replaceEmotes();}, 500);
        classChanged();
      });
      var act = document.getElementsByClassName("_1ht2")[0];
      window.convoSwitchOB.observe(act, {
        attributes: true,
        attributeFilter: ["class"]
      });


      //the mutation observer for new messages
      window.newMesssageOb = new MutationObserver(function() {
        setTimeout(function(){replaceEmotes();}, 500);
      });

      //implementing the observe for newMessageob
      var newMOBSetter = setInterval(function(){
          if(document.getElementsByClassName("_2k8v")[0] != null){
            window.newMesssageOb.observe(document.getElementsByClassName("_2k8v")[0].nextSibling ,{
              childList: true,
              subtree: true
            });
            clearInterval(newMOBSetter);
          }
      }, 100);

      //clears the start loop after successfully starting
      clearInterval(start);
  }

}, 1000);