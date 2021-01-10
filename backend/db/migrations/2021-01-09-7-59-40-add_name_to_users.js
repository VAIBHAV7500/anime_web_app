module.exports = async (con) => {
  const sql = `ALTER TABLE users ADD name TEXT`;
  return new Promise((res, rej) => {
      con.query(sql, (err, result) => {
          if (err) {
              rej(err);
          }
          res(result);
      });
  });
}   
