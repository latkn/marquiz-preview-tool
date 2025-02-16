// line-factory.js

function createVerticalLine() {
  createDraggableLine({
      orientation: 'vertical',
      onDragEnd: function(position) {
          console.log('Vertical line stopped at position: ' + position + 'px');
          // You can do something with the position here, like saving it to localStorage or using it to adjust other elements on the page
      }
  });
}

function createHorizontalLine() {
  createDraggableLine({
      orientation: 'horizontal',
      onDragEnd: function(position) {
          console.log('Horizontal line stopped at position: ' + position + 'px');
          // You can do something with the position here, like saving it to localStorage or using it to adjust other elements on the page
      }
  });
}

// Make these functions available globally (not recommended for large projects, but okay for this example)
window.createVerticalLine = createVerticalLine;
window.createHorizontalLine = createHorizontalLine;
