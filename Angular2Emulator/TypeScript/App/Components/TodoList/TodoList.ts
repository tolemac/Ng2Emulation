import {Component, Inject} from "Ng2Emulation/Ng2Emulation"

import {TodoService} from "App/Services/TodoService"

@Component({
    templateUrl: "TypeScript/App/Components/TodoList/TodoList.html",
    selector: "todo-list"
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

    text: string;
    todoList: string[];
    textInput: HTMLInputElement;

    addTodo() {
        if (!this.text)
            return;        
        if (this.service.addTodo(this.text))
            this.textInput.value = "";
    }
}