export default class PostEnv{
    public static data: Record<string, any> = {
        port: 3000,
        env: 'dev'
    }

    public static get( key: string ) : any {
        return PostEnv.data[ key ];
    }

    public static set( key: string, val : any ) : PostEnv {
            PostEnv.data[ key ] = val;
        return PostEnv;
    }
}