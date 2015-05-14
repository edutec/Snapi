// SpriteBubbleMorph.proxy.dataAsMorph proxy

SpriteBubbleMorph.prototype.originalDataAsMorph = SpriteBubbleMorph.prototype.dataAsMorph;
SpriteBubbleMorph.prototype.dataAsMorph = function (data) {
    if (data instanceof Association) {
        contents = new AssociationWatcherMorph(data);
        contents.isDraggable = false;
        contents.update(true);
        contents.step = contents.update;
    } else {
        contents = this.originalDataAsMorph(data);
    }
    return contents;
}

// CellMorph.prototype.drawNew override, because proxying is WAY too convoluted in this case

CellMorph.prototype.drawNew = function () {
    var context,
        txt,
        img,
        fontSize = SyntaxElementMorph.prototype.fontSize,
        isSameList = this.contentsMorph instanceof ListWatcherMorph
            && (this.contentsMorph.list === this.contents);

    if (this.isBig) {
        fontSize = fontSize * 1.5;
    }

    // re-build my contents
    if (this.contentsMorph && !isSameList) {
        this.contentsMorph.destroy();
    }

    if (!isSameList) {
        if (this.contents instanceof Morph) {
            this.contentsMorph = this.contents;
        } else if (isString(this.contents)) {
            txt  = this.contents.length > 500 ?
                this.contents.slice(0, 500) + '...' : this.contents;
            this.contentsMorph = new TextMorph(
                txt,
                fontSize,
                null,
                true,
                false,
                'left' // was formerly 'center', reverted b/c of code-mapping
            );
            if (this.isEditable) {
                this.contentsMorph.isEditable = true;
                this.contentsMorph.enableSelecting();
            }
            this.contentsMorph.setColor(new Color(255, 255, 255));
        } else if (typeof this.contents === 'boolean') {
            this.contentsMorph = SpriteMorph.prototype.booleanMorph.call(
                null,
                this.contents
            );
        } else if (this.contents instanceof HTMLCanvasElement) {
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(this.contents.width);
            this.contentsMorph.silentSetHeight(this.contents.height);
            this.contentsMorph.image = this.contents;
        } else if (this.contents instanceof Context) {
            img = this.contents.image();
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(img.width);
            this.contentsMorph.silentSetHeight(img.height);
            this.contentsMorph.image = img;
        } else if (this.contents instanceof Costume) {
            img = this.contents.thumbnail(new Point(40, 40));
            this.contentsMorph = new Morph();
            this.contentsMorph.silentSetWidth(img.width);
            this.contentsMorph.silentSetHeight(img.height);
            this.contentsMorph.image = img;
        } else if (this.contents instanceof Association) {
            this.contentsMorph = new AssociationWatcherMorph(this.contents);
            this.contentsMorph.isDraggable = false;
        } else if (this.contents instanceof List) {
            if (this.isCircular()) {
                this.contentsMorph = new TextMorph(
                    '(...)',
                    fontSize,
                    null,
                    false, // bold
                    true, // italic
                    'center'
                );
                this.contentsMorph.setColor(new Color(255, 255, 255));
            } else {
                this.contentsMorph = new ListWatcherMorph(
                    this.contents,
                    this
                );
                this.contentsMorph.isDraggable = false;
            }
        } else {
            this.contentsMorph = new TextMorph(
                !isNil(this.contents) ? this.contents.toString() : '',
                fontSize,
                null,
                true,
                false,
                'center'
            );
            if (this.isEditable) {
                this.contentsMorph.isEditable = true;
                this.contentsMorph.enableSelecting();
            }
            this.contentsMorph.setColor(new Color(255, 255, 255));
        }
        this.add(this.contentsMorph);
    }

    // adjust my layout
    this.silentSetHeight(this.contentsMorph.height()
                         + this.edge
                         + this.border * 2);
                         this.silentSetWidth(Math.max(
                             this.contentsMorph.width() + this.edge * 2,
                             (this.contents instanceof Context ||
                              this.contents instanceof List ? 0 :
                              SyntaxElementMorph.prototype.fontSize * 3.5)
                         ));

    // draw my outline
    this.image = newCanvas(this.extent());
    context = this.image.getContext('2d');
    if ((this.edge === 0) && (this.border === 0)) {
        BoxMorph.uber.drawNew.call(this);
        return null;
    }
    context.fillStyle = this.color.toString();
    context.beginPath();
    this.outlinePath(
        context,
        Math.max(this.edge - this.border, 0),
        this.border
    );
    context.closePath();
    context.fill();
    if (this.border > 0 && !MorphicPreferences.isFlat) {
        context.lineWidth = this.border;
        context.strokeStyle = this.borderColor.toString();
        context.beginPath();
        this.outlinePath(context, this.edge, this.border / 2);
        context.closePath();
        context.stroke();

        context.shadowOffsetX = this.border;
        context.shadowOffsetY = this.border;
        context.shadowBlur = this.border;
        context.shadowColor = this.color.darker(80).toString();
        this.drawShadow(context, this.edge, this.border / 2);
    }

    // position my contents
    if (!isSameList) {
        this.contentsMorph.setCenter(this.center());
    }
};

// Definition of a new API Category

SpriteMorph.prototype.categories.push('api');
SpriteMorph.prototype.blockColor['api'] = new Color(120, 150, 50);

// Definition of a new Map Category

SpriteMorph.prototype.categories.push('map');
SpriteMorph.prototype.blockColor['map'] = new Color(200, 20, 50);

// Block specs

SpriteMorph.prototype.originalInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function() {

    this.originalInitBlocks();

    // Control
    this.blocks.doForEach.category = 'control';
    this.blocks.doForEach.dev = 'false';

    // Pen
    this.blocks.stampFromURL =
        {
        type: 'command',
        category: 'pen',
        spec: 'stamp image from http:// %s',
        defaults: ['snapi.citilab.eu/snapi/logo.png']
    }

    // Operators
    this.blocks.colorFromPicker =
        {
        type: 'reporter',
        category: 'operators',
        spec: 'color %clr'
    }
    this.blocks.colorFromRGB =
        {
        type: 'reporter',
        category: 'operators',
        spec: 'color r: %n g: %n b: %n',
        defaults: [250,128,64]
    };
    this.blocks.colorFromHSV =
        {
        type: 'reporter',
        category: 'operators',
        spec: 'color h: %n s: %n v: %n',
        defaults: [0.3,0.7,0.9]
    }
    this.blocks.colorFromString =
        {
        type: 'reporter',
        category: 'operators',
        spec: 'magic color from %s',
        defaults: [localize('Hello!')]
    }

    // API
    this.blocks.jsonObject =
        {
        type: 'reporter',
        category: 'api',
        spec: 'object from JSON %s',
        defaults: [localize('{"name":"John","surname":"Doe","age":14}')]
    };
    this.blocks.objectToJsonString =
        {
        type: 'reporter',
        category: 'api',
        spec: 'JSON from object %l'
    };

    this.blocks.newAssociation =
        {
        type: 'reporter',
        category: 'api',
        spec: '%s → %s'
    };
    this.blocks.valueAt =
        {
        type: 'reporter',
        category: 'api',
        spec: '%s of %s'
    };

    this.blocks.apiCall =
        {
        type: 'reporter',
        category: 'api',
        spec: '%method at %protocol %s with parameters %mult%s',
        defaults: ['GET', 'http://', null, null]
    };
    this.blocks.proxiedApiCall =
        {
        type: 'reporter',
        category: 'api',
        spec: 'proxied %method at %protocol %s with parameters %mult%s',
        defaults: ['GET', 'http://', null, null]
    };

    // Maps
    this.blocks.showMap =
        {
        type: 'command',
        category: 'map',
        spec: 'show map'
    };
    this.blocks.hideMap =
        {
        type: 'command',
        category: 'map',
        spec: 'hide map'
    };
    this.blocks.switchView =
        {
        type: 'command',
        category: 'map',
        spec: 'switch view to %mapView'
    };
    this.blocks.setMapCenter =
        {
        type: 'command',
        category: 'map',
        spec: 'set center at long: %n lat: %n',
        defaults: [2.061749, 41.359827]
    };
    this.blocks.getCurrentLongitude =
        {
        type: 'reporter',
        category: 'map',
        spec: 'current longitude',
    };
    this.blocks.getCurrentLatitude =
        {
        type: 'reporter',
        category: 'map',
        spec: 'current latitude',
    };
    this.blocks.xFromLongitude =
        {
        type: 'reporter',
        category: 'map',
        spec: 'x from longitude %n',
    };
    this.blocks.yFromLatitude =
        {
        type: 'reporter',
        category: 'map',
        spec: 'y from latitude %n',
    };
    this.blocks.setMapZoom =
        {
        type: 'command',
        category: 'map',
        spec: 'set zoom level to %zoomLevel'
    };
    this.blocks.getMapZoom =
        {
        type: 'reporter',
        category: 'map',
        spec: 'zoom level'
    };
    this.blocks.addMarker =
        {
        type: 'command',
        category: 'map',
        spec: 'add %clr marker at long %n lat %n with label %s',
        defaults: [null, 2.061749, 41.359827, 'Citilab']
    };
    this.blocks.simpleAddMarker =
        {
        type: 'command',
        category: 'map',
        spec: 'add %clr marker at coordinates %l with label %s'
    };
    this.blocks.showMarkers =
        {
        type: 'command',
        category: 'map',
        spec: 'show markers'
    };
    this.blocks.hideMarkers =
        {
        type: 'command',
        category: 'map',
        spec: 'hide markers'
    };
    this.blocks.clearMarkers =
        {
        type: 'command',
        category: 'map',
        spec: 'remove all markers'
    };
    this.blocks.showBubbles =
        {
        type: 'command',
        category: 'map',
        spec: 'show bubbles'
    };
    this.blocks.hideBubbles =
        {
        type: 'command',
        category: 'map',
        spec: 'hide bubbles'
    };
}

SpriteMorph.prototype.initBlocks();

// blockTemplates proxy

var blockTemplates = function(category) {
    var blocks = this.originalBlockTemplates(category); 

    function blockBySelector(selector) {
        // Can't call myself, as these blocks belong only to SpriteMorph and I may be a StageMorph as well
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    };

    if (category === 'control') {
        blocks.push(blockBySelector('doForEach'));
    }

    if (category === 'pen') {
        blocks.push(blockBySelector('stampFromURL'));
    }

    if (category === 'operators') {
        blocks.push('-');
        blocks.push(blockBySelector('colorFromPicker'));
        blocks.push(blockBySelector('colorFromRGB'));
        blocks.push(blockBySelector('colorFromHSV'));
        blocks.push(blockBySelector('colorFromString'));
    }

    if (category === 'api') {
        blocks.push(blockBySelector('jsonObject'));
        blocks.push(blockBySelector('objectToJsonString'));
        blocks.push('-');
        blocks.push(blockBySelector('newAssociation'));
        blocks.push(blockBySelector('valueAt'));
        blocks.push('-');
        blocks.push(blockBySelector('apiCall'));
        blocks.push(blockBySelector('proxiedApiCall'));
    };

    if (category === 'map') {
        blocks.push(blockBySelector('showMap'));
        blocks.push(blockBySelector('hideMap'));
        blocks.push('-');
        blocks.push(blockBySelector('switchView'));
        blocks.push(blockBySelector('setMapCenter'));
        blocks.push(blockBySelector('getCurrentLongitude'));
        blocks.push(blockBySelector('getCurrentLatitude'));
        blocks.push(blockBySelector('xFromLongitude'));
        blocks.push(blockBySelector('yFromLatitude'));
        blocks.push(blockBySelector('setMapZoom'));
        blocks.push(blockBySelector('getMapZoom'));
        blocks.push('-');
        blocks.push(blockBySelector('addMarker'));
        blocks.push(blockBySelector('simpleAddMarker'));
        blocks.push(blockBySelector('showMarkers'));
        blocks.push(blockBySelector('hideMarkers'));
        blocks.push(blockBySelector('clearMarkers'));
        blocks.push('-');
        blocks.push(blockBySelector('showBubbles'));
        blocks.push(blockBySelector('hideBubbles'));
    }
    return blocks;
}

SpriteMorph.prototype.originalBlockTemplates = SpriteMorph.prototype.blockTemplates;
SpriteMorph.prototype.blockTemplates = blockTemplates;

StageMorph.prototype.originalBlockTemplates = StageMorph.prototype.blockTemplates;
StageMorph.prototype.blockTemplates = blockTemplates;

// OpenLayers Stage

StageMorph.prototype.originalInit = StageMorph.prototype.init; 
StageMorph.prototype.init = function (globals) {
    this.originalInit(globals);
    var myself = this;

    var loc = ol.proj.transform([2.061749, 41.359827], 'EPSG:4326', 'EPSG:3857');

    // Apparently, we need to create a stupid div on the DOM, even if it's not visible,
    // so that the canvas shows the map and allows us to interact with it

    this.mapDiv = document.createElement('div');
    this.mapDiv.style['visibility'] = 'hidden';
    this.mapDiv.style['position'] = 'fixed';
    this.mapDiv.style['left'] = 0;
    this.mapDiv.style['top'] = 0;
    this.mapDiv.style['width'] = '480px';
    this.mapDiv.style['height'] = '360px';
    document.body.appendChild(this.mapDiv);

    var markersSource = new ol.source.Vector({
        features: []
    });

    var layers = { 
        political:	new ol.layer.Tile({ source: new ol.source.TileJSON({ url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp' }) }),
        satellite:	new ol.layer.Tile({ source: new ol.source.MapQuest({ layer: 'sat'}) }),
        road:		new ol.layer.Tile({ source: new ol.source.MapQuest({ layer: 'osm'}) }),
        markers:	new ol.layer.Vector({ source: markersSource }) 
    };

    this.map = new ol.Map({
        target: this.mapDiv,
        renderer: 'canvas',
        view: new ol.View({
            zoom: 3,
            center: loc
        }),
        layers: [ layers.satellite, layers.road, layers.political, layers.markers ]
    });

    this.map.layers = layers;

    for (var property in this.map.layers) {
        if (this.map.layers.hasOwnProperty(property)) {
            this.map.layers[property].setVisible(false)
        }
    }

    this.map.layers.markers.setVisible(true);
    this.map.currentLayer = this.map.layers.road;
    this.map.currentLayer.setVisible(true);
    this.map.markers = markersSource;
    this.map.showingBubbles = false;
    this.map.canvas = this.map.getTarget().children[0].children[0];
    this.map.visible = false;
}

// Overriden
StageMorph.prototype.drawOn = function (aCanvas, aRect) {
    // make sure to draw the pen trails canvas as well
    var rectangle, area, delta, src, context, w, h, sl, st, ws, hs, myself = this;
    if (!this.isVisible) {
        return null;
    }
    rectangle = aRect || this.bounds;
    area = rectangle.intersect(this.bounds).round();
    if (area.extent().gt(new Point(0, 0))) {
        delta = this.position().neg();
        src = area.copy().translateBy(delta).round();
        context = aCanvas.getContext('2d');
        context.globalAlpha = this.alpha;

        sl = src.left();
        st = src.top();
        w = Math.min(src.width(), this.image.width - sl);
        h = Math.min(src.height(), this.image.height - st);

        if (w < 1 || h < 1) {
            return null;
        }
        context.drawImage(
            this.image,
            src.left(),
            src.top(),
            w,
            h,
            area.left(),
            area.top(),
            w,
            h
        );

        // map canvas
        if (this.map.visible) {
            ws = w / this.scale;
            hs = h / this.scale;
            this.mapDiv.style['width'] = w + 'px';
            this.mapDiv.style['height'] = h + 'px';
            context.save();
            context.scale(this.scale, this.scale);
            context.drawImage(
                this.map.canvas,
                src.left() / this.scale,
                src.top() / this.scale,
                ws,
                hs,
                area.left() / this.scale,
                area.top() / this.scale,
                ws,
                hs
            );
            myself.map.markers.forEachFeature(function(feature) {
                var coord = feature.getGeometry().getCoordinates(),
                    pos = myself.map.getPixelFromCoordinate(coord),
                    point = new Point(pos[0] * myself.scale + myself.left(), pos[1] * myself.scale + myself.top());
                if (myself.map.showingBubbles) {
                    feature.get('bubble').showUp(myself, point);
                } else {
                    feature.get('bubble').adjustPosition(point);
                }

            }) 
            context.restore();
        }

        // pen trails
        ws = w / this.scale;
        hs = h / this.scale;
        context.save();
        context.scale(this.scale, this.scale);
        try {
            context.drawImage(
                this.penTrails(),
                src.left() / this.scale,
                src.top() / this.scale,
                ws,
                hs,
                area.left() / this.scale,
                area.top() / this.scale,
                ws,
                hs
            );
        } catch (err) { // sometimes triggered only by Firefox
            // console.log(err);
            context.restore();
            context.drawImage(
                this.penTrails(),
                0,
                0,
                this.dimensions.x,
                this.dimensions.y,
                this.left(),
                this.top(),
                this.dimensions.x * this.scale,
                this.dimensions.y * this.scale
            );
        }
        context.restore();
    }
};

StageMorph.prototype.featureAtPosition = function(pos) {
    return this.map.forEachFeatureAtPixel(
        [(pos.x - this.left()) / this.scale, (pos.y - this.top()) / this.scale], 
        function(feature, layer) { return feature }
    );
}

StageMorph.prototype.referencePos = null;

StageMorph.prototype.mouseScroll = function(y, x) {
    if (this.map.visible) {
        if (y > 0) {
            this.map.getView().setZoom(Math.min(this.map.getView().getZoom() + 1, 20));
        } else if (y < 0) {
            this.map.getView().setZoom(Math.max(this.map.getView().getZoom() - 1, 1));
        }
        this.delayedRefresh();
    }
};

StageMorph.prototype.mouseDownLeft = function(pos) {
    this.referencePos = pos;
    var feature = this.featureAtPosition(pos);
    if (feature) {
        var value = feature.get('value');
        if (value) {
            feature.get('bubble').showUp(this.world(), pos);
        }
    }
};

StageMorph.prototype.mouseDownRight = function(pos) {
    this.referencePos = pos;
};

StageMorph.prototype.mouseMove = function(pos, button) {
    if (this.map.visible) {
        deltaX = this.referencePos.x - pos.x;
        deltaY = pos.y - this.referencePos.y;
        this.referencePos = pos;
        var view = this.map.getView();
        var xFactor = Math.pow(2, view.getZoom()) / 4;
        var yFactor = Math.pow(2, view.getZoom()) / 3;
        view.setCenter(
            [view.getCenter()[0] + deltaX / this.dimensions.x / xFactor * 10000000,
                view.getCenter()[1] + deltaY / this.dimensions.y / yFactor * 10000000]
        );
        this.delayedRefresh();
    }
};

StageMorph.prototype.originalUserMenu = StageMorph.prototype.userMenu;
StageMorph.prototype.userMenu = function() {
    var myself = this,
        feature = this.featureAtPosition(this.referencePos),
        menu;

    if (feature) {
        var loc = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
            menu = new MenuMorph(this);
        menu.addItem(
            'remove', 
            function(){ 
                myself.map.markers.removeFeature(feature);
                myself.delayedRefresh();
            });
            menu.addLine();
            menu.addItem(
                'export...',
                function () {
                    window.open(
                        'data:text/plain;charset=utf-8,' +
                            encodeURIComponent(feature.get('value'))
                    );
                });
                menu.addLine();
                menu.addItem(
                    'show in OpenStreetMap',
                    function() {
                        window.open('http://www.openstreetmap.org/#map=17/' + loc[1] + '/' + loc[0]);
                    });
                    menu.addItem(
                        'show in GoogleMaps',
                        function() {
                            window.open('https://www.google.es/maps/@' + loc[1] + ',' + loc[0] + ',17z');
                        });
                        menu.addItem(
                            'show in Google StreetView',
                            function() {
                                window.open('http://maps.google.com/maps?q=&layer=c&cbll=' + loc[1] + ',' + loc[0]);
                            });

    } else {
        menu = this.originalUserMenu();
    }

    return menu;
}

StageMorph.prototype.delayedRefresh = function(delay) {
    var myself = this;		
    setTimeout(function(){ myself.changed() }, delay ? delay : 100)
}
