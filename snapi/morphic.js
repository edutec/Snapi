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
	if (! this.hasBeenAddedToStage) {
		stage.add(this);
		this.hasBeenAddedToStage = true;
		this.mouseDownLeft = function () {
			myself.destroy();
			myself.hasBeenAddedToStage = false;
		};
 	}
	this.adjustPosition(pos);
}

