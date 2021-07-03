window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');

  // o point on the mouse 
  const canvasForWidthIndicator = document.querySelector('#line-width-indicator');
  const contextForWidthIndicator = canvasForWidthIndicator.getContext('2d');

  const lastPosition = { x: null, y: null };
  let isDrag = false;
  let currentColor = '#000000';

// pen width
  let currentLineWidth = 1;

  function draw(x, y) {
    if(!isDrag) {
      return;
    }
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = currentLineWidth;
    context.strokeStyle = currentColor;
    if (lastPosition.x === null || lastPosition.y === null) {
      context.moveTo(x, y);
    } else {
      context.moveTo(lastPosition.x, lastPosition.y);
    }
    context.lineTo(x, y);
    context.stroke();
    lastPosition.x = x;
    lastPosition.y = y;
  }

  function showLineWidthIndicator(x, y) {
    contextForWidthIndicator.lineCap = 'round';
    contextForWidthIndicator.lineJoin = 'round';
    contextForWidthIndicator.strokeStyle = currentColor;

    contextForWidthIndicator.lineWidth = 1;

    contextForWidthIndicator.clearRect(0, 0, canvasForWidthIndicator.width, canvasForWidthIndicator.height);

    contextForWidthIndicator.beginPath();

    contextForWidthIndicator.arc(x, y, currentLineWidth / 2, 0, 2 * Math.PI);

    contextForWidthIndicator.stroke();
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dragStart(event) {
    context.beginPath();

    isDrag = true;
  }

  function dragEnd(event) {
    context.closePath();
    isDrag = false;
    lastPosition.x = null;
    lastPosition.y = null;
  }

  function initEventHandler() {
    const clearButton = document.querySelector('#clear-button');
    const eraserButton = document.querySelector('#eraser-button');
    clearButton.addEventListener('click', clear);
    eraserButton.addEventListener('click', () => {
      currentColor = '#FFFFFF';
    });

    const layeredCanvasArea = document.querySelector('#layerd-canvas-area');

    layeredCanvasArea.addEventListener('mousedown', dragStart);
    layeredCanvasArea.addEventListener('mouseup', dragEnd);
    layeredCanvasArea.addEventListener('mouseout', dragEnd);
    layeredCanvasArea.addEventListener('mousemove', event => {

      draw(event.layerX, event.layerY);
      showLineWidthIndicator(event.layerX, event.layerY);
    });
  }

  function initColorPalette() {
    const joe = colorjoe.rgb('color-palette', currentColor);
    joe.on('done', color => {
      currentColor = color.hex();
    });
  }

  function initConfigOfLineWidth() {
    const textForCurrentSize = document.querySelector('#line-width');
    const rangeSelector = document.querySelector('#range-selector');

    currentLineWidth = rangeSelector.value;

    rangeSelector.addEventListener('input', event => {
      const width = event.target.value;

      currentLineWidth = width;

      textForCurrentSize.innerText = width;
    });
  }

  initEventHandler();
  initColorPalette();

  initConfigOfLineWidth();
});