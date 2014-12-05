// BlockMorph userMenu proxy
// =========================
// We add a menuItem that lets us inspect JSON strings AND Snap! listified JSON objects
// If the result is not JSON-inspectable we just ignore it silently

BlockMorph.prototype.originalUserMenu = BlockMorph.prototype.userMenu;
BlockMorph.prototype.userMenu = function () {
	var menu = this.originalUserMenu(),
		top = this.topBlock();

	if (top instanceof ReporterBlockMorph) {
		menu.addItem(
			'inspect JSON',
			function() {
				var receiver = top.receiver(),
					stage;  
				if (top !== this) {return; }
				if (receiver) {
					stage = receiver.parentThatIsA(StageMorph);
					if (stage) {
						stage.threads.stopProcess(top);
						stage.threads.startProcess(top, false, false, function(result) {
							// This was showing up multiple inspectors, so a very dirty hack was implemented 
							// to close them all but the last one... sorry, dear readers!
							try {
								if (typeof result == 'string') { 
									world.jsonInspect(JSON.parse(result))
								} else if (result instanceof List && result.length() > 0) {
									// A bit convoluted, we're converting stuff to and fro all the time...
									world.jsonInspect(JSON.parse(Process.prototype.objectToJsonString(result)))
								}
							} catch (err) {
								// This doesn't look like something JSON-inspectable, ignore it
							}
						})
					}
				}
			}
		)
	};

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
		case '%zoomLevel':
			part = new InputSlotMorph(
					null,
					true,
					{
					1:[1],
					2:[2],
					3:[3],
					4:[4],
					5:[5],
					6:[6],
					7:[7],
					8:[8],
					9:[9],
					10:[10],
					11:[11],
					12:[12],
					13:[13],
					14:[14],
					15:[15],
					16:[16],
					17:[17],
					18:[18],
					19:[19],
					20:[20]
					},
					false
					);
			break;
		case '%mapView':
			part = new InputSlotMorph(
					null,
					false,
					{
					'Road Map' : ['road'],
					'Satellite' : ['satellite'], 
					'Political' : ['political'], 
					},
					true
					);
			break;
		case '%clr':
            part = new ColorSlotMorph();
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
		} else if (value instanceof Color) {
				sf = this.parentThatIsA(ScrollFrameMorph);
				morphToShow = new Morph();
				morphToShow.setColor(value);
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
