import React, { useState, useEffect } from 'react'
import styles from './review.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
 import { Editor } from '@tinymce/tinymce-react';

function Review({show_id}) {

    const [reviews, setReviews] = useState([]);

    const init = async () => {
        const endPoint = `${requests.reviews}/shows?id=${show_id}`;
        const response = await axios.get(endPoint);
        console.log(response);
    }

    useEffect(() => {
        init();
    },[show_id]);

    let finalContent = '';
    let textEditor;

    const handleEditorChange = (content, editor) => {
        finalContent = content;
        textEditor = editor;
    }

    const postReview = async () => {
        console.log(finalContent);
        const endPoint = `${requests.reviews}/create`;
        const body = {
            show_id,
            user_id: 1,
            review: finalContent
        }
        const response = await axios.post(endPoint,body).catch((err)=>{
            console.log(err);
            //Something went wrong
        });
        console.log(response);  
        textEditor.setContent('');
    }

    return (
        <div className={styles.reviews}>
            <div className={styles.editor}>
                <Editor
                    className={styles.tiny_editor}
                    apiKey = {process.env.REACT_APP_TINY_API_KEY}
                    initialValue=""
                    placeHolder = "Jot down your review here"
                    init={{
                    menubar: false,
                    min_height: 300,
                    max_height: 400,
                    branding: false,
                    themes: "modern",
                    placeholder: "Jot down your review here",
                    skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
                    content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
                    content_style: 'div { margin: 10px; border: 5px solid red; padding: 3px; }',
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic forecolor backcolor | \
                        bullist numlist outdent indent | removeformat | help'
                    }}
                    onEditorChange={handleEditorChange}
                />
                <div className={`${styles.post_button} ${styles.neumorphism}`} onClick={postReview}>POST</div>
            </div>
            <div className={styles.seperator} />
            <div className={styles.review_container}>
                
            </div>
        </div>
    )
}

export default Review
