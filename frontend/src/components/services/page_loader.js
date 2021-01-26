import React from 'react'
import styles from './page_loader.module.css';
import GridLoader from "react-spinners/ClipLoader";

const override = `
    position:fixed;
    left: 45%;
    top: 50%;
`;

function page_loader({title}) {
    return (
        <div className={styles.shadow}>
                <div className={styles.title}>{title}</div>
                <GridLoader loading={true} css={override} size={100} color="white"/>
        </div>
    )
}

export default page_loader
