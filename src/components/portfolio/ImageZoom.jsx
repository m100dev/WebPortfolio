import React, { useLayoutEffect, useRef } from 'react'
import { BsX } from 'react-icons/bs'
import './image-zoom.css'

// Name shared by the thumbnail and the enlarged image during a view transition, so the
// browser morphs one into the other. Only one element may carry it at a time.
export const ZOOM_TRANSITION_NAME = 'image-zoom'

export const canMorph = () =>
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function' &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Enlarged view of a project image in a native modal <dialog>: focus moves to Close, Esc
// closes, and focus returns to the thumbnail on close. Clicking the backdrop also closes.
// The parent owns `open` and does the view-transition choreography (see ImageRotator).
const ImageZoom = ({ open, image, contain, morph, onClose }) => {
  const dialogRef = useRef(null)

  // Layout effect so showModal()/close() run inside the parent's flushSync, i.e. within
  // the view-transition update callback
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal?.()
    if (!open && dialog.open) dialog.close?.()
  }, [open])

  const handleCancel = (e) => {
    // Esc: route through onClose so the closing animation and state stay in sync
    e.preventDefault()
    onClose()
  }

  const handleClick = (e) => {
    if (e.target === dialogRef.current) onClose()
  }

  const classes = ['image-zoom', contain && 'image-zoom--contain', morph && 'is-morphing']
    .filter(Boolean)
    .join(' ')

  return (
    <dialog
      ref={dialogRef}
      className={classes}
      aria-label={image ? `Enlarged image: ${image.caption}` : undefined}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {open && image && (
        <figure className='image-zoom__figure'>
          <button type='button' className='image-zoom__close' aria-label='Close' onClick={onClose} autoFocus>
            <BsX aria-hidden='true' />
          </button>
          <img
            src={image.src}
            alt={image.caption}
            className='image-zoom__img'
            style={morph ? { viewTransitionName: ZOOM_TRANSITION_NAME } : undefined}
          />
          {image.caption && <figcaption className='image-zoom__caption mono'>{image.caption}</figcaption>}
        </figure>
      )}
    </dialog>
  )
}

export default ImageZoom
