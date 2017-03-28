//Pixel Art Exporter
//By Henry Heffernan
var doc = app.activeDocument;
var docLayers = [];
var docLayers = getLayers(doc, docLayers);

//Laptop directory
var laptopDir = "C:/Storage/Programming/Photoshop Scripts/Test Exports";
//Desktop directory
var desktopDir = "D:/Programming/Photoshop Scripts/Test Exports";

var varients = ["legs", "arms"];
multiPartExportFrames(docLayers, "running", varients, desktopDir);

function getLayers(doc, docLayers) {
    for (var m = 0; m < doc.layers.length; m++) {
        var curLayer = doc.layers[m];
        if (curLayer.typename == "ArtLayer") {
            docLayers.push(curLayer);
        } else {
            getLayers(curLayer, docLayers);
        }
    }
    return docLayers;
}

function formatVisibilty(docLayers, animationName, varient) {
    for (var i = 0; i < docLayers.length; i++) {
        var docName = "[Document " + doc.name + "]";
        var prevParent = docLayers[i];
        var parent = prevParent.parent;
        goToFrame(1);
        if (parent == docName) {
            prevParent.visible = false;
            continue;
        }
        while (parent.parent != docName) {
            var temp = parent;
            parent = parent.parent;
            prevParent = temp;
        }
        alert("Parent: " + parent + " | PrevParent: " + prevParent);
        if (parent == "[LayerSet " + animationName + "]") {
            parent.visible = true;
            if (varient != null || varient != undefined || varient != "") {
                if (prevParent == "[LayerSet " + varient + "]") {
                    prevParent.visible = true;
                } else {
                    prevParent.visible = false;
                }
            } else {
                continue;
            }
        } else {
            parent.visible = false;
        }
    }
}

function getFrameCount() {
    var count = 1;
    while (goToFrame(count) != false) {
        count++;
    }
    return count - 1;
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

function multiPartExportFrames(docLayers, animationName, varients, baseDir) {
    for (var i = 0; i < varients.length; i++) {
        formatVisibilty(docLayers, animationName, varients[i]);
        exportFrames(animationName + "_" + varients[i], baseDir);
    }
}

function exportFrames(animationName, baseDir) {
    var frameCount = getFrameCount();
    exportFolder = Folder(baseDir + "/" + animationName);
    if (!exportFolder.exists) exportFolder.create();
    for (var i = 1; i <= frameCount; i++) {
        goToFrame(i);
        var pngFile = File(baseDir + "/" + animationName + "/" + animationName + "_" + i + ".png");
        doc.saveAs(pngFile, new PNGSaveOptions(), true, Extension.LOWERCASE);
    }
}
