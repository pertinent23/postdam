import shell from 'shelljs';

export default function postServe( root: string ) : void {
    shell.exec( `nodemon ${ root }` );
}