export {};
// import React, { useState } from 'react'
// import PropTypes from "prop-types"

// import { useFormContext } from 'react-hook-form'

// const error_message = "Only numbers please"

// const ReconomeFieldNumberStepper = ({disabled, helperText, id, label, max, min, name, defaultValue}) => {

//   const [ isFocus, setIsFocus ] = useState(false)
//   const { clearErrors, errors, getValues, register, setError, setValue } = useFormContext()

//   const onFocus = (event) => {
//     setIsFocus(true)
//     event.currentTarget.select()
//   }

//   const onBlur = (event) => {
//     setIsFocus(false)
//   }

//   const clampInput = (value) => {
//     if (isNaN(value) || value === '') {
//       value = (min)? min : 0
//     }

//     value = parseInt(value, 10)
//     value = (typeof max !== 'undefined')? Math.min(parseInt(max, 10), value) : value
//     value = (typeof min !== 'undefined')? Math.max(parseInt(min, 10), value) : value

//     setValue(name, value)

//     clearErrors(name)
//   }

//   const onInputChange = (event) => {
//     const value = event.target.value;

//     const pattern = /^\d+$/;

//     if (!pattern.test(value)) {
//       setError(name, {
//         type: "manual",
//         message: error_message
//       })
//     } else {
//       clearErrors(name)
//     }

//   }

//   const onInputKeyPress = (event) => {
//     if(event.which === 13 || event.keyCode === 13) {
//       event.preventDefault();
//       clampInput(event.currentTarget.value)
//     }
//   }

//   const onButtonClick = (action) => {
//     let value = getValues(name)

//     if (isNaN(value) || value === '')
//       value = (min)? min : 0

//     value = parseInt(value, 10)

//     if (isNaN(value))
//       value = (min)? min : 0

//     if (action === '+') {
//       value++
//     } else {
//       value--
//     }
//     clampInput(value)
//   }

//   let classes = 'stepper MuiFormControl-root MuiTextField-root'

//   if (name in errors) {
//     classes += ' error'
//   }

//   if (isFocus)
//     classes += ' focus'

//   if (disabled)
//     classes += ' disabled'

//   return (
//     <div className={classes}>
//       {(label) && <label className={'MuiFormLabel-root stepper-label'} htmlFor={id}>
//         <span className={`scaled`}>{label}</span>
//         <div className="stepper-container">
//           <button type="button" title={`-`} onClick={() => onButtonClick('-')} className="stepper-button" disabled={disabled}><span className={`action`}>-</span></button>
//           <input  type="number"
//                   name={name}
//                   id={id}
//                   step="1"
//                   ref={register}
//                   key={`key-${name}`}
//                   onBlur={onBlur}
//                   onChange={onInputChange}
//                   onFocus={onFocus}
//                   onKeyPress={onInputKeyPress}
//                   disabled={disabled}
//                   defaultValue={defaultValue}
//           />
//           <button type="button" title={`+`} onClick={() => onButtonClick('+')} className="stepper-button" disabled={disabled}><span className={`action`}>+</span></button>
//         </div></label>}
//       {(helperText && !(name in errors)) && <div className={`helper-text MuiFormLabel-root`}><span className={`scaled`}>{helperText}</span></div>}
//       {(name in errors) && <div className={`error-text MuiFormLabel-root`}><span className={`scaled`}>{errors[name].message}</span></div>}
//     </div>

//   )
// }

// ReconomeFieldNumberStepper.defaultProps = {
//   min: 0,
//   max: 100000,
//   disabled: false
// }

// ReconomeFieldNumberStepper.propTypes = {
//   id: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   helperText: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.bool,
//     PropTypes.node
//   ]),

//   min: PropTypes.number,
//   max: PropTypes.number,
//   label: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),  //as you can render an array of elements
//     PropTypes.node,                  //for a single component/element
//     PropTypes.string
//   ]).isRequired,
//   defaultValue: PropTypes.number
// }

// export default ReconomeFieldNumberStepper
