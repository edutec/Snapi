Morph.fromImageURL = function(url) {
    var m = new Morph();

    m.texture = url;

    m.drawNew = function() {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    }

    m.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(
            this.cachedTexture,
            0,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    m.drawNew();

    m.setExtent(new Point(m.cachedTexture.width, m.cachedTexture.height));

    return m;
}

SpeechBubbleMorph.prototype.adjustPosition = function(pos) {
    var oldPos = this.position(),
        newPos = pos.subtract(new Point(0, this.height()));
    if (oldPos != newPos) {
        this.drawNew();
        this.setPosition(newPos);
        this.fullChanged();
    }
}

SpeechBubbleMorph.prototype.showUp = function (stage, pos) {
    var myself = this;
    if (!this.hasBeenAddedToStage) {
        stage.add(this);
        this.hasBeenAddedToStage = true;
        this.mouseDownLeft = function () {
            myself.destroy();
            myself.hasBeenAddedToStage = false;
        };
    }
    this.adjustPosition(pos);
}

var TriangleBoxMorph;

TriangleBoxMorph.prototype = new Morph();
TriangleBoxMorph.prototype.constructor = TriangleBoxMorph;
TriangleBoxMorph.uber = Morph.prototype;

function TriangleBoxMorph(orientation) {
    this.init(orientation);
}

TriangleBoxMorph.prototype.init = function (orientation) {
    TriangleBoxMorph.uber.init.call(this);
    this.orientation = orientation ? orientation : 'left';
    this.setExtent(new Point(20, 28));
}

TriangleBoxMorph.prototype.drawNew = function () {
    var context,
    ext,
    myself = this;

    this.image = newCanvas(this.extent());
    context = this.image.getContext('2d');

    context.fillStyle = myself.color.toString();
    context.beginPath();

    if (this.orientation == 'left') {
        context.moveTo(0,  14);
        context.lineTo(20, 0);
        context.lineTo(20, 28);	
    } else if (this.orientation == 'right') {
        context.moveTo(0,  0);
        context.lineTo(20, 14);
        context.lineTo(0,  28);	
    }

    context.closePath();
    context.fill();
};
