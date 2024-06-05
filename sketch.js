function loaded() {
  loadedAssets++;

  if (loadedAssets === totalAssets) {
    loading = false;
  }
}

function setup() {
  boxEmpty = loadImage("box-empty.webp", loaded);
  boxChk = loadImage("box-chckd.webp", loaded);

  for (let i = 0; i < fontPaths.length; i++) {
    setFont[i] = loadFont(fontPaths[i], loaded);
  }

  calculateDimensions();

  mainC = createCanvas(adjustedCanvasWidth, adjustedCanvasHeight);
  poster = createGraphics(adjustedCanvasWidth, adjustedCanvasHeight);
  brushCanvas = createGraphics(adjustedCanvasWidth, adjustedCanvasHeight);
  svgCanvas = createGraphics(adjustedCanvasWidth, adjustedCanvasHeight, SVG);

  if (isMobileDevice()) {
    displayWarning();
  } else {
    svgCanvas.clear();
    poster.clear();
    brushCanvas.clear();

    mainC.drop(gotFile);

    //////////////////////////////////////////// UI settings ////////////////////////////////////////////

    settComp = QuickSettings.create(20, 100, "Canvas");
    settText = QuickSettings.create(20, 140, "Text");
    settPattern = QuickSettings.create(20, 180, "Type Pattern");
    settImg = QuickSettings.create(20, 220, "Image");
    settDraw = QuickSettings.create(20, 260, "Draw");
    settAbout = QuickSettings.create(20, 300, "About");
    settAssets = QuickSettings.create(20, 340, "Assets");

    settComp.hide();
    settText.hide();
    settPattern.hide();
    settImg.hide();
    settDraw.hide();
    settAbout.hide();
    settAssets.hide();

    settComp.collapse();
    settText.collapse();
    settPattern.collapse();
    settImg.collapse();
    settDraw.collapse();
    settAbout.collapse();
    settAbout.setHeight(230);
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
    settComp.addButton("Export Poster", function () {
      exportPoster();
      const variableData = exportVariables();
      saveStrings(variableData.split("\n"), "my-poster_settings.txt");
    });
    settComp.addHTML(
      "Background Color",
      "<div><input type='color' id='bgPicker' name='head' value='#ffffff'/></div>"
    );
    settComp.addButton("Generate Poster", randomAll);
    settComp.addButton("Generate Layout", generateGrid);
    settComp.addRange("Margin Width", 0.7, 1, mW, 0.01, function (value) {
      mW = value;
      txtFiles.forEach((txt) => {
        if (txt) {
          updateTextPosition(txt);
        }
      });
      updateTextPosition(myTextObj);
      displayImages.forEach((img) => {
        if (img) {
          updateImagePosition(img);
        }
      });
    });
    settComp.addRange("Margin Height", 0.7, 1, mH, 0.01, function (value) {
      mH = value;
      txtFiles.forEach((txt) => {
        if (txt) {
          updateTextPosition(txt);
        }
      });
      updateTextPosition(myTextObj);
      displayImages.forEach((img) => {
        if (img) {
          updateImagePosition(img);
        }
      });
    });
    settComp.addRange("Gutter", 0, 50, gridGutter, 0.1, function (value) {
      gridGutter = value;
    });
    settComp.addBoolean("Show Baseline Grid", true, function (value) {
      showBaselineGrid = value;
    });
    settComp.addBoolean("Show Layout Grid", showLayoutGrid, function (value) {
      showLayoutGrid = value;
    });
    settComp.addBoolean("Show Rows", showRows, function (value) {
      if (value) {
        showRows = true;
        showColumns = false;
        showLayoutGrid = false;
        settComp.setValue("Show Columns", false);
        settComp.setValue("Show Layout Grid", false);
      } else {
        showRows = false;
        if (!showColumns) {
          showLayoutGrid = true;
          settComp.setValue("Show Layout Grid", true);
        }
      }
    });
    settComp.addBoolean("Show Columns", showColumns, function (value) {
      if (value) {
        showColumns = true;
        showRows = false;
        showLayoutGrid = false;
        settComp.setValue("Show Rows", false);
        settComp.setValue("Show Layout Grid", false);
      } else {
        showColumns = false;
        if (!showRows) {
          showLayoutGrid = true;
          settComp.setValue("Show Layout Grid", true);
        }
      }
    });
    settComp.addRange("Rows", 2, 10, rows, 1, function (value) {
      rows = value;
    });
    settComp.addRange("Columns", 2, 12, columns, 1, function (value) {
      columns = value;
    });

    /////////////////////////////////////////// UI PATTERN ///////////////////////////////////////////
    settPattern.addDropDown(
      "Select pattern",
      ["None", "Radial", "Vertical"],
      function (value) {
        if (value.value == "None") {
          radialPatternEnabled = false;
          verticalPatternEnabled = false;
        } else if (value.value == "Radial") {
          radialPatternEnabled = true;
          verticalPatternEnabled = false;
        } else if (value.value == "Vertical") {
          radialPatternEnabled = false;
          verticalPatternEnabled = true;
        }
      }
    );
    settPattern.addText("Type here", "", function (value) {
      patternText = value;
    });
    settPattern.addBoolean("Hide pattern", false, function (value) {
      hidePattern = value;
    });
    settPattern.addHTML(
      "Pattern Color",
      "<div><input type='color' id='pnPicker' name='head' value='#000000'/></div>"
    );
    settPattern.addBoolean("Animate Rotation", false, function (value) {
      animatePattRot = value;
      if (!animatePattRot) {
        stopFrame = frameCount;
      }
    });
    settPattern.addBoolean("Animate Size", false, function (value) {
      animatePattSiz = value;
      if (!animatePattSiz) {
        stopFrame = frameCount;
      }
    });
    settPattern.addRange("Offset X", 0, 1, 0.5, 0.01, function (value) {
      patternOffX = value;
    });
    settPattern.addRange("Offset Y", 0, 1, 0.5, 0.01, function (value) {
      patternOffY = value;
    });
    settPattern.addButton("Randomize font", generatePatternFont);
    settPattern.addButton("Randomize pattern", generatePattern);
    settPattern.addRange("Position X", 0, width, 20, 1, function (value) {
      patternPosX = value;
    });
    settPattern.addRange("Position Y", 0, height, 20, 1, function (value) {
      patternPosY = value;
    });
    settPattern.addRange("Size", 5, 500, 10, 1, function (value) {
      patternSize = value;
    });
    settPattern.addRange("Shape", 0, 1000, 50, 1, function (value) {
      patternRadius = value;
    });
    settPattern.addRange("Detail", 1, 500, 12, 1, function (value) {
      patternDetail = value;
    });
    settPattern.addRange("Speed", 0, 1, 0.12, 0.01, function (value) {
      patternSpeed = value;
    });
    settPattern.addRange("Length", 0, 1000, 50, 1, function (value) {
      patternLength = value;
    });
    settPattern.addRange("Spacing", -500, 1000, 0, 1, function (value) {
      patternSpacing = value;
    });
    settPattern.addRange("Rotation", 0, 360, 0, 1, function (value) {
      patternRotation = value;
    });

    settPattern.hideControl("Shape");
    settPattern.hideControl("Position X");
    settPattern.hideControl("Position Y");
    settPattern.hideControl("Offset X");
    settPattern.hideControl("Offset Y");

    //////////////////////////////////////////// UI TEXT ////////////////////////////////////////////
    settText.addButton("Randomize all texts", randomAllTexts);
    settText.addBoolean("Lock all texts", false, function (value) {
      lockTextEnabled = value;
    });
    settText.addHTML(
      "About",
      "<div id=info-panel>Below you can write your own text and display it. Use the different controls to give it a bit more personality! <br><br>Scroll to find more controls. ⬇</div>"
    );
    settText.addBoolean("Display written text", true, function (value) {
      showMyText = value;
    });
    settText.addHTML(
      "Text Color",
      "<div><input type='color' id='tyPicker' name='head' value='#000000'/></div>"
    );
    settText.addTextArea("Write here", myText, function (value) {
      showMyText = value;
      myText = value;
      myTextMaxWidth = calculateMyTextMaxWidth(myText);
    });
    settText.addButton("Randomize position", generateMyTextPositions);
    settText.addButton("Randomize font", generateMyTextFont);
    settText.addButton("Randomize everything", randomizeMyText);
    settText.addRange("Size", 20, 1000, myTextSize, 1, function (value) {
      myTextSize = value;
    });
    settText.addRange(
      "Line spacing",
      0,
      1000,
      myTextLeading,
      0.1,
      function (value) {
        myTextLeading = value;
      }
    );
    settText.addRange(
      "Character spacing",
      -500,
      500,
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
    settText.addHTML(
      ".txt Color",
      "<div><input type='color' id='txPicker' name='head' value='#000000'/></div>"
    );
    settText.addButton("Randomize positions (.txt)", generateTxtPositions);
    settText.addButton("Randomize fonts (.txt)", generateTxtFont);
    settText.addButton("Chaos", randomizeTxt);
    settText.addBoolean("Hide .txt", false, function (value) {
      hideTxt = value;
    });
    settText.addRange("Length (.txt)", 10, 500, txtBreak, 1, function (value) {
      txtBreak = value;
      regenerateText();
    });
    settText.addRange("Size (.txt)", 10, 1000, txtSize, 1, function (value) {
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
      1000,
      txtLead,
      0.1,
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
    settImg.addBoolean("Hide all images", false, function (value) {
      hideImages = value;
    });
    settImg.addBoolean("Lock all images", false, function (value) {
      lockImagesEnabled = value;
    });
    settImg.addButton("Randomize all positions", generateImgPositions);
    settImg.addRange("Image scale", 0.1, 2, pImgScale, 0.01, function (value) {
      if (
        displayImages.length > 0 &&
        currentImage >= 0 &&
        currentImage < displayImages.length
      ) {
        displayImages[currentImage].scale = value;
      }
    });

    settImg.addButton("Threshold my image", function (value) {
      if (displayImages[currentImage].uploaded) {
        displayImages[currentImage].image.filter(THRESHOLD);
      }
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
    settDraw.addHTML(
      "Shapes Color",
      "<div><input type='color' id='shPicker' name='head' value='#ffffff'/></div>"
    );
    settDraw.addButton("Set vertices", newShape);
    settDraw.addButton("Delete current shape", deleteCurrentShape);
    settDraw.addBoolean("Use brush", false, function (value) {
      brushCanvasEnabled = value;
    });
    settDraw.addHTML(
      "Brush Color",
      "<div><input type='color' id='brPicker' name='head' value='#ffffff'/></div>"
    );
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

    //////////////////////////////////////////// UI ABOUT ////////////////////////////////////////////
    settAbout.addHTML(
      "Credits",
      "Developed by Francisco Gutiérrez Hardt (<a href='https://www.instagram.com/paco.hardt/'  target='_blank' >@paco.hardt</a>) as part of his bachelors degree Kommunikationsdesign at the University of Applied Sciences in Mannheim, Germany."
    );

    settAbout.addHTML(
      "Everything everywhere",
      "+ Don't be scared of playing with the randomize buttons! Use them as a starting point or if you feel stuck.<br><br>+ Just remember, there is no 'un-do' function, so depending on what you are randomizing, chances are you will never get to the same result again!"
    );
    settAbout.addHTML(
      "Image transformation",
      "+ The transformed image looks best if you use portraits or motifs with clear shapes/minmal details.<br><br>+ Try inverting the colors if there is not enough contrast.<br><br>+ If you place the same image beneath the transformed image you will retain the Canvas details!"
    );
    settAbout.addHTML(
      "Text and .txt assets",
      "+ Use the text box to write a small paragraph or powerful headline.<br><br>+ If you plan on using larger pieces of text, upload them as a .txt file instead!"
    );

    settDraw.hideTitle("About");
    settImg.hideTitle("Image rasterizer");
    settText.hideTitle("About");
    settText.hideTitle(".txt assets");

    ////////////////////////////////////////// GENERATORS ////////////////////////////////////////
    generateImgPositions();
    generateMyTextPositions();
    generateTxtPositions();
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

    let colorPicker = document.getElementById("bgPicker");
    if (colorPicker != null) {
      colorBg = colorPicker.value;
    }

    background(colorBg);
    poster.background(colorBg);
    drawPattern(poster);
    placeImage(poster);
    rasterizeImage(poster);
    customShape(poster);
    drawTxt(poster);
    drawMyText(poster);
    drawGrid(poster);
    displayIntro(poster);
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
      let brushPicker = document.getElementById("brPicker");
      if (brushPicker != null) {
        colorMarker = brushPicker.value;
      }
      brushCanvas.stroke(colorMarker);
      brushCanvas.strokeWeight(markerWeight);
      brushCanvas.line(pmouseX, pmouseY, mouseX, mouseY);
    }

    if (radialPatternEnabled) {
      settPattern.showControl("Shape");
      settPattern.hideControl("Position X");
      settPattern.hideControl("Position Y");
      settPattern.hideControl("Offset X");
      settPattern.hideControl("Offset Y");
    }
    if (verticalPatternEnabled) {
      settPattern.showControl("Position X");
      settPattern.showControl("Position Y");
      settPattern.showControl("Offset X");
      settPattern.showControl("Offset Y");
      settPattern.hideControl("Shape");
    }

    if (currentIntro >= 4 && !panelsVisible) {
      panelsVisible = true;
      settComp.show();
      settAssets.show();
      settText.show();
      settImg.show();
      settPattern.show();
      settDraw.show();
      settAbout.show();

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
    } else if (currentIntro < 4 && panelsVisible) {
      panelsVisible = false;
      settAssets.hide();
      settComp.hide();
      settText.hide();
      settImg.hide();
      settPattern.hide();
      settDraw.hide();
      settAbout.hide();
    }
  }

  if (isMobileDevice()) {
    loading = false;
    displayWarning();
  }
}
