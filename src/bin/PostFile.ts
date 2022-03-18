import fs from 'fs';
import Handlebars from 'handlebars';

export default class PostFile{
    protected path : string = '';
    static FILE_NAME_REG: RegExp = /^[^\/\:\*\?"<>\|\\]{1,}$/i;
    static COMPONENT_NAME_REG: RegExp = /^[a-z]*[a-z0-9\-]*[a-z]$/i;

    constructor( path: string ) {
        this.setPath( path );
    }

    protected setPath( val: string ) : void {
        if ( !val )
            throw new Error( `( Postdam.PostFile ) path cannot be an empty string` );
        this.path = val;
    }

    public exist() : boolean {
        return fs.existsSync( this.path );
    }

    public readContent( encode: BufferEncoding  = 'utf8' ) : Promise<string> {
        return new Promise( ( resolve, reject ) => {
            fs.readFile( this.path, encode, ( err, data ) => {
                if ( err )
                    return reject( err );
                return resolve( data );
            } );
        } );
    }

    public compile( params: Record<string, any> ) : Promise<string> {
        return new Promise( ( resolve, reject ) => {
            return this.readContent().then( data => {
                const 
                    compiler = Handlebars.compile( data );
                return resolve( compiler( params ) );
            } ).catch( reject );
        } );
    }

    public static isValidFileName( name: string ) : boolean {
        return PostFile.FILE_NAME_REG.test( name );
    }

    public static isValidComponentName( name: string ) : boolean {
        return PostFile.COMPONENT_NAME_REG.test( name );
    }
};