module.exports = async (con) => {
  const sql = `INSERT INTO plans (name, screen, price)
  SELECT * FROM (SELECT 'premium', 2, 200) AS tmp
  WHERE NOT EXISTS (
      SELECT name FROM plans WHERE name = 'premium'
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