////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// PLACE image ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function placeImage(canvas) {
  calculateDimensions();

  if (!hideImages && displayImages.length > 0) {
    canvas.push();
    for (let i = 0; i < displayImages.length; i++) {
      const imgObj = displayImages[i];

      canvas.push();
      canvas.translate(imgObj.x, imgObj.y);

      if (imgObj === imgDragged) {
        imgDragged.x = mouseX - imgOffsetX;
        imgDragged.y = mouseY - imgOffsetY;
      }

      canvas.scale(imgObj.scale);
      canvas.image(imgObj.image, 0, 0, imgObj.image.width, imgObj.image.height);
      canvas.pop();

      const scaledWidth = imgObj.image.width * imgObj.scale;
      const scaledHeight = imgObj.image.height * imgObj.scale;

      if (
        mouseX >= imgObj.x &&
        mouseX <= imgObj.x + scaledWidth &&
        mouseY >= imgObj.y &&
        mouseY <= imgObj.y + scaledHeight
      ) {
        cursor("grab");
      } else {
        cursor(ARROW);
      }
    }

    canvas.pop();
  }

  if (randomImg) {
    canvas.image(randomImg, randomImageX, randomImageY);
  }
}

function randomizePImg() {
  generateImgPositions();
  for (let i = 0; i < displayImages.length; i++) {
    const imgObj = displayImages[i];
    imgObj.scale = random(0.05, 1);
    updateScaleSliders();
  }
  addMoreImages = random(1) < 0.5;
  if (addMoreImages) {
    loadRandomImage();
    addMoreImages = false;
  }
}

function generateImgPositions() {
  for (let i = 0; i < displayImages.length; i++) {
    if (displayImages[i]) {
      displayImages[i].x =
        floor(random(1, columns + 1)) * cellWidth + currentMarginW;
      displayImages[i].y =
        floor(random(1, rows + 1)) * cellHeight + currentMarginH;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// RASTER image ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function rasterizeImage(canvas) {
  calculateDimensions();

  if (
    (rImgLineEnabled || rImgSquareEnabled || rImgCircleEnabled) &&
    rasterizedImages.length > 0 &&
    currentImage >= 0 &&
    currentImage < rasterizedImages.length
  ) {
    noiseGen.animationspeed = NOISErISpeed;
    noiseGen.schrittweite[0] = NOISErIShiftX;
    noiseGen.schrittweite[1] = NOISErIShiftY;
    noiseGen.schrittweite[2] = NOISErIStrength;

    let rImgObj = rasterizedImages[currentImage];

    let scaledWidth = rImgScale * rImgObj.width;
    let scaledHeight = rImgScale * rImgObj.height;

    let resizedImg = rImgObj.get();
    resizedImg.resize(scaledWidth, scaledHeight);

    canvas.push();
    canvas.translate(canvas.width / 2, canvas.height / 2);

    let tiles = rImageDetail;
    let tileW = canvas.width / tiles;
    let tileH = canvas.height / tiles;

    noiseGen.zeroY();
    for (let x = 0; x < tiles; x++) {
      noiseGen.updateY();
      noiseGen.zeroX();
      for (let y = 0; y < tiles; y++) {
        noiseGen.updateX();
        let c = resizedImg.get(x * tileW, y * tileH);
        let shiftX = noiseGen.mod(0, -rIShiftX, rIShiftX);
        let shiftY = noiseGen.mod(1, -rIShiftY, rIShiftY);
        let sW = noiseGen.mod(2, 0.5, rIStrength);

        canvas.push();
        canvas.translate(
          x * tileW - canvas.width / 2,
          y * tileH - canvas.height / 2
        );
        canvas.noStroke();
        canvas.fill(c);
        canvas.rotate(radians(sW * 12));

        if (rImgSquareEnabled) {
          canvas.rect(0, 0, shiftX * 3, shiftY * 3);
        } else if (rImgLineEnabled) {
          canvas.noFill();
          canvas.stroke(c);
          canvas.strokeWeight(sW);
          canvas.line(0, 0, shiftX, shiftY);
        } else if (rImgCircleEnabled) {
          canvas.ellipse(0, 0, shiftX * 3, shiftY * 3);
        }

        canvas.pop();
      }
    }
    canvas.pop();
  }

  if (rImageAnimateEnabled) {
    noiseGen.updateAnimation();
  }
}

function randomizeRImg() {
  if (
    (rImgLineEnabled || rImgSquareEnabled || rImgCircleEnabled) &&
    rasterizedImages.length > 0 &&
    currentImage >= 0 &&
    currentImage < rasterizedImages.length
  ) {
    rImageDetail = random(100);
    rImgScale = random(1);
    rIShiftX = random(100);
    rIShiftY = random(100);
    rIStrength = random(45);
    NOISErIShiftX = random(1);
    NOISErIShiftY = random(1);
    NOISErIStrength = random(1);
    updateImgSettings();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// RANDOM IMAGE ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function loadRandomImage() {

  fetch("https://picsum.photos/720/720?grayscale")
    .then((response) => {
      if (!response.ok) {
        errorMsg +=
          "Sorry, there was a problem fetching the image!\nPlease restart";
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      imageURL = URL.createObjectURL(blob);
      const randomImg = createImg(imageURL, "Random Image");

      randomImg.addClass("img_ui");
      randomImg.id(`storedImg${imageCounter}`);
      const randomImageX =
        floor(random(1, columns + 1)) * cellWidth + currentMarginW;
      const randomImageY =
        floor(random(1, rows + 1)) * cellHeight + currentMarginH;
      randomImg.hide();

      allImagesHTML += `<img id='storedImg${imageCounter}' class='img_ui' src='${imageURL}' style='width:15%; padding:2px;'></img>`;

      settAssets.setValue("Images", allImagesHTML);
      highlightSelectedImage(currentImage);

      displayImages.push({
        image: randomImg,
        x: randomImageX,
        y: randomImageY,
        scale: 1,
      });

      loadImage(imageURL, (img) => {
        rasterizedImages.push(img);
        updateScaleSliders();
      });
    })
    .catch((error) => {
      console.error("There was a problem fetching the image:", error);
      errorMsg +=
        "Sorry, there was a problem fetching the image!\nPlease restart";
    });
  
  currentImage++;
  imageCounter++;
}

function reloadRandomImage() {
  if (displayImages.length > 0) {
    // Remove the current image from the HTML field
    const currentStoredImg = document.getElementById(
      `storedImg${currentImage}`
    );
    if (currentStoredImg) {
      fetch("https://picsum.photos/720/720?grayscale")
        .then((response) => {
          if (!response.ok) {
            errorMsg +=
              "Sorry, there was a problem fetching the image!\nPlease restart";
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          imageURL = URL.createObjectURL(blob);
          currentStoredImg.src = imageURL; // Set the new image source

          // Update the image source in the displayImages array
          displayImages[currentImage].image.elt.src = imageURL;
        })
        .catch((error) => {
          console.error("There was a problem fetching the image:", error);
          errorMsg +=
            "Sorry, there was a problem fetching the image!\nPlease restart";
        });
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// CONTROLS /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function highlightSelectedImage(index) {
  allImages = document.getElementsByClassName("img_ui");

  for (let i = 0; i < allImages.length; i++) {
    allImages[i].style.transform = "scale(0.7)";
    allImages[i].style.border = "2px solid transparent";
  }

  if (index >= 0 && index < allImages.length) {
    allImages[index].style.filter = "brightness(100%)";
    allImages[index].style.transform = "scale(1)";
    allImages[index].style.border = "2px solid #255dbb";
  }
}

function nextImage() {
  currentImage++;
  highlightSelectedImage(currentImage);

  if (currentImage >= displayImages.length) {
    currentImage = 0;
    updateScaleSliders();
    highlightSelectedImage(currentImage);
  }

  if (displayImages.length >= 1) {
    rImgObj = rasterizedImages[currentImage];
    if (rImgObj) {
      currentImageWidth = rImgObj.width;
      currentImageHeight = rImgObj.height;
    }
  }

  updateScaleSliders();
}

function deleteSelectedImage(index) {
  const deletedImage = document.getElementById(`storedImg${index}`);
  if (deletedImage) {
    deletedImage.remove();
  }

  let updatedImagesHTML = "";
  for (let i = 0; i < displayImages.length; i++) {
    if (i !== index) {
      updatedImagesHTML += `<img id='storedImg${i}' class='img_ui' src='${displayImages[i].image.elt.src}' style='width:15%; padding:2px;'></img>`;
    }
  }

  allImagesHTML = updatedImagesHTML;
  settAssets.setValue("Images", allImagesHTML);
  highlightSelectedImage(currentImage);
}

function deleteImage() {
  if (displayImages.length > 0) {
    const currentIndex = currentImage;
    deleteSelectedImage(currentIndex);
    displayImages.splice(currentIndex, 1);
    rasterizedImages.splice(currentIndex, 1);
    imageCounter--;
    if (currentImage >= displayImages.length) {
      currentImage = displayImages.length - 1;
      imageCounter = currentImage;
    }
    highlightSelectedImage(currentImage);
    updateScaleSliders();
  }

  if (rasterizedImages.length > 0 && currentImage >= displayImages.length) {
    currentImage = displayImages.length - 1;
    rImgObj = rasterizedImages[currentImage];
    currentImageWidth = rImgObj.width;
    currentImageHeight = rImgObj.height;
    updateScaleSliders();
  } else {
    // Reset settings if no images exist
    rImgLineEnabled = false;
    rImgSquareEnabled = false;
    rImgCircleEnabled = false;
    rImageAnimateEnabled = false;
    hideImages = false;
    rImgObj = null;
    currentImageWidth = 0;
    currentImageHeight = 0;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// OTHER ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function imageWarning(canvas) {
  if (
    ((rImgLineEnabled ||
      rImgSquareEnabled ||
      rImgCircleEnabled ||
      rImageAnimateEnabled) &&
      displayImages.length === 0) ||
    (hideImages && displayImages.length === 0)
  ) {
    canvas.push();
    canvas.translate(0, 0);
    canvas.imageMode(CENTER);
    canvas.image(scrError, 0.5 * width, 0.5 * height);
    canvas.pop();

    if (mouseIsPressed) {
      hideImages = false;
      rImgLineEnabled = false;
      rImgSquareEnabled = false;
      rImgCircleEnabled = false;
      rImageAnimateEnabled = false;
      //updateCheckboxState();
    }
  }
}

class NoiseGeneratorAnimation {
  constructor(_anz) {
    this.anz = _anz;
    this.xoff = new Array(this.anz);
    this.yoff = new Array(this.anz);
    this.schrittweite = new Array(this.anz);
    this.animation = 0;
    this.animationspeed = 0;
  }

  updateAnimation() {
    this.animation += this.animationspeed;
  }

  zeroY() {
    for (let n = 0; n < this.anz; n++) {
      this.yoff[n] = this.animation;
    }
  }

  updateY() {
    for (let n = 0; n < this.anz; n++) {
      this.yoff[n] += this.schrittweite[n];
    }
  }

  zeroX() {
    for (let n = 0; n < this.anz; n++) {
      this.xoff[n] = this.animation;
    }
  }

  updateX() {
    for (let n = 0; n < this.anz; n++) {
      this.xoff[n] += this.schrittweite[n];
    }
  }

  mod(index, minOutput, maxOutput) {
    return map(
      noise(this.xoff[index], this.yoff[index]),
      0,
      1,
      minOutput,
      maxOutput
    );
  }
}
