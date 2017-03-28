//Pixel Art Exporter
//By Henry Heffernan

var doc = app.activeDocument;
var docLayers = [];
var docLayers = getLayers(doc, docLayers);

//Laptop directory
var laptopDir = "C:/Storage/Programming/Photoshop Scripts/Test Exports";
//Desktop directory
var desktopDir = "D:/Storage/Programming/Photoshop Scripts/Test Exports"
//exportFrames("test", "C:/Storage/Programming/Photoshop Scripts/Test Exports");
alert("Doc layers: " + docLayers)

function getLayers (doc, docLayers){
    for (var m = 0; m < doc.layers.length; m++){
        var curLayer = doc.layers[m];
        if (curLayer.typename == "ArtLayer"){
            docLayers.push(curLayer);
        }else{
            getLayers(curLayer, docLayers);
        }
    }
    return docLayers;
}

function getFrameCount() {
    var k = 1;
    while (goToFrame(k) != false) {
        k++;
    }
    return k - 1;
}

function goToFrame(jumpToFrame) {
    try {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIndex(stringIDToTypeID("animationFrameClass"), jumpToFrame);
        desc.putReference(charIDToTypeID("null"), ref);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
        return true;
    } catch (e) {}
    return false;
}


function multipleExportFrames(animationName, varients, baseDir){
    for(var i = 0; i < varients.length; i++){
        // TODO
        // formatVisibilty(varients[i]);
        // formatCanvas(varients[i])
        exportFrames(animationName + "_" + varients[i], baseDir);
    }
}

function exportFrames(animationName, baseDir){
    var frameCount = getFrameCount();
    exportFolder = Folder(baseDir + "/" + animationName);
    if(!exportFolder.exists) exportFolder.create();
    for(var i = 1; i <= frameCount; i++){
        goToFrame(i);
        var pngFile =   File(baseDir + "/" + animationName + "/" + animationName + "_" + i + ".png");
        doc.saveAs(pngFile, new PNGSaveOptions(), true, Extension.LOWERCASE);
    }
}
