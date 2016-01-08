/**
 * Directive to do Event binding.
 * Uses by template parser. EventBindingRule search in template (event)="expression" and replace
 * by ng-event-binging="event=>expression", this way we emulate ng2 behaivor. Sample:
 *		<button (click)="addTodo()"/>
 * Parser change it by:
 *		<button ng-event-binding="event=>expression"/>
 */
export declare class NgEventBinding {
    $element: any;
    $scope: ng.IScope;
    expression: any;
    /**
     * Copied and modified from ng-forward: https://github.com/tolemac/ng-forward/blob/master/lib/events/events.ts
     */
    constructor($parse: ng.IParseService, $element: any, $attrs: ng.IAttributes, $scope: ng.IScope);
    createBinding(binding: any, $parse: any, $element: any, $scope: any): void;
    eventHandler($event?: any): void;
    onDestroy(): void;
}
