const { runQuery } = require('../db_utils');

const createTable = (con) => {
  const sql = `
      CREATE TABLE IF NOT EXISTS razorpay_orders (
          id VARCHAR(255) PRIMARY KEY,
          status VARCHAR(255),
          amount DOUBLE,
          invoice_id VARCHAR(255),
          method TEXT,
          amount_refunded DOUBLE,
          refund_status TEXT,
          email TEXT,
          contact VARCHAR(255),
          card_id TEXT,
          bank TEXT,
          wallet TEXT,
          vpa TEXT,
          transaction_id VARCHAR(255),
          user_id BIGINT UNSIGNED,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(ID)
      )
  `;
  return new Promise((res, rej) => {
      con.query(sql, (err, result) => {
          if (err) {
              rej(err);
          }
          res(result);
      });
  })
}

const find = async (id) => {
  const sql = `SELECT * FROM razorpay_orders WHERE id = ${id} LIMIT 1`;
  const result = await runQuery(sql);
  return result.length ? result[0] : undefined;
}

const create = async (body) => {
  const sql = `INSERT INTO razorpay_orders(${Object.keys(body).join()}) VALUES (?)`;
  return await runQuery(sql, [Object.values(body)]);
}

const onTransactionComplete = (body, order_id) => {
  const columns = Object.keys(body);
  let columnQuery = [];
  columns.forEach(x => columnQuery.push(`${x} = ?`));
  if(columnQuery){
    const sql = `UPDATE razorpay_orders SET ${columnQuery.join()} WHERE id = ?;`;
    return runQuery(sql, [Object.values(body),order_id].flat());
  }
}

module.exports = {
  createTable,
  find,
  create,
  onTransactionComplete
}
