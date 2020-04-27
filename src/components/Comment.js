import React, { useState, useEffect } from 'react'
import commentService from '../services/comment'
import Notification from './Notification'
import Moment from 'react-moment'


const Comment = ({ task, user }) => {
  const [comments, setComments] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    commentService.getComments(task.id).then((response) => {
      setComments(response)

    })
  }, [])

  const handleCommentDelete = async (comment) => {
    try {
      await commentService.deleteComment(comment.id)
      setComments(comments.filter(c => c.id !== comment.id))
    } catch (exeption) {
      setErrorMessage('Kommentin poistaminen ei onnistunut')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    }
  }

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      {comments.map((comment) => (
        <div key={comment.id}>
          <div className="comment-date">
            <Moment format="DD.MM.YYYY HH:mm">{comment.created}</Moment>
            {user &&
              "  POISTA"
            }
          </div>
          <div className="comment-content">
            {comment.content}
          </div>
          <div>
            <div className="comment-container">
              <div>
                <div className="user" />
              </div>
              <div className="user-right" >
                <p className="user-left">{comment.nickname}</p>
              </div>
            </div>
          </div>
          <div className="space2"></div>
        </div>
      ))}
      <div className="space"></div>

    </div>


  )
}
export default Comment
