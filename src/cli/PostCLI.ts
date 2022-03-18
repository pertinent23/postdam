import { Command } from 'commander';
import PostEnv from './PostEnv';
import postNewApp from './tools/postNewApp';
import { postBuildApp, postServeApp } from './tools/postServe';
import chalk from 'chalk';

export const packages = require( './../../package.json' );

export default class PostCLI{
    protected app: Command = new Command();
    protected env: PostEnv = new PostEnv( process.cwd() );

    constructor() {
        this.app.version( packages.version  );
        this.build( this.app );
    }

    protected actions( type: any, options: Record<string, any> ) : void  {
        //console.log( args );
    }

    protected build( app: Command ) : void {
        const args = process.argv;
            app
                .version( packages.version )
                .name( 'pm' )
                .description( 'make node js server side app fast' )
                .option( '-r, --root', 'return the root path of pm' )
                .option( '-i, --infos', 'return all applications infos' )
            app.addCommand( this.getCreateCommand( 'new' ) );
            app.addCommand( this.getGenerateCommand( 'generate' ) );
            app.addCommand( this.getServeCommand( 'serve' ) );
            app.addCommand( this.getCreateCommand( 'n' ) );
            app.addCommand( this.getGenerateCommand( 'g' ) );
            app.addCommand( this.getServeCommand( 's' ) );
            app.addCommand( this.getBuildCommand( 'build' ) );
            app.addCommand( this.getBuildCommand( 'b' ) );
            app.action( this.actions );
        app.parse( args );
    }

    protected createActions( name: string, options: Record<string, any> ) : void  {
        postNewApp( name, {
            views: options.skipView ? false : true,
            entry: options.entryPoint,
            validators: options.skipValidator ? false : true
        } );
    }

    protected getCreateCommand( name: string ) : Command {
        const 
            create = this.getCommand();
                create.name( `${ name }` );
                create.argument( '<name>', 'the name of the app and the app folder' );
                create.description( 'create a new postdam app' );
                create
                    .option( '-sv, --skip-view', 'do not add view module', false )
                    .option( '-ep, --entry-point <name>', 'the entry point of the app', 'app' )
                    .option( '-sl, --skip-validator <name>', 'do not add validator base', false );
        return create.action( this.createActions );
    }

    protected generateActions( type: string, options: Record<string, any> ) : void  {
        //console.log( args );
        console.log( 'generate ' );
    }

    protected getGenerateCommand( name: string ) : Command {
        const 
            create = this.getCommand();
                create.name( `${ name }` );
                create.argument( '<type>', 'type of the file which will be generate' );
                create.description( 'generate a new validator, middleware, guard, view, route' );
        return create.action( ( type: string, options: Record<string, any> ) => (
            this.generateActions( type, options )
        ) );
    }

    protected serverActions() : void  {
        if( this.env.getConfigFile().exist() ) {
            postServeApp( this.env );   
        } else console.error( chalk.red( `(PostCLI) ${ process.cwd() } is not a postdam project, missing postdam.json file` ) );
    }

    protected getServeCommand( name: string = 'serve' ) : Command {
        const 
            create = this.getCommand();
                create.name( `${ name }` );
                create.description( 'launch your project, and regenerating when changes' );
        return create.action( () => (
            this.serverActions()
        ) );
    }

    protected buildActions() : void  {
        if( this.env.getConfigFile().exist() ) {
            postBuildApp( this.env );
        } else console.error( chalk.red( `(PostCLI) ${ process.cwd() } is not a postdam project, missing postdam.json file` ) );
    }

    protected getBuildCommand( name: string = 'build' ) : Command {
        const 
            create = this.getCommand();
                create.name( `${ name }` );
                create.description( 'build your project then serve it.' );
        return create.action( () => (
            this.buildActions()
        ) );
    }

    getCommand() : Command{
        return new Command();
    }
};