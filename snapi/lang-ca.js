tempDict = {

/*
    Special characters: (see <http://0xcc.net/jsescape/>)

    Ä, ä   \u00c4, \u00e4
    Ö, ö   \u00d6, \u00f6
    Ü, ü   \u00dc, \u00fc
    ß      \u00df
*/
    // primitive blocks:

    /*
        Attention Translators:
        ----------------------
        At this time your translation of block specs will only work
        correctly, if the order of formal parameters and their types
        are unchanged. Placeholders for inputs (formal parameters) are
        indicated by a preceding % prefix and followed by a type
        abbreviation.

        For example:

            'say %s for %n secs'

        can currently not be changed into

            'say %n secs long %s'

        and still work as intended.

        Similarly

            'point towards %dst'

        cannot be changed into

            'point towards %cst'

        without breaking its functionality.
    */

	// Dialogs:
	'About Snap!':
		'Sobre Snap!',
	'About Snapi!':
		'Sobre Snapi!',
	'About Snapi':
		'Sobre Snapi',
	'Snapi! 1.0 beta\n\nCopyright \u24B8 2015 Citilab\nedutec@e-citilab.eu\n\nSnapi! is a Snap! extension developed by the Edutec\neducational research team at Citilab, Barcelona.\n\nIts aim is to take advantage of Snap!\'s wonderful\neducational and computational power to bring API\nprogramming and OpenData to the general public.\n\nThis project has been sponsored by the Barcelona\nMetropolitan Area administration (AMB).\n\nFor any questions or suggestions, please contact us at:\nedutec@e-citilab.eu.\n\nhttp://amb.cat\nhttp://citilab.eu\nhttp://edutec.citilab.eu':
		'Snapi! 1.0 beta\n\nCopyright \u24B8 2015 Citilab\nedutec@e-citilab.eu\n\nSnapi! és una extensió de Snap! desenvolupada per\nl\'equip de recerca Edutec del Citilab (Cornellà de\nLlobregat, Barcelona)\n\nEl seu objectiu és aprofitar les grans capacitats\neducatives i computacionals de Snap! per tal d\'apropar\nla programació amb APIs i OpenData a la ciutadania.\n\nAquest projecte ha estat finançat per l\'AMB.\n\nPer qualsevol dubte o suggerència, ens podeu trobar a:\nedutec@e-citilab.eu.\n\nhttp://amb.cat\nhttp://citilab.eu\nhttp://edutec.citilab.eu',

	// Errors:
	'JSON string couldn\'t be parsed':
		'el text no sembla ser un JSON correcte',
	'property ':
		'no s\'ha trobat la propietat ',
	' not found in this object':
		' en aquest objecte',
	
	// Control:
	'for %upvar in %l %cs':
		'per %upvar de %l %cs',
	'each item':
		'cada element',


	// Color:
	'color %clr':
		'color %clr',
	'color r: %n g: %n b: %n':
		'color r: %n g: %n b: %n',
	'color h: %n s: %n v: %n':
		'color h: %n s: %n v: %n',
	'magic color from %s':
		'color magic de %s',
	'Hello!':
		'Hola!',

	// API:
	'object from JSON %s':
		'objecte de JSON %s',
	'{"name":"John","surname":"Doe","age":14}':
		'{"nom":"Joan","cognom":"Petit","edat":11}',
	'JSON from object %l':
		'JSON d\'objecte %l',
	'%s → %s':
		'%s → %s',
	'%s of %s':
		'%s de %s',
	'%method at %protocol %s with parameters %mult%s':
		'%method a %protocol %s amb paràmetres %mult%s',
	'proxied %method at %protocol %s with parameters %mult%s':
		'%method a %protocol %s via proxy amb paràmetres %mult%s',
	'Import API blocks':
		'Importar blocs d\'API',
	'Choose among different API blocks to add to this project.':
		'Escull entre blocs de diferents APIs per afegir al projecte.',

	// New widgets
	'inspect JSON':
		'inspecciona JSON',
	'Inspect':
		'Inspecciona',
	'Close':
		'Tanca',
	'Quit':
		'Sortir',
	'« Previous':
		'« Anterior',
	'Next »':
		'Següent »',
	
    // Maps:
	'Map':
		'Mapa',
	'show map':
		'mostra mapa',
	'hide map':
		'amaga mapa',
	'switch view to %mapView':
		'canvia visualització a %mapView',
	'Road Map':
		'Carreteres',
	'Satellite':
		'Satèl·lit',
	'Political':
		'Polític',
	'road':
		'carreteres',
	'satellite':
		'satèl·lit',
	'political':
		'polític',
	'set center at long: %n lat: %n':
		'fixa el centre a long: %n lat: %n',
	'current longitude':
		'longitud actual',
	'current latitude':
		'latitud actual',
	'x from longitude %n':
		'x de longitud %n',
	'y from latitude %n':
		'y de latitud %n',
	'set zoom level to %zoomLevel':
		'fixa zoom a %zoomLevel',
	'zoom level':
		'zoom',
	'add %clr marker at long %n lat %n with label %s':
		'afegeix marcador %clr a long %n lat %n amb etiqueta %s',
	'add %clr marker at coordinates %l with label %s':
		'afegeix marcador %clr a coordenades %l amb etiqueta %s',
	'show markers':
		'mostra marcadors',
	'hide markers':
		'amaga marcadors',
	'remove all markers':
		'elimina marcadors',
	'show bubbles':
		'mostra bafarades',
	'hide bubbles':
		'amaga bafarades',
	'remove': 
		'elimina',
	'show in OpenStreetMap':
		'mostra a OpenStreetMap',
	'show in GoogleMaps':
		'mostra a GoogleMaps',
	'show in Google StreetView':
		'mostra a Google StreetView',

	// API libraries
	// Genderize.io
	
	'gender of %s':
		'gènere de %s',
	'female':
		'dona',
	'male':
		'home',
	'gender of %txt':
		'gènere de %txt',
	'gender of %txt in country with code %txt':
		'gènere de %txt al país amb codi %txt',
	'gender of %txt in language with code %txt':
		'gènere de %txt en l\'idioma amb codi %txt',
	'all language codes':
		'codis de tots els idiomes',
	'all country codes':
		'codis de tots els països',
	'%txt is %txt':
		'%txt és %txt',
	'%txt is %txt in country with code %txt':
		'%txt és %txt al país amb codi %txt',
	'%txt is %txt in language with code %txt':
		'%txt és %txt en l\'idioma amb codi %txt',

	// Missing strings
	'JavaScript function ( %mult%s ) { %code }':
		'funció JavaScript ( %mult%s ) { %code }',
	'Reset Password...':
		'Restablir contrasenya...',
	'Reset password':
		'Restablir contrasenya',
	'User name:':
		'Nom d\'usuari:',
	'User name:':
		'Nom d\'usuari:',
	'Codification support':
		'Suport per a codificació',
	'check for block\nto text mapping features':
		'marca\'m per activar les\nfuncionalitats de conversió\nde blocs a codi',
	'add a new Turtle sprite':
		'afegeix un nou objecte Tortuga',
	'paint a new sprite':
		'dibuixa un nou objecte',

};

// Add attributes to original SnapTranslator.dict.ca
for (var attrname in tempDict) { SnapTranslator.dict.ca[attrname] = tempDict[attrname]; }
