# Ng2Emulation Change log.

## Version 0.1.* ALPHA
* Doble curly braces syntax use component as scope root. You can do:
````html
<div>{{componentProperty}}</div>
````
instead of
````html
<div>{{component.componentProperty}}</div>
````
* `(event-binding)` search in component for custom (outputs) events (EventEmitter), if not found try to emit element event.
* `[property-binding]` search in component for custom (inputs) properties, if not found assign value to element property.
* `@Input` and `@Output` add property to `$componentMetadata.inputs` and `$componentMetadata.outputs`
* Cannonical syntax is accepted (`bind-propertyName`, `on-eventName`, `var-localVariableName`)
* Attribute syntax `[attr.colspan]="expression"`.
* Class syntax `[class.red]="amount < 0"`.
* Style syntax `[style.color] = "isSpecial ? 'red' : 'green'"`. Or with units: `[style.fontSize.em]="isSpecial ? 3 : 1"`
* NgModelRule for template parser, replace [(ngModel)]="some.thing" by ng-model="$$cmp.some.thing"
* *ngFor working. Replace *ngFor by ng-repeat + ng-init: 
````html
<div *ngFor="#item of itemList, #i = index"></div>
````
change by:
````html
<div ng-repeat="item in itemList" ng-init="i = $index"></div>
````
* styles added to component metadata and load it in bootstrap (added globally) 
* Add `providers` to @Component metadata.
* LifeCycleHooks - OnChanges, OnInit and OnDestroy
* Angular 2 Hero Tutorial as example application
* **breaking** controllerAs is $$cmp instead of $$vm
* Template interception to change html.
* NgContentRule to replace ng-content por ng-transclude
* NgProperty directive to access to html element as component property. You can do:
````html
 <input type="text" ng-property="myinput"/> {{$cmp.myinput.value}}
````
* NgPropertyRule to replace #something by ng-property="something", to access to html like angular2 you can do:
````html
 <input type="text" #myinput/> {{$cmp.myinput.value}}
````
* Postpone router.
* `@Inject` for angular1 components and take care with param order. Closes #2
* `@Injectable` to mark a class as service
* `@Directive` to make Structural or Attribute directives
* `(elementEvents)` generic behaivor to handle element events.
* ElementEvents execute expression on `$scope.$$vm` scope, you can write:
````html
<button (click)="componentMethod($event)"/>
````
instead of
````html
<button (click)="componentAs.componentMethod($event)"/>
````

* Remove `componentAs` from Component directive
* Rename `components` attribute from component directive to `directives` as Angular 2
