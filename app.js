const tsvToJson = require( './tsvToJson' );

const dataPath = './static_data';

const newFiles = tsvToJson.getNewTsvFilesSync( dataPath );
console.log( newFiles );

newFiles.forEach( file => {
    tsvToJson.tsvFileToJsonFileSync( dataPath, file.tsvFile, file.jsonFile );
}); 
