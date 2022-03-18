import shell from 'shelljs';

export default function postBuildProject( root: string ) {
    shell.exec( `tsc && node ${root}` );
};