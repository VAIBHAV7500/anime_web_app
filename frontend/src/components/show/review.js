import React, { useState, useEffect } from 'react'
import styles from './review.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { Editor } from '@tinymce/tinymce-react';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useSelector } from 'react-redux';

function Review({show_id}) {

    const [reviews, setReviews] = useState([]);
    const userId = useSelector(state => state.user_id);

    const init = async () => {
        const endPoint = `${requests.reviews}/shows?id=${show_id}&user_id=${userId}`;
        const response = await axios.get(endPoint);
        console.log(response);
        response.data = response.data.reverse();
        setReviews(response.data);
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
        if(finalContent){
            const endPoint = `${requests.reviews}/create`;
            const body = {
                show_id,
                user_id: userId,
                review: finalContent
            }
            const response = await axios.post(endPoint, body).catch((err) => {
                console.log(err);
                //Something went wrong
            });
            console.log(response);
            textEditor.setContent('');
        }
    }

    const createMarkup = (review) => {
        return {
            __html: review.review
        };
    }

    const handleLike = (review_id) => {
        const className = styles.red_heart;
        console.log(className);
        const element = document.getElementById(review_id);
        const likeNumber = document.getElementById(`like_${review_id}`);
        console.log(element);
        console.log(likeNumber.innerText);
        if(element.classList.contains(className)){
            element.classList.remove(className);
            likeNumber.innerText = (parseInt(likeNumber.innerText) - 1).toString();
            const endPoint = `${requests.reviews}/unlike?id=${review_id}&user_id=${userId}`;
            axios.delete(endPoint);
        }else{
            element.classList.add(className);
            likeNumber.innerText = (parseInt(likeNumber.innerText) + 1).toString();
            const body = {
                user_id: userId,
                show_id,
                review_id
            }
            const endPoint = `${requests.reviews}/like`;
            axios.post(endPoint, body);
        }
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
                    allow_unsafe_link_target: false,
                    placeholder: "To get more attention, Start with writing the Heading of the Review",
                    skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
                    content_css: 'default',
                    content_style: 'div { margin: 10px; border: 5px solid red; padding: 3px; }',
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic forecolor backcolor | \
                        bullist numlist outdent indent | removeformat'
                    }}
                    onEditorChange={handleEditorChange}
                />
                <div className={`${styles.post_button} ${styles.neumorphism}`} onClick={postReview}>POST</div>
            </div>
            <div className={styles.seperator} />
            <div className={styles.review_container}>
                { reviews.map((review, index)=> {
                    return <div className={`${styles.review} ${styles.neumorphism}`} key={index}>
                        <div className={styles.review_text} dangerouslySetInnerHTML={createMarkup(review)}/>
                        <div className={styles.bottom_container}>
                            <div className={styles.reviewer}>By {review.email} </div>
                            <AiFillHeart id={review.id} className={`${styles.heart} ${review.current_user ? styles.red_heart : ""}`} onClick={()=>{handleLike(review.id)}} />  
                            <div className={styles.likes} id={`like_${review.id}`}>{review.likes}</div>      
                        </div>
                    </div>
                }) }
            </div>
        </div>
    )
}

export default Review
