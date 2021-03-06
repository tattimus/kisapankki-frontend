import React, { useState, Fragment } from 'react'
import { CirclePicker } from 'react-color'
import Notification from '../misc/Notification'
import seriesService from '../../services/series'

const Series = ({ series, setSeries }) => {
  const [name, setName] = useState('')
  const [modifiedSerieName, setModifiedSerieName] = useState('')
  const [modifiedSerieId, setModifiedSerieId] = useState('')
  const [modifiedSerieColor, setModifiedSerieColor] = useState('')
  const [color, setColor] = useState('#ffffff')
  const [errorMessage, setErrorMessage] = useState(null)
  const [modifyVisible, setModifyVisible] = useState(false)

  const handleSeriesAdd = async (event) => {
    event.preventDefault()
    try {
      const addedSerie = await seriesService.addSeries({ name, color })
      setName('')
      setColor('')
      setSeries(series.concat(addedSerie))
    } catch (exception) {
      setErrorMessage('Jotain meni vikaan')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleSerieDelete = async (serie) => {
    try {
      if (window.confirm(`Haluatko poistaa sarjan: ${serie.name}`)) {
        await seriesService.deleteSerie(serie.id)
        setSeries(series.filter(s => s.id !== serie.id))
      }
    } catch (exeption) {
      setErrorMessage('Jotain meni vikaan')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleSerieModify = async (event) => {
    event.preventDefault()
    const modifiedSerie = { id: modifiedSerieId, name: modifiedSerieName, color: modifiedSerieColor }
    try {
      await seriesService.editSerie(modifiedSerie)
      setModifyVisible(false)
      setSeries(series.map(serie => serie.id !== modifiedSerie.id ? serie : modifiedSerie))
    } catch (exception) {
      setErrorMessage('Jotain meni vikaan')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleShowModify = (serie) => {
    setModifyVisible(true)
    setModifiedSerieId(serie.id)
    setModifiedSerieName(serie.name)
    setModifiedSerieColor(serie.color)
  }

  return (
    <div className="series-form">
      <Notification message={errorMessage} type="error" />

      {series && series.map((serie) => (
        <div className="serie-list-item" key={serie.id}>
          {modifyVisible && modifiedSerieId === serie.id ?
            <div className="serie-form-item">
              <form onSubmit={handleSerieModify} >
                <div className="item-modify">
                  <input
                    className="serie"
                    type="text"
                    value={modifiedSerieName}
                    name="Serie"
                    onChange={({ target }) => setModifiedSerieName(target.value)}
                  />
                  <div className="item-buttons-save">
                    <button type="submit" className="serie-save-button">Tallenna</button>
                    <button onClick={() => setModifyVisible(false)}>Peruuta</button>
                  </div>
                  <div className="color-picker">
                    <CirclePicker
                      color={modifiedSerieColor}
                      onChangeComplete={color => setModifiedSerieColor(color.hex)}
                      colors={["#253764", "#28aae1", "#f04150", "#f0a01e", "#f0e105", "#14a54b",
                        "#f5ea2e", "#d4791e", "#5e0f75", "#33652e", "#6e470a", "#607d8b"]}
                    />
                  </div>
                </div>
              </form>
            </div>
          :
          <Fragment>
            <p className="item-name"><span>{serie.name}</span><span style={{ backgroundColor: serie.color, display: 'inline-block', borderRadius: '50%', height: '27px', width: '27px', marginLeft: '5px' }} /></p>
            <div className="item-buttons">
              <button onClick={() => handleShowModify(serie)} className="modify-button">Muokkaa</button>
              <button onClick={() => handleSerieDelete(serie)} className="delete-button">Poista</button>
            </div>
          </Fragment>
          }
        </div>))
      }

      <form onSubmit={handleSeriesAdd} className="add-form">
        <div className="item-add">
          <input
            className="name"
            type="text"
            value={name}
            name="Name"
            placeholder="Uusi sarja"
            onChange={({ target }) => setName(target.value)}
          />
          <button type="submit" className="series-submit-button">Lisää</button>
        </div>
        <div className="color-picker">
          <CirclePicker
            color={color}
            onChangeComplete={color => setColor(color.hex)}
            colors={["#253764", "#28aae1", "#f04150", "#f0a01e", "#f0e105", "#14a54b",
              "#f5ea2e", "#d4791e", "#5e0f75", "#33652e", "#6e470a", "#607d8b"]}
          />
        </div>
      </form>

    </div>
  )
}

export default Series
