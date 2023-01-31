import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';

export interface PeriodicElement {
    name: string;
    data: string;
}

export interface GroupParticipant {
    userId: number;
    accepted: boolean;
    rejected: boolean;
}

export interface GroupAcceptance {
    groupId: number;
    userId: number;
    groupName: string;
    userName: string;
}

export interface User {
    id: number;
    name: string;
    lastname: string;
}

export interface Group {
    id: number;
    name: string;
    participants: GroupParticipant[];
    authorId: number;
    canUserJoin?: boolean;
}

const allGroups: Group[] = [];
const userGroups: Group[] = [];
const groupAcceptance: GroupAcceptance[] = [];
const groupUsers: User[] = [];

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    readonly apiUrl = 'https://perfectly-energetic-wolf-object.wayscript.cloud';
    readonly vapidPublicKey = 'BEY_lf7UsoVHunFKq9QiuID2rtEMvzTttrFughPSxC-wu5ip4PBAhSmXLonwHEa7hTQLuyCLF1Q76967h8StEIY';

    displayedColumns1: string[] = ['nazwa', 'akcja'];
    displayedColumns2: string[] = ['nazwa', 'akcja', "rola"];
    displayedColumns3: string[] = ['nazwa', 'dane', 'akcja'];
    displayedColumns4: string[] = ['dane', 'akcja'];
    dataSource1 = new MatTableDataSource(allGroups);
    dataSource2 = new MatTableDataSource(userGroups);
    dataSource3 = new MatTableDataSource(groupAcceptance);
    dataSource4 = new MatTableDataSource(groupUsers);

    newGroupName: string = '';
    currentUserId: number = 0;
    selectedGroupId: number = 0;
    selectedGroupName: string = '';
    notificationTitle: string = '';
    notificationContent: string = '';

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _swPush: SwPush) { }

    ngOnInit(): void {
        this.currentUserId = +this._activatedRoute.snapshot.params['id'];
        this.refreshData();
        this.initServiceWorker();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource1.filter = filterValue.trim().toLowerCase();
    }

    createGroup(): void {
        fetch(this.apiUrl + '/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: this.newGroupName, authorId: this.currentUserId })
        })
            .then(response => response.json())
            .then(id => {
                if (id == -1) {
                    this._snackBar.open('Grupa o takiej nazwie już istnieje!', 'Ok', {
                        horizontalPosition: 'start',
                        verticalPosition: 'top'
                    });
                    this.newGroupName = '';
                }
                else {
                    this.refreshData();
                }
            });
    }

    joinGroup(groupId: number): void {
        fetch(this.apiUrl + '/groups-participants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId: groupId, userId: this.currentUserId })
        });
        this.refreshData();
    }

    selectGroup(chosenGroup: Group): void {
        fetch(this.apiUrl + '/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                let allUsers = data as User[];
                let tempGroupUsers: User[] = []

                for (let user of chosenGroup.participants) {
                    let currentUser = allUsers.find(u => u.id == user.userId)
                    tempGroupUsers.push({
                        id: user.userId,
                        name: currentUser?.name + '',
                        lastname: currentUser?.lastname + ''
                    });
                }

                this.dataSource4 = new MatTableDataSource(tempGroupUsers);
                this.selectedGroupId = chosenGroup.id;
                this.selectedGroupName = chosenGroup.name;
            });
    }

    acceptUser(item: GroupAcceptance): void {
        fetch(this.apiUrl + '/groups-participants-accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId: item.groupId, userId: item.userId })
        }).then(res => {
            this.refreshData();
        })
    }

    rejectUser(item: GroupAcceptance): void {
        fetch(this.apiUrl + '/groups-participants-reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId: item.groupId, userId: item.userId })
        }).then(res => {
            this.refreshData();
        })
    }

    refreshData(): void {
        let allUsers: User[] = [];

        fetch(this.apiUrl + '/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                allUsers = data as User[];
            })

        fetch(this.apiUrl + '/groups', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                let tempAllGroups = data as Group[];
                let tempUserGroups: Group[] = [];
                let tempGroupAcceptance: GroupAcceptance[] = [];
                for (let group of tempAllGroups) {
                    group.canUserJoin = true;
                    if (group.authorId == this.currentUserId) {
                        tempUserGroups.push(group);
                        group.canUserJoin = false;
                    }
                    for (let participant of group.participants) {
                        if (participant.userId == this.currentUserId && participant.accepted == true) {
                            tempUserGroups.push(group);
                            group.canUserJoin = false;
                        }

                        if (participant.userId == this.currentUserId && participant.accepted == false) {
                            group.canUserJoin = false;
                        }

                        if (participant.userId != this.currentUserId && participant.accepted == false && participant.rejected == false) {
                            group.canUserJoin = false;
                            let tempParticipant = allUsers.find(u => u.id == participant.userId);
                            tempGroupAcceptance.push({
                                groupId: group.id,
                                userId: participant.userId,
                                groupName: group.name,
                                userName: tempParticipant?.name + ' ' + tempParticipant?.lastname
                            });
                        }
                    }
                }

                this.dataSource1 = new MatTableDataSource(tempAllGroups);
                this.dataSource2 = new MatTableDataSource(tempUserGroups);
                this.dataSource3 = new MatTableDataSource(tempGroupAcceptance);
            });
    }

    initServiceWorker(): void {
        navigator.serviceWorker.ready.then((ServiceWorkerRegistration) => {
            ServiceWorkerRegistration.pushManager.getSubscription()
                .then((subscription) => {
                    if (!subscription) {

                        this._swPush.requestSubscription({
                            serverPublicKey: this.vapidPublicKey
                        })
                            .then(async sub => {
                                let subParsed = sub.toJSON();
                                console.log(subParsed);

                                await fetch(this.apiUrl + '/add-subscription', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ subscription: subParsed, userId: this.currentUserId })
                                });

                                console.log("send");
                            });
                    }
                })
        })
    }

    sendAll(): void {
        fetch(this.apiUrl + '/notify-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId: this.selectedGroupId, title: this.notificationTitle, content: this.notificationContent })
        }).then(res => {
            console.log(res);

        })
    }

    sendTo(user: User): void {
        fetch(this.apiUrl + '/notify-one', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, title: this.notificationTitle, content: this.notificationContent })
        }).then(res => {
            console.log(res);

        })
    }
}
