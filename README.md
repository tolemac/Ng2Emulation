# Ng2Emulation

## Build Angular 1 components using Angular 2 style in TypeScript.

If you have to start a new project with AngularJS and can't wait for Angular 2, you can prepare for its arrival and write Angular 1.4+ applications this way:

```typeScript
import {Component} from "Ng2Emulation/Ng2Emulation";
import {Hero} from "./hero";
import {HeroDetailComponent} from "./hero-detail.component";
@Component({
	selector: "my-app",
	template: `
    <h1>{{title}}</h1>
    <h2>My Heroes</h2>
    <ul class="heroes">
      <li *ngFor="#hero of heroes"
        [class.selected]="hero === selectedHero"
        (click)="onSelect(hero)">
        <span class="badge">{{hero.id}}</span> {{hero.name}}
      </li>
    </ul>
    <my-hero-detail [hero]="selectedHero"></my-hero-detail>
  `,
	styles: [`
    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    .heroes {
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      width: 10em;
    }
    .heroes li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0em;
      height: 1.6em;
      border-radius: 4px;
    }
    .heroes li.selected:hover {
      color: white;
    }
    .heroes li:hover {
      color: #607D8B;
      background-color: #EEE;
      left: .1em;
    }
    .heroes .text {
      position: relative;
      top: -3px;
    }
    .heroes .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0em 0.7em;
      background-color: #607D8B;
      line-height: 1em;
      position: relative;
      left: -1px;
      top: -4px;
      height: 1.8em;
      margin-right: .8em;
      border-radius: 4px 0px 0px 4px;
    }
  `],
	directives: [HeroDetailComponent]
})
export class AppComponent {
	public title = "Tour of Heroes";
	public heroes = HEROES;
	public selectedHero: Hero;
	onSelect(hero: Hero) { this.selectedHero = hero; }
}
var HEROES: Hero[] = [
	{ "id": 11, "name": "Mr. Nice" },
	{ "id": 12, "name": "Narco" },
	{ "id": 13, "name": "Bombasto" },
	{ "id": 14, "name": "Celeritas" },
	{ "id": 15, "name": "Magneta" },
	{ "id": 16, "name": "RubberMan" },
	{ "id": 17, "name": "Dynama" },
	{ "id": 18, "name": "Dr IQ" },
	{ "id": 19, "name": "Magma" },
	{ "id": 20, "name": "Tornado" }
];
```

Ng2Emulation lets you build your components in the Angular 2 style. Using similar Angular 2 @Decorators to configure it. You can:

1. Build components writing a single class and decorating it.
2. Set component and service dependencies.
3. Set inputs and outputs properties and events bindings of your components by component decorator (outputs, inputs) or/and by property decorators (@Input, @Output).
3. Define injectable services and inject on your component, via component decorator (providers) or decorating constructor parameters (@Inject).
4. Use complete Angular 2 template syntax, including:
  * Event binding template `(event)` and cannonical `on-`
  * Property binding template `[event]` and cannonical `bind-`
  * Two way binding `[()]` and cannonical `bindon-`
  * Attribute (`[attrs.*]`), class (`[class.classname]`) and style (`[style.*]` and `[style.*.units]`) syntax.
  * `*ngFor` and `*ngIf` syntax
  * Local template variable `#variableName`

Ng2Emulation tries to bring you similar tools to the Angular 2 tools, making the jump to Angular 2 easy, `@Component` and `@Inject` decorators, bootstraping, etc.

````typeScript
import {Component} from "Ng2Emulation/Ng2Emulation";
import {Hero} from "./hero";
@Component({
	selector: "my-hero-detail",
	template: `
    <div *ngIf="hero">
      <h2>{{hero.name}} details!</h2>
      <div><label>id: </label>{{hero.id}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="hero.name" placeholder="name"/>
      </div>
    </div>
  `,
	inputs: ["hero"]
})
export class HeroDetailComponent {
	public hero: Hero;
}
````

This way you can minimize the migration time from Angular 1.x to Angular 2.0

## How it works?

The components and services are attached with metadata through @decorators. This metadata is used by bootstrap to create all components as directives and all @Injectable classes as services.
Ng2Emulation use httpInterceptor and component registration to parse html and convert ng2 syntax to ng1 syntax, to make property and event binding Ng2Emulation use internal directives.
The main technique to avoid use `controllerAs` syntax in expression and to be able to write expressions accessing to component properties without preffix, is an internal `$parse` decorator to parse each expression and find tokens in scope and components. This way Ng2Emulation can redirect each expression identifier to correct context. To parse expressions Ng2Emulation use Angular 1 Lexer.

## It works?

At the moment we have write Angular 2 Hero Tutorial only changing the imports, changing "Angular2/*" by "Ng2Emulation/Ng2Emulation".
Our goal is accept the templating syntax and component (and services ) definition.

We would like to have the minimal external dependencies.

## What's the next?

* Build package, over NPM, bower, ...
* Build ES5 bundle and generate typings to use Ng2Emulation without any package manager.
* Use a router and use @RouteConfig decorator to use multiple views and url routing.
* Angular 1 integration. Allow current Angular projects to use new components wrote using Ng2Emulation.
* Follow Angular 2 docs to implements others features (Http, Router)

## What's the end?
* When Angular 2.0 will be release this project will be closed.

