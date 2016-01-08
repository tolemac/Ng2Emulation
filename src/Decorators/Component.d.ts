export interface IComponentMetadata {
    template?: string;
    templateUrl?: string;
    selector?: string;
    directives?: Function[];
    outputs?: string[];
    inputs?: string[];
    styles?: string[];
    providers?: (Function | string)[];
}
/**
 * Register metadata into class to be used by bootstrap.
 */
export declare function Component(componentMetadata: IComponentMetadata): (target: any) => any;
