const oracledb = require('oracledb');

export const runInsert = async (sql, datas) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'test',
      connectionString: 'localhost:1521',
    });

    console.log('Successfully connected to Oracle Database');

    const result = await connection.execute(sql, datas, {
      resultSet: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(result);

    connection.commit();

    //await rs.close();
    //return data;
  } catch (e) {
    console.error(e);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};
