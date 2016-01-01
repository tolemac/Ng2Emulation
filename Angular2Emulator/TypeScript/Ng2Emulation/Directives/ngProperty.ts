import {Directive, Inject} from "../Ng2Emulation";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";
import {getOwnPropertyNameInsensitiveCase} from "../Utils/Utils";

/**
 * Directive to get access to html element as a component property.
 * Uses by template parser. NgPropertyRule search in template #something and replace 
 * by ng-property="something", this way we emulate ng2 behaivor. Sample:
 *		<input #mytext type="text"/>
 * Parser change #text by ng-property="text":
 *		<input ng-property="mytext" type="text"/>
 * An you can do:
 *		<input #mytext type="text"/>
 *		<span>{{$$cmp.mytext.value}}</span>
 */
@Directive({ selector: "ng-property", priority: -1000 })
export class NgProperty {
    constructor( 
        @Inject("$element") public $element: JQuery,
        @Inject("$attrs") $attrs: ng.IAttributes,
        @Inject("$scope") public $scope: ng.IScope)
	{
		const newScope = $scope[DEFAULT_CONTROLLER_AS];
        newScope[getOwnPropertyNameInsensitiveCase(newScope, $attrs["ngProperty"]) || $attrs["ngProperty"]] = $element[0];
    }
}