var wget = require('../wget');

var MAX_JOBS = parseInt(process.env.MAX_CONCURRENT_JOBS, 10) || 3;
var COOLDOWN_MS = parseInt(process.env.JOB_COOLDOWN_MS, 10) || 15 * 1000;
var lastJobByIp = {};
var activeJobs = 0;

module.exports = (io) => {
  io.on('connection', function (socket) {
    socket.on('request', function (data) {
      if (!data || typeof data.token !== 'string' || !data.token) return;

      // The handle returned by wget() is now stored on the socket. It never was
      // before, so the cleanup below could never find a process to stop.
      if (socket.job) {
        socket.emit(data.token, { error: 'A download is already running on this connection.' });
        return;
      }

      var ip = socket.handshake.address || 'unknown';
      var now = Date.now();
      if (COOLDOWN_MS > 0 && lastJobByIp[ip] && now - lastJobByIp[ip] < COOLDOWN_MS) {
        socket.emit(data.token, { error: 'You started a capture moments ago. Please wait a few seconds and try again.' });
        return;
      }
      if (activeJobs >= MAX_JOBS) {
        socket.emit(data.token, { error: 'The server is busy with other captures right now. Please try again in a moment.' });
        return;
      }
      if (Object.keys(lastJobByIp).length > (MAX_JOBS * 100)) {
        for (var key in lastJobByIp) {
          if (now - lastJobByIp[key] > 60 * 60 * 1000) delete lastJobByIp[key];
        }
      }
      lastJobByIp[ip] = now;
      activeJobs++;

      console.log('Request connection received %s', data.token);
      socket.job = wget(socket, data, function () {
        activeJobs--;
        socket.job = null;
      });
    });

    socket.on('disconnect', function () {
      console.log('User disconnected');
      // Stop the wget process and remove partially downloaded files
      if (socket.job) {
        socket.job.cancel();
        socket.job = null;
        activeJobs--;
      }
    });
  });
};