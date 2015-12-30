import {Inject} from "Ng2Emulation/Decorators/Inject"
import {Injectable} from "Ng2Emulation/Decorators/Injectable"
import {DataStore} from "App/Services/DataStore"

@Injectable()
export class TodoService {
    todoList: string[];

    constructor(@Inject(DataStore) dataStore: DataStore) {
        this.todoList = dataStore.valueList;
    }

    addTodo(text) {
        this.todoList.push(text);
    }
}