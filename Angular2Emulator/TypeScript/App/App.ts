import {Component, Inject} from "Ng2Emulation/Ng2Emulation"

import {DataStore} from "App/Services/DataStore"
import {TodoListComponent} from "App/Components/TodoList/TodoList"

@Component({
    template: `
        <h1>{{title}}</h1>
		<input autofocus [(ngModel)]="text"/>
		{{text}}
`, ///<todo-list bind-addText="addText" on-onNewTodo="newTodo($event);"></todo-list>
    selector: "my-app",
    directives: [TodoListComponent]
})
export class AppComponent {
    public title = "Ng2 Emulator - Todo list sample";
	public addText = "Añadir TODO: ";
	newTodo(todo:string) {
		console.log("New todo: " + todo);
	}
    constructor() {
        // Configuration section.
        DataStore.setInitialValues(["A sopesteque", "Picha liebre", "Zurre mierdas", "Chupa candaos", "Cascoporro"]);
    }
}
