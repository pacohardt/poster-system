////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// MY TEXT //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function drawMyText(canvas) {
  if (showMyText) {
    calculateDimensions();
    myTextObj.text = myText;

    canvas.textFont(setFont[myTextFontIndex]);
    canvas.textSize(myTextSize);

    lines = myTextObj.text.split("\n");
    let numLinesCstmText = lines.length;

    let hHead = myTextSize + myTextLeading * (numLinesCstmText - 1);

    canvas.noStroke();
    canvas.fill(colorType);
    canvas.textLeading(myTextLeading);

    const draggableXHead = myTextObj.x;
    const totalHeight = myTextObj.y + hHead;
    const draggableYHead = totalHeight - hHead;

    let x = draggableXHead;
    let y = draggableYHead;

    for (let i = 0; i < myTextObj.text.length; i++) {
      let c = myTextObj.text.charAt(i);

      canvas.push();
      canvas.translate(x, y);
      canvas.text(c, 0, 0);
      canvas.pop();

      x += canvas.textWidth(c) + myTextKerning;
      if (c === "\n") {
        y += myTextLeading;
        x = draggableXHead;
      }
    }

    if (myTextObj === myTextDragged) {
      myTextObj.x = mouseX - myText0ffsetX;
      myTextObj.y = mouseY - myText0ffsetY;
    }

    if (
      mouseX >= draggableXHead &&
      mouseX <= draggableXHead + myTextMaxWidth &&
      mouseY >= draggableYHead - myTextSize &&
      mouseY <= totalHeight - myTextSize
    ) {
      cursor("grab");
    } else {
      cursor(ARROW);
    }
  }
}

function calculateMyTextMaxWidth(text) {
  let maxWidth = 0;
  const lines = text.split("\n");

  lines.forEach((line) => {
    let lineWidth = 0;

    for (let i = 0; i < line.length; i++) {
      let c = line.charAt(i);
      lineWidth += textWidth(c) + myTextKerning;
    }

    if (lineWidth > maxWidth) {
      maxWidth = lineWidth;
    }
  });

  return maxWidth;
}

function randomizeMyTextPositions() {
  currentMarginW = proportionalWidth * mW;
  currentMarginH = adjustedHeight * mH;
  cellWidth = (poster.width - 2 * currentMarginW) / columns;
  cellHeight = (poster.height - 2 * currentMarginH) / rows;
  myTextObj.x = floor(random(columns) + 1) * cellWidth + currentMarginW;
  myTextObj.y = floor(random(rows) + 1) * cellHeight + currentMarginH;
}

function updateMyTextPositions() {
  let storedXPosPercent =
    (myTextObj.x - currentMarginW) / (columns * cellWidth);
  let storedYPosPercent = (myTextObj.y - currentMarginH) / (rows * cellHeight);

  currentMarginW = proportionalWidth * mW;
  currentMarginH = adjustedHeight * mH;
  cellWidth = (poster.width - 2 * currentMarginW) / columns;
  cellHeight = (poster.height - 2 * currentMarginH) / rows;

  let myTextNewX = storedXPosPercent * (columns * cellWidth) + currentMarginW;
  let myTextNewY = storedYPosPercent * (rows * cellHeight) + currentMarginH;

  myTextObj.x = myTextNewX;
  myTextObj.y = myTextNewY;
}

function generateMyTextFont() {
  myTextFontIndex = floor(random(maxFonts));
}

function randomizeMyText() {
  randomizeMyTextPositions();
  generateMyTextFont();
  showMyText = true;
  myTextSize = random(20, 300);
  myTextLeading = random(0, myTextSize * 4);
  myTextKerning = random(-100, 100);
  updateTextSettings();
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// .TXT  ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function drawTxt(canvas) {
  if (!hideTxt) {
    calculateDimensions();

    for (let i = 0; i < txtFiles.length; i++) {
      const textObj = txtFiles[i];
      const maxWidth = textObj.maxWidth;
      txtSize = textObj.size;
      txtLead = textObj.lead;

      const numLines = textObj.text.split("\n").length;
      let h = txtSize + txtLead * numLines;

      const draggableX = textObj.x;
      const totalHeight = textObj.y + h;
      const draggableY = totalHeight - h;

      canvas.noStroke();
      canvas.fill(colorType);
      canvas.textFont(setFont[txtFontIndex]);
      canvas.textSize(txtSize);
      totalWidth = calculateTextWidth(textObj.text) * 2;
      canvas.textLeading(txtLead);
      canvas.text(textObj.text, draggableX, draggableY);

      if (
        mouseX >= draggableX &&
        mouseX <= draggableX + totalWidth &&
        mouseY >= draggableY - txtSize &&
        mouseY <= totalHeight - txtSize
      ) {
        cursor("grab");
      } else {
        cursor(ARROW);
      }

      if (textObj === txtDragged) {
        textObj.x = mouseX - txtOffsetX;
        textObj.y = mouseY - txtOffsetY;
      }
    }
  }
}

function calculateTextWidth(text) {
  let totalWidth = 0;
  let characterWidth = 0;

  for (let i = 0; i < txtBreak; i++) {
    let characterWidth = textWidth(text.charAt(txtBreak));
    totalWidth += characterWidth;
  }

  return totalWidth;
}


function randomizeTxtPositions() {
  currentMarginW = proportionalWidth * mW;
  currentMarginH = adjustedHeight * mH;
  cellWidth = (poster.width - 2 * currentMarginW) / columns;
  cellHeight = (poster.height - 2 * currentMarginH) / rows;

  for (let i = 0; i < txtFiles.length; i++) {
    if (txtFiles[i]) {
      txtFiles[i].x = floor(random(columns) + 1) * cellWidth + currentMarginW;
      txtFiles[i].y = floor(random(rows) + 1) * cellHeight + currentMarginH;
    }
  }
}

function updateTxtPositions() {
  const storedTextPositions = [];

  for (let i = 0; i < txtFiles.length; i++) {
    if (txtFiles[i]) {
      const xPosPercent =
        (txtFiles[i].x - currentMarginW) / (columns * cellWidth);
      const yPosPercent =
        (txtFiles[i].y - currentMarginH) / (rows * cellHeight);
      storedTextPositions.push({ x: xPosPercent, y: yPosPercent });
    }
  }

  let txtCurrentMarginW = proportionalWidth * mW;
  let txtCurrentMarginH = adjustedHeight * mH;
  let txtCellWidth = (poster.width - 2 * txtCurrentMarginW) / columns;
  let txtCellHeight = (poster.height - 2 * txtCurrentMarginH) / rows;

  for (let i = 0; i < txtFiles.length; i++) {
    if (txtFiles[i]) {
      const newX =
        storedTextPositions[i].x * (columns * txtCellWidth) + txtCurrentMarginW;
      const newY =
        storedTextPositions[i].y * (rows * txtCellHeight) + txtCurrentMarginH;

      txtFiles[i].x = newX;
      txtFiles[i].y = newY;
    }
  }
}

function generateTxtFont() {
  txtFontIndex = floor(random(maxFonts));
}

function randomizeTxt() {
  randomizeTxtPositions();
  let moreTexts = false;
  moreTexts = random(1) < 0.5;
  if (moreTexts){
    loadHipsterText();
  }
  
  txtBreak = random(10, 50);
  txtSize = random(20, 80);
  txtLead = random(txtSize * 0.7, txtSize * 1.4);
  generateTxtFont();
  updateTextSettings();
  regenerateText();
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// RANDOM TEXT  ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function loadHipsterText() {
  let url = "https://hipsum.co/api/?type=hipster-centric&sentences=2";
  loadJSON(url, gotData);
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        errorMsg += "Sorry, there was a problem fetching the text!\nPlease restart";
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem fetching the text:", error);
      errorMsg += "Sorry, there was a problem fetching the text!\nPlease restart";
    });
}

function gotData(data) {
  const randomText = data[0];
  displayText(randomText);
}

function displayText(randomText) {
  let modifiedText = "";
  const currentTxtBreak = txtBreak;

  for (let i = 0; i < randomText.length; i += currentTxtBreak) {
    modifiedText += randomText.substring(i, i + currentTxtBreak) + "\n";
  }

  txtFiles[currentText] = {
    text: modifiedText.trim(),
    x: floor(random(columns) + 1) * cellWidth + currentMarginW,
    y: floor(random(rows) + 1) * cellHeight + currentMarginH,
    numLines: ceil(modifiedText.length / currentTxtBreak),
    size: 20,
    lead: 20,
  };

  let updatedTextsHTML = "";
  for (let i = 0; i < txtFiles.length; i++) {
    const textLines = txtFiles[i].text.split("\n");
    let firstWord = textLines[0].split(" ")[0] + "...";
    updatedTextsHTML += `<div id='storedTxt${i}' class ='txt_ui' style='padding:2px;'>${firstWord}</div>`;
  }

  allTextsHTML = updatedTextsHTML;
  settAssets.setValue("Txts", allTextsHTML);
  highlightSelectedTxt(currentText);
}

function regenerateText() {
  if (txtFiles.length > 0) {
    const latestText = txtFiles[currentText].text.split("\n").join("");
    const originalX = txtFiles[currentText].x;
    const originalY = txtFiles[currentText].y;
    const originalSize = txtFiles[currentText].size;
    displayText(latestText);
    txtFiles[currentText].size = originalSize;
    txtFiles[currentText].x = originalX;
    txtFiles[currentText].y = originalY;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// CONTROL  /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function highlightSelectedTxt(index) {
  allTexts = document.getElementsByClassName("txt_ui");

  for (let i = 0; i < allTexts.length; i++) {
    allTexts[i].style.transform = "scale(0.7)";
    allTexts[i].style.border = "2px solid transparent";
  }
  if (index >= 0 && index < allTexts.length) {
    allTexts[index].style.transform = "scale(1)";
    allTexts[index].style.border = "2px solid #255dbb";
  }
}

function nextText() {
  currentText++;

  if (currentText >= txtFiles.length) {
    currentText = 0;
    highlightSelectedTxt(currentText);
  }
  if (txtFiles.length > 0) {
    selectedText = txtFiles[currentText];
    highlightSelectedTxt(currentText);
  }
  updateTxtSliders();
}

function deleteSelectedText(index) {
  const deletedText = document.getElementById(`storedTxt${index}`);
  if (deletedText) {
    deletedText.remove();
  }

  let updatedTextsHTML = "";
  for (let i = 0; i < txtFiles.length; i++) {
    // Reassign IDs based on the loop index
    const textLines = txtFiles[i].text.split("\n");
    let firstWord = textLines[0].split(" ")[0] + "...";
    updatedTextsHTML += `<div id='storedTxt${i}' class ='txt_ui' style='padding:2px;'>${firstWord}</div>`;
  }

  allTextsHTML = updatedTextsHTML;
  settAssets.setValue("Txts", allTextsHTML);
  highlightSelectedTxt(currentText);
}

function deleteText() {
  if (txtFiles.length > 0) {
    const currentIndexTxt = currentText;
    txtFiles.splice(currentIndexTxt, 1);
    deleteSelectedText(currentIndexTxt);
    textCounter--;
    if (currentText >= txtFiles.length) {
      currentText = txtFiles.length - 1;
      textCounter = currentText;
    }
    highlightSelectedTxt(currentText);
  } else {
    selectedText = null;
    hideTxt = false;
  }
  updateTxtSliders();
}

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// PATTERN  /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function generatePatternFont() {
  patternFontIndex = floor(random(maxFonts));
}

function generatePattern() {
  patternSize = random(5, 50);
  patternRadius = random(1, 100);
  patternLength = random(0, 100);
  patternSpeed = random(0.01, 1.0);
  patternSpacing = random(-50, 100);
  patternRotation = random(0, 360);
  generatePatternFont();
  updatePatternSettings();
}

function drawPattern(canvas) {
  if (!hidePattern) {
    let angleBetweenText = TWO_PI / patternDetail;
    if (animatePattern) {
      radius = map(tan(radians(frameCount * patternSpeed)), -1, 1, 0, 150);
    } else {
      radius = map(tan(radians(stopFrame * patternSpeed)), -1, 1, 0, 150);
    }

    canvas.push();
    canvas.translate(width / 2, height / 2);

    for (let i = 0; i < 150; i++) {
      canvas.push();
      canvas.rotate(i * angleBetweenText);
      canvas.translate(radius, radius);
      canvas.rotate(radians(patternRotation));
      prepPattern(canvas);
      canvas.pop();
    }

    canvas.pop();
  }
}

function prepPattern(canvas) {
  let arclength = patternLength;
  let x = 0;

  for (let i = 0; i < patternText.length; i++) {
    let currentChar = patternText.charAt(i);
    let w = textWidth(currentChar);
    arclength += w / 2;

    let theta = PI + arclength / patternRadius;

    canvas.push();
    canvas.translate(-patternRadius * cos(theta), patternRadius * sin(theta));
    canvas.rotate(-theta + PI / 2);
    canvas.textFont(setFont[patternFontIndex]);
    canvas.textAlign(CENTER, CENTER);
    canvas.fill(colorPattern);
    canvas.noStroke();
    canvas.textSize(patternSize);
    canvas.text(currentChar, x, 0);

    x += w + patternSpacing;

    canvas.pop();
    arclength += w / 2;
  }

  x = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// OTHER  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function randomAllTexts() {
  randomizeMyText();
  randomizeTxt();
  updateTextSettings();
}
