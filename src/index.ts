import PostServer from "./http/PostServer";

const 
    server = new PostServer();
server.listen();

export {
    PostServer
};