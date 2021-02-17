'use strict';

const fs = require( 'fs' );

function checkForNewTsvs( tsvPath ) {
	if ( !fs.existsSync( tsvPath ) ) {
		throw new Error( `static data path ${tsvPath} does not exist` );
	}

	const tsvFiles = fs.readdirSync( tsvPath ).filter( c => c.split( '.' ).pop() == 'tsv' );
	if ( tsvFiles.length == 0 ) {
		throw new Error( `no tsv files found in static data path ${tsvPath}` );
	}


	tsvFiles.forEach( e => checkForNewTsv( tsvPath, e ) ); 
}

function checkForNewTsv( tsvPath, tsvFile ) {
	var tsvPathAndFile = tsvPath + '/' + tsvFile;
	var jsonPathAndFile = tsvPath + '/' + tsvFile.split( '.' ).shift() + '.json';

	if ( !fs.existsSync( jsonPathAndFile ) ||
		getFileMTime( tsvPathAndFile ) > getFileMTime( jsonPathAndFile ) ) {
		tsvFileToJsonFile( tsvPathAndFile, jsonPathAndFile );
	}
}

function getFileMTime( pathAndFile ) {
        return fs.statSync( pathAndFile ).mtimeMs;
}

function tsvFileToJsonFile( tsvPathAndFile, jsonPathAndFile ) {
        var tsv = fs.readFileSync( tsvPathAndFile, 'utf8' );
		var json = tsvToJson( tsv );
		try {
			var fd = fs.openSync( jsonPathAndFile, 'w+' );
			fs.writeSync( fd, JSON.stringify( json ) );
			fs.closeSync( fd );
		} catch ( err ) {
			console.log( `Unable to open ${jsonPathAndFile} for writing: ${err.code} (${err.errno})` );
		}
}

function tsvToJson( tsv ) {
	const lines = tsv.split( '\n' );
	const headers = lines.shift().split( '\t' );
	return lines.map( line => {
		const data = line.split( '\t' );
		return headers.reduce( ( obj, nextKey, index ) => {
			obj[ nextKey ] = data[ index ];
			return obj;
		}, {} );
	} );
}

module.exports = {
	checkForNewTsvs	
};
