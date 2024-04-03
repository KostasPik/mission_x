import React from 'react'
import './Preloader.css'

export default function Preloader({text}) {
  return (
    <div className='loader-container'>
        <h1 className='loader-text'>{text}</h1>
        <div class="loader"></div>
    </div>
  )
}
