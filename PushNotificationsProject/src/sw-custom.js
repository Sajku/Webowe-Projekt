self.addEventListener('notificationclick', function (event) {
    console.log("Notification Clicked");

    event.waitUntil(clients.matchAll({
        type: "window"
    }).then((clientList) => {

        for (const client of clientList) {
            if (client.url.includes('/') && 'focus' in client)
                return client.focus();
        }

        if (clients.openWindow)
            return clients.openWindow('/');
    }));

});

importScripts('./ngsw-worker.js');
