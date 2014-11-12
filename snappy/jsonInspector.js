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
	
    JsonInspectorMorph.uber.init.call(this);

	this.inspector = new InspectorMorph(target);

	this.labelString = this.inspector.target.toString();
	this.createLabel();

	this.list = this.inspector.list;
	this.detail = this.inspector.detail;

	frame = new FrameMorph();
	frame.color = this.color;
	frame.add(this.list);
	frame.add(this.detail);

	this.list.setLeft(0);
	this.list.setTop(0);
	this.detail.setLeft(this.list.width);
	this.detail.setTop(0);
	this.detail.setHeight(this.list.height());
    frame.setWidth(this.list.width() + this.detail.width());
    frame.setHeight(this.list.height());

	this.inspectIt = function() {
        this.jsonInspect(myself.inspector.currentProperty);
	}

	// Why isn't this working?
	this.list.doubleClickAction = myself.inspectIt;

	this.addBody(frame);
    this.addButton('inspectIt', 'Inspect');
    this.addButton('cancel', 'Close');
    this.fixLayout();
    this.drawNew();
    this.fixLayout();
}

JsonInspectorMorph.prototype.popUp = function (target) {
    var world = target.world();

    if (world) {
        JsonInspectorMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            280,
            220,
            this.corner,
            this.corner
        );
    }
};

Morph.prototype.jsonInspect = function(inspectee) {
    var world = this.world instanceof Function ?
            this.world() : this.root() || this.world;
    inspector = new JsonInspectorMorph(inspectee);
    inspector.popUp(world);
}
