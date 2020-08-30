const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS videos (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT,
            url TEXT,
            video_length TIME,
            intro_start_time TIME,
            intro_end_time TIME,
            recap_start_time TIME,
            recap_end_time TIME,
            closing_start_time TIME,
            closing_end_time TIME,
            quality INT,
            type VARCHAR(255),
            show_id BIGINT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

module.exports = {
    createTable
}
