// draggable-line.js

(function() {
  function DraggableLine(options) {
      this.options = Object.assign({
          color: '#' + Math.floor(Math.random()*16777215).toString(16),  //Random color on each instantiation
          width: '2px',
          onDragEnd: function(position) {} // Callback function
      }, options);

      this.line = null;
      this.isDragging = false;
      this.startX = 0;
      this.currentX = 0;
  }

  DraggableLine.prototype.createLine = function() {
      this.line = document.createElement('div');
      this.line.style.position = 'fixed'; // Fixed position for staying on the screen
      this.line.style.top = '0';
      this.line.style.left = '20%';
      this.line.style.width = this.options.width;
      this.line.style.height = '100vh'; // Cover entire height of the viewport
      this.line.style.backgroundColor = this.options.color;
      this.line.style.cursor = 'ew-resize'; // Horizontal resize cursor
      this.line.style.zIndex = '1000'; // Ensure it's on top of other elements

      //Event listeners
      this.line.addEventListener('mousedown', this.dragStart.bind(this));
      document.addEventListener('mousemove', this.drag.bind(this));
      document.addEventListener('mouseup', this.dragEnd.bind(this));

      document.body.appendChild(this.line);

  };


  DraggableLine.prototype.dragStart = function(e) {
      this.isDragging = true;
      this.startX = e.clientX - this.line.offsetLeft; //Offset from left edge of the line
  };

  DraggableLine.prototype.drag = function(e) {
      if (!this.isDragging) return;
      e.preventDefault(); //Prevent text selection during drag

      this.currentX = e.clientX - this.startX;

      //Keep the line within the bounds of the document
      if (this.currentX < 0) {
          this.currentX = 0;
      }
      if (this.currentX > document.documentElement.clientWidth - parseInt(this.options.width)) {
          this.currentX = document.documentElement.clientWidth - parseInt(this.options.width);
      }

      this.line.style.left = this.currentX + 'px';
  };


  DraggableLine.prototype.dragEnd = function() {
      this.isDragging = false;
      const position = this.line.offsetLeft;
      this.options.onDragEnd(position); //Call callback
  };


  // Expose the DraggableLine to the global object
  window.DraggableLine = DraggableLine;
})();
