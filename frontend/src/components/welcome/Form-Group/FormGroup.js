import React, { useEffect } from 'react'
import styles from './FormGroup.module.css';

export default function FormGroup(props) {
    
    return (
        <div className={styles.form_group}>
            <label className={styles.label} htmlFor={props.fieldData.name}><strong>{props.fieldData.name}:</strong></label>
            <div className={styles.group}>
                <i className={styles.icon}>  
                    {props.fieldData.component}
                </i>
                <input name={props.fieldData.name} id={props.fieldData.id} type={props.fieldData.type} className={`${styles.inputField} form-control`} placeholder={props.fieldData.name} value={props.fieldData.value} onChange={props.fieldData.onChange} pattern={props.fieldData?.pattern ? props.fieldData.pattern : null} title={props.fieldData.title? props.fieldData.title : null} required />
            </div>
        </div>
    )
}
