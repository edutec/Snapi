PushButtonMorph.prototype.disable = function() {
    this.labelColor = new Color(180,180,180);
    this.createLabel();
    this.fixLayout();
    this.action = null;
}

DialogBoxMorph.prototype.originalPopUp = DialogBoxMorph.prototype.popUp;
DialogBoxMorph.prototype.popUp = function (world) {
    this.originalPopUp(world);
    this.show();
    if (this.popUpPosition) { 
        this.setPosition(this.popUpPosition);
        if (this.arrow) { this.placeArrow(); }
    }
};

DialogBoxMorph.prototype.tutorialWindow = function (
    title,
    pic,
    msg,
    popUpPosition,
    arrowOrientation,
    previousWindow,
    nextWindow,
    cancelAction
) {
    var bdy = new AlignmentMorph('column', this.padding);

    function labelText(string) {
        return new TextMorph(
            localize(string),
            12,
            null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            MorphicPreferences.isFlat ? null : new Point(1, 1),
            new Color(255, 255, 255) // shadowColor
        );
    }

    this.popUpPosition = popUpPosition;
    this.cancelAction = cancelAction;
    this.isDraggable = false;

    bdy.setColor(this.color);

    if (msg) {
        bdy.add(labelText(msg));
    }

    bdy.fixLayout();

    this.labelString = title;
    this.createLabel();
    if (pic) {this.setPicture(pic); }

    this.addBody(bdy);

    bdy.fixLayout();

    this.previousButton = this.addButton(previousWindow, '« Previous');
    if (!previousWindow) { this.previousButton.disable() };

    this.addButton(this.cancelAction, 'Quit');

    this.nextButton = this.addButton(nextWindow, 'Next »');
    if (!nextWindow) { this.nextButton.disable() };

    this.fixLayout();
    this.drawNew();
    this.fixLayout();

    this.arrow = new TriangleBoxMorph(arrowOrientation);
    this.arrow.setColor(this.titleBarColor);
    if (arrowOrientation) { this.add(this.arrow) };

    this.placeArrow = function() {
        if (this.arrow.orientation == 'left') {
            this.arrow.setLeft(this.left() - 20);
            this.moveBy(new Point(20, -14));
        } else if (this.arrow.orientation == 'right') {
            this.arrow.setRight(this.right() + 20);
            this.moveBy(new Point(- this.extent().x - 20, -14));
        }
    }

    return this;
};

