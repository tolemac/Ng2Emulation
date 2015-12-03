import {Inject} from "Ng2Emulation/Inject"
import {DataStore} from "App/Services/DataStore"

export class TodoService {
    todoList : string[];
    constructor( @Inject(DataStore) dataStore: DataStore) {
        this.todoList = dataStore.valueList;
    }
    addTodo(text) {
        this.todoList.push(text);
    }
}
