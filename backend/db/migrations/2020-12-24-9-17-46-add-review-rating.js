module.exports = async (con) => {
  const sql = `ALTER TABLE reviews ADD rating INT`;
  return new Promise((res, rej) => {
      con.query(sql, (err, result) => {
          if (err) {
              rej(err);
          }
          res(result);
      });
  });
}   
