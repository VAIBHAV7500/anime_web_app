import React, { useState, useEffect } from 'react'
import styles from './review.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
 import { Editor } from '@tinymce/tinymce-react';

function Review() {

    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
        console.log('Editor: ', editor);
    }

    useEffect(() => {
        console.log(process.env.REACT_APP_TINY_API_KEY);
    })

    return (
        <div className={styles.reviews}>
            <div className={styles.editor}>
                <Editor
                    className={styles.tiny_editor}
                    apiKey = {process.env.REACT_APP_TINY_API_KEY}
                    initialValue="<p>This is the initial content of the editor</p>"
                    init={{
                    menubar: false,
                    min_height: 300,
                    max_height: 400,
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
            </div>
        </div>
    )
}

export default Review
