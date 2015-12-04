# Ng2Emulation

## Why?

Yo can read why I started this project: http://code.jros.org/2015/12/04/ng2emulation-typescript-angular-1-4-code-using-angular-2-style/

## Build Angular 1 components using Angular 2 style in TypeScript.

If you, as me, have to start a new project with angular and you can't wait for Angular 2, you can prepare for arrival of Angular 2.
You can write Angular 1.4+ applications this way:

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

Ng2Emulation allow you build your components with Angular 2 style. Using similar Angular 2 @Decorators to configure its. You can:

1. Build components writing only a class and decorating it.
2. Set component and service dependency.
3. Inject services.

Ng2Emulation try to bring you similar tools to Angular 2 tools to make easy the jump to Angular 2, `@Component` and `@Inject` decorators, bootstraping, ...

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

I recommend to follow the multiples "Angular 2 Preparation" guides on www, asuming to use `controllerAs`, `bindToController`, isolated scopes, ...

## How it works?

The initial versión have been written in two days, 8 hours +-, no large code.
Ng2Emulation register ng2 components as directives and injectable clases as services, no providers, no controllers, no factories, ...

`bootstrap` method register the main component as a directive, use the decorator values to build de DDO and component as controller of this directive. If component has dependencies, in `components` attribute of his `@Component` decorator, bootstrap register each dependent component recursively.

All kinds of issues are welcome ;)

