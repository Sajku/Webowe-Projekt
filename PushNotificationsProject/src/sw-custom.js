self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('google') && !event.request.url.includes('calendar')) {
        doAction(event);
    }
});

async function doAction(x) {
    let headers = new Headers();
    headers.append("Content-Security-Policy", "connect-src *;");
    headers.append("Access-Control-Allow-Origin", "*");
    x.respondWith(
        fetch(x.request, { headers: headers, mode: 'no-cors' })
    );
}

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
