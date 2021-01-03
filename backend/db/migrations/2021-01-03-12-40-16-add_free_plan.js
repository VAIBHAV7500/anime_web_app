module.exports = async (con) => {
  const sql = `INSERT INTO plans (name, screen, price)
  SELECT * FROM (SELECT 'basic', 1, 0) AS tmp
  WHERE NOT EXISTS (
      SELECT name FROM plans WHERE name = 'basic'
  ) LIMIT 1;`;
  return new Promise((res, rej) => {
      con.query(sql, (err, result) => {
          if (err) {
              rej(err);
          }
          res(result);
      });
  });
}   