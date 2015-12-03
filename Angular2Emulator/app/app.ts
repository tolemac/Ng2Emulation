
import {bootstrap, Component} from "Ng2Emulation/Ng2Emulation"

@Component({
	controllerAs: "vm",
	template: `
		<input #input ng-model="vm.text"/>
		<div>Aplicacion1 {{vm.text}} {{vm.upper(vm.text)}}</div>
`,
	selector: "my-app"
})
export class AppComponent {
	upper(text) {
		if (text)
			return text.toUpperCase();
		return undefined;
	}
}


bootstrap(AppComponent);