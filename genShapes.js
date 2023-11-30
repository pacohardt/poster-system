////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// RECTANGLE ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function customShape(canvas) {
  for (const shape of shapes) {
    canvas.beginShape();
    for (let i = 0; i < shape.length; i++) {
      canvas.vertex(shape[i].x, shape[i].y);
    }
    canvas.noStroke();
    canvas.fill(colorShape);
    canvas.endShape(CLOSE);
  }

  if (currentShape.length === 4) {
    canvas.beginShape();
    for (let i = 0; i < currentShape.length; i++) {
      canvas.vertex(currentShape[i].x, currentShape[i].y);
    }
    canvas.noStroke();
    canvas.fill(colorShape);
    canvas.endShape(CLOSE);
  } else {
    for (let i = 0; i < currentShape.length; i++) {
      if (i < 3) {
        canvas.noStroke();
        canvas.fill(0);
        canvas.ellipse(currentShape[i].x, currentShape[i].y, 10, 10);
      }
    }
  }
}

function newShape() {
  startNewShape = true;
  if (currentShape.length === 4) {
    shapes.push([...currentShape]);
    currentShape = []; 
    startNewShape = false;
  }
}

function endDrawingShape() {
  startNewShape = false;
  shapes.push([...currentShape]);
  currentShape = []; 
}

function deleteCurrentShape() {
  if (currentShape.length === 4) {
    currentShape = []; 
  } else if (shapes.length > 0) {
    shapes.pop(); 
  }
  startNewShape = false;
}


////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// BRUSH //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function deleteMarker() {
  brushCanvas.clear();
}