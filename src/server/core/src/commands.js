var program = require('commander')
    ,os = require("os")
    ,Actions = require("./actions");

module.exports = function(args){
    program
        .version("0.1")
        .command("agent")
        .description("Run agent in server or client mode", "redis://127.0.0.1:6379")
        .option("-r, --redis [redis]", "Redis server")
        .option("-m, --mode [mode]", "which agent mode to use")
        .option("-n, --name [name]", "Node name", os.hostname())
        .action(Actions.agent);
    program
        .command("build")
        .option("-r, --redis [redis]", "Redis server", "redis://127.0.0.1:6379")
        .option("-n, --node [node]", "Node name to build")
        .action(Actions.build);
    program
        .command("exec")
        .description("Execute commands in nodes")
        .option("-r, --redis [redis]", "Redis server", "redis://127.0.0.1:6379")
        .option("-n, --node [node]", "node name to execute command", "")
        .option("-c, --command [command]", "command name")
        .action(Actions .exec);
    program
        .command("nomad_agent")
        .description("Run nomad agent in node")
        .option("-r, --redis [redis]", "Redis server", "redis://127.0.0.1:6379")
        .option("-n. --node [node]", "node name where nomad agent will be run")
        .option("-s, --server [server]", "run agent on server mode", false)
        .option("-c, --client [client]", "run agent on client mode", false)
        .option("--bootstrap-expect [bootstrap]", "number of server nodes in cluster", parseInt, 1)
        .option("--servers [servers]", "known servers", '')
        .option("-j, --join [join]", "server joins to these servers")
        .option("--dc [dc]", "datacenter of node", "dc1")
        .option("-r, --region [region]", "region of node", "global")
        .action(Actions.nomad_agent);
    program
        .command("consul_agent")
        .option("-r, --redis [redis]", "Redis server", "redis://127.0.0.1:6379")
        .description("Run consul agent in node")
        .option("-n, --node [node]", "node where consul agent will be run")
        .option("--dc [dc]", "datacenter of node", "dc1")
        .option("-s, --server [server]", "run agent in server mode", false)
        .option("-c, --client [client]", "run agent in client mode", false)
        .option("--bootstrap-expect [bootstrap]", "number of server nodes in cluster", 1)
        .action(Actions.consul_agent);
    program
        .command('run_job')
        .description('Run job on node')
        .option('-r, --redis [redis]', 'redis server', 'redis://127.0.0.1:6379')
        .option('-c, --config [config]', 'config file')
        .action(Actions.run_job);
    program
        .command("test")
        .action(Actions.test);
    program.parse(args);
};
