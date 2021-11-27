require('dotenv').config();
const oracledb = require('oracledb');

const { DB_USERNAME, DB_PASSWORD } = process.env;

export const runInsert = async (sql, datas) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: DB_USERNAME,
      password: DB_PASSWORD,
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
      user: DB_USERNAME,
      password: DB_PASSWORD,
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
