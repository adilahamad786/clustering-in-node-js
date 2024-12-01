const cluster = require('cluster');

// Initially file execute in master mode and create an instance which is known as Cluster Master
if (cluster.isMaster) {
    cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
}
else {
    // this code run for child/worker/slave mode only and work as server
    const express = require('express');
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    function doWork(duration) {
        const start = Date.now();
        while(Date.now() - start < duration);
    }
    
    app.get('/', (req, res) => {
        doWork(5000) // block main thread for 5s
        res.send("Hi there!");
    });
    
    app.listen(port, () => {
        console.log("Server is running on port : ", port);
    });
}