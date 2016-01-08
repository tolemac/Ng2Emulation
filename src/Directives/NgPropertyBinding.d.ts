/**
 * Directive to do Property binding.
 * Uses by template parser. PropertyBindingRule search in template [property]="expression" and replace
 * by ng-property-binging="property=>expression", this way we emulate ng2 behaivor. Sample:
 *		<button (click)="addTodo()"/>
 * Parser change it by:
 *		<button ng-property-binding="property=>expression"/>
 */
export declare class NgPropertyBinding {
    $element: any;
    $scope: ng.IScope;
    $interpolate: ng.IInterpolateService;
    expression: any;
    constructor($parse: ng.IParseService, $element: any, $attrs: ng.IAttributes, $scope: ng.IScope, $interpolate: ng.IInterpolateService);
    createBinding(binding: string, $parse: any, $element: any): void;
}
