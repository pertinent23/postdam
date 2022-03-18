import { Application } from "express";

export type PostEventDataType = number | string | object | boolean;

export type PostNaturalEvent = {
    ( parent : Application ) : void
};

export type PostListeningEvent = {
    (): void
};

export type PostErrorEvent = {
    ( err: Error ) : void 
};

export type PostEventData = {
    type: string,
    data: PostEventDataType
};

export type PostEventCallback = {
    ( event: PostEvent<PostEventDataType> ): void 
};

export default class PostEvent<T>{
    protected data? : T;
    protected type : string = '';
    protected progression : string [ ] = [ ];

    constructor( type: string, data : T ) {
        this.data = data;
        this.type = type;
    }

    public getType() : string {
        return this.type;
    }

    public getData() : T | undefined{
        return this.data;
    }

    public addProgression( item : string ) : PostEvent<T> {
            this.progression.push( item );
        return this;
    }
};