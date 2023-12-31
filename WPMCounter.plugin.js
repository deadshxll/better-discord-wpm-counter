/**
 * @name WPM Counter
 * @author deadshell
 * @description Words per minute counter above your text bar!
 * @version 0.0.1
 */

// !
//
// Sorry for the garbage code lol
//
// !


let textbox;
let rootStyles;
let primaryColor;
let targetHTML;

let addedElement;
let interval;

function root_function() {
  textbox = document.querySelector('[role="textbox"]');
  if (!textbox.getAttribute("injected")) {
    clearInterval(interval);

    function on_focused() {
      textbox = document.querySelector('[role="textbox"]');
      let parent = textbox.parentElement.parentElement.parentElement.parentElement.parentElement;
      
      addedElement = document.createElement('div');
      addedElement.innerHTML = targetHTML;
      
      parent.insertBefore(addedElement, parent.firstChild);
      parent.firstChild.style.borderTopLeftRadius = "0px"

      let counter = document.getElementById("wpm-counter");
      let startTime;
      interval = setInterval(() => {
        if (textbox.innerText.replace("\n", "").length > 1) {
          if (!startTime) {
            startTime = new Date();
          }
          const currentTime = new Date();
          const elapsedTime = (currentTime - startTime) / 1000 / 60; // in minutes
          if (elapsedTime > .0065) {
            const wpm = Math.round(textbox.innerText.split(/\s+/).length / elapsedTime);
            counter.innerText = wpm + " wpm"
          } else {
            counter.innerText =  "0 wpm"
          }
        } else {
          startTime = null;
        }
      }, 50);
    }

    if (document.activeElement === textbox) {
      on_focused()
    }

    textbox.addEventListener('focus', on_focused);

    textbox.addEventListener('blur', function() {
    
    if (addedElement) {
        let parent = textbox.parentElement.parentElement.parentElement.parentElement.parentElement;
        parent.removeChild(addedElement);
        addedElement = null;
        clearInterval(interval);
      }
    });

    textbox.setAttribute("injected", "true")
  }
}


let rootInterval = null

module.exports = class WPMCounter 
{
    start() 
    {
      textbox = document.querySelector('[role="textbox"]');
      rootStyles = getComputedStyle(document.documentElement);
      targetHTML = '<div class="wpm-counter-div" style="padding:2px;margin:0;border-top-left-radius:5px;border-top-right-radius:5px;margin-left:25%;width:50%;background-color:'+rootStyles.getPropertyValue('--background-tertiary')+';"><h2 id="wpm-counter" style="text-align:center;color:#fff;">0 wpm</h2></div>'
      rootInterval = setInterval(root_function, 500)
    }

    stop() 
    {
        if (rootInterval !== null)
        {
            clearInterval(rootInterval)
            clearInterval(interval)
            let textbox = document.querySelector('[role="textbox"]');
            let parent = textbox.parentElement.parentElement.parentElement.parentElement.parentElement;
            parent.removeChild(addedElement);
            addedElement = null;
        }
    }
}