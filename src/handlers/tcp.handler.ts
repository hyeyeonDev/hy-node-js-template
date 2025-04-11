import { createServer } from 'net';
import tcpRouter from '@/src/routers/tcp.router';

export async function tcp_init({ port, schema }: { port: number; schema: string }) {
  let server = createServer((socket) => {
    socket.setEncoding('utf8');
    socket.setTimeout(1000000);

    socket.on('data', function (data: string) {
      const today = new Date().toISOString();
      console.log(`\nReceived data from tcp on port ${port}: ${today}`);
      if (data == '' || data == null) {
        console.log('😵No Data');
        return false;
      }
      tcpRouter(schema, data);
    });

    socket.on('end', function () {
      console.log('Client disconnected');
    });

    socket.on('error', function (err) {
      console.log('Socket Error: ', JSON.stringify(err));
    });

    socket.on('timeout', function () {
      console.log('Socket Timed out');
    });
  });

  server.on('error', function (err: NodeJS.ErrnoException) {
    console.log('Something broke! : ', err.code ?? 'Unknown error');
  });

  // listening
  server.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
}
