//Pixel Art Exporter
//By Henry Heffernan
var doc = app.activeDocument;
var docLayers = [];
var docLayers = getLayers(doc, docLayers);

//Laptop directory
var laptopDir = "C:/Storage/Programming/Photoshop Scripts/Test Exports";
//Desktop directory
var desktopDir = "C:/Users/Henry Heffernan/Photoshop Exports";

getValidAnimations(docLayers, function(splitAnimations, regularAnimations) {
    generateWinGUI(splitAnimations, regularAnimations, function(returnString) {
        var toExport = [];
        var res =
            "dialog { alignChildren: 'fill', \
              info: Panel {orientation: 'column', alignChildren:'Right', \
                  text:'Avalible Animations for Export', \
                  animations: Group {orientation: 'column', alignment:'center', \ " +
            returnString +
            "} \
              } \
              buttons: Group {orientation: 'row', alignment: 'center', \
                  okBtn: Button {text: 'Export' },\
                  cancelBtn: Button {text: 'Cancel', properties: {name:'cancel'} },\
              } \
          }";
        win = new Window(res);
        win.buttons.okBtn.onClick = function() {
            var toExport
            for (var i = 0; i < win.info.animations.children.length; i++) {
                if (win.info.animations.children[i].value == true) {
                    var text = win.info.animations.children[i].text
                    for (var j = 0; j < regularAnimations.length; j++) {
                        if (text == regularAnimations[j].name) {
                            exportComplete(docLayers, regularAnimations[j].name, null, desktopDir);
                        }
                    }
                    for (var j = 0; j < splitAnimations.length; j++) {
                        for (var k = 0; k < splitAnimations[j].layerSets.length; k++) {
                            if (text == splitAnimations[j].name + " " + splitAnimations[j].layerSets[k].name) {
                                exportComplete(docLayers, splitAnimations[j].name, splitAnimations[j].layerSets[k].name, desktopDir);
                            }
                        }
                    }
                }
            }
        }
        win.center();
        win.show();
    });
});

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

function generateWinGUI(splitAnimations, regularAnimations, callback) {
    var returnString = "";
    for (var i = 0; i < regularAnimations.length; i++) {
        returnString += "regularCb: Checkbox {text: '" + regularAnimations[i].name + "'}, \ ";
    }
    for (var i = 0; i < splitAnimations.length; i++) {
        var varients = "";
        for (var j = 0; j < splitAnimations[i].layerSets.length; j++) {
            varients += "peiceCb: Checkbox {text: '" + splitAnimations[i].name + " " + splitAnimations[i].layerSets[j].name + "'}, \ ";
        }
        returnString += varients;
    }
    callback(returnString);
}

function getValidAnimations(docLayers, callback) {
    var parents = [];
    var regularAnimations = [];
    var splitAnimations = [];
    for (var i = 0; i < docLayers.length; i++) {
        var docName = "[Document " + doc.name + "]";
        var parent = docLayers[i].parent;
        if (parent == docName) {
            docLayers[i].visible = false;
            continue;
        }
        while (parent.parent != docName) {
            parent = parent.parent;
        }
        if (!inArray(parent, parents)) {
            parents.push(parent);
        }
    }
    for (var i = 0; i < parents.length; i++) {
        if (parents[i].layerSets.length < 1) {
            regularAnimations.push(parents[i]);
            continue;
        }
        splitAnimations.push(parents[i]);
    }
    callback(splitAnimations, regularAnimations);
}

function inArray(target, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === target) {
            return true;
        }
    }
    return false;
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

function exportComplete(docLayers, animationName, varient, baseDir) {
    formatVisibilty(docLayers, animationName, varient);
    if (varient == null) {
        exportFrames(animationName, baseDir);
    } else {
        exportFrames(animationName + "_" + varient, baseDir);
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
