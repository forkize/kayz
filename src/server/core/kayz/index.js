var Kaydz = require('./src/index');

if (require.main == module) {
    Kaydz.Commands(process.argv);
    process.on('SIGINT', function() {
        console.log("[info] Exiting kayz.");
        process.exit();
    });
} else {
    module.exports = Kaydz;
}
