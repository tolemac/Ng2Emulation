import {Directive, Inject} from "../Ng2Emulation";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";

/**
 * Directive to get access to html element as a component property.
 * Uses by template parser. NgPropertyRule search in template #something and replace 
 * by ng-property="something", this way we emulate ng2 behaivor. Sample:
 *		<input #mytext type="text"/>
 * Parser change #text by ng-property="text":
 *		<input ng-property="mytext" type="text"/>
 *		<input #mytext type="text"/>
 *		<span>{{$$cmp.mytext.value}}</span>
 * An you can do:
 */
@Directive({ selector: "ng-property" })
export class NgProperty {
    constructor( 
        @Inject("$element") public $element: JQuery,
        @Inject("$attrs") $attrs: ng.IAttributes,
        @Inject("$scope") public $scope: ng.IScope) {
        $scope[DEFAULT_CONTROLLER_AS][$attrs["ngProperty"]] = $element[0];
    }
}