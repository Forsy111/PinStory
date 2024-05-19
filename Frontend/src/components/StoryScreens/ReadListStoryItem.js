import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { BsThreeDots, BsBookmarkFill } from 'react-icons/bs'

const ReadListStoryItem = ({ story, editDate }) => {

    const truncateContent = (content) => {
        const trimmedString = content.substr(0, 130);
        return trimmedString
    }

    return (
        <a href={`story/${story.slug}`}>
            <div className="readList-story-item">
                <section>
                    <div className="story-Image-Wrap">
                        <img src={`/storyImages/${story.image}`} alt={story.title} width="180px" />
                    </div>
                </section>
                
                <section>
                    <div className="story-top-block">
                        <div className="readList-story-author">
                            {story.author.username}
                        </div>
                        <span>-</span>
                        <div className="readList-story-createdAt">
                            {editDate(story.createdAt)}
                        </div>
                    </div>
                    <div className="story-med-block">
                        <div className="readList-story-title">
                            <a href={`story/${story.slug}`}>
                                {story.title}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </a>
    )
}

export default ReadListStoryItem