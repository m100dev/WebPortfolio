import React from 'react'

const CTA = () => {
  return (
    <div className='cta'>
        <a href='https://mbdev-resume-bucket.s3.amazonaws.com/Marc+Bastien+Resume.pdf' download className='btn'>View Resume</a>
        <a href="#contact" className='btn btn-primary'>Let's Talk</a>
    </div>
  )
}

export default CTA