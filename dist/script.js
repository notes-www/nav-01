function returnTransform(scale, left,top,rotation){
  console.log(left);
  return "scale(" +
      scale +
      ") translate(" +
      left +
      "px," +
      top +
      "px) rotate("+rotation+"deg)"
}

(function() {
  var el = document.querySelector(".map__image-wrap");
  var mc = new Hammer(el, {
    domEvents: true
  });
  //enable mouse pan

  var currentScale = 1;
  var currentLeft = 0;
  var currentTop = 0;
  var currentRotation = 0;
  
  var buttonRotationChange =15
  var adjustRotation =0 ;
  var rotationSensibility=100;
  
  // zoom
  mc.get("pinch").set({ enable: true });
  mc.get('rotate').set({ enable: true });
  mc.get('pan').set({pointers: 0});
  mc.on("pinchstart", function(ev) {
    // on pinch zoom we eliminate the panning event listener so that we dont have that weird movement after we end pinching
    mc.off("pan");
  });
  mc.on("pinch", function(ev) {
    el.style.transform = returnTransform(currentScale * ev.scale, currentLeft, currentTop, currentRotation);
  });
  mc.on("pinchend", function(ev) {
    currentScale = currentScale * ev.scale;
    // once we have ended pinch zooming we fire off the panning event once again
    window.setTimeout(hammerPan, 50);
  });

  // panning function
  function hammerPan() {
    mc.on("pan", function(ev) {
      el.style.transform = returnTransform(currentScale,(currentLeft + ev.deltaX / currentScale), (currentTop + ev.deltaY / currentScale), currentRotation)
    });
  }

  hammerPan();
  mc.on("panend", function(ev) {
    currentLeft = currentLeft + ev.deltaX / currentScale;
    currentTop = currentTop + ev.deltaY / currentScale;
  });
  
  //Rotate function
  mc.on("rotatestart", function(e) {
    //el.style.transformOrigin= currentLeft+"px "+currentTop+"px";
  adjustRotation -= e.rotation;
  });
  mc.on("rotate", function(e) {
    currentRotation = adjustRotation + Math.round(e.rotation);
    el.style.transform = returnTransform(currentScale, currentLeft,currentTop, currentRotation)
  });
  mc.on("rotateend", function(e) {
    adjustRotation = currentRotation;
  });
  //reset button
  mc.on("doubletap",function(e) {
    console.log(e.center);
    currentScale = currentScale*1.3;
    el.style.transform = returnTransform(currentScale, currentLeft,currentTop, currentRotation);
      });
  document.getElementById("resetMap").addEventListener("click", function() {
    console.log("ResetMap");
    currentScale = 1;
    currentLeft = 0;
    currentTop = 0;
    currentRotation =0;
    el.style.transform = returnTransform(currentScale, currentLeft,currentTop, currentRotation);
  });
document.getElementById("zoomIn").addEventListener("click", function() {
    console.log("zoomIn");
    currentScale = currentScale*1.3;
    el.style.transform =
      returnTransform(currentScale, currentLeft,currentTop, currentRotation);
  });
  document.getElementById("zoomOut").addEventListener("click", function() {
    console.log("zoomOut");
    currentScale=currentScale*0.7;
    el.style.transform =
      returnTransform(currentScale, currentLeft,currentTop, currentRotation);
  });
   document.getElementById("rotateLeft").addEventListener("click", function() {
    console.log("zoomOut");
    currentRotation-=buttonRotationChange;
    el.style.transform =
      returnTransform(currentScale, currentLeft,currentTop, currentRotation);
  });
 document.getElementById("rotateRight").addEventListener("click", function() {
    console.log("zoomOut");
    currentRotation+=buttonRotationChange;
    el.style.transform =
      returnTransform(currentScale, currentLeft,currentTop, currentRotation);
  });
})();