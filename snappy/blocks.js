BlockMorph.prototype.originalUserMenu = BlockMorph.prototype.userMenu;

BlockMorph.prototype.userMenu = function () {
	var menu = this.originalUserMenu();
	menu.addItem(
		'inspect JSON',
		function() {
			var top = this.topBlock(),
				receiver = top.receiver(),
				stage;  
			if (top !== this) {return; }
			if (receiver) {
				stage = receiver.parentThatIsA(StageMorph);
				if (stage) {
					stage.threads.stopProcess(top);
					stage.threads.startProcess(top, false, false, function(result) { console.log(result); world.inspectJson(result) });
				}
			}
		}
	);
	return menu;
}


// labelPart() proxy
SyntaxElementMorph.prototype.originalLabelPart = SyntaxElementMorph.prototype.labelPart;

SyntaxElementMorph.prototype.labelPart = function(spec) {
	var part;
	switch (spec) {
		case '%protocol':
			part = new InputSlotMorph(
					null,
					false,
					{
					'http' : ['http://'],
					'https' : ['https://'], 
					},
					true
					);
			break;
		case '%method':
			part = new InputSlotMorph(
					null,
					false,
					{
					'GET' : ['GET'],
					'POST' : ['POST'], 
					'PUT' : ['PUT'], 
					'HEAD' : ['HEAD'], 
					'DELETE' : ['DELETE'], 
					'TRACE' : ['TRACE'], 
					'CONNECT' : ['CONNECT'], 
					},
					true
					);
			break;

		default:
			part = SyntaxElementMorph.prototype.originalLabelPart(spec);
	}
	return part;
}

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
