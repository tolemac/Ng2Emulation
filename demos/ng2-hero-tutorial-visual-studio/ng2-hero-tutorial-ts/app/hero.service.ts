import {Hero} from "./hero";
import {HEROES} from "./mock-heroes";
import {Injectable} from "Ng2Emulation";
@Injectable()
export class HeroService {
    getHeroes() {
        return Promise.resolve(HEROES);
    }
    getHeroesNow() {
        return HEROES;
    }
    // See the "Take it slow" appendix
    getHeroesSlowly() {
        return new Promise<Hero[]>(resolve =>
            setTimeout(() => resolve(HEROES), 2000) // 2 seconds
        );
    }
}