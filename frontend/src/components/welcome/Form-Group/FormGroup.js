import React from 'react'

export default function FormGroup(props) {
    return (
        <div className="form-group">
            <label htmlFor={props.name}><strong>{props.name}:</strong></label>
            <div className="group">
            <i>  
                {props.component}
            </i>
            <input name={props.name} id={props.id} type={props.type} className="inputField form-control" placeholder={props.name} value={props.value} onChange={props.onChange} pattern={props.pattern? props.pattern : null} title={props.title? props.title : null} required="required" />
            </div>
        </div>
    )
}
