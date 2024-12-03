const cluster = require('cluster');
const os = require('os');

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
    const start = Date.now();
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    function doHash() {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            console.log("Hash : ", Date.now() - start);
        })
    }
    
    app.get('/', (req, res) => {
        doHash() // block main thread
        for(let i=0; i < 10000000000; i++);
        res.send("Hi there!");
        console.log(process.pid)
    });

    app.get('/fast', (req, res) => {
        res.send("Fast response!");
        console.log(process.pid)

    });
    
    app.listen(port, () => {
        console.log("Server is running on port : ", port);
    });
}