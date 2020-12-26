module.exports = async (con) => {
  const sql = `ALTER TABLE character_show_mapping ADD revealed_in INT`;
  return new Promise((res, rej) => {
      con.query(sql, (err, result) => {
          if (err) {
              rej(err);
          }
          res(result);
      });
  });
}   
