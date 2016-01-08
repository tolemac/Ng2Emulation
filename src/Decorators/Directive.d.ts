export interface IDirectiveMetadata {
    selector?: string;
    priority?: number;
    outputs?: string[];
    inputs?: string[];
}
/**
 * Register metadata into class to be used by bootstrap.
 */
export declare function Directive(directiveMetadata: IDirectiveMetadata): (target: any) => any;
