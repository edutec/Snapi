// API category

Process.prototype.proxyIP = 'corsproxy.citilab.eu';

Process.prototype.newAssociation = function(key, value) {
    return new Association(key,value);
};

Process.prototype.setValue = function(association, value) {
    association.setValue(value);
};

Process.prototype.getValue = function(association) {
    return association.value;
};

Process.prototype.associationAt = function (key, snapObject) {
    var array = snapObject.asArray();

    for(var i = 0; i < array.length; i++) {
        if(array[i].key == key) { return array[i] }
    }

    return Association(null,null);
};

Process.prototype.valueAt = function (key, snapObject) {
    var value;
    if (typeof snapObject == 'string') { 
        try {
            var object = JSON.parse(snapObject) 
        } catch(err) {
            throw new Error(localize('JSON string couldn\'t be parsed'));
        };
        if (object.hasOwnProperty(key)) {
            value = JSON.stringify(object[key]);
            value = value.replace(/^"/g,'').replace(/"$/g,'');
        } else {
            //throw new Error(localize('property ') + key + localize(' not found in this object'));
            return null;
        }
    } else if (snapObject instanceof List && snapObject.length() > 0) {
        return this.valueAt(key, this.objectToJsonString(snapObject))
    } else {
        // This doesn't look like something JSON-inspectable, ignore it
        return;
    };
    return value;
};

Process.prototype.jsonObject = function (jsonString) {

    return toSnapObject(JSON.parse(jsonString));

    function toSnapObject(jsonObject) {
        if (jsonObject instanceof Array) {
            return new List(jsonObject.map(function(eachElement) { return toSnapObject(eachElement) }));
        } else if (jsonObject instanceof Object) {
            return new List(Object.keys(jsonObject).map( function(eachKey) { return new Association(eachKey, toSnapObject(jsonObject[eachKey])) }))
        } else {
            return jsonObject;
        }
    }
};

Process.prototype.objectToJsonString = function (object) {
    return toJsonString(object);

    function toJsonString(object) {
        if (object instanceof List) {
            var array = object.asArray(),
                mappedArray = array.map(function(eachElement) { return toJsonString(eachElement) }); 

            if (array.every(function(eachElement) { return (eachElement instanceof Association) })) {
                // We're dealing with an object
                return '{' + mappedArray  + '}';
            } else {
                // We're dealing with an array
                return '[' + mappedArray + ']';
            }
        } else if (object instanceof Association) {
            return '"' + object.key + '":' + toJsonString(object.value);
        } else {
            return JSON.stringify(object);
        }
    }

}

Process.prototype.apiCall = function (method, protocol, url, parameters) {
    var response;
    var fullUrl = protocol + url;
    if (!this.httpRequest) {
        if (parameters) {
            fullUrl += '?';
            parameters.asArray().forEach(function(each) {  fullUrl += each.key + '=' + each.value + '&' });
            fullUrl = fullUrl.slice(0, -1);
        };
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.open(method, fullUrl, true);
        this.httpRequest.send(null);
    } else if (this.httpRequest.readyState === 4) {
        response = this.httpRequest.responseText;
        this.httpRequest = null;
        return response;
    }
    this.pushContext('doYield');
    this.pushContext();
}

Process.prototype.proxiedApiCall = function (method, protocol, url, parameters) {
    return this.apiCall(method, protocol, this.proxyIP + '/' + url, parameters)
}

// Maps Category

Process.prototype.showMap = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.visible = true;
    stage.delayedRefresh();
}

Process.prototype.hideMap = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.visible = false;
    stage.delayedRefresh();
}

Process.prototype.switchView = function(view) {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);

    if (stage.map.currentLayer != stage.map.layers[view]) {
        stage.map.layers[view].setVisible(true);
        stage.map.currentLayer.setVisible(false);
        stage.map.currentLayer = stage.map.layers[view];

        stage.delayedRefresh();
    }
}

Process.prototype.setMapCenter = function(lng, lat) {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph),
        longitude = parseFloat(lng),
        latitude = parseFloat(lat);
    stage.map.getView().setCenter(ol.proj.transform([isNaN(longitude)?0:longitude, isNaN(latitude)?0:latitude], 'EPSG:4326', 'EPSG:3857'));
    stage.delayedRefresh();
}

Process.prototype.getCurrentLongitude = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    return ol.proj.transform(stage.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[0];
}

Process.prototype.getCurrentLatitude = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    return ol.proj.transform(stage.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')[1];
}

Process.prototype.xFromLongitude = function(longitude) {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    return stage.map.getPixelFromCoordinate(ol.proj.transform([parseFloat(longitude), 0], 'EPSG:4326', 'EPSG:3857'))[0] - (stage.width() / 2);
}

Process.prototype.yFromLatitude = function(latitude) {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    return (stage.height() / 2) - stage.map.getPixelFromCoordinate(ol.proj.transform([0, parseFloat(latitude)], 'EPSG:4326', 'EPSG:3857'))[1];
}

Process.prototype.setMapZoom = function(level) {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.getView().setZoom(Math.max(Math.min(level, 20),1));
    stage.delayedRefresh(300);
}

Process.prototype.getMapZoom = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    return stage.map.getView().getZoom();
}

Process.prototype.showMarkers = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.layers.markers.setVisible(true);
    stage.delayedRefresh();
}

Process.prototype.hideMarkers = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.layers.markers.setVisible(false);
    stage.delayedRefresh();
}

Process.prototype.clearMarkers = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.markers.clear();
    stage.delayedRefresh();
}

Process.prototype.addMarker = function(color, lng, lat, value) {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph),
        longitude = parseFloat(lng),
        latitude = parseFloat(lat),
        pos;

    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([isNaN(longitude)?0:longitude, isNaN(latitude)?0:latitude], 'EPSG:4326', 'EPSG:3857')),
        value: value,
        bubble: new SpeechBubbleMorph(value)
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: null,
            stroke: new ol.style.Stroke({ color: color.toString(), width: 3 })
        })
    });

    iconFeature.setStyle(iconStyle);
    stage.map.markers.addFeature(iconFeature);
    pos = stage.map.getPixelFromCoordinate(iconFeature.getGeometry().getCoordinates());
    stage.delayedRefresh();
}

Process.prototype.simpleAddMarker = function(color, loc, value) {
    if (loc.length < 1) { return };

    if (loc instanceof Array) {
        finalLoc = loc;
    } else if (loc instanceof List) {
        finalLoc = loc.asArray();
    } else {
        try {
            finalLoc = JSON.parse(loc);
        } catch(error) {
            throw error;
        }
    }

    function flatten(array) {
        if (array[0] instanceof Array) {
            return flatten(array[0])
        } else if (array[0] instanceof List) {
            return flatten(array[0].asArray())
        } else {
            return array
        }
    }

    finalLoc = flatten(finalLoc);

    this.addMarker(color, finalLoc[0], finalLoc[1], value);
}

Process.prototype.showBubbles = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.showingBubbles = true;
    stage.changed();
}

Process.prototype.hideBubbles = function() {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    stage.map.showingBubbles = false;
    stage.map.markers.forEachFeature(function(feature) {
        // Bonus feature! When on "show bubbles" mode, this code allows you to 
        // place the clicked bubble on top of all others!
        var bubble = feature.get('bubble')
        bubble.hasBeenAddedToStage = false;
        bubble.destroy();
    });
}

// Colors

Process.prototype.colorFromRGB = function(r,g,b) {
    return new Color(r,g,b);
}

Process.prototype.colorFromHSV = function(h,s,v) {
    var color = new Color();
    color.set_hsv(h,s,v);
    return color;
}

Process.prototype.colorFromPicker = function(color) {
    return color;
}

Process.prototype.colorFromString = function(string) {
    var color,
    components,
    element = document.createElement('div');

    // We first attempt to read a color by (ab)using HTML color names
    element.style.color = string.split(' ').join('');
    components = window.getComputedStyle(document.body.appendChild(element)).color.match(/\d+/g).map(function(a){ return parseInt(a,10) });
    document.body.removeChild(element);

    // If there is no color named after that string, we use magic. There are only 255 magic colors, deal with it!
    if (string.toLowerCase() != 'black' && components[0] == 0 && components[1] == 0 && components[2] == 0) {
        return this.colorFromHSV(
            ((Math.abs(
                string.toString().split('').reduce(function(a,b){
                    a = ((a<<5) - a) + b.charCodeAt(0); return a & a
                }, 
                0)) % 255) / 255)
                                                                ,1
                                                                ,1)
    } else {
        return new Color(components[0], components[1], components[2])
    }
}

// List modifications to accept JSON arrays

Process.prototype.tryToParseJsonList = function(list) {
    var lst = list;
    if (typeof list == 'string') {
        try {
            lst = this.jsonObject(list);
        } catch(err) {
            lst = new List();
        }
    }
    return lst;
}

Process.prototype.originalReportCONS = Process.prototype.reportCONS;
Process.prototype.reportCONS = function (car, cdr) {
    return this.originalReportCONS(car, this.tryToParseJsonList(cdr));
};

Process.prototype.originalReportCDR = Process.prototype.reportCDR;
Process.prototype.reportCDR = function (list) {
    return this.originalReportCDR(this.tryToParseJsonList(list));
};

Process.prototype.originalReportListItem = Process.prototype.reportListItem;
Process.prototype.reportListItem = function (index, list) {
    return this.originalReportListItem(index, this.tryToParseJsonList(list));
}

Process.prototype.originalReportListLength = Process.prototype.reportListLength;
Process.prototype.reportListLength = function (list) {
    return this.originalReportListLength(this.tryToParseJsonList(list));
};

Process.prototype.originalReportListContainsItem = Process.prototype.reportListContainsItem;
Process.prototype.reportListContainsItem = function (list, element) {
    return this.originalReportListContainsItem(this.tryToParseJsonList(list), element);
};

Process.prototype.originalDoForEach = Process.prototype.doForEach; 
Process.prototype.doForEach = function (upvar, list, script) {
    return this.originalDoForEach(upvar, this.tryToParseJsonList(list), script)
}

// Images

Process.prototype.stampFromURL = function(url) {
    var sprite = this.homeContext.receiver,
        stage = sprite.parentThatIsA(StageMorph),
        context = stage.penTrails().getContext('2d'),
        isWarped = sprite.isWarped,
        img = new Image(),
        left = sprite.center().x - stage.left(),
        top = sprite.center().y - stage.top();

    // We proxy the image so we can get over CORS policies
    img.src = 'http://' + this.proxyIP + '/' + url;

    // We've got to wait until it's ready to stamp it
    img.onload = function() {
        if (isWarped) {
            sprite.endWarp();
        }

        // Now that we know its size, we can center it
        left -= img.width/2;
        top -= img.height/2;

        context.save();
        context.scale(1 / stage.scale, 1 / stage.scale);
        context.translate(left, top);
        context.rotate((sprite.heading - 90) * Math.PI/180);

        context.drawImage(
            img,
            0,
            0
        );

        context.restore();

        stage.changed();

        if (isWarped) {
            sprite.startWarp();
        }
    }

}
