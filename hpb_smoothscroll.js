var ss = {
  fixAllLinks: function() {
    var allLinks = document.getElementsByTagName('a');
    for (var i=0;i<allLinks.length;i++) {
      var lnk = allLinks[i];
      if ((lnk.href && lnk.href.indexOf('#') != -1) && 
          ( (lnk.pathname == location.pathname) ||
	    ('/'+lnk.pathname == location.pathname) ) && 
          (lnk.search == location.search)) {
        ss.addEvent(lnk,'click',ss.smoothScroll);
      }
    }
  },

  smoothScroll: function(e) {
    if (window.event) {
      target = window.event.srcElement;
    } else if (e) {
      target = e.target;
    } else return;
    if (target.nodeName.toLowerCase() != 'a') {
      target = target.parentNode;
    }
    if (target.nodeName.toLowerCase() != 'a') return;
    anchor = target.hash.substr(1);
    var allLinks = document.getElementsByTagName('a');
    var destinationLink = null;
    for (var i=0;i<allLinks.length;i++) {
      var lnk = allLinks[i];
      if (lnk.name && (lnk.name == anchor)) {
        destinationLink = lnk;
        break;
      }
    }
    if (!destinationLink) destinationLink = document.getElementById(anchor);
    if (!destinationLink) return true;

    var destx = destinationLink.offsetLeft; 
    var desty = destinationLink.offsetTop;
    var thisNode = destinationLink;
    while (thisNode.offsetParent && 
          (thisNode.offsetParent != document.body)) {
      thisNode = thisNode.offsetParent;
      destx += thisNode.offsetLeft;
      desty += thisNode.offsetTop;
    }
    clearInterval(ss.INTERVAL);
    ss.STEPS = 25;ss.CYPOS = -1;
    ss.CYPOS = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    ss_stepsize = parseInt((desty-ss.CYPOS)/ss.STEPS);
    ss.INTERVAL = setInterval('ss.scrollWindow('+ss_stepsize+','+desty+')',10);
  
    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
    }
    if (e && e.preventDefault && e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
  },

  scrollWindow: function(scramount,dest) {
    ss.CYPOS = ss.CYPOS + scramount;
    if ((scramount >= 0 && dest <= ss.CYPOS) || (scramount < 0 && dest >= ss.CYPOS)) {
      clearInterval(ss.INTERVAL);
      window.scrollTo(0,dest);
    }
    else{
      window.scrollTo(0,ss.CYPOS);
    }
  },

  addEvent: function(elm, evType, fn, useCapture) {
    if (elm.addEventListener){
      elm.addEventListener(evType, fn, useCapture);
      return true;
    } else if (elm.attachEvent){
      var r = elm.attachEvent("on"+evType, fn);
      return r;
    } else {
      alert("Handler could not be removed");
    }
  } 
}

ss.addEvent(window,"load",ss.fixAllLinks);
