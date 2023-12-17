////// GENERAL
let mainC;
let posterWidth = 752;
let posterHeight = 1065;
let colorBg = 255;
let svgCanvas;
let poster;
let date, year, month, day, hour, minute, filename;
let scaleFactor = 0.95;
let adjustedHeight;
let proportionalWidth;
let settComp;
let settText;
let settImg;
let settDraw;
let settExport;
let settCredits;
let settTips;
let settAssets;
let showIntro = true;
let showSharePNG = false;
let showShareSVG = false;
let scrIntro1, scrIntro2, scrIntro3, scrIntro4, scrIntro5;
let scrIntro = [];
let currentIntro = 1;
let invertBgColor = false;
let loading = true;
let loadedAssets = 0;
let totalAssets = 13; 
let errorMsg = '';
let panelsVisible = false; 

////// MARKER
let brushCanvas;
let brushCanvasEnabled = false;
let invertMarkerColor = false;
let colorMarker = 0;
let markerWeight = 20;

////// GRID
let showGridEnabled = true;
let currentMarginW, currentMarginH;
let cellWidth, cellHeight;
let rows = 52;
let columns = 5;
let mW = 0.93;
let mH = 0.92;

////// MY TEXT
let showMyText = true;
let myTextFontIndex = 1;
let myText = "";
let myTextSize = 20;
let myTextLeading = 20;
let myTextKerning = 0;
let isDraggingMyText = false;
let myTextDragged = null;
let myTextDraggedX, myTextDraggedY;
let myText0ffsetX, myText0ffsetY;
let myTextObj = { text: " ", x: 0, y: 0 };
let myTextMaxWidth = 0;
let lines, lineWidth;

////// .TXT 
let percentageToShow = 50;
let totalWidt = 0;
let txtPosX, txtPosY;
let storedXPositions = [];
let storedYPositions = [];
let txtBreak = 20;
let allTextsHTML = '';
let allTexts;
let textCounter = -1;
let randomText = '';
let invertTextColor = false;
let maxFonts = 10;
let setFont = new Array(maxFonts);
let fontPaths = [
  "fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf",
  "fonts/IBM_Plex_Mono/IBMPlexMono-Italic.ttf",
  "fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf",
  "fonts/Agbalumo/Agbalumo-Regular.ttf",
  "fonts/Old_Standard_TT/OldStandardTT-Bold.ttf",
  "fonts/Old_Standard_TT/OldStandardTT-Italic.ttf",
  "fonts/Old_Standard_TT/OldStandardTT-Regular.ttf",
  "fonts/Open_Sans/OpenSans_Condensed-Regular.ttf",
  "fonts/Open_Sans/OpenSans_Condensed-Bold.ttf",
  "fonts/Open_Sans/OpenSans-Bold.ttf",
  "fonts/Open_Sans/OpenSans-Regular.ttf",
  "fonts/Vina_Sans/VinaSans-Regular.ttf",
];
let txtFontIndex = 1;
let maxTextFiles = 3;
let hideTxt = false;
let isDraggingTxt = false;
let lockTextEnabled = false;
let txtDragged = null;
let currentText = 0;
let selectedText;
let txtSize = 20;
let txtLead = 20;
let colorType = 0;
let txtFiles = [];
let txtOffsetX, txtOffsetY;


////// NOISE
let noiseGen;
let NOISErIShiftX = 0.07;
let NOISErIShiftY = 0.085;
let NOISErIStrength = 1;
let NOISErISpeed = 0.005;

////// IMAGE
let allImagesHTML = "";
let randomImages = [];
let imageCounter = 0;
let allImages;
let addMoreImages = false;
let imageURL;
let randomImg;
let randomImageX, randomImageY;
let applyThresholdFilter = false; 
let hideImages = false;
let displayImages = [];
let currentImage = -1;
let pImgScale = 1;
let rasterizedImages = [];
let rImgScale = 1;
let rImgLineEnabled = false;
let rImgSquareEnabled = false;
let rImgCircleEnabled = false;
let rImageAnimateEnabled = false;
let rImageDetail = 20;
let rIShiftX = 50;
let rIShiftY = 50;
let rIStrength = 10;
let isDraggingImage = false;
let imgDragged = null;
let imgOffsetX, imgOffsetY;
let lockImagesEnabled = false;
let rImgObj;
let currentImageWidth;
let currentImageHeight;
let scaledWidth;
let scaledHeight;

////// SHAPES
let customShapeEnabled = false;
let startNewShape = false;
let invertShapeColor = false;
let shapes = [];
let currentShape = [];
let colorShape = 0;
