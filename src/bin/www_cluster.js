/**
 * Created by wuxiaoran on 2017/7/11.
 */
const cluster = require('cluster');

console.log('enter');

function startWorker() {
  const worker = cluster.fork();
  console.log(`CLUSTER: worker ${worker.id} started.`);
}

if (cluster.isMaster) {
  console.log('Master');
  require('os').cpus().forEach(function() {
    startWorker();
  });
  cluster.on('disconnect', function(worker) {
    console.log(`CLUSTER: Woker ${worker.id} died with
     exit code ${code}(${signal})`);
    startWorker();
  });
} else {
  console.log('child');
  require('./www');
}
