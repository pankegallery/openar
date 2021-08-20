export {};
// import React from 'react'
// import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core'
// import { Controller, useFormContext } from 'react-hook-form'

// const ReconomeFieldSelect = ({errormessage, name, label, helperText, defaultValue, options}) => {
//   const { control, errors } = useFormContext();

//   return <FormControl variant="outlined" required error={(name in errors)}>
//     <InputLabel id="company-size-label">{label}</InputLabel>
//     <Controller
//       as={
//         <Select
//           labelId={`${name}-label`}
//           id={name}
//           label={label}

//         >{
//           options.map((item, index) => (
//             <MenuItem key={`${name}-option-${index}`} value={item.value}>{item.label}</MenuItem>
//           ))
//         }
//         </Select>
//       }
//       rules={{
//         required: "Please select",
//       }}
//       name={name}
//       control={control}

//       defaultValue={defaultValue}
//     />
//     {(name in errors) && <FormHelperText>{errormessage}</FormHelperText>}
//     {(helperText) && <FormHelperText>{helperText}</FormHelperText>}
//   </FormControl>
// }

// export default ReconomeFieldSelect
