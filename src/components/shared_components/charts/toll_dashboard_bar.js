import React, { useState,useEffect } from "react";
// import tollDepartmentTypes from "../../views/hgs_toll/tollDepartmentsTypes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Grid, MenuItem, Select } from "@material-ui/core";
import Button from "@mui/material/Button";
import { departments } from "../../../utils/constants";

import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  // let currentYear = new Date().getFullYear();

  const [penaltyData, setPenaltyData] = useState({
    dept: "ZABITA DAİRESİ BAŞKANLIĞI",
    year: "",
  });
  const [graphData, setGraphData] = useState({});
  const [Years,setYears]=useState([]);
  useEffect(()=>{
   async function loadYears(){
      const response =await axios.get(`getYearFromToll`)
      const result = response.data;
      setYears(result);   
    }
 
    loadYears();
   
  },[])
  useEffect(()=>{
    async function loadDefaultData(){
     const response=await axios.post( "department-year-getPenalty",
     penaltyData);
     const result=response.data;
     setGraphData(result);
    }
    loadDefaultData();

  },[penaltyData.year])
  const onChangeHandler = (e) => {
    const fieldName = e.target.name;

    if (fieldName === "dept") {
      const value = e.target.value;
      setPenaltyData({
        ...penaltyData,
        dept: value,
      });
    }
    if (fieldName === "year") {
      const value = e.target.value;
      setPenaltyData({
        ...penaltyData,
        year: value,
      });
    }
  };

  const postHandler = async () => {
    const response = await axios.post(
      "department-year-getPenalty",
      penaltyData
    );
    
    if (response.status === 200) {
      setGraphData(response.data);
    } else {
      console.error("there was an error");
    }
  };

  console.log("graphData is ",graphData);

let labels= [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
]
 
  const data = {
    labels:labels,
    datasets: [
      { 
        label:" ",
        backgroundColor: [
          "rgb(25, 244, 216)",
          "rgb(229, 220, 70)",
          "rgb(251, 199, 125)",
          "rgb(154, 229, 160)",
          "rgb(214, 217, 225)",
          "rgb(192, 37, 161)",
          "rgb(242, 116, 147)",
          "rgb(217, 113, 49)",
          "rgb(13, 130, 54)",
          "rgb(5, 122, 130)",
          "rgb(52, 42, 17)",
          "rgb(165, 208, 173)"
        ],
        data:graphData.data,
      },
    ],
  };

  const config = {
    type: 'bar',
    locale:"tr-TR",
    data: data,
    options: {
      plugins:{
        legend:{
          display:false,
        },
      tooltip:{
        callbacks:{
          label:function(context){
            let label=context.dataset.label|| "";
           if(label){
            label +=": "
           }
           if(context.parsed.y!==null){
            label +=new Intl.NumberFormat('tr-TR',{
              style:"currency",
              currency:"TRY"
            }).format(context.parsed.y);
           }
           return label;
          }
        }
      }
    },  
      scales: {
        x:{
          ticks:{
            font:{
              size:14
            }
          }
        },
        y: {
         ticks: {
          font:{
           size:14
          },
              
               callback:(value)=>{
                return new Intl.NumberFormat('tr-TR',{
                  style:"currency",
                  currency:"TRY",
                  maximumSignificantDigits:3
                }).format(value)
               }     
            },
          beginAtZero: true
        }
      }
    },
  };
  
  return (
    <>
    <Grid container spacing={4} >
      <Grid  item xs={6} md={5}>
        <select
          onChange={onChangeHandler}
          name="dept"
          value={penaltyData.dept}
          style={{ float: "right", height: "56px" }}
          className="form-control"
        >
          {/* <option value="all">Daire Başkanlığını seçiniz</option> */}

          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </Grid>
      <Grid item xs={6} md={5}>
        <select
          onChange={onChangeHandler}
          value={penaltyData.year}
          name="year"
          defaultValue={penaltyData.year}
          style={{ float: "right", height: "56px" }}
          className="form-control"
        >
          {/* <option value="all">Choose years</option> */}
          {Years.map((year) => (
            <option key={year} value={year} >
              {year}
            </option>
          ))}
        </select>
      </Grid>
      </Grid>
      <Button style={{marginTop:"1rem"}}  variant="contained" onClick={postHandler}>
      GÖSTER
      </Button>

      <Bar data={data} options={config.options}></Bar>
    </>
  );
}
export default BarChart;
