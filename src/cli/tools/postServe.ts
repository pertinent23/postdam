import shell from 'shelljs';
import PostEnv from '../PostEnv';

export function postServeApp( root: PostEnv ) : void {
    root.getConfigFile().readContent().then( content => {
        const 
            data = JSON.parse( content );
        shell.exec( `nodemon ${ root.getPath() }/src/${data.entry}.ts` );
    } );
};

export function postBuildApp( root: PostEnv ) : void {
    root.getConfigFile().readContent().then( content => {
        const 
            data = JSON.parse( content ),
            params = '--es-module-specifier-resolution=node --experimental-json-modules';
        shell.exec( `cd ${ root.getPath() } && tsc && node ${ params } ./dist/${data.entry}.ts` );
    } );
};