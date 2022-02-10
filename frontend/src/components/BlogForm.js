// import React, { useState } from 'react'
// import InputElement from './InputElement'

// const BlogForm = ({ createBlog }) => {
//   const [ title, setTitle ] = useState('')
//   const [ author, setAuthor ] = useState('')
//   const [ url, setUrl ] = useState('')

//   const addBlog = (event) => {
//     event.preventDefault()

//     const blog = {
//       title,
//       author,
//       url
//     }

//     createBlog(blog)

//     setTitle('')
//     setAuthor('')
//     setUrl('')
//   }

//   const blogForm = {
//     headerText: 'add a new blog',
//     inputElements: [
//       {
//         label: 'title: ',
//         value: title,
//         id: 'title',
//         handleChange: (event) => setTitle(event.target.value)
//       },
//       {
//         label: 'author: ',
//         value: author,
//         id: 'author',
//         handleChange: (event) => setAuthor(event.target.value)
//       },
//       {
//         label: 'url: ',
//         value: url,
//         id: 'url',
//         handleChange: (event) => setUrl(event.target.value)
//       }
//     ],
//     submit: addBlog,
//     submitBtnText: 'create'
//   }

//   return (
//     <div>
//       <h3>{blogForm.headerText}</h3>
//       <form onSubmit={blogForm.submit} id='blog-form'>
//         {blogForm.inputElements.map(e => <InputElement key={e.label} props={e}/>)}
//         <button type='submit' id='blog-submit'>{blogForm.submitBtnText}</button>
//       </form>
//     </div>
//   )
// }

// export default BlogForm