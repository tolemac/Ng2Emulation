import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper"

let objects : any[];

export function createScope(scope): any {
	return scope;
	//const newScope = scope.hasOwnProperty(DEFAULT_CONTROLLER_AS) ? scope[DEFAULT_CONTROLLER_AS] : scope;
	//return newScope;
	//objects = [scope];
	//loadObjects(scope);
	//const result = {};
	//for (let i = objects.length - 1; i >= 0; i--) {
	//	const obj = objects[i];
	//	for (let p in obj)
	//		result[p] = obj[p];
	//}
	//return result;
}

function loadObjects(obj: any) {
	if (obj.hasOwnProperty(DEFAULT_CONTROLLER_AS))
		objects.push(obj[DEFAULT_CONTROLLER_AS]);
	if (obj.$parent)
		loadObjects(obj.$parent);
}