import './App.css'
import { useEffect, useState } from 'react'

import { openDB } from 'idb';

const dbPromise = openDB('requests-db', 1, {
  upgrade(db) {
    db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
  },
});

function App() {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { type: 'module' })
          .then((registration) => {
            console.log('Service Worker registrado con éxito:', registration);
          })
          .catch((err) => {
            console.log('Service Worker registro falló:', err);
          });
      });
    }
  }, []);

  const [loading, setLoading] = useState<boolean>(false)


  const saveRequest = async (request: any) => {
    const db = await dbPromise;
    try {
      await db.add('requests', request)
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmitImage = async (e: any) => {
    e.preventDefault()
    const data = new FormData(e.target)
    try {

      setLoading(true)
      const timeout = setTimeout(() => {
        controller.abort()
      }, 1000)
      const controller = new AbortController()
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: data,
        signal: controller.signal
      })
      clearTimeout(timeout)
      const results = await response.json()
      console.log(results)
    } catch (e: any) {
      if (e.name === 'AbortError') {
        const image = data.get('image') as File
        const imageObject = {
          name: image.name,
          type: image.type,
          size: image.size,
          lastModified: image.lastModified,
          lastModifiedDate: image.lastModified,
          arrayBuffer: await image.arrayBuffer()
        }

        //save request
        await saveRequest({
          url: 'http://localhost:3000/upload',
          method: 'POST',
          body: {
            image: imageObject
          }
        })
      }
    } finally {
      setLoading(false)
    }

  }


  return (
    <section>
      <h1>Service worker</h1>
      <form onSubmit={onSubmitImage}>
        <input type="file" name="image" />
        <button type="submit">{loading ? 'Guardando...' : 'Enviar'}</button>
      </form>
    </section>
  )
}

export default App
