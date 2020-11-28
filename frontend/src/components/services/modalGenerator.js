import React from 'react'
import styles from './modalGenerator.module.css'

const ModalGenerator = (modalContent,id,hook=null) => {
    return(
        <div 
            onClick={(e)=>{
                closeModal(e,id,hook);
            }} 
            id={id} 
            className={styles.modal}
        >
            {modalContent}
        </div>
    )
}

export default ModalGenerator;
export const onStateChange = (hook,newValue) => {
   hook(newValue);
}
export const showModal = (id,hook=null) => {
    document.getElementById(id).style.display="block";
    if(hook){
        onStateChange(hook,true);
    }
}
export const closeModal = (e,id,hook=null,closeIcon=false) => {
    if(e.target === document.getElementById(id) || closeIcon){
        document.getElementById(id).style.display="none";
        if(hook){
            onStateChange(hook,false);
        }
    }
}
