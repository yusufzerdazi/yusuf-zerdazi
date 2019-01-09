import { Subject } from "rxjs";

export class NavbarColourService {
    public changeNavColor: Subject<string> = new Subject<string>();
}