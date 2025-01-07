const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

// Initially file execute in master mode and create an instance which is known as Cluster Master
if (cluster.isMaster) {
    console.log("Length : ", os.cpus().length);
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
    // cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
    // cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
}
else {
    process.env.UV_THREADPOOL_SIZE=4;
    // this code run for child/worker/slave mode only and work as server
    const express = require('express');
    const crypto = require('crypto');
    const serverStart = Date.now();
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    function doHash() {
        var start = Date.now();
        crypto.pbkdf2('a', 'a', 100000, 512, 'sha512', () => {
            // console.log(Date.now() - start);
            console.log(Date.now() - serverStart);
        });
    }

    function readFile() {
        fs.readFile('dummy.txt', () => {
            console.log("Working : ", new Date(), process.pid)
        })
    }
    
    app.get('/', (req, res) => {
        
        // console.log("Start : ", new Date(), process.pid)
        // readFile() // longer task
        // console.log("End : ", new Date(), process.pid)

        doHash();

        res.send("Hi there!");
    });

    app.get('/fast', (req, res) => {
        res.send("Fast response!");
        console.log(process.pid)

    });
    
    app.listen(port, () => {
        console.log("Server is running on port : ", port);
    });
}