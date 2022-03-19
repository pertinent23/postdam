import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export default class PostDir{
    protected path : string = '';
    static APP_NAME_REG: RegExp = /^[a-z0-9@]{1,}[a-z0-9\-]{1,}[a-z0-9]*$/i;

    constructor( path: string ) {
        this.setPath( path );
    }

    protected setPath( val: string ) : void {
        if ( !val )
            throw new Error( `( Postdam.PostFile ) path cannot be an empty string` );
        this.path = val;
    }

    public readFiles() : Promise<string[]> {
        return new Promise( ( resolve, reject ) => {
            fs.readdir( this.path, ( err, files ) => {
                if ( err ) 
                    return reject( err );
                return resolve( files );
            } );
        } );
    }

    public navigate( path: string ) : PostDir{
        return new PostDir( `${ this.path }/${ path }` );
    }

    public mkdir() : PostDir {
        if ( !this.exist() )
            fs.mkdirSync( this.path );
        return this;
    }

    public getPath() : string {
        return this.path;
    }

    public close() : PostDir{
        return new PostDir( this.path );
    }

    public exist() : boolean {
        return fs.existsSync( this.path );
    }

    public isDirEmpty() : Promise<boolean> {
        return new Promise( ( resolve, reject ) => {
            return this.readFiles().then( files => (
                resolve( files.length ? false : true )
            ) ).catch( err => reject( err ) );
        } );
    }

    public static isValidAppName( name: string ) : boolean{
        return PostDir.APP_NAME_REG.test( name );
    }

    public static resolvePath( meta: string, link: string ) : string {
        return path.join( path.dirname(
            fileURLToPath(  meta ) 
        ), link );
    }
}