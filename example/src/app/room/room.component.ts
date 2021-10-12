import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'demo-room',
    templateUrl: 'room.component.html'
})
export class DemoRoomComponent implements OnInit {
    clients: { name: string }[] = [];

    name = 'ottype-slate';

    ngOnInit() {
        this.addClient();
        // this.addClient();
    }

    addClient(event?: Event) {
        this.clients.push({name: this.name});
    }
}