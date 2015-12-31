import {Component, Inject} from "Ng2Emulation/Ng2Emulation"
import {TodoService} from "App/Services/TodoService"
import {EventEmiter} from "Ng2Emulation/Ng2Emulation"

@Component({
	templateUrl: "TypeScript/App/Components/TodoList/TodoList.html",
	selector: "todo-list",
	outputs: ["onNewTodo"]
})
export class TodoListComponent {
    upper(text) {
        if (text)
            return text.toUpperCase();
        return undefined;
    }

    constructor( @Inject(TodoService) public service: TodoService) {
        this.todoList = service.todoList;        
    }

	onNewTodo = new EventEmiter<string>();

    text: string;
    todoList: string[];
    textInput: HTMLInputElement;

    addTodo() {
        if (!this.text)
            return;
		if (this.service.addTodo(this.text)) {
			this.onNewTodo.emit(this.text);
			this.textInput.value = "";
	    }
    }
}