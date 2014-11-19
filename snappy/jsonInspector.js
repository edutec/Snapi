// Definition of a new Inspector morph, slightly following the Snap! UI, moveable within the IDE canvas and optimized for browsing inside JSON objects

// JsonInspectorMorph inherits from DialogBoxMorph:

JsonInspectorMorph.prototype = new DialogBoxMorph();
JsonInspectorMorph.prototype.constructor = JsonInspectorMorph;
JsonInspectorMorph.uber = DialogBoxMorph.prototype;

// JsonInspectorMorph instance creation:

function JsonInspectorMorph(target) {
    this.init(target);
}

// A JsonInspectorMorph contains an InspectorMorph and (ab)uses its parts at will

JsonInspectorMorph.prototype.init = function(target) {

	var myself = this;
    this.handle = null;
	var inspector = new InspectorMorph(target);
	var value = inspector.target.toString();
	
    JsonInspectorMorph.uber.init.call(this, target, function(){}, target);

	this.labelString = value.length < 41 ? value : value.substring(0, 40) + '...';
	this.createLabel();

	this.list = inspector.list;
	this.detail = inspector.detail;

	var inspectIt = function() { myself.jsonInspect(inspector.currentProperty) };

	this.list.doubleClickAction = inspectIt;

	var bdy = new AlignmentMorph('row', this.padding);
	bdy.add(this.list);
	bdy.add(this.detail);

	bdy.padding = 10;
    bdy.growth = 50;
    bdy.isDraggable = false;
    bdy.acceptsDrops = false;

    this.list.action = function () { myself.updateCurrentSelection(inspector) };

	this.list.scrollBarSize = 1;
	this.list.setHeight(180);
	this.list.setWidth(this.list.width() + 2);
	this.list.setLeft(0);
	this.list.setTop(0);
	this.detail.scrollBarSize = 1;
	this.detail.setLeft(this.list.width() + 4);
	this.detail.setTop(0);
	this.detail.setHeight(this.list.height());
	bdy.drawNew();
	bdy.fixLayout();

	// We need to do this again in order for the doubleClickAction to percolate down to the list contents
	this.list.buildListContents();
	
	this.addBody(bdy);

    this.addButton(inspectIt, 'Inspect');
    this.addButton('cancel', 'Close');

    this.setExtent(new Point(375, 300));
    this.fixLayout();
}

JsonInspectorMorph.prototype.fixLayout = function () {
	JsonInspectorMorph.uber.fixLayout.call(this);
// Resize code, it must be looked at!
	/*
	if (this.list) {

    var x, y, r, b, w, h;

    // list
    y = this.top() + this.edge;
    w = Math.min(
        Math.floor(this.width() / 3),
        this.list.listContents.width()
    );

    w -= this.edge;
    b = this.bottom() - (2 * this.edge) -
        MorphicPreferences.handleSize;
    h = b - y;
    this.list.setPosition(new Point(x, y));
    this.list.setExtent(new Point(w, h));

    // detail
    x = this.list.right() + this.edge;
    r = this.right() - this.edge;
    w = r - x;
    this.detail.setPosition(new Point(x, y));
    this.detail.setExtent(new Point(w, (h * 2 / 3) - this.edge));
    this.changed();
	}*/
};

JsonInspectorMorph.prototype.updateCurrentSelection = function(inspector) {
    var val, txt, cnts,
        sel = this.list.selected,
        currentTxt = this.detail.contents.children[0],
        root = this.root();

    if (root &&
            (root.keyboardReceiver instanceof CursorMorph) &&
            (root.keyboardReceiver.target === currentTxt)) {
        inspector.hasUserEditedDetails = true;
        return;
    }
    if (isNil(sel) || inspector.hasUserEditedDetails) {return; }
    val = inspector.target[sel];
    inspector.currentProperty = val;
    if (isNil(val)) {
        txt = 'NULL';
    } else if (isString(val)) {
        txt = val;
    } else if (typeof val === 'object' ) {
        txt = JSON.stringify(val, null, "\t");
		if (txt.length > 20000) { txt = txt.substring(0,20000) + '\n(...)' };
    } else {
        txt = val.toString();
	}
    if (currentTxt.text === txt) {return; }
    cnts = new TextMorph(txt);
    cnts.isEditable = true;
    cnts.enableSelecting();
    cnts.setReceiver(inspector.target);
    this.detail.setContents(cnts);
};
	
JsonInspectorMorph.prototype.popUp = function (target) {
	JsonInspectorMorph.uber.popUp.call(this, target.world());
	this.handle = new HandleMorph(
		this,
		280,
		220,
		this.corner,
		this.corner,
		'resize'
	);
};

Morph.prototype.jsonInspect = function(inspectee) {
    var world = this.world instanceof Function ?
            this.world() : this.root() || this.world;
    inspector = new JsonInspectorMorph(inspectee);
    inspector.popUp(world);
	return inspector;
}
