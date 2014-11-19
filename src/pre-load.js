define(['require', 'domready!', 'font-loader'], function(require, dom, fontLoader) {
    // Start loading configured fonts
    fontLoader.start(function() {
      // Now all fonts are loaded, and FOUT has been avoided.
      
      // Create main module
      require(["main"]);
    });
});