import {bootstrap, Component} from "Ng2Emulation/Ng2Emulation"
import {RouteConfig} from "Ng2Emulation/RouteConfig"

import {DataStore} from "App/Services/DataStore"
import {TodoListComponent} from "App/Components/TodoList/TodoList"

import {Home} from "App/Components/Home/Home"
import {Contact} from "App/Components/Contact/Contact"
import {About} from "App/Components/About/About"

@Component({
    template: `
        <h1>Ng2 Emulator - Todo list sample</h1>
        <div ng-link="home">Home</div>
        <div ng-link="contact">Contact</div>
        <div ng-link="about">About</div>

        <todo-list></todo-list>
        <ng-outlet></ng-outlet>`,
    selector: "my-app",
    components: [TodoListComponent]
})
    @RouteConfig([
        { path: "/", component: Home, as: "home" },
        { path: "/contact", component: Contact, as: "contact" },
        { path: "/about", component: About, as: "about" }
    ])
export class AppComponent {
    constructor() {
        // Configuration section.
        DataStore.setInitialValues(["A sopesteque", "Picha liebre", "Zurre mierdas", "Chupa candaos", "Cascoporro"]);
    }
}

bootstrap(AppComponent, ["ngComponentRouter"]);
