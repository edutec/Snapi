// Force flat design
IDE_Morph.prototype.setDefaultDesign = IDE_Morph.prototype.setFlatDesign; 

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
    menu.addItem(
            'Save to disk',
            'saveProjectToDisk',
            'store this project\nin the downloads folder\n'
            + '(in supporting browsers)'
            );
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

    menu.addLine();

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
                    loadLib(line.substring(0, line.indexOf('\t')));
                }
                );
        }
    });

    libMenu.popup(world, pos);
            },
            'Choose among different API blocks to add to this project.'
                );

    menu.addLine();
    menu.addItem(
            'Tutorial',
            function() {
                myself.startTutorial(world);
            }
            );

    menu.popup(world, pos);
};

// Costumes are now pulled from GitHub's API
IDE_Morph.prototype.getCostumesList = function (dirname) {
    var dir,
        costumes = [];

    dir = JSON.parse(this.getURL('https://api.github.com/repos/bromagosa/Snapi/contents/' + dirname));
    dir.forEach( 
            function (each) {
                costumes.push(each.name);
            }
            );
    costumes.sort(function (x, y) {
        return x < y ? -1 : 1;
    });
    return costumes;
};


// Examples are now pulled from GitHub's API
ProjectDialogMorph.prototype.getExamplesProjectList = function () {
    var dir,
        projects = [];
    dir = JSON.parse(this.ide.getURL('https://api.github.com/repos/edutec/Snapi/contents/snapi/examples'));
    dir.forEach(function(each){
        var dta = {
            name: each.name.replace('.xml',''),
        thumb: null,
        notes: null,
        path: each.path
        };
        projects.push(dta)
    })
    projects.sort(function (x, y) {
        return x.name < y.name ? -1 : 1;
    });
    return projects;
};

ProjectDialogMorph.prototype.setSource = function (source) {
    var myself = this,
        msg;

    this.source = source; //this.task === 'save' ? 'local' : source;
    this.srcBar.children.forEach(function (button) {
        button.refresh();
    });
    switch (this.source) {
        case 'cloud':
            msg = myself.ide.showMessage('Updating\nproject list...');
            this.projectList = [];
            SnapCloud.getProjectList(
                    function (projectList) {
                        myself.installCloudProjectList(projectList);
                        msg.destroy();
                    },
                    function (err, lbl) {
                        msg.destroy();
                        myself.ide.cloudError().call(null, err, lbl);
                    }
                    );
            return;
        case 'examples':
            this.projectList = this.getExamplesProjectList();
            break;
        case 'local':
            this.projectList = this.getLocalProjectList();
            break;
    }

    this.listField.destroy();
    this.listField = new ListMorph(
            this.projectList,
            this.projectList.length > 0 ?
            function (element) {
                return element.name;
            } : null,
            null,
            function () {myself.ok(); }
            );

    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    if (this.source === 'local') {
        this.listField.action = function (item) {
            var src, xml;

            if (item === undefined) {return; }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            if (myself.task === 'open') {

                src = localStorage['-snap-project-' + item.name];
                xml = myself.ide.serializer.parse(src);

                myself.notesText.text = xml.childNamed('notes').contents
                    || '';
                myself.notesText.drawNew();
                myself.notesField.contents.adjustBounds();
                myself.preview.texture = xml.childNamed('thumbnail').contents
                    || null;
                myself.preview.cachedTexture = null;
                myself.preview.drawNew();
            }
            myself.edit();
        };
    } else { // 'examples', 'cloud' is initialized elsewhere
        this.listField.action = function (item) {
            var src, xml;
            if (item === undefined) {return; }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            src = myself.ide.getURL(item.path);

            xml = myself.ide.serializer.parse(src);
            myself.notesText.text = xml.childNamed('notes').contents
                || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = xml.childNamed('thumbnail').contents
                || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            myself.edit();
        };
    }
    this.body.add(this.listField);
    this.shareButton.hide();
    this.unshareButton.hide();
    if (this.source === 'local') {
        this.deleteButton.show();
    } else { // examples
        this.deleteButton.hide();
    }
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.openProject = function () {
    var proj = this.listField.selected,
        src;
    if (!proj) {return; }
    this.ide.source = this.source;
    if (this.source === 'cloud') {
        this.openCloudProject(proj);
    } else if (this.source === 'examples') {
        src = this.ide.getURL('snapi/examples/' + proj.name + '.xml');
        this.ide.openProjectString(src);
        this.destroy();
    } else { // 'local'
        this.ide.openProject(proj.name);
        this.destroy();
    }
};

// Snapi! logo

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

IDE_Morph.prototype.snapMenu = function () {
    var menu,
        world = this.world();

    menu = new MenuMorph(this);
    menu.addItem('About Snapi!', 'aboutSnapi');
    menu.addItem('About Snap!', 'aboutSnap');
    menu.addLine();
    menu.addItem(
            'Reference manual',
            function () {
                window.open('help/SnapManual.pdf', 'SnapReferenceManual');
            }
            );
    menu.addItem(
            'Snap! website',
            function () {
                window.open('http://snap.berkeley.edu/', 'SnapWebsite');
            }
            );
    menu.addItem(
            'Download source',
            function () {
                window.open(
                    'http://snap.berkeley.edu/snapsource/snap.zip',
                    'SnapSource'
                    );
            }
            );
    if (world.isDevMode) {
        menu.addLine();
        menu.addItem(
                'Switch back to user mode',
                'switchToUserMode',
                'disable deep-Morphic\ncontext menus'
                + '\nand show user-friendly ones',
                new Color(0, 100, 0)
                );
    } else if (world.currentKey === 16) { // shift-click
        menu.addLine();
        menu.addItem(
                'Switch to dev mode',
                'switchToDevMode',
                'enable Morphic\ncontext menus\nand inspectors,'
                + '\nnot user-friendly!',
                new Color(100, 0, 0)
                );
    }
    menu.popup(world, this.logo.bottomLeft());
};

IDE_Morph.prototype.aboutSnapi = function () {
    var dlg, aboutTxt, pic, world = this.world();

    pic = Morph.fromImageURL('snapi/logos-about.png');
    pic.setExtent(new Point(230, 76));

    aboutTxt = 'Snapi! 1.0 beta\n\n'
        + 'Copyright \u24B8 2015 Citilab\n'
        + 'edutec@e-citilab.eu\n\n'

        + 'Snapi! is a Snap! extension developed by the Edutec\n'
        + 'educational research team at Citilab, Barcelona.\n\n'

        + 'Its aim is to take advantage of Snap!\'s wonderful\n'
        + 'educational and computational power to bring API\n'
        + 'programming and OpenData to the general public.\n\n'

        + 'This project has been sponsored by the Barcelona\n'
        + 'Metropolitan Area administration (AMB).\n\n'

        + 'For any questions or suggestions, please contact us at:\n'
        + 'edutec@e-citilab.eu.\n\n'

        + 'http://amb.cat\n'
        + 'http://citilab.eu\n'
        + 'http://edutec.citilab.eu'

        dlg = new DialogBoxMorph();
    dlg.inform(localize('About Snapi'), localize(aboutTxt), world, pic);
};


IDE_Morph.prototype.originalInit = IDE_Morph.prototype.init; 
IDE_Morph.prototype.init = function () {
    this.originalInit();

    // Allow dropping of InspectorMorphs
    originalWantsDropOf = this.wantsDropOf;
    this.wantsDropOf = function (morph) {
        return (originalWantsDropOf() || morph instanceof InspectorMorph);
    };
}


IDE_Morph.prototype.originalNewProject = IDE_Morph.prototype.newProject;
IDE_Morph.prototype.newProject = function () {
    this.stage.map.markers.forEachFeature(function(feature) {
        var bubble = feature.get('bubble')
        bubble.hasBeenAddedToStage = false;
    bubble.destroy();
    });
    this.originalNewProject();
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
