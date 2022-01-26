import React, { useState, useEffect, useRef } from 'react'

// import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import LoginMessage from './components/LoginMessage'
// import Toggleable from './components/Toggleable'
// import Blogs from './components/Blogs'

// import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

const App = () => {
  const [ user, setUser ] = useState(null)

  // const [ blogs, setBlogs ] = useState([])
  const [ notification, setNotification ] = useState(null)
  const [ notificationType, setNotificationType ] = useState(null)

  // const blogFormRef = useRef()

  const notificationHandler = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotificationType(null)
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (credentials, isLogin) => {
    try {
      const userObject = await loginService.login(credentials, isLogin)
      setUser(userObject)

      window.localStorage.setItem('loggedInUser', JSON.stringify(userObject))

      if (isLogin)
        notificationHandler(`logged in successfully as ${userObject.name}`, 'success')
      else
        notificationHandler(`signed up successfully as ${userObject.name}`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  // const createBlog = async (blogObject) => {
  //   try {
  //     blogFormRef.current.toggleVisibility()
  //     const createdBlog = await blogService.create(blogObject)

  //     setBlogs(blogs.concat(createdBlog))

  //     notificationHandler(`a new blog "${createdBlog.title}" by ${createdBlog.author} has been added successfully`, 'success')
  //   }
  //   catch (exception) {
  //     notificationHandler(exception.response.data.error, 'error')
  //   }
  // }

  // const handleLike = async (blogObject) => {
  //   try {
  //     await blogService.update(blogObject)
  //     setBlogs(blogs.map(blog => blog.id === blogObject.id? blogObject: blog))
  //   }
  //   catch (exception) {
  //     notificationHandler(exception.response.data.error, 'error')
  //   }
  // }

  // const removeBlog = async (blogObject) => {
  //   try {
  //     await blogService.deleteBlog(blogObject)
  //     setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
  //     notificationHandler(`Successfully deleted the blog entry for ${blogObject.title} by ${blogObject.author}`, 'success')
  //   }
  //   catch (exception) {
  //     notificationHandler(exception.response.data.error, 'error')
  //   }
  // }

  // useEffect(() => {
  //   blogService
  //     .getData()
  //     .then(data => {
  //       setBlogs(data)
  //     })
  // }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser)
      setUser(JSON.parse(loggedInUser))
  }, [])

  return (
    <div>
      <h2> fintrack </h2>
      <Notification notification={notification} type={notificationType}/>
      <LoginMessage user={user} setUser={setUser}/>
      { user === null && <LoginForm startLogin={handleLogin}/> }
      { user === null && <SignupForm startSignup={handleLogin}/> }
      {/* {
        user !== null &&
        <Toggleable buttonLabel={'create a blog'} ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Toggleable>
      } */}
      {/* <div>
        { user !== null? <Blogs blogs={blogs} handleLike={handleLike} removeBlog={removeBlog} user={user}/>: ''}
      </div> */}
    </div>
  )
}

export default App