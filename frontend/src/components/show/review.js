import React, { useState, useEffect } from 'react'
import styles from './review.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { Editor } from '@tinymce/tinymce-react';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useSelector } from 'react-redux';
import { review_word_limit } from '../../constants';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import 'react-toastify/dist/ReactToastify.css';

function Review({show_id,setState,prev}) {
    const [reviews, setReviews] = useState([]);
    const [preview, setPreview] = useState();
    const [editor, setEditor] = useState(false);
    let verified = false;
    const [textEditor, setTextEditor] = useState();
    const userId = useSelector(state => state.user_id);
    const {id} = useParams();

    const toastConfig = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }
    
    const init = async () => {
        const endPoint = `${requests.reviews}/shows?id=${id}&user_id=${userId}`;
        const response = await axios.get(endPoint);
        response.data = response.data.reverse();
        //response.data = {...response.data,showMore : false};
        (response.data).forEach((e,i)=>{
            e = { 
                ...e,
                showMore:false,
            };
            response.data[i] = e;
        })
        setReviews(response.data);
        setState(2,response.data);
    }

    useEffect(() => {
        if(!prev){
            init();
        }else{
            setReviews(prev);
        }
    },[id]);

    const handleEditorChange = (content, editor) => {
        setTextEditor(editor);
        const review = {
            review: content,
            showMore: true,
            email: 'abc@gmail.com'
        };
        setPreview(review);
    }

    const postReview = async () => {
        const proposedReview = preview?.review;
        if(proposedReview){
            if(verified){
                const endPoint = `${requests.reviews}/create`;
                const body = {
                    show_id,
                    user_id: userId,
                    review: proposedReview
                }
                const response = await axios.post(endPoint, body).catch((err) => {
                    toast.error(`O'Oh, looks like there's some issue. Please try again later`);
                    //Something went wrong
                });
                textEditor.setContent('');
                toast.success('Your review has been submitted successfully..', toastConfig);
            }else{
                toast.dark('Hmmm.... Captcha is Required', toastConfig);
            }
        }else{
            toast.warning(`Please write the review first...`);
        }
    }
    const wordLimit = review_word_limit;
    const createMarkup = (review) => {
        return {
            __html: review?.showMore? review.review : review.review.length<=wordLimit ? review.review : review.review.substring(0,wordLimit) + " ..."
        };
    }
    const handleLike = (review_id) => {
        const className = styles.red_heart;
        const element = document.getElementById(review_id);
        const likeNumber = document.getElementById(`like_${review_id}`);
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
    
    const toggleShowMore = (index) =>{
        let newArr = [...reviews];
        newArr[index].showMore = !newArr[index].showMore;
        setReviews(newArr);
    }

    const handleTinyInit = () => {
        setEditor(true);
    }

    const handleVerificationSuccess = (token) => {
        if(token){
            verified = true;
        }
    }

    return (
        <div className={styles.reviews}>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            {/* Same as */}
            <ToastContainer />
            <div className={styles.editor}>
                <Editor
                    className={styles.tiny_editor}
                    apiKey = {process.env.REACT_APP_TINY_API_KEY}
                    initialValue=""
                    init={{
                    menubar: false,
                    min_height: 300,
                    max_height: 400,
                    branding: false,
                    themes: "modern",
                    allow_unsafe_link_target: false,
                    placeholder: "Jot down your review here",
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
                    onInit={handleTinyInit}
                />
                { preview?.review && <div className={`${styles.review} ${styles.make_flex} ${styles.preview}`}>
                            <div className={styles.preview_text}>Preview: </div>
                            <div className={styles.review_detail}>
                                <div className={styles.review_text} dangerouslySetInnerHTML={createMarkup(preview)}/>
                            </div>               
                        </div>
                }
                {editor && <div>
                    <div className={styles.hcaptcha}>
                        <HCaptcha
                        sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                        onVerify={token => handleVerificationSuccess(token)}
                        theme = "dark"
                        language = "en"
                        className = {styles.hcaptcha}
                        />
                    </div>
                    <div className={`${styles.post_button}`} onClick={postReview}>
                    POST
                    </div>
                </div>}
            </div>
            <div className={styles.seperator} />
            <div className={styles.review_container}>
                {
                    reviews.map((review, index)=> {
                        return <div className={`${styles.review} ${styles.make_flex}`} key={index}>
                            <div >
                                <img className={`${styles.avatar} ${styles.neumorphism}`} src="data:image/png;base64,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"></img>
                            </div>
                            <div className={styles.review_detail}>
                                <div className={styles.reviewer}>{review.email} </div>
                                <div className={styles.review_text} dangerouslySetInnerHTML={createMarkup(review)}/>
                                {review.review.length<=wordLimit? "" : review?.showMore? <p className={styles.showMore} onClick={()=>{toggleShowMore(index)}}>Show Less</p> : <p className={styles.showMore} onClick={()=>{toggleShowMore(index)}}>Show More</p>}
                                <div className={styles.make_flex}>
                                    <AiFillHeart id={review.id} className={`${styles.heart} ${review.current_user ? styles.red_heart : ""}`} onClick={()=>{handleLike(review.id)}} />  
                                    <div className={styles.likes} id={`like_${review.id}`}>{review.likes}</div>      
                                </div>
                            </div>               
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Review
