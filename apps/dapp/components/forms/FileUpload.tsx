export {};
// import React, { useEffect } from 'react'
// import PropTypes from "prop-types"

// import { useFormContext } from 'react-hook-form'
// import { useDropzone } from "react-dropzone";
// import { Chip} from '@material-ui/core'

// const ReconomeFieldFileUpload = ({ data = {}, id, label, name}) => {
//   const {
//     clearErrors,
//     register,
//     unregister,
//     errors,
//     setError,
//     setValue,
//     watch,
//   } = useFormContext()

//   const files = watch(name)

//   const {getInputProps, getRootProps, isDragActive, isDragReject, isDragAccept, isFocused} = useDropzone({
//     accept: (data.accept)? data.accept : [],
//     onDrop: (droppedFiles) => {
//       setValue(name, droppedFiles)
//       clearErrors(name)
//     },
//     onDropRejected: () => {
//       setError(name, {
//         type: "manual",
//         message: `Please use only files of the following types: ${data.accepted}`
//       })
//     },
//     maxSize: (data.maxFileSize)? data.maxFileSize : 5000000, // max size 5MB -- !!! Also change description below
//     minSize: (data.minFileSize)? data.minFileSize : 0 // max size 10MB
//   });

//   const removeFile = (event) => {
//     event.stopPropagation()
//     setValue(name, [])
//   }

//   useEffect(() => {
//     register(name, {
//       validate: (files) => {
//         return (!data.required) || (files && !!files.length) || "Please choose a file"
//       }
//     })
//     return () => {
//       unregister(name)
//     }
//   }, [register, unregister, name, data.required])

//   let classes = 'file-drop-container MuiFormControl-root MuiFormControl-fullWidth'
//   if (isDragReject)
//     classes += ' drag-reject'

//   if (isDragActive)
//     classes += ' drag-active'

//   if (isDragAccept)
//     classes += ' drag-accept'

//   if (isFocused)
//     classes += ' drag-focused'

//   if (files && !!files.length && !!files[0].name)
//     classes += ' has-files'

//   if (name in errors)
//     classes += ' error'

//   let accepted_files = data.accept.split(' ')

//   if (!!accepted_files.length)
//     accepted_files[accepted_files.length - 1] = `and ${accepted_files[accepted_files.length - 1]}`

//   accepted_files = accepted_files.join(' ')

//   return <div className={classes}>
//     <div className="border"></div>
//     <div className="dropzone-container">

//       <div className="dropzone" {...getRootProps()}>
//       <label
//         className='file-drop-label'
//         htmlFor={name}
//       >
//         <span className="title">{label}</span>{(data.accept) && <span className="small">We work with <span className="typelist">{accepted_files}</span> files that are smaller than <b>5MB</b>.</span>}
//         {((name in errors)) && <span className="error-message">{data.required}</span>}

//         <input
//           name={name}
//           id={name}
//           required
//           {...getInputProps()}
//         />
//         </label>
//           {!!files?.length && (
//             <div className="file-list">
//               {files.map((file, index) => {
//                 return (
//                   (!!file.name) && <Chip label={file.name} onDelete={removeFile} color="secondary" key={`file-list-${index}`}/>
//                 )
//               })}
//             </div>
//           )}

//       </div>
//     </div>
//   </div>
// }

// ReconomeFieldFileUpload.defaultProps = {
//   data: {}
// }

// ReconomeFieldFileUpload.propTypes = {
//   id: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired
// }

// export default ReconomeFieldFileUpload
