const oracledb = require('oracledb');
const dbConfig = require('./database');

oracledb.initOracleClient({ libDir: 'C:\\instantclient_19_11' });

async function initialize() {

  await oracledb.createPool(dbConfig.hrPool);
  console.log("pool created");
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool().close();
  console.log("pool closed");
}

module.exports.close = close;

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
    opts.autoCommit = true;

    try {
    console.log("Requesting connection");
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.simpleExecute = simpleExecute;

// function refCursorExecute (statement, binds = []) {
//   return new Promise(async (resolve, reject) => {
//     let conn;

//     opts.outFormat = oracledb.OBJECT;
//     opts.autoCommit = true;

//   try {
//     connection = await oracledb.getConnection();

//     const result = await connection.execute(statement, binds);
//     /* const result = await connection.execute(
//       `BEGIN 
//             AIT_OPERATION_PKG.select_truck_org (:p_truck_id, :p_org_id, :info); 
//        END;`,
//       {
//         P_TRUCK_ID: { type: oracledb.STRING, dir: OracleDB.BIND_IN},
//           P_ORG_ID: { type: oracledb.STRING, dir: OracleDB.BIND_IN },
//               info: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT}
//       }
//     ); */

//     const cursor = result.outBinds.cursor;
//     const queryStream = cursor.toQueryStream();

//     const consumeStream = new Promise((resolve, reject) => {
//       queryStream.on('data', function(row) {
//         console.log(row);
//       });
//       queryStream.on('error', reject);
//       queryStream.on('end', function() {
//         queryStream.destroy(); // free up resources
//       });
//       queryStream.on('close', resolve);
//     });

//     await consumeStream;

//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }

//module.exports.refCursorExecute = refCursorExecute;
 

async function startup() {

  try {
    console.log('Initializing database module');

    await initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }

}

module.exports.startup = startup;

async function shutdown(e) {
  let err = e;

  console.log('Shutting down application');

  try {
    console.log('Closing database module');

    await close();
  } catch (e) {
    console.error(e);

    err = err || e;
  }

  console.log('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

module.exports.shutdown = shutdown;
