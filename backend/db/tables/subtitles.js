const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS subtitles (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            url TEXT,
            show_id BIGINT,
            video_id BIGINT,
            language VARCHAR(255),
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
