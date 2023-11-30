function loaded() {
  loadedAssets++;

  if (loadedAssets === totalAssets) {
    loading = false;
  }
}

function setup() {
  boxEmpty = loadImage("box-empty.webp", loaded);
  boxChk = loadImage("box-chckd.webp", loaded);
  scrPNG = loadImage("screens/scrPNG.webp", loaded);
  scrSVG = loadImage("screens/scrSVG.webp", loaded);
  scrError = loadImage("screens/scrError.webp", loaded);

  for (let i = 1; i <= 6; i++) {
    scrIntro[i] = loadImage("screens/scrIntro" + i + ".webp", loaded);
  }

  for (let i = 0; i < fontPaths.length; i++) {
    setFont[i] = loadFont(fontPaths[i], loaded);
  }

  calculateDimensions();

  let mainC = createCanvas(proportionalWidth, adjustedHeight);
  poster = createGraphics(proportionalWidth, adjustedHeight);
  brushCanvas = createGraphics(proportionalWidth, adjustedHeight);
  svgCanvas = createGraphics(proportionalWidth, adjustedHeight, SVG);

  svgCanvas.clear();
  poster.clear();
  brushCanvas.clear();

  mainC.drop(gotFile);

  //////////////////////////////////////////// UI settings ////////////////////////////////////////////

  settTips = QuickSettings.create(20, 100, "Tips");
  settComp = QuickSettings.create(20, 140, "General");
  settAssets = QuickSettings.create(240, 140, "Assets");
  settText = QuickSettings.create(20, 180, "Text");
  settImg = QuickSettings.create(20, 220, "Image");
  settDraw = QuickSettings.create(20, 260, "Draw");
  settCredits = QuickSettings.create(20, 300, "About");

  settTips.hide();
  settAssets.hide();
  settComp.hide();
  settText.hide();
  settImg.hide();
  settDraw.hide();
  settCredits.hide();

  settComp.collapse();
  settText.collapse();
  settImg.collapse();
  settDraw.collapse();
  settTips.collapse();
  settCredits.collapse();
  settText.setHeight(420);
  settImg.setHeight(420);

  //////////////////////////////////////////// UI ASSETS ////////////////////////////////////////////

  settAssets.addHTML("Images", allImagesHTML);
  settAssets.addHTML("Controlls", "<div id = 'buttonContainer'></div>");
  settAssets.hideTitle("Controlls");

  settAssets.addButton("🆕", loadRandomImage);
  settAssets.addButton("🚮", deleteImage);
  settAssets.addButton("🔄", reloadRandomImage);
  settAssets.addButton("➡️", nextImage);
  select("#🆕").parent("buttonContainer");
  select("#🚮").parent("buttonContainer");
  select("#🔄").parent("buttonContainer");
  select("#➡️").parent("buttonContainer");

  settAssets.hideControl("🆕");
  settAssets.hideControl("🚮");
  settAssets.hideControl("🔄");
  settAssets.hideControl("➡️");

  settAssets.addHTML("Txts", allTextsHTML);
  settAssets.addHTML("TxtControlls", "<div id = 'buttonContainerTxt'></div>");
  settAssets.hideTitle("TxtControlls");
  settAssets.addButton("random", loadHipsterText);
  settAssets.addButton("next", nextText);
  settAssets.addButton("delete", deleteText);
  settAssets.addButton("Delete all assets", deleteAll);
  settAssets.hideControl("random");
  settAssets.hideControl("next");
  settAssets.hideControl("delete");
  select("#random").parent("buttonContainerTxt");
  select("#next").parent("buttonContainerTxt");
  select("#delete").parent("buttonContainerTxt");

  //////////////////////////////////////////// UI COMP ////////////////////////////////////////////
  settComp.addHTML(
    "About exp",
    "<div id=info-panel>Export your poster to be featured alongside creations from other users in a printed book!<br><br><a href='https://forms.gle/JSFGyZPM4DCnt1U96'>Learn more</a></div>"
  );
  settComp.addButton("Export Poster", function () {
    exportPoster();
    const variableData = exportVariables();
    saveStrings(variableData.split("\n"), "my-poster_settings.txt");
  });

  settComp.addButton("Random Grid", generateGrid);
  settComp.addButton("Generate Poster", randomAll);
  settComp.addBoolean("Black background", false, function (value) {
    invertBgColor = value;
    if (value == true) {
      colorBg = 0;
    } else {
      colorBg = 255;
    }
  });
  settComp.addBoolean("Show Grid", true, function (value) {
    showGridEnabled = value;
  });
  settComp.addRange("Margin Width", 0.7, 1, mH, 0.01, function (value) {
    mW = value;
    updateTxtPositions();
    updateMyTextPositions();
  });
  settComp.addRange("Margin Height", 0.7, 1, mW, 0.01, function (value) {
    mH = value;
    updateTxtPositions();
    updateMyTextPositions();
  });
  settComp.addRange("Rows", 16, 72, rows, 1, function (value) {
    rows = value;
    updateTxtPositions();
    updateMyTextPositions();
  });
  settComp.addRange("Columns", 2, 12, columns, 1, function (value) {
    columns = value;
    updateTxtPositions();
    updateMyTextPositions();
  });

  //////////////////////////////////////////// UI TEXT ////////////////////////////////////////////
  settText.addHTML(
    "About",
    "<div id=info-panel>Below you can write your own text and display it. Use the different controls to give it a bit more personality! <br><br>Scroll to find more controls. ⬇</div>"
  );
  settText.addButton("Randomize all texts", randomAllTexts);
  settText.addBoolean("Lock all texts", false, function (value) {
    lockTextEnabled = value;
  });
  settText.addBoolean("White text", false, function (value) {
    invertTextColor = value;
    if (value == true) {
      colorType = 255;
    } else {
      colorType = 0;
    }
  });
  settText.addBoolean("Display written text", true, function (value) {
    showMyText = value;
  });
  settText.addTextArea("Write here", myText, function (value) {
    showMyText = value;
    myText = value;
    myTextMaxWidth = calculateMyTextMaxWidth(myText);
  });
  settText.addButton("Randomize position", randomizeMyTextPositions);
  settText.addButton("Randomize font", generateMyTextFont);
  settText.addButton("Randomize written text", randomizeMyText);
  settText.addRange("Size", 20, 300, myTextSize, 1, function (value) {
    myTextSize = value;
  });
  settText.addRange(
    "Line spacing",
    0,
    myTextSize * 4,
    myTextLeading,
    1,
    function (value) {
      myTextLeading = value;
    }
  );
  settText.addRange(
    "Character spacing",
    -100,
    100,
    myTextKerning,
    1,
    function (value) {
      myTextKerning = value;
    }
  );

  settText.addHTML(
    ".txt assets",
    "<div id=info-panel><b>.txt assets</b><br>If you uploaded any .txt files, you can use the controls below to further customize them! ⬇</div>"
  );
  settText.addButton("Randomize positions (.txt)", randomizeTxtPositions);
  settText.addButton("Randomize fonts (.txt)", generateTxtFont);
  settText.addButton("Chaos", randomizeTxt);
  settText.addBoolean("Hide .txt", false, function (value) {
    hideTxt = value;
  });
  settText.addRange("Length (.txt)", 10, 50, txtBreak, 1, function (value) {
    txtBreak = value;
    regenerateText();
  });
  settText.addRange("Size (.txt)", 10, 50, txtSize, 1, function (value) {
    if (
      txtFiles.length > 0 &&
      currentText >= 0 &&
      currentText < txtFiles.length
    ) {
      txtFiles[currentText].size = value;
    }
  });
  settText.addRange(
    "Line spacing (.txt)",
    10,
    50,
    txtLead,
    1,
    function (value) {
      if (
        txtFiles.length > 0 &&
        currentText >= 0 &&
        currentText < txtFiles.length
      ) {
        txtFiles[currentText].lead = value;
      }
    }
  );

  //////////////////////////////////////////// UI IMAGE ////////////////////////////////////////////
  settImg.addButton("Randomize positions", generateImgPositions);
  settImg.addBoolean("Hide all images", false, function (value) {
    hideImages = value;
  });
  settImg.addBoolean("Lock all images", false, function (value) {
    lockImagesEnabled = value;
  });
  settImg.addRange("Image scale", 0.1, 2, pImgScale, 0.01, function (value) {
    if (
      displayImages.length > 0 &&
      currentImage >= 0 &&
      currentImage < displayImages.length
    ) {
      displayImages[currentImage].scale = value;
    }
  });

  settImg.addButton("Threshold filter", function (value) {
    displayImages[currentImage].image.filter(THRESHOLD);
  });

  settImg.addHTML(
    "Image rasterizer",
    "<div id=info-panel><b>Image transformer</b><br><br>Below you can transform your uploaded images into a selected shape.</div>"
  );
  settImg.addDropDown(
    "Transform to...",
    ["None", "Line", "Square", "Circle"],
    function (value) {
      if (value.value == "None") {
        rImgLineEnabled = false;
        rImgSquareEnabled = false;
        rImgCircleEnabled = false;
      } else if (value.value == "Line") {
        rImgLineEnabled = true;
        rImgSquareEnabled = false;
        rImgSquareEnabled = false;
      } else if (value.value == "Square") {
        rImgLineEnabled = false;
        rImgSquareEnabled = true;
        rImgCircleEnabled = false;
      } else if (value.value == "Circle") {
        rImgLineEnabled = false;
        rImgSquareEnabled = false;
        rImgCircleEnabled = true;
      }
    }
  );
  settImg.addButton("Random transformation", randomizeRImg);
  settImg.addRange(
    "Transformed image scale",
    0.1,
    2,
    rImgScale,
    0.01,
    function (value) {
      rImgScale = value;
    }
  );
  settImg.addRange("Detail", 5, 100, rImageDetail, 1, function (value) {
    rImageDetail = value;
  });
  settImg.addRange("Width", 1, 100, rIShiftX, 1, function (value) {
    rIShiftX = value;
  });
  settImg.addRange("Height", 1, 100, rIShiftY, 1, function (value) {
    rIShiftY = value;
  });
  settImg.addRange("Rotation", 10, 50, rIStrength, 1, function (value) {
    rIStrength = value;
  });
  settImg.addRange(
    "Width randomness",
    0,
    1,
    NOISErIShiftX,
    0.01,
    function (value) {
      NOISErIShiftX = value;
    }
  );
  settImg.addRange(
    "Height randomness",
    0,
    1,
    NOISErIShiftY,
    0.01,
    function (value) {
      NOISErIShiftY = value;
    }
  );
  settImg.addBoolean("Animate shapes", false, function (value) {
    rImageAnimateEnabled = value;
  });
  settImg.addRange(
    "Animation speed",
    0,
    0.01,
    NOISErISpeed,
    0.001,
    function (value) {
      NOISErISpeed = value;
    }
  );

  //////////////////////////////////////////// UI DRAW ////////////////////////////////////////////
  settDraw.addHTML(
    "About",
    "<div id=info-panel>Use your mouse to set the 4 vertices of a rectangle or to paint over the canvas!</div>"
  );
  settDraw.addBoolean("Enable shape drawing", false, function (value) {
    customShapeEnabled = value;
    if (value == false) {
      endDrawingShape();
    }
  });
  settDraw.addBoolean("White shapes", false, function (value) {
    invertShapeColor = value;
    if (value == true) {
      colorShape = 255;
    } else {
      colorShape = 0;
    }
  });
  settDraw.addButton("Set vertices", newShape);
  settDraw.addButton("Delete current shape", deleteCurrentShape);
  settDraw.addBoolean("Use brush", false, function (value) {
    brushCanvasEnabled = value;
  });
  settDraw.addBoolean("White stroke", false, function (value) {
    invertMarkerColor = value;
    if (value == true) {
      colorMarker = 255;
    } else {
      colorMarker = 0;
    }
  });
  settDraw.addRange(
    "Brush thickness",
    1,
    30,
    markerWeight,
    1,
    function (value) {
      markerWeight = value;
    }
  );
  settDraw.addButton("Delete all strokes", deleteMarker);

  //////////////////////////////////////////// UI TIPS ////////////////////////////////////////////
  settTips.addHTML(
    "Everything everywhere",
    "+ Don't be scared of playing with the randomize buttons! Use them as a starting point or if you feel stuck.<br><br>+ Just remember, there is no 'un-do' function, so depending on what you are randomizing, chances are you will never get to the same result again!"
  );
  settTips.addHTML(
    "Image transformation",
    "+ The transformed image looks best if you use portraits or motifs with clear shapes/minmal details.<br><br>+ Try inverting the colors if there is not enough contrast.<br><br>+ If you place the same image beneath the transformed image you will retain the general details!"
  );
  settTips.addHTML(
    "Text and .txt assets",
    "+ Use the text box to write a small paragraph or powerful headline.<br><br>+ If you plan on using larger pieces of text, upload them as a .txt file instead!"
  );

  //////////////////////////////////////////// UI ABOUT ////////////////////////////////////////////
  settCredits.addHTML(
    "About",
    "Developed by Francisco Gutiérrez Hardt (<a href='https://www.instagram.com/paco.hardt/'  target='_blank' >@paco.hardt</a>) as part of his bachelors degree Kommunikationsdesign at the University of Applied Sciences in Mannheim, Germany."
  );
  settCredits.addHTML(
    "Survey",
    "<a href='https://forms.gle/JSFGyZPM4DCnt1U96'>Share your thoughts!</a>"
  );

  settComp.hideTitle("About exp");
  settDraw.hideTitle("About");
  settImg.hideTitle("Image rasterizer");
  settText.hideTitle("About");
  settText.hideTitle(".txt assets");

  ////////////////////////////////////////// GENERATORS ////////////////////////////////////////
  generateImgPositions();
  randomizeMyTextPositions();
  randomizeTxtPositions();
  generateTxtFont();
  loadRandomImage();
  loadHipsterText();

  ////////////////////////////////////////// NOISE ////////////////////////////////////////////
  noiseGen = new NoiseGeneratorAnimation(3);
  noiseGen.animationspeed = NOISErISpeed;
  noiseGen.schrittweite[0] = NOISErIShiftX;
  noiseGen.schrittweite[1] = NOISErIShiftY;
  noiseGen.schrittweite[2] = NOISErIStrength;

  background(0);
}

function draw() {
  if (loading) {
    let shiftX = map(sin(radians(frameCount)), -1, 1, 125, 1000);
    let shiftY = map(cos(radians(frameCount)), -1, 1, 50, 1000);
    let t = map(cos(radians(frameCount * 2)), -1, 1, 0, 75);

    translate(width / 2, height / 2);
    stroke(255, t);
    noFill();
    ellipse(0, 0, shiftX, shiftY);
    noStroke();
    fill(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("Loading...", 0, 0);
  } else {
    clear();

    background(colorBg);
    poster.background(colorBg);

    placeImage(poster);
    rasterizeImage(poster);
    customShape(poster);
    drawTxt(poster);
    drawMyText(poster);
    drawGrid(poster);

    displayIntro(poster);
    displaySharePNG(poster);
    displayShareSVG(poster);
    imageWarning(poster);

    if (errorMsg != "") {
      poster.fill(255, 0, 0);
      poster.noStroke();
      poster.rect(0, 0, width, height);
      poster.fill(255);
      poster.textSize(20);
      poster.textLeading(20);
      poster.textAlign(CENTER, CENTER);
      poster.text(errorMsg, width / 2, height / 2);
    }

    image(poster, 0, 0);
    image(brushCanvas, 0, 0);
    if (mouseIsPressed && brushCanvasEnabled) {
      brushCanvas.stroke(colorMarker);
      brushCanvas.strokeWeight(markerWeight);
      brushCanvas.line(pmouseX, pmouseY, mouseX, mouseY);
    }

    if (currentIntro >= 7 && !panelsVisible) {
      panelsVisible = true;
      settTips.show();
      settComp.show();
      settAssets.show();
      settText.show();
      settImg.show();
      settDraw.show();
      settCredits.show();

      let base64BOX = boxEmpty.canvas.toDataURL();
      let base64CHK = boxChk.canvas.toDataURL();

      let style = document.createElement("style");
      style.innerHTML = `
    .qs_checkbox span {
        background: url(${base64BOX}) no-repeat;
    }
.qs_checkbox input:checked+span {
        background: url(${base64CHK}) no-repeat;
    }
  `;
      document.head.appendChild(style);
    } else if (currentIntro < 7 && panelsVisible) {
      panelsVisible = false;
      settTips.hide();
      settAssets.hide();
      settComp.hide();
      settText.hide();
      settImg.hide();
      settDraw.hide();
      settCredits.hide();
    }
  }
}
