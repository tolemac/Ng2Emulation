# Ng2Emulation

## Why?

Yo can read why I started this project here: http://code.jros.org/2015/12/04/ng2emulation-typescript-angular-1-4-code-using-angular-2-style/

## Build Angular 1 components using Angular 2 style in TypeScript.

If you, as me, have to start a new project with AngularJS and  can't wait for Angular 2, you can prepare for its arrival and write Angular 1.4+ applications this way:

```typeScript
import {bootstrap, Component} from "Ng2Emulation/Ng2Emulation"

import {DataStore} from "App/Services/DataStore"
import {TodoListComponent} from "App/Components/TodoList"

@Component({
    template: `
        <h1>Ng2 Emulator - Todo list sample</h1>
        <todo-list></todo-list>
`,
    selector: "my-app",
    components: [TodoListComponent]
})
export class AppComponent {
    constructor() {
        // Configuration section.
        DataStore.setInitialValues(["A sopesteque", "Picha liebre", "Zurre mierdas", "Chupa candaos", "Cascoporro"]);
    }
}

bootstrap(AppComponent);
```

Ng2Emulation lets you build your components in the Angular 2 style. Using similar Angular 2 @Decorators to configure it. You can:

1. Build components writing a single class and decorating it.
2. Set component and service dependencies.
3. Inject services.

Ng2Emulation tries to bring you similar tools to the Angular 2 tools, making the jump to Angular 2 easy, `@Component` and `@Inject` decorators, bootstraping, etc.

````typeScript
import {Component, Inject} from "Ng2Emulation/Ng2Emulation"

import {TodoService} from "App/Services/TodoService"

@Component({
    templateUrl: "TypeScript/App/Components/TodoList.html",
    selector: "todo-list",
    componentAs: "vm"
})
export class TodoListComponent {
    upper(text) {
        if (text)
            return text.toUpperCase();
        return undefined;
    }

    constructor(@Inject(TodoService) public service: TodoService) {
        this.todoList = service.todoList;
    }

    text: string;
    todoList: string[];

    addTodo() {
        if (!this.text)
            return;
        this.service.addTodo(this.text);
        delete this.text;
    }
}
````

This way you can minimize the migration time from Angular 1.x to Angular 2.0

I recommend to follow the multiple "Angular 2 Preparation" guides on the web, using `controllerAs`, `bindToController`, isolated scopes, etc.

## How it works?

The initial version has been written in two days, around 8 hours, so no large codebase.
Ng2Emulation registers ng2 components as directives and injectable clases as services, no providers, no controllers, no factories, etc.

`bootstrap` method registers the main component as a directive. Use the decorator values to build the DDO and component as a controller of this directive. If the component has dependencies, in the `components` attribute of its `@Component` decorator, bootstrap register each dependent component recursively.

All kind of issues are welcome ;)
