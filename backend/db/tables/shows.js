const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS shows (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT,
            genre_id JSON,
            trailer_url TEXT,
            poster_portrait_url TEXT,
            poster_landscape_url TEXT,
            season INT,
            total_view BIGINT,
            release_date DATE,
            age_category INT,
            plan_id BIGINT,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    return new Promise((res, rej) => {
        con.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                rej(err);
            }
            res(result);
        });
    })
}

module.exports = {
    createTable
}
