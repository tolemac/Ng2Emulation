import {Component, Inject, Output, Input, EventEmiter} from "Ng2Emulation/Ng2Emulation"
import {TodoService} from "App/Services/TodoService"

@Component({
	templateUrl: "TypeScript/App/Components/TodoList/TodoList.html",
	selector: "todo-list"
	//outputs: ["onNewTodo"]
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

	@Output() onNewTodo = new EventEmiter<string>();
	@Input() addText : string = "Añadir";

    text: string;
    todoList: string[];
    textInput: HTMLInputElement = <HTMLInputElement>({});

    addTodo() {
        if (!this.text)
            return;
		if (this.service.addTodo(this.text)) {
			this.onNewTodo.emit(this.text);
			this.textInput.value = "";
	    }
    }
}