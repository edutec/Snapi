// API category

Process.prototype.newAssociation = function(key,value) {
		return new Association(key,value);
};

Process.prototype.setValue = function(association,value) {
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
		return this.associationAt(key, snapObject).value;
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
	stage.changed();
}

Process.prototype.hideMap = function() {
	var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
	stage.map.visible = false;
	stage.changed();
}

Process.prototype.showMarkers = function() {
	var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
	stage.map.markersLayer.setVisible(true);
	stage.changed();
}

Process.prototype.hideMarkers = function() {
	var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
	stage.map.markersLayer.setVisible(false);
	stage.changed();
}

Process.prototype.addMarker = function(color, lat, lng) {
	var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
	var iconFeature = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
		//name: 'Null Island', // allows to add data at will, not sure what to use it for
	});

	var iconStyle = new ol.style.Style({
		image: new ol.style.Circle({
			radius: 5,
			fill: null,
			stroke: new ol.style.Stroke({ color: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')', width: 2 })
		})
	});

	iconFeature.setStyle(iconStyle);
	stage.map.markers.addFeature(iconFeature);
	
	// should be a callback being fired when the feature has been added!
	stage.changed();
	stage.drawNew();
}

