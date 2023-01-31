import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'PushNotificationsProject';
    readonly vapidPublicKey = 'BEY_lf7UsoVHunFKq9QiuID2rtEMvzTttrFughPSxC-wu5ip4PBAhSmXLonwHEa7hTQLuyCLF1Q76967h8StEIY';
    readonly apiUrl = 'https://perfectly-energetic-wolf-object.wayscript.cloud';

    registrationButton: boolean = false;
    unregistrationButton: boolean = true;
    subscriptionButton: boolean = true;
    unsubscriptionButton: boolean = true;
    notifyMeButton: boolean = true;

    constructor() { }

    ngOnInit(): void {

        console.log("onInit func");

        // navigator.serviceWorker.ready.then((ServiceWorkerRegistration) => {
        //     ServiceWorkerRegistration.pushManager.getSubscription()
        //         .then((subscription) => {
        //             if (!subscription) {

        //                 this._swPush.requestSubscription({
        //                     serverPublicKey: this.vapidPublicKey
        //                 })
        //                     .then(async sub => {
        //                         let subParsed = sub.toJSON();
        //                         console.log(subParsed);

        //                         await fetch(this.apiUrl + '/add-subscription', {
        //                             method: 'POST',
        //                             headers: {
        //                                 'Content-Type': 'application/json'
        //                             },
        //                             body: JSON.stringify(subParsed)
        //                         });

        //                         console.log("send");
        //                     });
        //             }
        //         })
        // })
    }

    async notifyMe() {
        // const registration = await navigator.serviceWorker.getRegistration();
        // const subscription = await registration?.pushManager.getSubscription();
        // this.postToServer(this.apiUrl + '/notify-me', { endpoint: subscription?.endpoint });
    }

    async notifyAll() {
        const response = await fetch(this.apiUrl + '/notify-all', {
            method: 'POST'
        });
    }
}
