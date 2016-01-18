export interface IDirectiveMetadata {
    selector?: string;
	priority?: number;
	outputs?: string[];
	inputs?: string[];
}

/**
 * Register metadata into class to be used by bootstrap.
 */
export function Directive(directiveMetadata: IDirectiveMetadata) {
    return (target: any) => {

        target.$directiveMetadata = directiveMetadata;

        return target;
    }
}
