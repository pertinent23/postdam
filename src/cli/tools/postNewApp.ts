import shell from 'shelljs';
import path from 'path';
import PostDir from '../../bin/PostDir';
import PostFile from '../../bin/PostFile';
import PostEnv from '../PostEnv';

export type PostNewOptions = {
    views: boolean,
    entry: string,
    validators: boolean,
    name?: string
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
    shell.exec( `npm --prefix ${dirname} install ${ list.join( ' ' ) } --save` );
};

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

    postBuildFolders( dir, {
        ...options,
        name
    } );
    postInstallPackages( dir.getPath(), options.views );
};

export function postBuildConfigs( base: string, options: PostNewOptions ) : void{
    const 
        env = new PostEnv( base ),
        packageJSON = new PostFile( `${ base }/package.json` ),
        gitignore = new PostFile( `${ base }/.gitignore` ),
        typescriptJSON = new PostFile( `${ base }/tsconfig.json` );
    env.getConfigFile().write( {
        name: options.name,
        path: base,
        engine: 'pug',
        version: '1.0.0',
        options: {
            entry: options.entry,
            views: options.views,
            validators: options.validators
        }
    } );

    typescriptJSON.write( {
        compilerOptions: {
          target: "es2016", 
          module: "commonjs",  
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
          outDir: "./dist",                             
          rootDir: "./src",  
          moduleResolution: "node",
          strictNullChecks: true    
        },
        exclude:[
          "./node_modules",
          "./dist"
        ]
    } );

    packageJSON.write( {
        name: options.name,
        version: "1.0.0",
        description: "getting started with postdam",
        main: `dist/${ options.entry }.js`,
        author: "",
        scripts: {
          start: "pm build",
          test: "pm serve",
        }
    } );

    gitignore.write( `node_modules\ndist` );
};

export function postBuildViews( base: PostDir ) : void {
    if ( !base.exist() ) {
        base.mkdir();
    }
};

export function postBuildValidators( base: PostDir ) : void {
    if ( !base.exist() ) {
        base.mkdir();
    }
};

export function postBuildGuards( base: PostDir ) : void {
    base.mkdir();
};

export function postBuildBin( base: PostDir ) : void {
    base.mkdir();
};

export function postBuildMiddleWares( base: PostDir ) : void {
    base.mkdir();
};

export function postBuildRoutes( base: PostDir ) : void {
    base.mkdir();
};

export function postBuildFolders( base: PostDir, options: PostNewOptions ) : void {
    base.navigate( 'static' ).mkdir();
    let services;
    const 
        entry = new PostFile( './../../models/entry.mdl' ),
        src =
            base
                .navigate( 'src' ).mkdir();
            postBuildMiddleWares( src.navigate( 'middlewares' ) );
            postBuildRoutes( src.navigate( 'routes' ) );
            services = src.navigate( 'services' ).mkdir();
    postBuildGuards( services.navigate( 'guards' ) );
    postBuildBin( services.navigate( 'bin' ) );

    if ( options.validators ) {
        postBuildValidators( services.navigate( 'validators' ) );
    }

    if ( options.views ) {
        postBuildViews( services.navigate( 'views' ) );
    }

    postBuildConfigs( base.getPath(), options );
    entry.readContent().then( content => (
        entry.setPath( `${ src }/${ options.entry}.ts` ).write( content )
    ) );
};