import {directiveNormalize} from "Ng2Emulation/AngularHelpers"

// a utility function to generate instances of a class
function construct(constructor, args) {
    var c: any = function () {
		return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;
    return new c();
}

export interface IComponentMetadata {
	template?: string;
	selector?: string;
	controllerAs?: string;
}

export function Component(componentMetadata: IComponentMetadata) {
	return (target: any) => {

		// save a reference to the original constructor
		var original = target;

		// the new constructor behaviour
		var f: any = function (...args) {
			console.log("New: " + original.name);
			return construct(original, args);
		}

		// copy prototype so intanceof operator still works
		f.prototype = original.prototype;

		f.$componentMetadata = componentMetadata;

		// return new constructor (will override original)
		return f;
	}
}

export class Ng2Emulation {
	static app : ng.IModule;
	static registerComponent(component: Function) {
		let ddo = {
			controller: component,
			controllerAs: "app",
			scope: {}
		};

		angular.extend(ddo, component["$componentMetadata"]);

		var directiveName = directiveNormalize(component["$componentMetadata"]["selector"]);

		Ng2Emulation.app.directive(directiveName, () => ddo);
	}
	
}

export function bootstrap(component: Function) {
	Ng2Emulation.app = angular.module("app", []);

	Ng2Emulation.registerComponent(component);

	angular.bootstrap(document, ["app"]);
}