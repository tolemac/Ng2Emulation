import {Directive, Inject} from "../Ng2Emulation";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";

@Directive({ selector: "ng-property" })
export class NgProperty {
    constructor( 
        @Inject("$element") public $element: JQuery,
        @Inject("$attrs") $attrs: ng.IAttributes,
        @Inject("$scope") public $scope: ng.IScope) {
        $scope[DEFAULT_CONTROLLER_AS][$attrs["ngProperty"]] = $element[0];
    }
}