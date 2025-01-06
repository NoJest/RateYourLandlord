import React from 'react'

function Homepage() {

  return (
    <>
    {/* Carousel of ten worst landlords */}
    {/* button for routing to LoginPage */}
    <Link to = '/login'>
    <button>Login</button>
    </Link>
    {/* button for routing to SignUpPage */}
    <Link to = '/signup'>
    <button>Sign Up</button>
    </Link>
    </>
  )
}

export default Homepage