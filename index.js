const cluster = require('cluster');
const https = require('https');
const fs = require('fs');
const os = require('os');

// Initially file execute in master mode and create an instance which is known as Cluster Master
// if (cluster.isMaster) {
//     console.log("Length : ", os.cpus().length);
//     cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
//     cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
//     // cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
//     // cluster.fork(); // run again full code fore creating an insatance of worker/slave/child mode (instance).
// }
// else {
//     process.env.UV_THREADPOOL_SIZE=4;
    // this code run for child/worker/slave mode only and work as server
    const express = require('express');
    const crypto = require('crypto');
    const serverStart = Date.now();
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    function doHash(callback) {
        var start = Date.now();
        crypto.pbkdf2('a', 'a', 100000, 512, 'sha512', () => {
            // console.log(Date.now() - start);
            // console.log(Date.now() - serverStart);
            callback();
        });
    }

    function doRequest() {
        https.request("https://www.dotcompal.com", res => {
            res.on('data', () => {});
            res.on('end', () => {
                // console.log("Request : ", Date.now() - start);
                console.log(Date.now() - serverStart);
            })
        }).end();
    }

    function readFile(callback) {
        fs.readFile('dummy.txt', () => {
            // console.log("Working : ", new Date(), process.pid);
            // console.log(Date.now() - serverStart);
            // res.send("Hi there!");
            callback();
        })
    }
    
    app.get('/', (req, res) => {
        
        // console.log("Start : ", new Date(), process.pid)
        // readFile() // longer task
        // console.log("End : ", new Date(), process.pid)

        // readFile(() => {
        //     console.log(Date.now() - serverStart);
        //     res.send("Hi there!");
        // });
        // console.log("Hitting request api!");
        // doRequest();

        doHash(() => {
            console.log(Date.now() - serverStart);
            res.send("Hi there!");
        })
        // res.send("Hi there!");
    });

    app.get('/fast', (req, res) => {
        res.send("Fast response!");
        console.log("Process ID : ", process.pid)

    });
    
    app.listen(port, () => {
        console.log("Server is running on port : ", port);
    });
// }




// # Explain All About :-

// NodeJs based on single thread non blocking I/O. So it has only one thread where actual node js (plain javascript)code has executed, but node use Threadpool which helps nodejs for handle input/output operation and also managing network or file handling task as async manner. In case of async task like file handling, node utilize threadpool and os internally for preventing it’s actual main thread(v8 callstack/js Stack) blocking, because threadpool is allow to change its size, so we can change it according to our requirement and hardware. But if we write a blocking code like normal loop which is taking much time, so over main thread(call stack) still block by this task.

// # Findings by practical :-

// 1. When we write a blocking code in javascipt live long loop, so in this case it block over main thread (v8 callstack).
// 2. When over api code do some i/o operations like crypto, reading files, then threadpool play an important role in increasing performance. ( high value of threadpool size give more performance in LINUX also in Windows).
// 3. When we run/execute crypto function 10 time in file using “node file.js”, then i find out that in my laptop which has dualCore(4cores in terms of logical cores), when i run this code at threadpool size 1, i got each function complete in around 1 second, one by one means first complete after 1 second, second complete after 2 second and so on, approx same work in case of threadpool size 2 and NOTE 2 threads execute or complete at the same time after 1 second and next two complete after 2 seconds and so on, but when i change threadpool size more than two like change 4, then i got each function complete after around 2 seconds one by one, this increase accordingly, the finding is : Because we have actually DualCore CPU, which is able to execute 2 thread at the same time and when we set threadpool size 1 or 2, It can execute crypto function in 1 second because both crypto function execute by 2 actual cores, but in case of when we change threadpool size 4, so due to my pc divide two actual cores into 4 logical cores by hyper threading and in this case 4 cores handle 4 threads at the same time, but performance is decrease means this time 4 cores executes 4 threads(crypto function) which will take around 2 seconds(because we double the work according to actual threads) for each thread, but NOTE all 4 threads execute(after 2 seconds) at the same time. this work accordingly when we change threadpool size more than our actual cpu cores. That’s means threadpool size depends on actual cpu cores and work accordingly.
// 4. When we create clusters then our request divided between those clusters and each cluster has it’s own v8 callstack and own threadpool.
// 5. Network request doesn’t depends directly on main thread, threadpool size and clusters and not affected so much (check on Ubuntu).