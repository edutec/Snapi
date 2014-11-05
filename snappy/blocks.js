SyntaxElementMorph.prototype.originalShowBubble = SyntaxElementMorph.prototype.showBubble;

SyntaxElementMorph.prototype.showBubble = function(value, exportPic) {
		if (value instanceof Association) {
				sf = this.parentThatIsA(ScrollFrameMorph);
				morphToShow = new AssociationWatcherMorph(value);		
				morphToShow.update(true);
				morphToShow.step = value.update;
				bubble = new SpeechBubbleMorph(
								morphToShow,
								null,
								Math.max(this.rounding - 2, 6),
								0
								);
				bubble.popUp(
								this.world(),
								this.rightCenter().add(new Point(2, 0)),
								false
							);
				if (exportPic) {
						this.exportPictureWithResult(bubble);
				}
				if (sf) {
						bubble.keepWithin(sf);
				}
		} else {
				this.originalShowBubble(value, exportPic);
		}
}
