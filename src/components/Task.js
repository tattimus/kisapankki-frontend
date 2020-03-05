import React, { useState, useEffect } from 'react'
import taskService from '../services/task'
import ModifyTask from './ModifyTask'
import Notification from './Notification'
import TaskTextDisplay from './TaskTextDisplay'
import { useHistory } from 'react-router-dom'

const Task = ({ match, user }) => {
  const [task, setTask] = useState(null)
  const [modifyVisible, setModifyVisible] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()

  useEffect(() => {
    taskService.getOneTask(match.params.id).then((response) => {
      setTask(response)
    })
  }, [])

  const handleDelete = () => {
    try {
      taskService.deleteTask(task.id)
      setMessage('Tehtävä poistettu')
      setTimeout(() => {
        setMessage(null)
        if (task.pending) {
          history.push('/admin')
        } else {
          history.push('/')
        }
      }, 2000)
    } catch (exception) {
      setErrorMessage('Jotain meni vikaan')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleAccept = () => {
    try {
      taskService.acceptTask(task.id)
      setMessage('Tehtävä hyväksytty')
      setTimeout(() => {
        setMessage(null)
        history.push('/admin')
      }, 2000)
    } catch (exception) {
      setErrorMessage('Jotain meni vikaan')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  return (
    <div>
      {modifyVisible ?
        <ModifyTask setModifyVisible={setModifyVisible} task={task} setTask={setTask} />
        :
        <div className="info-background">
          <Notification message={message} type="success" />
          <Notification message={errorMessage} type="error" />
          {task &&
            <div className="info">
              <h2>{task.name}</h2>
              <h3>Tehtävänanto:</h3>
              <TaskTextDisplay text={task.assignmentText} />
              <h3>Rastimiehen ohjeet:</h3>
              <TaskTextDisplay text={task.supervisorInstructions} />
              <h3>Arvosteluasteikko:</h3>
              <TaskTextDisplay text={task.gradingScale} />
              <h3>Sarja:</h3>
              {task.series.map(s => <span key={task.id + s.id}>{s.name}<br /></span>)}
              <h3>Kategoria:</h3>
              <p>{task.category.name}</p>
              <h3>Sääntöluokka:</h3>
              <p>{task.rules.name}</p>
              <h3>Tehtävän viimeisin muokkaaja:</h3>
              <p>{task.creatorName}<br />{task.creatorEmail}</p>

              {user !== null &&
                <div>
                  <button onClick={() => setModifyVisible(true)} className="modify-view-button">Muokkaa</button>
                  {task.pending && <button className="accept-button" onClick={() => handleAccept()}>Hyväksy</button>}
                  <button className="delete-button" onClick={() => handleDelete()}>Poista</button>
                </div>}
            </div>
          }
        </div>

      }
    </div>

  )
}

export default Task
