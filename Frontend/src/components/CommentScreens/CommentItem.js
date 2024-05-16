import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import {
    MdOutlineWavingHand,
    MdWavingHand
} from 'react-icons/md'
import { BsThreeDots } from 'react-icons/bs'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CommentItem = ({ comment, activeUser }) => {
    const navigate = useNavigate()
    const slug = useParams().slug
    const [likeCount, setLikeCount] = useState(comment.likeCount)
    const [likeStatus, setLikeStatus] = useState(false)

    useEffect(() => {

        const getCommentLikeStatus = async () => {

            const comment_id = comment._id
            try {
                const { data } = await axios.post(`/comment/${comment_id}/getCommentLikeStatus`, { activeUser }, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })
                setLikeStatus(data.likeStatus)
            }
            catch (error) {
                localStorage.removeItem("authToken")
                navigate("/")
            }
        }
        getCommentLikeStatus()
    }, [])

    const editDate = (createdAt) => {
        const d = new Date(createdAt);
        var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
        return datestring
    }

    const handleCommentLike = async () => {
        console.log("like comment ıtem ın  basıldı ")
        const comment_id = comment._id
        try {
            const { data } = await axios.post(`/comment/${comment_id}/like`, { activeUser }, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })

            setLikeCount(data.data.likeCount)
            setLikeStatus(data.likeStatus)

        }
        catch (error) {
            localStorage.removeItem("authToken")
            navigate("/")
        }
    }

    const handleDelete = async () => {
        const comment_id = comment._id
        if (window.confirm("Do you want to delete this post")) {
            try {
                const { data } = await axios.delete(`/comment/${slug}/${comment_id}/delete`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })
                // navigate(`/story/${story.slug}`)
                // location.reload()
                // window.location.reload();
            }
            catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='comment-item'>
            <div className="comment-top-block">
                <section>
                    <img src={`/userPhotos/${comment.author.photo}`} alt={comment.author.username} width="35" />
                    <div>
                        <span className='comment-author-username' >{comment.author.username}</span>
                        <span className='comment-createdAt'>{editDate(comment.createdAt)}</span>
                    </div>
                </section>
                <section className='BsThreeDots_opt'>
                    {activeUser &&
                        comment.author._id === activeUser._id ?
                    <button type='button'
                        className='cancel-Btn'
                        onClick={handleDelete}
                    > Delete </button>
                    :null
                    }
                </section>
            </div>

            <div className="comment-content">
                <span dangerouslySetInnerHTML={{ __html: comment.content }}></span>
            </div>

            <div className="comment-bottom-block">
                <div className="commentLike-wrapper">
                    <i className='biLike' onClick={() => handleCommentLike()}>
                        {
                            likeStatus ? <FaHeart /> : <FaRegHeart />
                        }
                    </i>
                    <span className='commentlikeCount'>
                        {likeCount}
                    </span>
                </div>
                {/* <div className="comment-star">
                    {
                        [...Array(5)].map((_, index) => {
                            return (
                                <FaStar
                                    key={index}
                                    className="star"
                                    size={15}
                                    color={comment.star > index ? "#0205b1" : "grey"}
                                />
                            )
                        })
                    }
                </div> */}
            </div>
        </div>
    )
}

export default CommentItem;