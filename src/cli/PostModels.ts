import PostFile from "../bin/PostFile";
import PostDir from "../bin/PostDir";

export default class PostModels extends PostFile{
    protected model: string = '';

    constructor( model: string ) {
        super( model );
    }

    public setPath( path: string ) : PostModels {
        console.log( path );
        super.setPath( 
            PostDir.resolvePath( import.meta.url, `./../../models/${ path }.mdl` )
         );
        return this;
    }

    protected setModel( name: string ) : PostModels{
            this.model = name;
        return this;
    }

    public writeTo( path: string, data: Record<string, any> = { } ) : Promise<void>{
        return new Promise( ( resolve, reject ) => {
            return this.compile( data ).then( content => {
                return new PostFile( path ).write( content ).then( () => (
                    resolve()
                ) ).catch( reject );
            } ).catch( reject );
        } );
    } 
};