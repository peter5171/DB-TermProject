const oracledb = require('oracledb');

export const runInsert = async (sql, datas) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'test',
      connectionString: 'localhost:1521/XE',
    });

    console.log('Successfully connected to Oracle Database');

    const result = await connection.execute(sql, datas, {
      resultSet: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

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

export const runSelect = async (sql, datas) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'test',
      connectionString: 'localhost:1521/XE',
    });

    console.log('Successfully connected to Oracle Database');

    const result = await connection.execute(sql, datas, {
      resultSet: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rs = result.resultSet;
    let row;
    let data = [];

    while ((row = await rs.getRow())) {
      data.push(row);
    }

    await rs.close();
    return data;
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
