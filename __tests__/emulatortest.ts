const EmulatorClient = require("../lib/client").default;

jest.setTimeout(10000);
const client = new EmulatorClient("L3Dg6JJ6qS8Ftnn4", { port: 5554 });

// test('ping', async () => {
//     const res = await new Promise((resolve, reject) => {
//         return client.ping().then(resolve).catch(reject);

//     });
//     expect(res).toBe(true);
// });

// test('sensor', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.sensorSet('temperature', 1, 0, 0)
//                 .then(() => {
//                     return client.sensorGet('temperature').then(resolve).catch(reject);
//                 });
//         }, 5000);

//     });
//     expect(res[0]).toBe(1);
// })

// test('gsm', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.gsmCall('12345')
//                 .then(() => {
//                     return client.gsmList().then(resolve).catch(reject);
//                 });
//         }, 5000);

//     });
//     expect(res).toHaveProperty('length', 1);
// })

// test('network speed', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.networkSpeed(1000)

//                 .then(() => {
//                     return client.networkStatus().then(resolve).catch(reject);
//                 });
//         }, 5000);
//     });
//     expect(res['DOWNLOAD_SPEED']).toContain('1000')
// })

// test('network delay', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.networkDelay(3, 6)

//                 .then(() => {
//                     return client.networkStatus().then(resolve).catch(reject);
//                 });
//         }, 5000);
//     });
//     expect(res['MINIMUM_LATENCY']).toContain('3')
// })

// test('redir', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.redirAdd('tcp', 1356, 9867)
//                 .then(() => {
//                     return client.redirList().then(resolve).catch(reject);
//                 });
//         }, 5000);
//     });
//     expect(res[0]).toHaveProperty('hostPort', 1356)
// })

// test('heartbeat', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.avdHeartbeat()
//                 .then(() => {
//                     return client.redirList().then(resolve).catch(reject);
//                 });
//         }, 5000);
//     });
//     expect(res).toBe(0)
// })

// test('avdname', async () => {
//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             client.avdName()
//                 .then(() => {
//                     return client.redirList().then(resolve).catch(reject);
//                 });
//         }, 5000);
//     });
//     expect(res).toBe('Pixel_2_API_27')
// })

// test('power', async () => {
//     const socket = new EmulatorConnection('L3Dg6JJ6qS8Ftnn4');
//     const res = await new Promise((resolve, reject) => {
//         socket.on('auth', () => {
//             Promise.all([
//                 socket.powerAc('on'),
//                 socket.powerStatus('discharging'),
//                 socket.powerPresent(true),
//                 socket.powerHealth('failure'),
//                 socket.powerCapacity(40)
//             ])
//                 .then(() => {
//                     return socket.powerDisplay().then(resolve).catch(reject);
//                 })
//         });
//     });
//     socket.connect(5554)
//     expect(res).toMatchObject({
//         ac: 'online',
//         status: 'Discharging',
//         health: 'Unspecified failure',
//         present: true,
//         capacity: 40
//     });
// });
