import React ,{useEffect,useState}from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Grid, CircularProgress } from '@material-ui/core';
import TimeComponent from './../TimeComponent/TimeComponent';
import Button from "@mui/material/Button";
import axios from 'axios';
import { departments } from '../../../utils/constants';
import {FormControl,InputLabel, Select,OutlinedInput,MenuItem} from '@material-ui/core';
import tollDepartmentTypes from '../../views/hgs_toll/tollDepartmentsTypes';
// import { render } from '@testing-library/react';
ChartJS.register(ArcElement, Tooltip, Legend);


function PieChart() {
 
  let currentDate=new Date();
  let Department='ZABITA DAIRESI BASKANLIGI';
  let Directorate='AVRUPA YAKASI ZABITA SUBE MUDURLUGU';

  function sixMonthsDate(date){


    date.setMonth(date.getMonth()-6);
    return date;
  }
   let fromDate=sixMonthsDate(currentDate).toISOString().split('T')[0];
   console.log("from date is ",fromDate);

const [piedata,setPieData]=useState({
  from_date:fromDate,
  to_date:new Date().toISOString().split('T')[0],
  department:Department,
  directorate:Directorate,
})

console.log("to date is ",piedata.to_date);
// console.log(typeof piedata.to_date);


const [graphData,setGraphData]=useState({})
const [message,setMessage]=useState(false)
const [errorMessage,setErrorMessage]=useState(false);


useEffect(()=>{
    const loadDefault=async()=>{
     const response= await axios.post(`bridges-list`,piedata)
     const result=response.data;
     setGraphData(result);
    }
    loadDefault();
 
},[])
const postDataHandler=async()=>{
  console.log("pie data is ",piedata);
  const result =await axios.post(`bridges-list`,piedata);
  // console.log(result);

  if(result.status===200){
    setGraphData(result.data);
    setErrorMessage(false);
    setMessage(false);
    console.log('graphData.....',graphData);
  }
  else if(result.status===204){
    setErrorMessage(true)
    console.error("there is an error");
  }
  else if (result.status===204 && piedata.directorate !==graphData.directorate){
   setMessage(true);
   setErrorMessage(true);
   console.error("there is an error");

  }
  else{
    setErrorMessage(true);
    console.error("there is an error");
  }
}
// const data = {
//   labels: graphData.bridge,
//   datasets: [
//     {
//       label: '# of Votes',
//       data: graphData.fees,
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//         'rgba(275, 150, 60, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//         'rgba(250, 140, 67, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

const config={
  type:"pie",
  locale:"tr-TR",
  data:{
  labels:graphData.bridge,
  datasets: [
    {
      data: graphData.fees,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(275, 150, 60, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(250, 140, 67, 1)',
      ],
      borderWidth: 1,
    },
  ],
  },
  options:{
    maintainAspectRatio: false,
    plugins:{
      tooltips:{
        callbacks:{
          label: function(tooltipItem, data) {
            return data['labels'][tooltipItem['index']] + ': $' + data['datasets'][0]['data'][tooltipItem['index']];
          }
        }
      }

    },
  
  }
}




  return (
<>
<Grid  spacing={4}>
<TimeComponent id="date"
type="date"
name="from_data"
label="Tarihten itibaren işlem"
defaultValue={piedata.from_date}
value={piedata.from_date}
onChange={(e)=>setPieData({...piedata,from_date:e.target.value})}
InputLabelProps={{
  shrink: true,
}}
/>
<TimeComponent
                id="date2"
                label="Bugüne kadarki işlem"
                type="date"
                // defaultValue={piedata.to_date}
                name="to_date"
                value={piedata.to_date}
                onChange={(e) => setPieData({...piedata,to_date:e.target.value})}
               
              />
              <Grid style={{marginTop:"3%"}} container>
<Grid item xs={6}>
<FormControl fullWidth>
          <InputLabel variant="outlined" id="demo-simple-select-label">
          departmanları seç
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={piedata.department}
            onChange={(e) =>
             setPieData({...piedata,
              department:e.target.value})
            }
            // input={<OutlinedInput label="departmanları seç" />}
           
          >
            {/* <MenuItem value="">None</MenuItem> */}
            {tollDepartmentTypes.map((filter) =>
                    filter.departments.map((depart) => (
                      <MenuItem value={depart.department}>
                        {depart.department}
                      </MenuItem>
                    ))
                  )}
           
          </Select>
        </FormControl>  
        </Grid>
      
       
                <Grid item xs={6}>
                  <FormControl fullWidth required>
                  <InputLabel htmlFor="dir">
                    Şube Müdürlüğünü seçiniz
                  </InputLabel>
                  <Select
                  required
                    onChange={(e) => setPieData({...piedata,
                      directorate:e.target.value})}
                    id="dir"
                    value={piedata.directorate}
                    // input={<OutlinedInput label="departmanları seç" />}
                    name="directorate"
                    style={{
                      minWidth: "250px",
                      marginLeft: "7px",
                      width: "100%",
                    }}
                  >
                    {/* <MenuItem value="" style={{ color: "gray" }}>
                      Şube Müdürlüğünü seçiniz
                    </MenuItem> */}
                    {tollDepartmentTypes.map((filter) =>
                      filter.departments.map(
                        (depart) =>
                          depart.department === piedata.department &&
                          depart.subunits.map((sub) => (
                            <MenuItem value={sub}>{sub}</MenuItem>
                          ))
                      )
                    )}
                  </Select>
                  </FormControl>
                </Grid>

        
              </Grid>
</Grid>

<Button style={{marginTop:"1rem"}}  variant="contained" onClick={postDataHandler}>
        Show Data
      </Button>
<Grid container style={{marginTop:"2rem"}}>
{message ? <h4 style={{color:'red',textAlign:"center"}}>Lütfen bir müdürlük seçin</h4>:" " }

  {errorMessage ?  <h4 style={{color:'red',textAlign:"center"}}>Data not Found!!</h4> : <Pie height={413} data={config.data} options={config.options} ></Pie>}

</Grid>

</>
    
 
  )
}

export default PieChart;



//data of pie Charts

 