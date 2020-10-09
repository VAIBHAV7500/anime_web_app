import React from 'react'
import styles from './FormGroup.module.css';

export default function FormGroup(props) {
    return (
        <div className={styles.form_group}>
            <label className={styles.label} htmlFor={props.name}><strong>{props.name}:</strong></label>
            <div className={styles.group}>
                <i className={styles.icon}>  
                    {props.component}
                </i>
                <input name={props.name} id={props.id} type={props.type} className={`${styles.inputField} form-control`} placeholder={props.name} value={props.value} onChange={props.onChange} pattern={props.pattern? props.pattern : null} title={props.title? props.title : null} required="required" />
            </div>
        </div>
    )
}
