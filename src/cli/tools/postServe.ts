import shell from 'shelljs';
import PostEnv from '../PostEnv';

export function postServeApp( root: PostEnv ) : void {
    shell.exec( `nodemon --exec "npm start"` );
};

export function postBuildApp( root: PostEnv ) : void {
    root.getConfigFile().readContent().then( content => {
        const 
            data = JSON.parse( content ),
            params = '--es-module-specifier-resolution=node --experimental-json-modules';
        shell.exec( `tsc --project ${ root.getPath() } && node ${ params } ./dist/${data.options.entry}.js` );
    } );
};