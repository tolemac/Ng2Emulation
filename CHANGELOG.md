# Ng2Emulation Change log.

## Version 0.1 ALPHA
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