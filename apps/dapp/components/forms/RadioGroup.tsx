export {};
// import React from 'react'
// import PropTypes from "prop-types"
// import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@material-ui/core'
// import { Controller, useFormContext } from 'react-hook-form'

// const ReconomeFieldRadioGroup= ({className, name, options, row, required}) => {
//   const { control, errors } = useFormContext();

//   let classes = 'radio-group ' + className

//   if (row)
//     classes += ' row'

//   return <FormControl component="fieldset" error={(name in errors)} fullWidth>
//     <Controller
//       as={
//         <RadioGroup aria-label={name} row={(row)} className={classes}>
//           {
//             options.map((option, index) => (
//               <FormControlLabel value={option.value} control={<Radio />} label={option.label} key={`${name}-option-${index}`} />
//             ))
//           }
//         </RadioGroup>
//       }
//       rules={{
//         required: (required)
//       }}

//       name={name}
//       control={control}
//     />
//   {(name in errors) && <FormHelperText className="radio-group-error">Please make a choice</FormHelperText> }
// </FormControl>

// }

// ReconomeFieldRadioGroup.propTypes = {
//   name: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(PropTypes.object).isRequired,
//   row: PropTypes.bool,
//   required: PropTypes.bool
// }

// export default ReconomeFieldRadioGroup
