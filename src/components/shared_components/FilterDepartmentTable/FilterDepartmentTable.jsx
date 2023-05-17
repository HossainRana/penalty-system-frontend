import { TableBody,TableRow,TableCell,FormControlLabel,Checkbox } from '@material-ui/core';
import React  from 'react';


const FilterDepartmentTable=({filteredDepartment, toggleDepartmentPenaltySelection,searchFilterThree,selectedDepartmentPenalties})=>{
    console.log("filterDepartmentList.......",filteredDepartment);

    return(
        <>
         <TableBody>
                      {
                        filteredDepartment && filteredDepartment.length &&
                        filteredDepartment
                          .filter((item) => {
                            if (searchFilterThree == "") {
                              return item;
                            } else if (
                              item.department
                                .toLowerCase()
                                .includes(searchFilterThree.toLowerCase())
                            ) {
                              return item;
                            }
                          })
                          .map((item, index) => (
                            <>
                              <TableRow key={item.department + "_" + index}>
                                <TableCell
                                  style={{ fontWeight: "bold" }}
                                  component="th"
                                  colSpan={6}
                                >
                                  {item.department}
                                </TableCell>
                              </TableRow>
                              {item.units.map((dept, deptIndex) => (
                                <TableRow
                                  key={dept.department + "_" + "_" + deptIndex}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell scope="row"></TableCell>
                                  <TableCell>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          value={dept}
                                          checked={selectedDepartmentPenalties.some(
                                            (selItem) =>
                                              selItem.unit === dept.unit
                                            
                                          )}
                                          onChange={(e) =>
                                            toggleDepartmentPenaltySelection(
                                              dept
                                            )
                                          }
                                        />
                                      }
                                    />
                                  </TableCell>
                                  {/* <TableCell scope="row">
                                    {dept.department}
                                  </TableCell> */}
                                  <TableCell scope="row">{dept.unit}
                                  </TableCell>
                                  <TableCell align="right">
                                    {dept.total_count||0}
                                  </TableCell>
                                 
                                  <TableCell align="right">
                                  {Number(
                                    dept.ANKARA_NİĞDE_OTOYOLU
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(dept.AVRASYA_TÜNELİ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    dept.GEBZE_ORHANGAZİ_İZMİR_OTOYOLU
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>

                                <TableCell align="right">
                                  {Number(
                                    dept.İSTANBUL_DENİZ_OTOBÜSLERİ_İDO
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>

                                <TableCell align="right">
                                  {Number(
                                    dept.KARAYOLLARI_GENEL_MÜDÜRLÜĞÜ
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    dept.KUZEY_ÇEVRE_OTOYOLU
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    dept.KUZEY_EGE_OTOYOLU
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    dept.KUZEY_MARMARA_OTOYOLU
                                  ).toLocaleString()||0}{" "}
                                  TL
                                </TableCell>
                              
                                 
                                  <TableCell align="right">
                                    {Number(dept.total || 0).toLocaleString()}{" "}
                                    TL
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          ))}
                    </TableBody>
        </>
    )
}


export default FilterDepartmentTable;