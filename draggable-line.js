// draggable-line.js

(function() {
  function DraggableLine(options) {
      this.options = Object.assign({
          color: '#' + Math.floor(Math.random()*16777215).toString(16),  //Random color on each instantiation
          width: '2px',
          orientation: 'vertical', // Default orientation
          onDragEnd: function(position) {} // Callback function
      }, options);

      this.line = null;
      this.isDragging = false;
      this.startPosition = 0; // General position variable (X or Y)
      this.currentPosition = 0; // General position variable (X or Y)
  }

  DraggableLine.prototype.createLine = function() {
    this.line = document.createElement('div');
    this.line.style.position = 'fixed'; // Fixed position for staying on the screen
    this.line.style.backgroundColor = this.options.color;
    this.line.style.zIndex = '1000'; // Ensure it's on top of other elements
    this.line.style.userSelect = 'none'; //Prevent selection

    if (this.options.orientation === 'vertical') {
        this.line.style.top = '0';
        this.line.style.left = '20%';
        this.line.style.width = this.options.width;
        this.line.style.height = '100vh'; // Cover entire height of the viewport
        this.line.style.cursor = 'ew-resize'; // Horizontal resize cursor
    } else { // Horizontal
        this.line.style.left = '0';
        this.line.style.top = '20%';
        this.line.style.height = this.options.width;
        this.line.style.width = '100vw'; // Cover entire width of the viewport
        this.line.style.cursor = 'ns-resize'; // Vertical resize cursor
    }

    //Event listeners
    this.line.addEventListener('mousedown', this.dragStart.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.dragEnd.bind(this));

     // Event listener to remove the line
    this.line.addEventListener('dblclick', this.removeLine.bind(this));

    document.body.appendChild(this.line);
  };


  DraggableLine.prototype.dragStart = function(e) {
      this.isDragging = true;
      if (this.options.orientation === 'vertical') {
          this.startPosition = e.clientX - this.line.offsetLeft; //Offset from left edge of the line
      } else {
          this.startPosition = e.clientY - this.line.offsetTop; //Offset from top edge of the line
      }
  };

  DraggableLine.prototype.drag = function(e) {
      if (this.isDragging) {
           e.preventDefault(); //Prevent text selection during drag

          if (this.options.orientation === 'vertical') {
              this.currentPosition = e.clientX - this.startPosition;

              //Keep the line within the bounds of the document
              if (this.currentPosition < 0) {
                  this.currentPosition = 0;
              }
              if (this.currentPosition > document.documentElement.clientWidth - parseInt(this.options.width)) {
                  this.currentPosition = document.documentElement.clientWidth - parseInt(this.options.width);
              }

              this.line.style.left = this.currentPosition + 'px';
          } else { //Horizontal
              this.currentPosition = e.clientY - this.startPosition;

              //Keep the line within the bounds of the document
              if (this.currentPosition < 0) {
                  this.currentPosition = 0;
              }
              if (this.currentPosition > document.documentElement.clientHeight - parseInt(this.options.width)) {
                  this.currentPosition = document.documentElement.clientHeight - parseInt(this.options.width);
              }

              this.line.style.top = this.currentPosition + 'px';
          }
      }
  };


  DraggableLine.prototype.dragEnd = function() {
      this.isDragging = false;
      let position = 0;
      if (this.options.orientation === 'vertical') {
          position = this.line.offsetLeft;
      } else {
          position = this.line.offsetTop;
      }


      this.options.onDragEnd(position); //Call callback
  };

    DraggableLine.prototype.removeLine = function() {
      document.body.removeChild(this.line); // Remove the line element from the DOM
      // Clean up the event listeners to avoid memory leaks (optional)
      document.removeEventListener('mousemove', this.drag.bind(this));
      document.removeEventListener('mouseup', this.dragEnd.bind(this));

  };


  // Expose the DraggableLine to the global object
  window.DraggableLine = DraggableLine;

  window.createDraggableLine = function(options) {
      const draggableLine = new DraggableLine(options);
      draggableLine.createLine();
  }
})();
