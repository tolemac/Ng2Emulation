import {Component, Inject} from "Ng2Emulation/Ng2Emulation"

import {TodoService} from "App/Services/TodoService"

@Component({
//    template: `
//		<input ng-model="vm.text"/>
//		<div>Aplicacion1 {{vm.text}} {{vm.upper(vm.text)}}</div>
//        <div ng-repeat="thing in vm.appService.todoList">
//            {{thing}}
//        </div>
//`,
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