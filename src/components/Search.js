import React, { useState } from 'react'
import taskService from '../services/task'
import Notification from './Notification'

const Search = ({ setTasks }) => {

  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = async (event) => {
    event.preventDefault()
    try {
      const response = await taskService.getSearchedTasks({ search })
      setTasks(response)
    } catch (exception) {
      setErrorMessage('Haku ei onnistunut')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <form onSubmit={handleSearch} className="Search-form">
        <input
          className="Search-input"
          type="text"
          defaultValue=''
          name="Search"
          placeholder="Hakutermi"
          onChange={({ target }) => setSearch(target.value)}
        />
        <button type="submit" className="search-tasks-button">Hae</button>
      </form>
    </div>
  )
}

export default Search