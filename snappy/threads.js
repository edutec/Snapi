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

