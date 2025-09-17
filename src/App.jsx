import React, { useState, useEffect, useRef } from 'react'
const utm = "?utm_source=scrimba_degree&utm_medium=referral"

const loadData = (options) => {
  fetch(options.url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .then(data => { if (options.onSuccess) options.onSuccess(data) })
    .catch(err => { if (options.onError) options.onError(err) })
}

export default function App() {
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // keep query state if you want to change theme later (search UI still commented out)
  const [query, setQuery] = useState('')
  const topics = ["technology", "computer", "office", "server", "programming", "city buildings", "data center", "startup", "futuristic", "coding"]
  /*["law", "court", "justice", "legal", "attorney", "judge"]*/ 
/*[*/
  const queryInput = useRef(null)
  const urlBase = "https://apis.scrimba.com/unsplash/photos/random/?orientation=landscape"

  // single reusable fetch
  const fetchPhoto = () => {
    setLoading(true)
    setError(null)
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    const photoUrl = `${urlBase}&query=${encodeURIComponent(randomTopic)}`
    loadData({
      url: photoUrl,
      onSuccess: res => {
        setPhoto(res)
        setLoading(false)
      },
      onError: err => {
        setError(err)
        setLoading(false)
      }
    })
  }

  // on mount: fetch immediately and then every N ms
  useEffect(() => {
    fetchPhoto()
    const intervalMs = 10000 // 10 seconds; increase to 30000 or 60000 to avoid rate limits
    const id = setInterval(fetchPhoto, intervalMs)
    return () => clearInterval(id)
    // we intentionally do NOT include fetchPhoto in deps to keep interval stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]) // if you later change query, effect will re-run and restart interval
// fetch once on mount, then every 10 seconds
useEffect(() => {
  fetchPhoto() // initial fetch

  const intervalId = setInterval(fetchPhoto, 10000) // 10000 ms = 10s
  return () => clearInterval(intervalId) // cleanup
}, [query])

  // click handler to get a new photo immediately
  const handleClickNext = () => {
    fetchPhoto()
  }

  return (
    <div className="container">
      <div className="item">
        {loading && <div className="status">Loading photo…</div>}
        {error && <div className="status error">Failed to load photo: {error.message}</div>}

        {photo && photo.urls && (
          // user can click the image to get a new photo
          <img
            className="img"
            src={photo.urls.regular}
            alt={photo.alt_description || `Photo by ${photo.user?.name || 'Unsplash'}`}
            onClick={handleClickNext}
            style={{ cursor: 'pointer' }}
          />
        )}

        <div className="red-border" aria-hidden="true"></div>

        <div className="right-frame">
          {/*
          <form className="search" onSubmit={searchPhotos}>
            <input ref={queryInput} defaultValue={query} className="search-input" placeholder="Search theme (e.g. Mountain, Ocean)" aria-label="Search photos" />
            <button className="search-btn" type="submit">Search</button>
          </form>
          */}
          <h4 className="name first-name">Palak</h4>
          <h4 className="name last-name">Mishra</h4>
          <div className="divider"></div>
          <h5 className="job-title">Legal Researcher</h5>
          <h5 className="email">palak.mishra0410@gmail.com</h5>
          <h5 className="phone"></h5>
        </div>

        <div className="caption" aria-hidden={!photo}>
          <span className="credits">Photo by
            <a href={(photo?.user?.links?.html || '#') + utm} target="_blank" rel="noopener noreferrer">{photo?.user?.name || 'Unknown'}</a>
            <span> on </span>
            <a href={"https://unsplash.com" + utm} target="_blank" rel="noopener noreferrer">Unsplash</a>
          </span>
        </div>
      </div>
    </div>
  )
}