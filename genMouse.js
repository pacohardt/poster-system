////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// DRAG //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function dragMyText() {
  myTextObj.text = myText;
  textSize(myTextSize);

  lines.forEach((line) => {
    let lineWidth = 0;

    for (let i = 0; i < line.length; i++) {
      let c = line.charAt(i);
      lineWidth += textWidth(c) + myTextKerning;
    }

    if (lineWidth > myTextMaxWidth) {
      myTextMaxWidth = lineWidth;
    }
  });

  let numLinesCstmText = lines.length;
  let hHead = myTextSize + myTextLeading * (numLinesCstmText - 1);

  const draggableXHead = myTextObj.x;
  const totalHeight = myTextObj.y + hHead;
  const draggableYHead = totalHeight - hHead;

  if (
    mouseX >= draggableXHead &&
    mouseX <= draggableXHead + myTextMaxWidth &&
    mouseY >= draggableYHead - myTextSize &&
    mouseY <= totalHeight - myTextSize
  ) {
    isDraggingMyText = true;
    myTextDragged = myTextObj;
    myText0ffsetX = mouseX - myTextDragged.x;
    myText0ffsetY = mouseY - myTextDragged.y;
  }
}

function dragTxt() {
  let totalWidth = 0;
  let characterWidth = 0;

  for (let i = txtFiles.length - 1; i >= 0; i--) {
    const textObj = txtFiles[i];

    txtSize = textObj.size;
    textSize(txtSize);
    totalWidth = calculateTextWidth(textObj.text) * 2;
    txtLead = textObj.lead;
    const numLines = textObj.text.split("\n").length;
    let h = txtSize + txtLead * numLines;

    const draggableX = textObj.x;
    const totalHeight = textObj.y + h;
    const draggableY = totalHeight - h;

    if (
      mouseX >= draggableX &&
      mouseX <= draggableX + totalWidth &&
      mouseY >= draggableY - txtSize &&
      mouseY <= totalHeight - txtSize
    ) {
      isDraggingTxt = true;
      txtDragged = textObj;
      txtOffsetX = mouseX - txtDragged.x;
      txtOffsetY = mouseY - txtDragged.y;
      break;
    }
  }
}

function dragImage() {
  for (let i = displayImages.length - 1; i >= 0; i--) {
    const imgObj = displayImages[i];
    const imgWidth = pImgScale * imgObj.image.width * imgObj.scale;
    const imgHeight = pImgScale * imgObj.image.height * imgObj.scale;
    if (
      mouseX >= imgObj.x &&
      mouseX <= imgObj.x + imgWidth &&
      mouseY >= imgObj.y &&
      mouseY <= imgObj.y + imgHeight
    ) {
      isDraggingImage = true;
      imgDragged = imgObj;
      imgOffsetX = mouseX - imgDragged.x;
      imgOffsetY = mouseY - imgDragged.y;
      break;
    }
  }
}

//////////////////////////////////////////// pressed

function mousePressed() {
  /////////////////////////////////////// DRAW SHAPE VERTICES

  if (mouseX < posterWidth && customShapeEnabled && startNewShape) {
    if (currentShape.length < 4) {
      currentShape.push(createVector(mouseX, mouseY));

      if (currentShape.length === 4) {
        let shapePicker = document.getElementById('shPicker');
    if (shapePicker != null){
      colorShape = shapePicker.value
    }
        noStroke();
        fill(colorShape);
        ellipse(currentShape[3].x, currentShape[3].y, 10, 10);
      }
    }
  }

  ////////////////////////////////////////// CLICK & DRAG

  if (!lockTextEnabled) {
    dragTxt();
  }

  if (!lockTextEnabled && showMyText) {
    dragMyText();
  }

  if (!lockImagesEnabled) {
    dragImage();
  }

  ////////////////////////////////////////// SCREENS

  if (showIntro && mouseIsPressed && currentIntro <= 7) {
    currentIntro++;
  }
  if (showIntro && mouseIsPressed && currentIntro == 7) {
    showIntro = false;
  }
  if (showSharePNG && mouseIsPressed) {
    showSharePNG = false;
  }
  if (showShareSVG && mouseIsPressed) {
    showShareSVG = false;
  }
}

//////////////////////////////////////////// dragged

function mouseDragged() {
  if (isDraggingTxt && txtDragged) {
    txtDragged.x = mouseX - txtOffsetX;
    txtDragged.y = mouseY - txtOffsetY;
    cursor("grab");
  }

  if (isDraggingImage && imgDragged) {
    imgDragged.x = mouseX - imgOffsetX;
    imgDragged.y = mouseY - imgOffsetY;
    cursor("grab");
  }

  if (isDraggingMyText && myTextDragged) {
    myTextObj.x = mouseX - myText0ffsetX;
    myTextObj.y = mouseY - myText0ffsetY;
    cursor("grab");
  }
}

//////////////////////////////////////////// released

function mouseReleased() {
  cursor("default");
  txtDragged = null;
  isDragging = false;
  imgDragged = null;
  isDraggingImage = false;
  myTextDragged = null;
  isDraggingMyText = false;
}
