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

// Required variables throughout the rest of the code
let textbox;
let rootStyles;
let primaryColor;
let targetHTML;

let addedElement;
let interval;

// The main function of the entire plugin
function root_function() {
  textbox = document.querySelector('[role="textbox"]'); // This will grab the textbox

  // In order to be able to switch chats and maintain the WPM counter, we need to check if we already injected the text box with the WPM counter,
  // because when you switch chats or servers, the original textbox gets destroyed, and our method of checking if we lost our current WPM is by adding
  // an attribute named "injected" to our current textbox and checking if its still there.
  if (!textbox.getAttribute("injected")) {
    clearInterval(interval); // This clear interval is for the last textbox.

    // When you enter a different chat, the text box is already focused, and our method of checking if the text box is focused is an event listener.
    // So when you enter a new chat the text box is focused but wont have our WPM counter because that event didn't trigger, so we need to put what happens
    // when the text box is focused in a function so that we can use it later.
    function on_focused() {
      textbox = document.querySelector('[role="textbox"]');
      let parent = textbox.parentElement.parentElement.parentElement.parentElement.parentElement; // You'll see why we need this

      // This creates a wrapper div for our HTML, because we need a way to remove the WPM counter.
      addedElement = document.createElement('div');
      addedElement.innerHTML = targetHTML; // "targetHTML" is the WPM counter HTML.

      // Over here we use the parent we made a variable of so that we can child it to the correct element, which is that parent lol.
      parent.insertBefore(addedElement, parent.firstChild);
      
      let counter = document.getElementById("wpm-counter"); // Inside our new HTML the WPM counter text has an ID of "wpm-counter"
      let startTime;

      // This is the interval that actually does our WPM counting.
      interval = setInterval(() => {
        // First we need to check if there is text in our textbox first
        if (textbox.innerText.replace("\n", "").length > 1) {
          // If there is, then we need to start the time
          if (!startTime) {
            startTime = new Date();
          }

          // Bunch of math garbage to calculate our WPM
          const currentTime = new Date();
          const elapsedTime = (currentTime - startTime) / 1000 / 60; // in minute
          // This if statement is so that we don't get an "infinity" value at the beginning or any weird high value, it just stays at 0 for the first 0.5 seconds.
          if (elapsedTime > .005) {
            const wpm = Math.round(textbox.innerText.split(/\s+/).length / elapsedTime);
            counter.innerText = wpm + " wpm" // Updating the text inside our counter element to display the current WPM
          } else {
            counter.innerText =  "0 wpm"
          }
        } else { // If we don't have anything in our textbox, we want to reset the start time.
          startTime = null;
        }
      }, 50);
    }

    // I explained this above the "on_focused" function, what i'm doing here is checking if the textbox is focused.
    if (document.activeElement === textbox) {
      on_focused()
    }

    // This is the actual event listener.
    textbox.addEventListener('focus', on_focused);

    // This is just running the clean up when the textbox is clicked out of
    textbox.addEventListener('blur', function() {
      if (addedElement) {
          let parent = textbox.parentElement.parentElement.parentElement.parentElement.parentElement; // Getting the parent element of the WPM counter
          parent.removeChild(addedElement); // Removing the element we added
          addedElement = null; // Making it null for next use
          clearInterval(interval); // And clearing the WPM counter interval
        }
    });

    // After we did everything we need, we need to put the "injected" attribute on it so that it actually runs
    textbox.setAttribute("injected", "true")
  }
}


let rootInterval = null

// This is the Better Discord stuff
module.exports = class WPMCounter 
{
    start() 
    {
      // Setting the variables we need
      textbox = document.querySelector('[role="textbox"]');
      rootStyles = getComputedStyle(document.documentElement);

      // This is the HTML
      // Yeah... a disaster, just do whatever you want to it lol
      targetHTML = '<div style="padding:2px;margin:0;border-top-left-radius:5px;border-top-right-radius:5px;margin-left:25%;width:50%;background-color:'+rootStyles.getPropertyValue('--background-tertiary')+';"><h2 id="wpm-counter" style="text-align:center;color:#fff;">0 wpm</h2></div>'
      
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
