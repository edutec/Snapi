// SpriteBubbleMorph.proxy.dataAsMorph proxy

SpriteBubbleMorph.prototype.originalDataAsMorph = SpriteBubbleMorph.prototype.dataAsMorph;

SpriteBubbleMorph.prototype.dataAsMorph = function (data) {
		console.log(data);
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

// Block specs

SpriteMorph.prototype.originalInitBlocks = SpriteMorph.prototype.initBlocks;

SpriteMorph.prototype.initBlocks = function() {

		this.originalInitBlocks();

		this.blocks.jsonObject =
		{
				type: 'reporter',
				category: 'api',
				spec: 'object from JSON %s'
		};
		this.blocks.newAssociation =
		{
				type: 'reporter',
				category: 'api',
				spec: '%s → %s'
		};
		this.blocks.setValue =
		{
				type: 'command',
				category: 'api',
				spec: 'set value of %s to %s'
		};
		this.blocks.getValue =
		{
				type: 'reporter',
				category: 'api',
				spec: 'value of %s'
		};
		this.blocks.associationAt =
		{
				type: 'reporter',
				category: 'api',
				spec: 'association at %s of object %s'
		};
		this.blocks.valueAt =
		{
				type: 'reporter',
				category: 'api',
				spec: 'value at %s of object %s'
		};

		this.blocks.apiCall =
		{
				type: 'reporter',
				category: 'api',
				spec: 'call API at http:// %s with parameters %exp'
		};

}

SpriteMorph.prototype.initBlocks();

// blockTemplates proxy

SpriteMorph.prototype.originalBlockTemplates = SpriteMorph.prototype.blockTemplates;

// Definition of our new primitive blocks

SpriteMorph.prototype.blockTemplates = function(category) {
		var myself = this;

		var blocks = myself.originalBlockTemplates(category); 

		function blockBySelector(selector) {
				var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
				newBlock.isTemplate = true;
				return newBlock;
		};

		if (category === 'api') {
				// Actual API access blocks
				blocks.push('-');
				// JSON and Associations
				blocks.push(blockBySelector('jsonObject'));
				blocks.push('-');
				blocks.push(blockBySelector('newAssociation'));
				blocks.push(blockBySelector('setValue'));
				blocks.push(blockBySelector('getValue'));
				blocks.push(blockBySelector('associationAt'));
				blocks.push(blockBySelector('valueAt'));
				blocks.push('-');
				// API Access
				blocks.push(blockBySelector('apiCall'));
		};

		return blocks;
}


