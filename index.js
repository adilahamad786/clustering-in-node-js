const cluster = require('cluster');
const os = require('os');
const gTime = Date.now();

// Initially file execute in master mode and create an instance which is known as Cluster Master
if (cluster.isMaster) {
    console.log("Length : ", os.cpus().length);
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
}
else {
    // this code run for child/worker/slave mode only and work as server
    const express = require('express');
    const crypto = require('crypto');
    // const start = Date.now();
    var start = Date.now();
    var firstTime = true;
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    function doHash() {
        crypto.pbkdf2('abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyz', 21474836, 512, 'sha512', () => {
            console.log("Hash : ", Date.now() - start);
        })
    }
    
    app.get('/', (req, res) => {
        // doHash() // block main thread

        console.log("Start : ", new Date(), process.pid)

        // if (firstTime) {
        //     start = Date.now();
        //     firstTime = false;
        // }

        // const start = new Date().getTime();

        for (let i = 0; i < 1000000000; i++) {
            // do nothing
        }

        // console.log((Date.now() - start), process.pid);
        // console.log("gTime : ", (gTime - start), process.pid);

        console.log("End : ", new Date(), process.pid)

        res.send("Hi there!");
        // console.log("Pid", process.pid)
    });

    app.get('/fast', (req, res) => {
        res.send("Fast response!");
        console.log(process.pid)

    });
    
    app.listen(port, () => {
        console.log("Server is running on port : ", port);
    });
}