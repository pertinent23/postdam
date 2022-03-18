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
            data = JSON.parse( content );
        shell.exec( `cd ${ root.getPath() } && tsc && node ./dist/${data.entry}.ts` );
    } );
};