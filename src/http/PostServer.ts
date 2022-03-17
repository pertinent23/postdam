import express, { Express } from "express";
import http, { Server } from 'http';
import PostEvent, { PostEventData, PostEventDataType, PostEventCallback, PostNaturalEvent } from "./utils/PostEvent";
import EventEmitter from 'events';
import PostEnv from "../cli/PostEnv";
import { Observable } from "rxjs";

export default class PostServer{
    public static POST_MAIN_EVENT = 'server.data';
    protected application : Express = express();
    protected server : Server = http.createServer( this.application );
    protected port : string | number = process.env.port || 3000;
    protected emitter : EventEmitter = new EventEmitter();
    protected listener? : Observable<PostEvent<PostEventDataType>>;
    protected _onerror? : PostNaturalEvent;
    protected _onlisten? : PostNaturalEvent;

    constructor( port? : number ) {
        this.setPort( port );
        this._build();
    }

    public onListen( callback : PostNaturalEvent ) : PostServer {
        this._onlisten = callback;
            this._setEvents();
        return this;
    }

    public onError( callback : PostNaturalEvent ) : PostServer {
        this._onerror = callback;
            this._setEvents();
        return this;
    }

    protected _build() : void {
        this.emitter.on( PostServer.POST_MAIN_EVENT, ( data : PostEvent<PostEventDataType> ) => (
            this._setListener( new Observable( ( subscriber ) => {
                subscriber.next( data );
            } ) )
        ) );
    }

    protected _parse( data: PostEventData ) : PostEvent<PostEventDataType>{
        return new PostEvent( data.type, data.data );
    }

    protected _setListener( observer : Observable<PostEvent<PostEventDataType>> ) {
        this.listener = observer;
    }

    public on( event : string, callback : PostEventCallback ) : PostServer {
        this.listener?.subscribe( ( observer ) => {
            if ( event === observer.getType() ) {
                callback( observer );
            }
        } );
        return this;
    }

    public setPort( port?: number ) : PostServer {
        if ( port ) 
            this.port = port;
        return this;
    }

    protected _setEvents() : void {
        if ( this._onlisten ) this.server.on( 'listening', this._onlisten );
        if ( this._onerror ) this.server.on( 'error', this._onerror );
    }

    public listen( port?: number ) : PostServer {
        this.setPort( port );
            this._setEvents();
                this.application.set( 'port', this.getPort() );
                this.server.listen( () => {
                    if ( PostEnv.get( 'env' ) === 'dev' ) {
                        const 
                            port = this.getPort();
                        console.log( `Server waching on http://localhost:${ port }` );
                    }
                } );
        return this;
    }

    public emit( event : string, data : PostEventDataType ) : PostServer {
        this.emitter.emit( PostServer.POST_MAIN_EVENT,
            this._parse( {
                type: event,
                data: data
            } )
        );
        return this;
    }

    public getServer() : Server{
        return this.server;
    }

    public getApplication() : Express {
        return this.application;
    }

    public getPort() : number {
        return typeof this.port === 'string' ? parseInt( this.port ) : this.port;
    }
};