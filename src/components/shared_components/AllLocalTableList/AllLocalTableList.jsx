import React from 'react'
import { TableBody, TableCell, TableRow, FormControlLabel,Checkbox } from '@material-ui/core';


const AllLocalTableList = ({filteredSecretariatsPenaltyList,searchFilterFour,selectedSecretariatsPenalties,toggleSecretariatsPenaltySelection}) => {
  return (
    <>
   <TableBody>
                      {filteredSecretariatsPenaltyList &&
                        filteredSecretariatsPenaltyList.length &&
                        filteredSecretariatsPenaltyList
                          .filter((item) => {
                            if (searchFilterFour == "") {
                              return item;
                            } else if (
                              item.plate_number
                                .toLowerCase()
                                .includes(searchFilterFour.toLowerCase()) ||
                              item.local
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
                                      checked={selectedSecretariatsPenalties.some(
                                        (selItem) =>
                                          selItem.plate_number ===
                                            item.plate_number &&
                                          selItem.local === item.local &&
                                          selItem.fee === item.fee
                                      )}
                                      onChange={(e) =>
                                        toggleSecretariatsPenaltySelection(item)
                                      }
                                    />
                                  }
                                />
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.unit.toLocaleUpperCase()}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.plate_number}
                              </TableCell>
                              <TableCell align="right">{item.local?item.local:item.upstate}</TableCell>
                              <TableCell align="right">
                                {Number(item.fee).toLocaleString()} TL
                              </TableCell>
                            </TableRow>
                          ))}
                      {!filteredSecretariatsPenaltyList.length && (
                        <TableRow>
                          <TableCell>Kayıt Bulunamadı</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    </>
  

)
}

export default AllLocalTableList;