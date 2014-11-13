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
	
    JsonInspectorMorph.uber.init.call(this);

	this.labelString = value.length < 41 ? value : value.substring(0, 40) + '...';
	this.createLabel();

	this.list = inspector.list;
	this.detail = inspector.detail;

	var inspectIt = function() { myself.jsonInspect(inspector.currentProperty) };

	this.list.doubleClickAction = inspectIt;

	frame = new FrameMorph();
	frame.color = this.color;
	frame.add(this.list);
	frame.add(this.detail);
	frame.acceptsDrops = false;

    this.list.action = function () {
        myself.hasUserEditedDetails = false;
        myself.updateCurrentSelection(inspector);
    };

	this.list.scrollBarSize = 1;
	this.list.setHeight(180);
	this.list.setWidth(this.list.width() + 2);
	this.list.setLeft(0);
	this.list.setTop(0);
	this.detail.scrollBarSize = 1;
	this.detail.setLeft(this.list.width() + 2);
	this.detail.setTop(0);
	this.detail.setHeight(this.list.height());
    frame.setWidth(this.list.width() + this.detail.width());
    frame.setHeight(this.list.height());

	// We need to do this again in order for the doubleClickAction to percolate down to the list contents
	this.list.buildListContents();
	
	this.addBody(frame);

    this.addButton(inspectIt, 'Inspect');
    this.addButton('cancel', 'Close');

	this.fixLayout();
    this.drawNew();
    this.fixLayout();
}

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
}
