import PostFile from "../bin/PostFile";

export default class PostEnv{
    protected path: string = '';
    protected config: PostFile = new PostFile( process.cwd() );

    constructor( path: string ) {
        this.setPath( path );
        this.build();
    }

    protected build() : void {
        this.config.setPath( this.getPath().concat( '/postdam.json' ) );
    }

    public setPath( path: string ) : PostEnv {
            this.path = path;
        return this;
    }

    public isPostDamProject() : boolean {
        return this.config.exist();
    }

    public getConfigFile() : PostFile {
        return this.config;
    }

    public getPath() : string {
        return this.path;
    }

    public static data: Record<string, any> = {
        port: 3000,
        env: 'dev'
    }

    public static get( key: string ) : any {
        return PostEnv.data[ key ];
    }

    public static set( key: string, val : any ) : void {
        PostEnv.data[ key ] = val;
    }
}