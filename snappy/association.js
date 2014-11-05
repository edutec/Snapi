modules.keyvalue = '2014-May-06';

var Association;
var AssociationWatcherMorph;

// Association ////////////////////////////////////////////////////////////////


// Association instance creation:

function Association(key, value) {
    this.key = key;
    this.value = value;
    this.lastChanged = Date.now();
}

Association.prototype.toString = function () {
    return 'an Association [' + this.key + ' -> ' + this.value + ']';
};

// Association updating:

Association.prototype.changed = function () {
    this.lastChanged = Date.now();
};

// Association setters:

Association.prototype.setValue = function (element) {
	this.value = element;
    this.changed();
};

// Association conversion:

Association.prototype.asText = function () {
    return this.key + ' -> ' + this.value;
};

// Association testing

Association.prototype.equalTo = function (other) {
    if (!(other instanceof Association)) {
        return false;
    }
    return this.key == other.key && this.value == other.value;
};

// AssociationWatcherMorph ////////////////////////////////////////////////////

// AssociationWatcherMorph inherits from WatcherMorph:

AssociationWatcherMorph.prototype = new WatcherMorph();
AssociationWatcherMorph.prototype.constructor = AssociationWatcherMorph;
AssociationWatcherMorph.uber = WatcherMorph.prototype;

function AssociationWatcherMorph(association) {
    this.init(association);
}

AssociationWatcherMorph.prototype.init = function(association) {
    // additional properties
    this.labelText = association.key || '';
    this.version = null;
	this.association = association;

    // initialize inherited properties
    WatcherMorph.uber.init.call(
        this,
        SyntaxElementMorph.prototype.rounding,
        1.000001, // shadow bug in Chrome,
        new Color(120, 120, 120)
    );

    // override inherited behavior
    this.color = new Color(243, 118, 29);
    this.readoutColor = new Color(202, 98, 24);
    this.style = 'normal';
    this.currentValue = null;
    this.labelMorph = null;
	this.getter = association.getValue;
    this.sliderMorph = null;
    this.cellMorph = null;
    this.isDraggable = true;
    this.fixLayout();
    this.update();
    if (this.isHidden) { // for de-serializing
        this.hide();
    }
}

AssociationWatcherMorph.prototype.update = function () {
    var newValue,
        num;
    if (this.association) {
        this.updateLabel();
		newValue = this.association.value;
        num = +newValue;
        if (typeof newValue !== 'boolean' && !isNaN(num)) {
            newValue = Math.round(newValue * 1000000000) / 1000000000;
        }
        if (newValue !== this.currentValue) {
            this.changed();
            this.cellMorph.contents = newValue;
            this.cellMorph.drawNew();
            this.fixLayout();
            this.currentValue = newValue;
        }
    }
    if (this.cellMorph.contentsMorph instanceof ListWatcherMorph) {
        this.cellMorph.contentsMorph.update();
    }
};

AssociationWatcherMorph.prototype.updateLabel = function () {
    if (!this.association) { return; }
    if (this.association.version !== this.version) {
		this.labelText = this.association.key;
        if (this.labelMorph) {
            this.labelMorph.destroy();
            this.labelMorph = null;
            this.fixLayout();
        }
    }
};

AssociationWatcherMorph.prototype.fixLayout = function () {
    var fontSize = SyntaxElementMorph.prototype.fontSize, isList,
        myself = this;

    this.changed();

    // create my parts
    if (this.labelMorph === null) {
        this.labelMorph = new StringMorph(
            this.labelText,
            fontSize,
            null,
            true,
            false,
            false,
            MorphicPreferences.isFlat ? new Point() : new Point(1, 1),
            new Color(255, 255, 255)
        );
        this.add(this.labelMorph);
    }
    if (this.cellMorph === null) {
        this.cellMorph = new CellMorph('', this.readoutColor);
        this.add(this.cellMorph);
    }
    
    // adjust my layout
    isList = this.cellMorph.contents instanceof List;
    if (isList) { this.style = 'normal'; }

    if (this.style === 'large') {
        this.labelMorph.hide();
        this.cellMorph.big();
        this.cellMorph.setPosition(this.position());
        this.setExtent(this.cellMorph.extent().subtract(1));
        return;
    }

    this.labelMorph.show();
    this.cellMorph.normal();
    this.labelMorph.setPosition(this.position().add(new Point(
        this.edge,
        this.border + SyntaxElementMorph.prototype.typeInPadding
    )));

    if (isList) {
        this.cellMorph.setPosition(this.labelMorph.bottomLeft().add(
            new Point(0, SyntaxElementMorph.prototype.typeInPadding)
        ));
    } else {
        this.cellMorph.setPosition(this.labelMorph.topRight().add(new Point(
            fontSize / 3,
            0
        )));
        this.labelMorph.setTop(
            this.cellMorph.top()
                + (this.cellMorph.height() - this.labelMorph.height()) / 2
        );
    }

	this.bounds.corner.y = this.cellMorph.bottom()
    	+ this.border
		+ SyntaxElementMorph.prototype.typeInPadding;

    this.bounds.corner.x = Math.max(
        this.cellMorph.right(),
        this.labelMorph.right()
    ) + this.edge
        + SyntaxElementMorph.prototype.typeInPadding;
    this.drawNew();
    this.changed();
};

