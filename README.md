# Ng2Emulation

Build Angular 1 components using Angular 2 style in TypeScript.

If you, as me, have to start a new project with angular and you can't wait for Angular 2, you can prepare for arrival of Angular 2.
You can write Angular 1.4+ applications like this way:

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

Ng2Emulation allow you build your components with Angular 2 style. Using similar Angular 2 @Decorators to configure its.

I recommend to follow the multiples "Angular 2 Preparation" guides on www, asuming to use `controllerAs`, `bindToController`, isolated scopes, ...
