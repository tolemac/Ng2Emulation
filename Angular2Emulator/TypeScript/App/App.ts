import {bootstrap, Component, Inject} from "Ng2Emulation/Ng2Emulation"

import {DataStore} from "App/Services/DataStore"
import {TodoList} from "App/Components/TodoList"

@Component({
    template: `
        <h1>Ng2 Emulator - Todo list sample</h1>
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