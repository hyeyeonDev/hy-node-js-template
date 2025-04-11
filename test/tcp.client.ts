import { createServer } from 'net';

const port = 8886;

const server = createServer((socket) => {
  socket.setEncoding('utf8');

  socket.on('data', function (data) {
    console.log(data);
    socket.write('success');
  });

  socket.on('end', function () {
    console.log('Socket Disconnted.');
  });

  socket.on('error', function (err) {
    console.log('Socket Error: ', JSON.stringify(err));
  });

  socket.on('timeout', function () {
    console.log('Socket Timed out');
  });
});

server.on('error', function (err) {
  console.log('TCP ERROR: ', err.code);
});

// listening
server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

function writeData(socket, message) {
  const length = Buffer.byteLength(message);
  const header = Buffer.alloc(4);
  header.writeInt32BE(length, 0);

  const data = Buffer.from(message);

  // socket.write(Buffer.concat([header, data]));
  const success = socket.write(message);
  if (!success) {
    console.log('Server Send Fail');
  }
}

let gpsData = [
  // `OPSI4194378|0|2024-01-31 20:26:21|2024-01-31 20:27:05|N|34.869561|E|127.795875|14.373081|55.689327|23|0|997|149.5;`,
  // `OPSI4194378|0|2024-01-31 20:26:21|2024-01-31 20:27:05|N|0|E|0|14.373081|55.689327|23|0|997|149.5;`,
  // `OPSI4194378|0|2024-01-31 20:26:21|2024-01-31 20:27:05|N|1|E|1|14.373081|55.689327|23|0|997|149.5;`,
  // `OPSI4194378|0|2024-01-31 20:26:21|2024-01-31 20:27:05|N|0|E|0|14.373081|55.689327|23|0|997|149.5;`,
  // `OPSI4194378|0|2024-01-31 20:26:21|2024-01-31 20:27:05|N|2|E|2|14.373081|55.689327|23|0|997|149.5;`,
  `OPSI3211299|0|2000-01-00 00:05:47||||||18.300755|47.205311|-10|10|1027|149.5;`,
];
writeData(client, gpsData.join(''));
