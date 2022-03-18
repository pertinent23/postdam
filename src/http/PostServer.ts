import express, { Express } from "express";
import { Server } from 'http';
import PostEvent, { PostEventData, PostEventDataType, PostEventCallback, PostListeningEvent, PostErrorEvent } from "./utils/PostEvent";
import EventEmitter from 'events';
import PostEnv from "../cli/PostEnv";
import { Observable } from "rxjs";

export default class PostServer extends Server{
    public static POST_MAIN_EVENT = `server.data:postdam@${ Math.random().toString( 5 ).slice( 3, 8 ) }`;
    protected application? : Express;
    protected port : string | number = process.env.port || 3000;
    protected emitter : EventEmitter = new EventEmitter();
    protected listener? : Observable<PostEvent<PostEventDataType>>;
    protected _onerror? : PostErrorEvent;
    protected _onlisten? : PostListeningEvent;

    constructor( port? : number ) {
        const 
            application = express();
                super( application );
        this.setApplication( application );
        this.setPort( port );
        this._build();
    }

    protected setApplication( app: Express ) {
        this.application = app;
    }

    public onListening( callback : PostListeningEvent ) : PostServer {
        this._onlisten = callback;
            this._setEvents();
        return this;
    }

    public onError( callback : PostErrorEvent ) : PostServer {
        this._onerror = callback;
            this._setEvents();
        return this;
    }

    protected _build() : void {
        this._setListener( new Observable( ( subscriber ) => {
            this.emitter.on( PostServer.POST_MAIN_EVENT, ( data : PostEvent<PostEventDataType> ) => (
                subscriber.next( data )
            ) )
        } ) )

        this.on( 'listening', () => {
            if ( PostEnv.get( 'env' ) === 'dev' ) {
                const 
                    port = this.getPort();
                console.log( `Server waching on http://localhost:${ port }` );
            }
        } );
    }

    protected _parse( data: PostEventData ) : PostEvent<PostEventDataType>{
        return new PostEvent( data.type, data.data );
    }

    protected _setListener( observer : Observable<PostEvent<PostEventDataType>> ) {
        this.listener = observer;
    }

    public when( event : string, callback : PostEventCallback ) : PostServer {
        this.listener?.subscribe( ( observer ) => {
            if ( event === observer.getType() ) {
                callback( observer );
            }
        } );
        return this;
    }

    public setPort( port?: number ) : PostServer {
        if ( port ) {
                this.port = port;
            this.application?.set( 'port', port );
        }
        return this;
    }

    protected _setEvents() : void {
        if ( this._onlisten ) 
            this.on( 'listening',  this._onlisten  );
        this.on( 'error', this._onerror ? this._onerror : ( err ) => {
            switch ( err.name ) {
                case 'EACCES':
                      console.error( `${ this.getPort() } requires elevated privileges` );
                  process.exit( 1 );
                case 'EADDRINUSE':
                        console.error( `${ this.getPort() } is already in use` );
                    process.exit( 1 );
                default:
                  throw err;
            }
        } );
    }

    public trigger( event : string, data : PostEventDataType ) : PostServer {
        this.emitter.emit( PostServer.POST_MAIN_EVENT,
            this._parse( {
                type: event,
                data: data
            } )
        );
        return this;
    }

    public getApplication() : Express | undefined {
        return this.application;
    }

    public getPort() : number {
        return typeof this.port === 'string' ? parseInt( this.port ) : this.port;
    }

    public start( port?: number ) : PostServer {
            this.listen( port || this.getPort() );
        return this;
    }

    public set( key: string, val: any ) : PostServer {
            this.application?.set( key, val );
        return this;
    }

    public get( key: string ) : any {
        return this.application?.get( key );
    }
};