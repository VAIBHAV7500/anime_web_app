import React from 'react'
import styles from './page_loader.module.css';
import GridLoader from "react-spinners/ClipLoader";

const override = `
    position:fixed;
    left: 45%;
    top: 50%;
`;

function page_loader({title,cover}) {

    const coverBackground = {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
        url(${cover})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }

    return (
        <div className={styles.shadow} style={coverBackground}>
                {/* <div className={styles.title}>{title}</div> */}
                {/* <GridLoader loading={true} css={override} size={100} color="white"/> */}
        </div>
    )
}

export default page_loader
