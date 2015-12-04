export interface IComponentMetadata {
    template?: string;
    templateUrl?: string;
	selector?: string;
    componentAs?: string;
    components?: Function[];
}

export function Component(componentMetadata: IComponentMetadata) {
	return (target: any) => {

        target.$componentMetadata = componentMetadata;
        		
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
