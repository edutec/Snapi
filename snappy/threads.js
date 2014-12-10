// API category

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
		try {
			if (typeof snapObject == 'string') { 
				value = JSON.stringify(JSON.parse(snapObject)[key]);
				value = value.replace(/^"/g,'').replace(/"$/g,'');
			} else if (snapObject instanceof List && snapObject.length() > 0) {
				value = this.associationAt(key, snapObject).value;
			}
		} catch (err) {
			// This doesn't look like something JSON-inspectable, ignore it
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
		return this.apiCall(method, protocol, 'www.corsproxy.com/' + url, parameters)
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
			longitude = Number.parseFloat(lng),
			latitude = Number.parseFloat(lat);
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
			longitude = Number.parseFloat(lng),
			latitude = Number.parseFloat(lat);

		var iconFeature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.transform([isNaN(longitude)?0:longitude, isNaN(latitude)?0:latitude], 'EPSG:4326', 'EPSG:3857')),
				value: value
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
		return this.colorFromHSV(((Math.abs(string.toString().split('').reduce(function(a,b){ a = ((a<<5) - a) + b.charCodeAt(0); return a & a }, 0)) % 255)/255),1,1)
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
