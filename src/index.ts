#!/usr/bin/env -S node --es-module-specifier-resolution=node --experimental-json-modules

import PostServer from "./http/PostServer";
import PostEnv from "./cli/PostEnv";
import PostCLI from "./cli/PostCLI";
import PostResponse from "./http/utils/PostResponse";

const 
    server = new PostServer(),
    cli = new PostCLI();
        //server.start();
PostEnv.set( ':server', server );

export {
    PostEnv,
    PostServer,
    PostResponse
};