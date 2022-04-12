let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let ctx = canvas.getContext('2d');

let button_copy = /** @type {HTMLButtonElement} */ (document.getElementById("button_copy"));
let button_clear = /** @type {HTMLButtonElement} */ (document.getElementById("button_clear"));

let para_text = /** @type {HTMLParagraphElement} */ (document.getElementById("positions_text"));

let check_line = /**@type {HTMLInputElement} */ (document.getElementById("check_line"));

let slider_X = /** @type {HTMLInputElement} */ (document.getElementById("slider_X"));
let slider_Y = /** @type {HTMLInputElement} */ (document.getElementById("slider_Y"));

let slider_X_li=/** @type {HTMLParagraphElement} */ (document.getElementById("slider_X_li"));
let slider_Y_li=/** @type {HTMLParagraphElement} */ (document.getElementById("slider_Y_li"));

let /** @type {String}*/positions_string="";
let /** @type {Array<Array<number>>} */ positions_array=[];
let /** @type {Array<number>} */ positions_line=[];

let clicked = /** @type {boolean} */ false;

/**
 * @param {MouseEvent} event
 */
function circle(x=250,y=250,r=5){
    ctx.beginPath()
    ctx.arc(x,y,r,0,2*Math.PI)
    ctx.fill()
    ctx.closePath()
    ctx.moveTo(x,y)
}

function coordinate(x,y){
    ctx.beginPath()

    ctx.moveTo(0,y)
    ctx.lineTo(canvas.width,y)
    ctx.moveTo(canvas.width-5,y-5)
    ctx.lineTo(canvas.width,y)
    ctx.lineTo(canvas.width-5,y+5)
    ctx.lineTo(canvas.width-5,y-5)

    ctx.moveTo(x,0)
    ctx.lineTo(x,canvas.height)
    ctx.moveTo(x-5,canvas.height-5)
    ctx.lineTo(x,canvas.height)
    ctx.lineTo(x+5,canvas.height-5)
    ctx.closePath()
    ctx.stroke()
}

/**
 * redraw plot based on the new coordinate position
 * @param {number} x x coordinate position
 * @param {number} y y coordinate position
 */
function redraw(x,y){
  for(let i=0;i<positions_array.length;i++){
    if(positions_line[i]==1){
      if(i==0||positions_line[i-1]==0){
        ctx.beginPath()
      }
      ctx.lineTo(positions_array[i][0]+x,positions_array[i][1]+y)
      ctx.stroke()
    }  
    circle(Number(positions_array[i][0])+x,Number(positions_array[i][1])+y,5)
  }
}


canvas.onmousedown=function (event){
  if(check_line.checked){
    if(!clicked){
      ctx.beginPath()
    }
    ctx.lineTo(event.offsetX,event.offsetY)
    positions_line.push(1)
    ctx.stroke()
    clicked=true
  }
  else{
    clicked=false
    positions_line.push(0)
  }
    /**event.screenX
    event.clientX
    event.movementX
    event.offsetX
    event.pageX
    ctx.font="30px Garamond";*/
    
    ctx.fillStyle = "#8003C0EE";
    /**ctx.fillText(`X position:${event.offsetX}`,200,400)
    ctx.fillText(`Y position:${event.offsetY}`,200,450)*/
    show(`[${event.offsetX-slider_X.value}, ${event.offsetY-slider_Y.value}]`)
    circle(event.offsetX,event.offsetY,5)
    positions_string+=`[${event.offsetX}, ${event.offsetY}]\n`
    positions_array.push([event.offsetX-slider_X.value,event.offsetY-slider_Y.value])
    
}

function show(text){
  para_text.innerHTML=text
}

function clear_screen(x,y){
  ctx.clearRect(0,0,500,500)
  coordinate(x,y)
  clicked=false
}


function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }



button_copy.onclick=function(){
  copyTextToClipboard(positions_string.toString())
}

button_clear.onclick=function(){  
  clear_screen(Number(slider_X.value),Number(slider_Y.value))
  positions_string=""
  positions_array=[]
  positions_line=[]
}

slider_X.oninput=function(){
  clear_screen(Number(slider_X.value),Number(slider_Y.value))
  redraw(Number(slider_X.value),Number(slider_Y.value))
  slider_X_li.innerHTML=`Slider X = ${slider_X.value} of 500`
}

slider_Y.oninput=function(){
  clear_screen(Number(slider_X.value),Number(slider_Y.value))
  redraw(Number(slider_X.value),Number(slider_Y.value))
  slider_Y_li.innerHTML=`Slider Y = ${slider_Y.value} of 500`
}



coordinate(Number(slider_X.value),Number(slider_Y.value))