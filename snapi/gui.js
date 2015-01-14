IDE_Morph.prototype.originalOpenIn = IDE_Morph.prototype.openIn;
IDE_Morph.prototype.openIn = function(world) {
	this.originalOpenIn(world);
	if (location.hash.substr(0, 9) === '#tutorial' && ! world.tutorialWasShown) {
		world.tutorialWasShown = true;
		this.startTutorial(world);
	}
}

IDE_Morph.prototype.startTutorial = function(world) {
	var morph,
		image,
		myself = this;

	if (!this.tutorial) { 
		this.tutorial = {};
		this.tutorial.slides = [];
		this.tutorial.currentIndex = 0;

		this.tutorial.addSlide = function(slide) {
			this.slides.push(slide);
		};

		this.tutorial.previous = function() {
			this.currentSlide.cancel();
			this.currentIndex--;
			this.currentSlide = this.slides[this.currentIndex];
			if (this.currentIndex == 0) {
				this.currentSlide.previousButton.disable();
			}
			this.currentSlide.popUp(world);
		};
		this.tutorial.next = function() {
			this.currentSlide.cancel();
			this.currentIndex++;
			this.currentSlide = this.slides[this.currentIndex];
			if (this.currentIndex == this.slides.length - 1) {
				this.currentSlide.nextButton.disable();
			}
			this.currentSlide.popUp(world);
		};
		
		this.tutorial.startIn = function(world) {
			this.currentSlide = this.slides[this.currentIndex]
			this.currentSlide.popUp(world);
		};
	} else {
		this.tutorial.quit();
		return;
	}

	this.tutorial.addSlide((new DialogBoxMorph).tutorialWindow(
			'Benvinguts a Snapi!', //title
			null, // pic
			  'Aquest tutorial us ensenyarà els conceptes bàsics\n' //msg
			+ 'per construïr les vostres pròpies aplicacions en\n'
			+ 'Snapi!.\n\n'
			+ 'Si voleu visitar-lo en un futur, podeu fer-ho\n'
			+ 'escollint "Tutorial" dins el menú d\'arxiu.',
			null, // popUpPosition
			null, // arrowOrientation ('left' / 'right')
			null, // previousWindow function
			function() { myself.tutorial.next() } // nextWindow function
	));

	this.tutorial.addSlide((new DialogBoxMorph).tutorialWindow(
			'Què és Snapi?', 
			null, 
			  'Snapi és una extensió del llenguatge i entorn de\n'
			+ 'programació Snap!, desenvolupat per la Universitat\n'
			+ 'de Berkeley, California.\n\n'
			+ 'Aquesta extensió està concebuda perquè tothom pugui\n'
			+ 'treballar amb dades obertes provinents de serveis\n'
			+ 'públics d\'Internet.\n\n'
			+ 'En aquest cas, treballarem amb les dades obertes que\n'
			+ 'l\'Àrea Metropolitana de Barcelona (AMB) proporciona\n'
			+ 'de forma gratuïta i lliure per a l\'ús de la ciutadania.',
			null,
			null,
			function() { myself.tutorial.previous() },
			function() { myself.tutorial.next() }
	));

	this.tutorial.addSlide((new DialogBoxMorph).tutorialWindow(
			'Importem la llibreria d\'AMB', 
			null, 
			  'Cliqueu en aquest menú (Arxiu) i seleccioneu l\'opció\n'
			+ '"APIs...", al final de tot.\n\n'
			+ 'Seguidament, seleccioneu la llibreria "AMB Barcelona OpenData".',
			new Point(150, 18),
			'left',
			function() { myself.tutorial.previous() },
			function() { myself.tutorial.next() }
	));

	this.tutorial.addSlide((new DialogBoxMorph).tutorialWindow(
			'Categories de blocs', 
			null, 
			  'En Snap! (i, per tant, en Snapi!), programem encaixant\n'
			+ 'blocs que realitzen accions.\n\n'
			+ 'Aquesta caixa mostra les diferents categories de blocs\n'
			+ 'de què disposem.\n\n'
			+ 'Seleccioneu la categoria "Api".',
			new Point(100, 114),
			'left',
			function() { myself.tutorial.previous() },
			function() { myself.tutorial.next() }
	));

	this.tutorial.addSlide((new DialogBoxMorph).tutorialWindow(
			'L\'API d\'OpenData de l\'AMB', 
			null, 
			  'Fixeu-vos que, important la llibreria d\'AMB, hem\n'
			+ 'obtingut uns quants blocs per interactuar amb\n'
			+ 'aquesta API.\n\n'
			+ 'Mitjançant aquests blocs, podem accedir a totes les\n'
			+ 'dades que aquest servei de l\'AMB proporciona.',
			new Point(195, 280),
			'left',
			function() { myself.tutorial.previous() },
			function() { myself.tutorial.next() }
	));

	morph = new FrameMorph();
	image = new Image();
	image.src = 'data:image/png;base64,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';
	morph.setExtent(new Point(image.width, image.height));
	morph.image = image;

	this.tutorial.addSlide((new DialogBoxMorph).tutorialWindow(
			'Comencem a programar', 
			morph,
			  'Arrossegueu aquest bloc cap a l\'àrea gris buida del\n'
			+ 'centre de la pantalla, etiquetada com a "Programes".',
			new Point(195, 345),
			'left',
			function() { myself.tutorial.previous() },
			function() { myself.tutorial.next() }
	));

	this.tutorial.startIn(world);
}

IDE_Morph.prototype.projectMenu = function () {
		var menu,
			myself = this,
			world = this.world(),
			pos = this.controlBar.projectButton.bottomLeft(),
			graphicsName = this.currentSprite instanceof SpriteMorph ?
					'Costumes' : 'Backgrounds',
			shiftClicked = (world.currentKey === 16);

		menu = new MenuMorph(this);
		menu.addItem('Project notes...', 'editProjectNotes');
		menu.addLine();
		menu.addItem('New', 'createNewProject');
		menu.addItem('Open...', 'openProjectsBrowser');
		menu.addItem('Save', 'save');
		if (shiftClicked) {
				menu.addItem(
								'Save to disk',
								'saveProjectToDisk',
								'experimental - store this project\nin your downloads folder',
								new Color(100, 0, 0)
							);
		}
		menu.addItem('Save As...', 'saveProjectsBrowser');
		menu.addLine();
		menu.addItem(
						'Import...',
						function () {
								var inp = document.createElement('input');
								if (myself.filePicker) {
										document.body.removeChild(myself.filePicker);
										myself.filePicker = null;
								}
								inp.type = 'file';
								inp.style.color = "transparent";
								inp.style.backgroundColor = "transparent";
								inp.style.border = "none";
								inp.style.outline = "none";
								inp.style.position = "absolute";
								inp.style.top = "0px";
								inp.style.left = "0px";
								inp.style.width = "0px";
								inp.style.height = "0px";
								inp.addEventListener(
										"change",
										function () {
												document.body.removeChild(inp);
												myself.filePicker = null;
												world.hand.processDrop(inp.files);
										},
										false
										);
								document.body.appendChild(inp);
								myself.filePicker = inp;
								inp.click();
						},
						'file menu import hint' // looks up the actual text in the translator
								);

		menu.addItem(
						shiftClicked ?
						'Export project as plain text...' : 'Export project...',
						function () {
								if (myself.projectName) {
										myself.exportProject(myself.projectName, shiftClicked);
								} else {
										myself.prompt('Export Project As...', function (name) {
												myself.exportProject(name);
										}, null, 'exportProject');
								}
						},
						'show project data as XML\nin a new browser window',
						shiftClicked ? new Color(100, 0, 0) : null
					);

		menu.addItem(
						'Export blocks...',
						function () {myself.exportGlobalBlocks(); },
						'show global custom block definitions as XML\nin a new browser window'
					);

		if (shiftClicked) {
				menu.addItem(
								'Export all scripts as pic...',
								function () {myself.exportScriptsPicture(); },
								'show a picture of all scripts\nand block definitions',
								new Color(100, 0, 0)
							);
		}

		menu.addLine();
		menu.addItem(
						'Import tools',
						function () {
								myself.droppedText(
										myself.getURLsbeOrRelative(
												'tools.xml'
												),
										'tools'
										);
						},
						'load the official library of\npowerful blocks'
					);
		menu.addItem(
						'Libraries...',
						function () {
								// read a list of libraries from an external file,
								var libMenu = new MenuMorph(this, 'Import library'),
				libUrl = 'http://snap.berkeley.edu/snapsource/libraries/' +
				'LIBRARIES';

		function loadLib(name) {
				var url = 'http://snap.berkeley.edu/snapsource/libraries/'
				+ name
				+ '.xml';
		myself.droppedText(myself.getURL(url), name);
		}

		myself.getURL(libUrl).split('\n').forEach(function (line) {
				if (line.length > 0) {
						libMenu.addItem(
								line.substring(line.indexOf('\t') + 1),
								function () {
										loadLib(
												line.substring(0, line.indexOf('\t'))
											   );
								}
								);
				}
		});

		libMenu.popup(world, pos);
						},
						'Select categories of additional blocks to add to this project.'
								);

		menu.addItem(
						localize(graphicsName) + '...',
						function () {
								var dir = graphicsName,
				names = myself.getCostumesList(dir),
				libMenu = new MenuMorph(
						myself,
						localize('Import') + ' ' + localize(dir)
						);

		function loadCostume(name) {
				var url = dir + '/' + name,
				img = new Image();
		img.onload = function () {
				var canvas = newCanvas(new Point(img.width, img.height));
				canvas.getContext('2d').drawImage(img, 0, 0);
				myself.droppedImage(canvas, name);
		};
		img.src = url;
		}

		names.forEach(function (line) {
				if (line.length > 0) {
						libMenu.addItem(
								line,
								function () {loadCostume(line); }
								);
				}
		});
		libMenu.popup(world, pos);
						},
						'Select a costume from the media library'
								);
		menu.addItem(
						localize('Sounds') + '...',
						function () {
								var names = this.getCostumesList('Sounds'),
				libMenu = new MenuMorph(this, 'Import sound');

		function loadSound(name) {
				var url = 'Sounds/' + name,
				audio = new Audio();
		audio.src = url;
		audio.load();
		myself.droppedAudio(audio, name);
		}

		names.forEach(function (line) {
				if (line.length > 0) {
						libMenu.addItem(
								line,
								function () {loadSound(line); }
								);
				}
		});
		libMenu.popup(world, pos);
						},
						'Select a sound from the media library'
								);

		menu.addItem(
						'APIs...',
						function () {
								// read a list of libraries from an external file,
								var libMenu = new MenuMorph(this, 'Import API blocks'),
				libUrl = 'apilibs/LIBRARIES';
		// our vps URL?
		// libUrl = 'http://snap.berkeley.edu/snapsource/libraries/' +
		// 'LIBRARIES';

		function loadLib(name) {
				var url = 'apilibs/'
				+ name
				+ '.xml';
		myself.droppedText(myself.getURL(url), name);
		}

		myself.getURL(libUrl).split('\n').forEach(function (line) {
				if (line.length > 0) {
						libMenu.addItem(
								line.substring(line.indexOf('\t') + 1),
								function () {
										loadLib(
												line.substring(0, line.indexOf('\t'))
											   );
								}
								);
				}
		});

		libMenu.popup(world, pos);
						},
						'Choose among different API blocks to add to this project.'
								);

		menu.popup(world, pos);
};

// Snappy! logo

IDE_Morph.prototype.createLogo = function () {
		var myself = this;

		if (this.logo) {
				this.logo.destroy();
		}

		this.logo = new Morph();
		this.logo.texture = 'snapi/logo.png'; // Overriden
		this.logo.drawNew = function () {
				this.image = newCanvas(this.extent());
				var context = this.image.getContext('2d'),
					gradient = context.createLinearGradient(
									0,
									0,
									this.width(),
									0
									);
				gradient.addColorStop(0, 'black');
				gradient.addColorStop(0.5, myself.frameColor.toString());
				context.fillStyle = MorphicPreferences.isFlat ?
						myself.frameColor.toString() : gradient;
				context.fillRect(0, 0, this.width(), this.height());
				if (this.texture) {
						this.drawTexture(this.texture);
				}
		};

		this.logo.drawCachedTexture = function () {
				var context = this.image.getContext('2d');
				context.drawImage(
								this.cachedTexture,
								5,
								Math.round((this.height() - this.cachedTexture.height) / 2)
								);
				this.changed();
		};

		this.logo.mouseClickLeft = function () {
				myself.snapMenu();
		};

		this.logo.color = new Color();
		this.logo.setExtent(new Point(200, 28)); // dimensions are fixed
		this.add(this.logo);
};

IDE_Morph.prototype.originalInit = IDE_Morph.prototype.init; 
IDE_Morph.prototype.init = function () {
	// Default design upon loading is Flat
	this.saveSetting('design', 'flat');

	this.originalInit();

	// Default language upon loading is Catalan
	this.setLanguage('ca');

	// Allow dropping of InspectorMorphs
	originalWantsDropOf = this.wantsDropOf;
	this.wantsDropOf = function (morph) {
		return (originalWantsDropOf() || morph instanceof InspectorMorph);
    };
}

// Language

IDE_Morph.prototype.originalSetLanguage = IDE_Morph.prototype.setLanguage;
IDE_Morph.prototype.setLanguage = function(lang, callback) {
	var myself = this;

	myself.originalSetLanguage(lang, function() {
		var translation = document.getElementById('snapi-language'),
		src = 'snapi/lang-' + lang + '.js',
		myInnerSelf = this;
		if (translation) {
			document.head.removeChild(translation);
		}
		if (lang === 'en') {
			return this.reflectLanguage('en', callback);
		}
		translation = document.createElement('script');
		translation.id = 'snapi-language';
		translation.onload = function () {
			myInnerSelf.reflectLanguage(lang, callback);
		};
		document.head.appendChild(translation);
		translation.src = src; 
	});
};
