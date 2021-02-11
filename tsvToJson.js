'use strict';

const fs = require( 'fs' );
//const path = require( 'path' );

function checkForNewTsvs( path ) {
	const tsvFiles = fs.readdirSync( path ).filter( c => c.split( '.' ).pop() == 'tsv' );
	tsvFiles.forEach( e => checkForNewTsv( path, e ) ); 
	console.log( tsvFiles );
}

function checkForNewTsv( path, tsvFile ) {
	var tsvPathAndFile = path + '/' + tsvFile;
	var jsonPathAndFile = path + '/' + tsvFile.split( '.' ).shift() + '.json';

	var tsvMTime = getFileMTime( tsvPathAndFile );

	if ( !fs.existsSync( jsonPathAndFile ) ||
		getFileMTime( tsvPathAndFile ) > getFileMTime( jsonPathAndFile ) ) {
		tsvFileToJsonFile( tsvPathAndFile, jsonPathAndFile );
	}
/*
	fs.stat( tsvPathAndFile, function( err, stats ) {
		var mtimeMs = stats.mtimeMs;
		console.log( mtimeMs );
		tsvFileToJsonFile( tsvPathAndFile, jsonPathAndFile );
	});
*/
}

function getFileMTime( pathAndFile ) {
        return fs.statSync( pathAndFile ).mtimeMs;
}

function tsvFileToJsonFile( tsvPathAndFile, jsonPathAndFile ) {
        var tsv = fs.readFileSync( tsvPathAndFile, 'utf8' );
        var json = tsvToJson( tsv );
        try {
                fs.writeFileSync( jsonPathAndFile, JSON.stringify( json ) );
        } catch ( err ) {
                console.log( err );
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
