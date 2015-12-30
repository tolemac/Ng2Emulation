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
        if (this.todoList.indexOf(text) >= 0)
            return false;
        this.todoList.push(text);
        return true;
    }
}