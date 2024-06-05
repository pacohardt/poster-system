////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// GRID ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function drawGrid(canvas) {
  calculateDimensions();

  currentPosterWidth = adjustedCanvasWidth * mW;
  currentPosterHeight = adjustedCanvasHeight * mH;
  fullMarginWidth = adjustedCanvasWidth - currentPosterWidth;
  fullMarginHeight = adjustedCanvasHeight - currentPosterHeight;
  marginWidth = fullMarginWidth / 2;
  marginHeight = fullMarginHeight / 2;
  cellWidth = currentPosterWidth / columns;
  cellHeight = currentPosterHeight / rows;
  canvas.noStroke();

  if (showLayoutGrid) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        
        canvas.fill(255, 0, 0, 50);
        canvas.rect(
          marginWidth + i * cellWidth + gridGutter / 2,
          marginHeight + j * cellHeight + gridGutter / 2,
          cellWidth - gridGutter,
          cellHeight - gridGutter
        );
      }
    }
  } else if (showRows) {
    for (let j = 0; j < rows; j++) {
      canvas.fill(255, 0, 0, 50);
      canvas.rect(
        marginWidth + gridGutter / 2,
        marginHeight + j * cellHeight + gridGutter / 2,
        currentPosterWidth - gridGutter,
        cellHeight - gridGutter
      );
    }
  } else if (showColumns) {
    for (let i = 0; i < columns; i++) {
      canvas.fill(255, 0, 0, 50);
      canvas.rect(
        marginWidth + i * cellWidth + gridGutter / 2,
        marginHeight + gridGutter / 2,
        cellWidth - gridGutter,
        currentPosterHeight - gridGutter
      );
    }
  }

  if (showBaselineGrid) {
    let baselineSpacing = (currentPosterHeight - gridGutter) / baselines;

    for (let i = 0; i <= baselines; i++) {
      let y = marginHeight + i * baselineSpacing + gridGutter / 2;
      canvas.stroke(0, 0, 255, 50);
      canvas.line(
        marginWidth + gridGutter / 2,
        y,
        marginWidth + currentPosterWidth - gridGutter / 2,
        y
      );
    }
    for (let j = 1; j <= columns - 1; j++) {
      canvas.line(
        marginWidth + j * cellWidth + gridGutter / 2,
        marginHeight + gridGutter / 2,
        marginWidth + j * cellWidth + gridGutter / 2,
        marginHeight + currentPosterHeight - gridGutter / 2
      );
      canvas.line(
        marginWidth + j * cellWidth - gridGutter / 2,
        marginHeight + gridGutter / 2,
        marginWidth + j * cellWidth - gridGutter / 2,
        marginHeight + currentPosterHeight - gridGutter / 2
      );
    }
    canvas.line(
      marginWidth + 0 * cellWidth + gridGutter / 2,
      marginHeight + gridGutter / 2,
      marginWidth + 0 * cellWidth + gridGutter / 2,
      marginHeight + currentPosterHeight - gridGutter / 2
    );
    canvas.line(
      marginWidth + columns * cellWidth - gridGutter / 2,
      marginHeight + gridGutter / 2,
      marginWidth + columns * cellWidth - gridGutter / 2,
      marginHeight + currentPosterHeight - gridGutter / 2
    );
  }
  canvas.fill(0);
}

function generateGrid() {
  calculateDimensions();
  columns = floor(random(2, 13));
  rows = floor(random(2, 11));
  gridGutter = floor(random(0, 50));
  mW = random(0.7, 1);
  mH = random(0.7, 1);
  generateImgPositions();
  generateTxtPositions();
  generateMyTextPositions();
  settComp.setValue("Margin Width", mW);
  settComp.setValue("Margin Height", mH);
  settComp.setValue("Rows", rows);
  settComp.setValue("Columns", columns);
  settComp.setValue("Gutter", gridGutter);
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

      highlightSelectedImage(currentImage);

      displayImages.push({
        image: displayImg,
        x: floor(random(columns) + 1) * cellWidth + currentPosterWidth,
        y: floor(random(rows) + 1) * cellHeight + currentPosterHeight,
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
      processText(file.data);
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
  generateGrid();
  randomAllTexts();
  randomizePImg();
  randomizeRImg();
  reloadRandomImage();
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

  addVariable("showBaselineGrid", showBaselineGrid);
  addVariable("mW", mW);
  addVariable("mH", mH);
  addVariable("rows", rows);
  addVariable("columns", columns);
  addVariable("lockTextEnabled", lockTextEnabled);
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
  addVariable("brushCanvasEnabled", brushCanvasEnabled);

  return variableData.join("\n");
}
/////////////////////////////////////////// resize

function calculateDimensions() {
  adjustedCanvasHeight = windowHeight * scaleFactor;
  adjustedCanvasWidth = (posterWidth * adjustedCanvasHeight) / posterHeight;
}

function windowResized() {
  calculateDimensions();

  resizeCanvas(adjustedCanvasWidth, adjustedCanvasHeight);
  poster.resizeCanvas(adjustedCanvasWidth, adjustedCanvasHeight);
  brushCanvas.resizeCanvas(adjustedCanvasWidth, adjustedCanvasHeight);
  svgCanvas.resizeCanvas(adjustedCanvasWidth, adjustedCanvasHeight);
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
  text(":/", width / 2, height / 4);
  textSize(txtSize);
  text(
    "This tool is not optimized for\nsmartphones/tablets.\n\nPlease use a computer or laptop.",
    width / 2,
    height / 2
  );
}

function displayIntro(canvas) {
  let tPosY = height / 8;
  let tSize = height / 12;
  let title;
  let pSize = height / 35;
  let paragraph;
  let info;
  if (showIntro && currentIntro == 1) {
    title = "Welcome :)";
    paragraph =
      "poster.system is an experimental tool that invites reflection on traditional design software and the potential of custom-made tools.\n\nApart from standard functions of text and image manipulation, this tool introduces randomizing generators that let users easily create compositions and play with different layouts.";
    info = "click to continue (1/3) → ";
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
    canvas.pop();
  } else if (showIntro && currentIntro == 2) {
    title = "Same... but different";
    paragraph =
      "• drag and drop your own files (.jpg, .png and .txt)\n\n• double-click a panel to open it (you can also drag them around)\n\n• play around and embrace randomness!\n\n• export and share!";
    info = "click to continue (2/3) → ";
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
  } else if (showIntro && currentIntro == 3) {
    title = "Have fun!";
    paragraph =
      "Remember, poster.system is not perfect and is not meant to replace professional design software.\n\nEnjoy the limitations! and don't forget to share your creations on instagram! (tag me @paco.hardt)";
    info = "click to begin → ";
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

function keyTyped() {
  if (key === "s") {
    showIntro = false;
    currentIntro = 4;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// UPDATE UI ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function updateTextSettings() {
  settText.setValue("Display written text", showMyText);
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
  settComp.setValue("Show Rows", showRows);
  settComp.setValue("Show Columns", showColumns);
  settComp.setValue("Show Layout Grid", showLayoutGrid);
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
