import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CommentItem = ({ comment, activeUser }) => {
    const navigate = useNavigate()
    const slug = useParams().slug
    const [likeCount, setLikeCount] = useState(comment.likeCount)
    const [likeStatus, setLikeStatus] = useState(false)
    const [commentlist, setCommentList] = useState([])

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
        const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
        ];
        const d = new Date(createdAt);
        var datestring = d.getDate() + " " + monthNames[d.getMonth()] + ", " + d.getFullYear()
        return datestring
    }

    const handleCommentLike = async () => {
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

    useEffect(() => {
        getStoryComments()
    }, [setCommentList])

    const handleDelete = async () => {
        const comment_id = comment._id
        if (window.confirm("Вы хотите удалить этот комментарий?")) {
            try {
                const { dataD } = await axios.delete(`/comment/${slug}/${comment_id}/delete`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })

                const { data } = await axios.get(`/comment/${slug}/getAllComment`)
                setCommentList(data.data)
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
                            className='delete-Btn'
                            onClick={handleDelete}
                        > Удалить </button>
                        : null
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
            </div>
        </div>
    )
}

export default CommentItem;
