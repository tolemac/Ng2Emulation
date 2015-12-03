# Ng2Emulation

Build Angular 1 components using Angular 2 style in TypeScript.

If you, as me, have to start a new project with angular and you can't wait for Angular 2, you can prepare for arrival of Angular 2.
You can write Angular 1.4+ applications this way:

```typeScript
import {bootstrap, Component, Inject} from "Ng2Emulation/Ng2Emulation"

import {DataStore} from "App/Services/DataStore"
import {TodoList} from "App/Components/TodoList"

@Component({
    componentAs: "vm",
    template: `
        <todo-list></todo-list>
`,
    selector: "my-app",
    components: [TodoList]
})
export class App {
    constructor() {
        // Configuration section.
        DataStore.setInitialValues(["A sopesteque", "Picha liebre", "Zurre mierdas", "Chupa candaos", "Cascoporro"]);
    }
}

bootstrap(App);
```

Ng2Emulation allow you build your components with Angular 2 style. Using similar Angular 2 @Decorators to configure its. You can:

1. Build components writing only a class and decorating it.
2. Set component and service dependency.
3. Inject services.

Ng2Emulation try to bring you similar tools to Angular 2 tools to make easy the jump to Angular 2, `@Component` and `@Inject` decorators, bootstraping, ...

This way you can minimize the migration time from Angular 1.x to Angular 2.0

I recommend to follow the multiples "Angular 2 Preparation" guides on www, asuming to use `controllerAs`, `bindToController`, isolated scopes, ...
