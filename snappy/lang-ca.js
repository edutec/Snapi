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
	'value at %s of object %s':
		'valor %s d\'objecte %s',
	'%method at %protocol %s with parameters %mult%s':
		'%method a %protocol %s amb paràmetres %mult%s',
	'proxied %method at %protocol %s with parameters %mult%s':
		'%method a %protocol %s via proxy amb paràmetres %mult%s',
	'Import API blocks':
		'Importar blocs d\'API',
	'Choose among different API blocks to add to this project.':
		'Escull entre blocs de diferents APIs per afegir al projecte.',
	'inspect JSON':
		'inspecciona JSON',
	'Inspect':
		'Inspecciona',
	'Close':
		'Tanca',
	
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
	'set zoom level to %zoomLevel':
		'fixa zoom a %zoomLevel',
	'zoom level':
		'zoom',
	'%clr marker at long %n lat %n value %s':
		'marcador %clr a long %n lat %n valor %s',
	'%clr marker at %l value %s':
		'marcador %clr a %l valor %s',
	'show markers':
		'mostra marcadors',
	'hide markers':
		'amaga marcadors',
	'remove all markers':
		'elimina marcadors',
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
		'%txt és %txt en l\'idioma amb codi %txt'
};

// Add attributes to original SnapTranslator.dict.ca
for (var attrname in tempDict) { SnapTranslator.dict.ca[attrname] = tempDict[attrname]; }
