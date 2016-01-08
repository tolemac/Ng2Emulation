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
export declare class NgProperty {
    $element: JQuery;
    $scope: ng.IScope;
    constructor($element: JQuery, $attrs: ng.IAttributes, $scope: ng.IScope);
}
