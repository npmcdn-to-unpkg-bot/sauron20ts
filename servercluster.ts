import * as cluster from "cluster";

var numCPUs = 21;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    require("./server");
}
