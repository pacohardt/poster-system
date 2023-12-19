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

function showSurveyAlert() {
  const surveyURL = "https://forms.gle/2ttXPgsNjhsc1aAN6";
  const message =
    "Are you enjoying poster.system? Please consider answering the survey and sharing your poster!";

  if (confirm(message)) {
    window.open(surveyURL, "_blank");
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

      displayImg.filter(GRAY);
      rasterImg.filter(GRAY);

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
  showShareSVG = true;
  showSurveyAlert();
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

function displayIntro(canvas) {
  if (showIntro) {
    canvas.push();
    canvas.translate(0, 0);
    canvas.imageMode(CENTER);
    canvas.image(
      scrIntro[currentIntro],
      0.5 * width,
      0.5 * height,
      canvas.width,
      canvas.height
    );
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
    currentIntro = 7;
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
