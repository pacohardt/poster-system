////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// GRID ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function drawGrid(canvas) {
  calculateDimensions();

  currentMarginW = proportionalWidth * mW;
  currentMarginH = adjustedHeight * mH;
  cellWidth = (canvas.width - 2 * currentMarginW) / columns;
  cellHeight = (canvas.height - 2 * currentMarginH) / rows;

  if (showGridEnabled) {
    canvas.stroke(255, 0, 0);
    canvas.strokeWeight(1);

    for (let i = 0; i <= columns; i++) {
      canvas.line(
        currentMarginW + i * cellWidth,
        currentMarginH,
        currentMarginW + i * cellWidth,
        canvas.height - currentMarginH
      );
      if (i !== 0 && i !== columns) {
        canvas.line(
          currentMarginW + i * cellWidth - gridGutter,
          currentMarginH,
          currentMarginW + i * cellWidth - gridGutter,
          canvas.height - currentMarginH
        );
      }
    }

    for (let i = 0; i <= rows; i++) {
      canvas.line(
        currentMarginW,
        currentMarginH + i * cellHeight,
        canvas.width - currentMarginW,
        currentMarginH + i * cellHeight
      );
    }
  }
}

function generateGrid() {
  calculateDimensions();
  columns = floor(random(2, 13));
  rows = floor(random(16, 73));
  mW = random(0.7, 1);
  mH = random(0.7, 1);
  generateImgPositions();
  updateTxtPositions();
  updateMyTextPositions();
  updateCompSettings();
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// UI /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function showExport() {
  const message =
    "Your poster is downloading... I hope you are enjoying poster.system! Don't forget to share your posters and tag me (@paco.hardt)";
  if (confirm(message)) {
  }
}

/////////////////////////////////////////// asset manage
function gotFile(file) {
  if (file.type === "image") {
    loadImage(file.data, (img) => {
      const uploadedImageURL = img.canvas.toDataURL();
      allImagesHTML += `<img id='storedImg${imageCounter}' class='img_ui' src='${uploadedImageURL}' style='width:15%; padding:2px;'></img>`;
      settAssets.setValue("Images", allImagesHTML);

      let displayImg = img.get();
      let rasterImg = img.get();

      //displayImg.filter(GRAY);
      //rasterImg.filter(GRAY);

      highlightSelectedImage(currentImage);

      displayImages.push({
        image: displayImg,
        x: floor(random(columns) + 1) * cellWidth + currentMarginW,
        y: floor(random(rows) + 1) * cellHeight + currentMarginH,
        scale: 1,
        uploaded: true,
        imageURL: uploadedImageURL,
      });

      currentImageWidth = rasterImg.width;
      currentImageHeight = rasterImg.height;

      rasterizedImages.push(rasterImg);
    });
    currentImage++;
    imageCounter++;
  } else if (file.type === "text") {
    if (txtFiles.length < maxTextFiles) {
      const textLines = file.data.split("\n");
      let firstWord = textLines[0].split(" ")[0] + "...";
      const numLines = textLines.length;
      txtFiles.push({
        text: file.data,
        x: floor(random(columns) + 1) * cellWidth + currentMarginW,
        y: floor(random(rows) + 1) * cellHeight + currentMarginH,
        numLines: numLines,
        size: 20,
        lead: 20,
      });

      allTextsHTML += `<div id='storedTxt${textCounter}' class ='txt_ui' style='padding:2px;'>'${firstWord}'</div>`;
      settAssets.setValue("Txts", allTextsHTML);
      textCounter++;
      currentText++;
      highlightSelectedTxt(currentText);
    }
  }
}

function deleteAll() {
  displayImages = [];
  rasterizedImages = [];
  txtFiles = [];
  rImgLineEnabled = false;
  rImgSquareEnabled = false;
  rImgCircleEnabled = false;
  rImageAnimateEnabled = false;
  hideImages = false;
  rImgObj = null;
  currentImageWidth = 0;
  currentImageHeight = 0;
  currentImage = 0;
  currentText = 0;
  currentIndex = 0;
  currentIndexTxt = 0;
  allImagesHTML = "";
  settAssets.setValue("Images", allImagesHTML);
  allTextsHTML = "";
  settAssets.setValue("Txts", allTextsHTML);
}

/////////////////////////////////////////// generate poster
function randomAll() {
  showGridEnabled = false;
  generateGrid();

  randomAllTexts();
  randomizePImg();
  randomizeRImg();
  reloadRandomImage();

  invertBgColor = random(1) < 0.5;
  invertTextColor = random(1) < 0.5;
  invertShapeColor = random(1) < 0.5;
  invertMarkerColor = random(1) < 0.5;

  if (invertBgColor) {
    invertTextColor = true;
  } else if (invertTextColor) {
    invertBgColor = true;
  }

  updateCompSettings();
  updateImgSettings();
  updateDrawSettings();
  updateTextSettings();
}

/////////////////////////////////////////// export
function exportPoster() {
  saveCanvas(mainC, "myPoster.png");

  svgCanvas.background(colorBg);
  drawGrid(svgCanvas);
  rasterizeImage(svgCanvas);
  drawPattern(svgCanvas);
  placeImage(svgCanvas);
  if (randomImages.length > 0) {
    for (let i = 0; i < randomImages.length; i++) {
      let img = randomImages[i];
      svgCanvas.push();
      svgCanvas.translate(displayImages[i].x, displayImages[i].y);
      svgCanvas.image(img, 0, 0);
      svgCanvas.pop();
    }
  }
  customShape(svgCanvas);
  drawMyText(svgCanvas);
  drawTxt(svgCanvas);
  svgCanvas.image(brushCanvas, 0, 0);

  save(svgCanvas, "myPoster_editable.svg");
  svgCanvas.noLoop();
  showExport();
}
function exportVariables() {
  let variableData = [];

  function addVariable(name, value) {
    variableData.push(`${name} = ${value};`);
  }

  addVariable("invertBgColor", invertBgColor);
  addVariable("showGridEnabled", showGridEnabled);
  addVariable("mW", mW);
  addVariable("mH", mH);
  addVariable("rows", rows);
  addVariable("columns", columns);
  addVariable("lockTextEnabled", lockTextEnabled);
  addVariable("invertTextColor", invertTextColor);
  addVariable("myText", myText);
  addVariable("myTextSize", myTextSize);
  addVariable("myTextLeading", myTextLeading);
  addVariable("myTextKerning", myTextKerning);
  addVariable("hideTxt", hideTxt);
  addVariable("percentageToShow", percentageToShow);
  addVariable("txtSize", txtSize);
  addVariable("txtLead", txtLead);
  addVariable("hideImages", hideImages);
  addVariable("lockImagesEnabled", lockImagesEnabled);
  addVariable("pImgScale", pImgScale);
  addVariable("rImgLineEnabled", rImgLineEnabled);
  addVariable("rImgSquareEnabled", rImgSquareEnabled);
  addVariable("rImgCircleEnabled", rImgCircleEnabled);
  addVariable("rImgScale", rImgScale);
  addVariable("rImageDetail", rImageDetail);
  addVariable("rIShiftX", rIShiftX);
  addVariable("rIShiftY", rIShiftY);
  addVariable("rIStrength", rIStrength);
  addVariable("NOISErIShiftX", NOISErIShiftX);
  addVariable("NOISErIShiftY", NOISErIShiftY);
  addVariable("NOISErISpeed", NOISErISpeed);
  addVariable("rImageAnimateEnabled", rImageAnimateEnabled);
  addVariable("patternSize", patternSize);
  addVariable("patternRadius", patternRadius);
  addVariable("patternLength", patternLength);
  addVariable("patternSpeed", patternSpeed);
  addVariable("patternSpacing", patternSpacing);
  addVariable("patternRotation", patternRotation);
  addVariable("markerWeight", markerWeight);
  addVariable("customShapeEnabled", customShapeEnabled);
  addVariable("invertShapeColor", invertShapeColor);
  addVariable("brushCanvasEnabled", brushCanvasEnabled);
  addVariable("invertMarkerColor", invertMarkerColor);

  return variableData.join("\n");
}
/////////////////////////////////////////// resize

function calculateDimensions() {
  adjustedHeight = windowHeight * scaleFactor;
  proportionalWidth = (posterWidth * adjustedHeight) / posterHeight;
}

function windowResized() {
  calculateDimensions();

  resizeCanvas(proportionalWidth, adjustedHeight);
  poster.resizeCanvas(proportionalWidth, adjustedHeight);
  brushCanvas.resizeCanvas(proportionalWidth, adjustedHeight);
  svgCanvas.resizeCanvas(proportionalWidth, adjustedHeight);
}

/////////////////////////////////////////// screens

window.onerror = function (msg, url, lineNo, columnNo, error) {
  let errorMessage = `Error: ${msg}\n`;
  errorMessage += `URL: ${url}\n`;
  errorMessage += `Line: ${lineNo}, Column: ${columnNo}\n`;
  errorMessage += `Stack: ${error.stack}`;

  errorMsg = errorMessage;
  return false;
};

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function displayWarning() {
  showIntro = false;
  background(255);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(txtSize * 2);
  text(":/", width/2, height/4);
  textSize(txtSize);
  text(
    "This tool is not optimized for\nsmartphones/tablets.\n\nPlease use a computer or laptop.",
    width / 2,
    height / 2
  );
}


function displayIntro(canvas) {
  let tPosY = height/8;
  let tSize = height/12;
  let title;
  let pSize = height/35;
  let paragraph;  
  let info;
  if (showIntro && currentIntro == 1) {
    title = "Welcome :)";
    paragraph =
      "poster.system is an experimental tool that invites reflection on traditional design software and the potential of custom-made tools.\n\nApart from standard functions of text and image manipulation, this tool introduces randomizing generators that let users easily create compositions and play with different layouts.";
    info = "click to continue (1/3) → "
    canvas.push();
    canvas.translate(50, tPosY);
    canvas.textFont(setFont[2]);
    canvas.background(255);
    canvas.noStroke();
    canvas.textSize(tSize);
    canvas.textLeading(tSize * 1.3);
    canvas.text(title, 0, 0, width * 0.9);
    canvas.textSize(pSize);
    canvas.textLeading(pSize * 1.3);
    canvas.text(paragraph, 0, height * 0.3, width * 0.8);
    canvas.fill(0, 0, 255);
    canvas.text(info, 0, height * 0.85, width * 0.8);
    print(width, height);
    canvas.pop();
  } else if (showIntro && currentIntro == 2) {
    title = "Same... but different"
    paragraph =
      "• drag and drop your own files (.jpg, .png and .txt)\n\n• double-click a panel to open it (you can also drag them around)\n\n• play around and embrace randomness!\n\n• export and share!";
    info = "click to continue (2/3) → "
    canvas.push();
    canvas.translate(50, tPosY);
    canvas.textFont(setFont[2]);
    canvas.background(255);
    canvas.noStroke();
    canvas.textSize(tSize);
    canvas.textLeading(tSize * 1.3);
    canvas.text(title, 0, 0, width * 0.8);
    canvas.textSize(pSize);
    canvas.textLeading(pSize * 1.3);
    canvas.text(paragraph, 0, height * 0.3, width * 0.8);
    canvas.fill(0, 0, 255);
    canvas.text(info, 0, height * 0.85, width * 0.8);
    canvas.pop();
  }
  else if (showIntro && currentIntro == 3) {
    title = "Have fun!"
    paragraph =
      "Remember, poster.system is not perfect and is not meant to replace professional design software.\n\nEnjoy the limitations! and don't forget to share your creations on instagram! (tag me @paco.hardt)";
    info = "click to begin → "
    canvas.push();
    canvas.translate(50, tPosY);
    canvas.textFont(setFont[2]);
    canvas.background(255);
    canvas.noStroke();
    canvas.textSize(tSize);
    canvas.textLeading(tSize * 1.3);
    canvas.text(title, 0, 0, width * 0.8);
    canvas.textSize(pSize);
    canvas.textLeading(pSize * 1.3);
    canvas.text(paragraph, 0, height * 0.3, width * 0.8);
    canvas.fill(0, 0, 255);
    canvas.text(info, 0, height * 0.85, width * 0.8);
    canvas.pop();
  }
}

function displaySharePNG(canvas) {
  if (showSharePNG) {
    canvas.push();
    canvas.translate(0, 0);
    canvas.imageMode(CENTER);
    canvas.image(scrPNG, 0.5 * width, 0.5 * height);
    canvas.pop();
  }
}
function displayShareSVG(canvas) {
  if (showShareSVG) {
    canvas.push();
    canvas.translate(0, 0);
    canvas.imageMode(CENTER);
    canvas.image(scrSVG, 0.5 * width, 0.5 * height);
    canvas.pop();
  }
}
function keyTyped() {
  if (key === "s") {
    showIntro = false;
    currentIntro = 4;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// UPDATE UI ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function updateCompSettings() {
  settComp.setValue("Show Grid", showGridEnabled);
  settComp.setValue("Margin Width", mW);
  settComp.setValue("Margin Height", mH);
  settComp.setValue("Rows", rows);
  settComp.setValue("Columns", columns);
  settComp.setValue("Black background", invertBgColor);
}

function updateTextSettings() {
  settText.setValue("Display written text", showMyText);
  settText.setValue("White text", invertTextColor);
  settText.setValue("Size", myTextSize);
  settText.setValue("Line spacing", myTextLeading);
  settText.setValue("Character spacing", myTextKerning);
  settText.setValue("Size (.txt)", txtSize);
  settText.setValue("Line spacing (.txt)", txtLead);
}

function updatePatternSettings() {
  settPattern.setValue("Size", patternSize);
  settPattern.setValue("Shape", patternRadius);
  settPattern.setValue("Length", patternLength);
  settPattern.setValue("Speed", patternSpeed);
  settPattern.setValue("Spacing", patternSpacing);
  settPattern.setValue("Rotation", patternRotation);
}

function updateImgSettings() {
  //settImg.setValue("Display images", hideImages);
  //settImg.setValue("Individual image size", pImgScale);

  if (
    (rImgLineEnabled || rImgSquareEnabled || rImgCircleEnabled) &&
    rasterizedImages.length > 0 &&
    currentImage >= 0 &&
    currentImage < rasterizedImages.length
  ) {
    settImg.setValue("Transformed image size", rImgScale);
    settImg.setValue("Detail", rImageDetail);
    settImg.setValue("Width", rIShiftX);
    settImg.setValue("Height", rIShiftY);
    settImg.setValue("Rotation", rIStrength);
    settImg.setValue("Width uniformity", NOISErIShiftX);
    settImg.setValue("Height uniformity", NOISErIShiftY);
    settImg.setValue("Animation speed", NOISErISpeed);
  }
}

function updateDrawSettings() {
  settDraw.setValue("Brush thickness", markerWeight);
}

function updateCheckboxState() {
  settImg.setValue("Display images", hideImages);
  settImg.setValue("Animate shapes", rImageAnimateEnabled);
  settText.setValue("Animate shapes", hideTxt);
}

function updateScaleSliders() {
  if (
    displayImages.length > 0 &&
    currentImage >= 0 &&
    currentImage < displayImages.length
  ) {
    const currentImageScale = displayImages[currentImage].scale;
    settImg.setValue("Image scale", currentImageScale);
    settImg.setValue("Transformed image scale", currentImageScale);
  }
}

function updateTxtSliders() {
  if (
    txtFiles.length > 0 &&
    currentText >= 0 &&
    currentText < txtFiles.length
  ) {
    const currentTxtSize = txtFiles[currentText].size;
    const currentTxtLead = txtFiles[currentText].lead;
    settText.setValue("Size (.txt)", currentTxtSize);
    settText.setValue("Line spacing (.txt)", currentTxtLead);
  }
}
