import { TableBody,FormControlLabel,TableCell,TableRow,Checkbox } from '@material-ui/core'
import React from 'react'
const FilterPlakaTable = ({filteredPlakaList,toggleDirectoratePenaltySelection,searchFilterTwo,selectedDirectoratePenalties}) => { 
    console.log("plaka bazli list from table", filteredPlakaList);
  return (
    <>
    <TableBody>
    {filteredPlakaList && filteredPlakaList.length && 
      filteredPlakaList
        .filter((item) => {
          if (searchFilterTwo == "") {
            return item;
          } else if (
            item.unit
              .toLowerCase()
              .includes(searchFilterTwo.toLowerCase())
          ) {
            return item;
          }
        })
        .map((item, index) => (
          <TableRow
            key={index}
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell>
              <FormControlLabel
                control={
                  <Checkbox
                    value={item}
                    checked={selectedDirectoratePenalties.some(
                      (selItem) =>
                        selItem.plate_number ===
                          item.plate_number
                    )}
                    onChange={(e) =>
                      toggleDirectoratePenaltySelection(item)
                    }
                  />
                }
              />
            </TableCell>
            <TableCell component="th" scope="row">
              {item.plate_number}
            </TableCell>
            <TableCell component="th" scope="row">
              {item.unit.toLocaleUpperCase()}
            </TableCell>
            <TableCell component="th" scope="row">
              {item.total_count}
            </TableCell>
           
            <TableCell align="right">
              {item.brand}
            </TableCell>
            <TableCell align="right">
             {item.model}
            </TableCell>
            <TableCell align="right">
              {Number(item.ANKARA_NİĞDE_OTOYOLU).toLocaleString()} TL
            </TableCell>
            <TableCell align="right">
              {Number(item.AVRASYA_TÜNELİ).toLocaleString()} TL
            </TableCell>
              <TableCell align="right">
              {Number(item.GEBZE_ORHANGAZİ_İZMİR_OTOYOLU).toLocaleString()} TL
            </TableCell>
            
              <TableCell align="right">
              {Number(item.İSTANBUL_DENİZ_OTOBÜSLERİ_İDO).toLocaleString()} TL
            </TableCell>
            
              <TableCell align="right">
              {Number(item.KARAYOLLARI_GENEL_MÜDÜRLÜĞÜ).toLocaleString()} TL
            </TableCell>
            <TableCell align="right">
              {Number(item.KUZEY_ÇEVRE_OTOYOLU).toLocaleString()} TL
            </TableCell>
            <TableCell align="right">
              {Number(item.KUZEY_EGE_OTOYOLU).toLocaleString()} TL
            </TableCell>
            <TableCell align="right">
              {Number(item.KUZEY_MARMARA_OTOYOLU).toLocaleString()} TL
            </TableCell>
            <TableCell align="right">
              {Number(item.total).toLocaleString()} TL
            </TableCell>
            
          </TableRow>
        ))}

  </TableBody>
 
  </>
  )
}

export default FilterPlakaTable