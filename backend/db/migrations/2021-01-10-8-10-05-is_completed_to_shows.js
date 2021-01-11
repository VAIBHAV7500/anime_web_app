module.exports = async (con) => {
  const sql = `ALTER TABLE shows ADD is_completed BOOLEAN`;
  return new Promise((res, rej) => {
      con.query(sql, (err, result) => {
          if (err) {
              rej(err);
          }
          res(result);
      });
  });
}   
