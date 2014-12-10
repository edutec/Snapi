SpeechBubbleMorph.prototype.showUp = function (world, pos) {
    this.drawNew();
    this.setPosition(pos.subtract(new Point(0, this.height())));
    this.addShadow(new Point(2, 2), 80);
    this.keepWithin(world);
	if(world.children.indexOf(this) == -1) { world.add(this) };
    this.fullChanged();
	this.mouseDownLeft = function () {
		this.destroy();
	};
};

