import {serviceNormalize} from "../Utils/AngularHelpers";

export interface IComponentMetadata {
    template?: string;
    templateUrl?: string;
	selector?: string;
    //componentAs?: string;
    directives?: Function[];
	outputs?: string[];
	inputs?: string[];
    styles?: string[];
    providers?: (Function|string)[];
}

/**
 * Register metadata into class to be used by bootstrap.
 */
export function Component(componentMetadata: IComponentMetadata) {
	return (target: any) => {

		target.$componentMetadata = target.$componentMetadata || {};
        target.$componentMetadata = angular.extend(target.$componentMetadata, componentMetadata);
        // providers ($inject)
	    if (componentMetadata.providers) {
            const $inject = target.$inject = target.$inject || [];
	        for (let i = 0; i < componentMetadata.providers.length; i++) {
	            const token = componentMetadata.providers[i];
	            const name = typeof token === "string" ? token : serviceNormalize((token as any).name);
	            if ($inject.length === i)
	                $inject.push();
	            $inject[i] = name;
	        }
	    }

	    return target;
	}
}
 
// Decorator new interceptor:
        //// a utility function to generate instances of a class
        //function construct(constructor, args) {
        //    var c: any = function () {
        //        return constructor.apply(this, args);
        //    }
        //    c.prototype = constructor.prototype;
        //    return new c();
        //}
		//// save a reference to the original constructor
		//var original = target;
        
		//// the new constructor behaviour
		//var f: any = function (...args) {
		//	//console.log("New: " + original.name);
		//	return construct(original, args);
		//}
        
        //		// copy prototype so intanceof operator still works
		//f.prototype = original.prototype;
