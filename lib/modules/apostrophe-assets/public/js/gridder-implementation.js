
$('.gridder').gridderExpander({
    scroll: true,
    scrollOffset: 30,
    scrollTo: "panel",                  // panel or listitem
    animationSpeed: 400,
    animationEasing: "easeInOutExpo",
    showNav: true,                      // Show Navigation
    nextText: "<span></span>", // Next button text
    prevText: "<span></span>", // Previous button text
    closeText: "", // Close button text                // Close button text
    onStart: function(){
        //Gridder Inititialized
    },
    onContent: function(){
        //Gridder Content Loaded
    },
    onClosed: function(){
        //Gridder Closed
    }
});

function afterRenderCallbackIdea(widget) {

  $(widget).find('idea-list').gridderExpander({
      scroll: true,
      scrollOffset: 30,
      scrollTo: "panel",                  // panel or listitem
      animationSpeed: 400,
      animationEasing: "easeInOutExpo",
      showNav: true,                      // Show Navigation
      nextText: "Next",                   // Next button text
      prevText: "Previous",               // Previous button text
      closeText: "Close",                 // Close button text
      onStart: function(){
          //Gridder Inititialized
      },
      onContent: function(){
          //Gridder Content Loaded
      },
      onClosed: function(){
          //Gridder Closed
      }
  });
}
