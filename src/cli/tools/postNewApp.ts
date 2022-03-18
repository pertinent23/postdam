import shell from 'shelljs';
import path from 'path';
import PostDir from '../../bin/PostDir';
import PostFile from '../../bin/PostFile';

export type PostNewOptions = {
    views: boolean,
    entry: string
};

export const postPackages = [
    '@types/express',
    'express', 'postdam', 
    'nodemon', 'typescript', 
    'ts-node'
];

export const postViewsPackages = [
    '@types/pug', 'pug'
];

export function postCreateFolder( name: string ) : void {
    shell.mkdir( name );
};

export function postInstallPackages( dirname: string, views: boolean ) : void {
    const 
        list = views ? postPackages.concat( postViewsPackages ) : postPackages;
    shell.cd( dirname );
    shell.exec( `npm install ${ list.join( ' ' ) } --save` );
}

export default async function postNewApp( name: string = 'postdam', options: PostNewOptions ) {
    if( !PostDir.isValidAppName( name ) ) {
        throw new Error( `(PostCLI, postdam) ${ name }, is not a valid app name, app name shall match with ${ PostDir.APP_NAME_REG }` );
    } else {
        if( !PostFile.isValidComponentName( options.entry ) ) {
            throw new Error( `(PostCLI, postdam) ${ options.entry }, is not a valid entry point name, app name shall match with ${ PostFile.COMPONENT_NAME_REG }` );
        }
    }
    const 
        folder = process.cwd(),
        url = path.join( folder, `./${name}` ),
        dir = new PostDir( url );
    if ( !dir.exist() ) {
        postCreateFolder( name );
    } else {
        const 
            isEmpty = await dir.isDirEmpty();
        if ( !isEmpty ) {
            throw new Error( `${ url } is not empty` );
        }
    }

    if ( !shell.which( 'node' ) ) {
        throw new Error( 'Postdam require node to work.' );
    } else {
        if( !shell.which( 'npm' ) ) {
            throw new Error( 'Postdam require npm to work.' );
        }
    }

    postInstallPackages( name, options.views );
    postBuildFolders( dir, options );
};

export function postBuildViews( base: PostDir ) {
    base.mkdir();
};

export function postBuildFolders( base: PostDir, options: PostNewOptions ) : void {
    base.navigate( 'static' ).mkdir();
    let services;
    const 
        src =
            base
                .navigate( 'src' ).mkdir();
            src.navigate( 'middlewares' ).mkdir();
            src.navigate( 'routes' ).mkdir();
            services = src.navigate( 'services' ).mkdir();
                services.navigate( 'guards' ).mkdir();
                services.navigate( 'validators' ).mkdir();
    if ( options.views ) {
        postBuildViews( services.navigate( 'view' ) );
    }
};