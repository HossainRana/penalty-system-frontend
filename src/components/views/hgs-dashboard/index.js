import React, { useEffect, useMemo, useState } from "react";
import {
  Divider,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  FormControl,
  TableHead,
  TableRow,
  OutlinedInput,
  TextField,
  IconButton,
  Tooltip,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
} from "@material-ui/core";

import SummaryCards from "../../shared_components/summary_card";
import { makeStyles } from "@material-ui/core";
import {
  checkdepartments,
  excelTitleStyle,
  Months,
} from "../../../utils/constants";
import { SummaryCardItems } from "../../data/summaryCardItems";
// import { Line, Doughnut, Bar,  } from 'react-chartjs-2';s
import { State } from "../../data/totalPenaltiesPerWeek";
import { PaymentData } from "../../data/paymentData";
import { garage_status_state } from "../../data/vehicle_unit_garage_status";
import { useStyles } from "./style";
import MenuCard from "../../shared_components/menu_card";
import Calendar from "react-calendar";
import DashboardCard from "../../shared_components/dashboard_card";
import "react-calendar/dist/Calendar.css";
import DataProgressRateCard from "../../shared_components/DataProgressRateCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllStatistics } from "../../../store/reducers/statistics/statistics.actions";
import ProgressSpinner from "../../shared_components/ProgressBarSpinner";
import { translateDates } from "../../../utils/functions";
import axios from "axios";
import { ClearAll, MoreVert, Publish, Refresh } from "@material-ui/icons";
import ReactExport from "react-data-export";
import ColumnSelectionModal from "../../shared_components/columnSelectionModal";
import LicensePenaltyDialog from "./LicensePenaltyDialog";
import ImageModal from "../../shared_components/ImageModal";
import { getPlaceHolderName, getTurkishDate } from "../../../utils/functions";
import {
  penaltyTextFields,
  borderStyle,
  alignmentStyle,
  exportCommonStyle,
} from "../../../utils/constants";
import PenaltyMenu from "../../views/penalty/actionBtns";
import BarChart from "../../shared_components/charts/toll_dashboard_bar";
import PieChart from "./../../shared_components/charts/toll_dashboard_pie";
import InfiniteScroll from "react-infinite-scroll-component";
import { ListItemText, MenuItem, Select } from "@mui/material";
import DropdownComponent from "../../shared_components/DropDown/DropdownComponent";
import FilterPlakaTable from "../../shared_components/FilterPlakaTable/FilterPlakaTable";
import { secretaryData } from './../../../utils/TestData';
import AllDepartmentTableList from './../../shared_components/AllDepartmentTableList/AllDepartmentTableList';
import FilterDepartmentTable from "../../shared_components/FilterDepartmentTable/FilterDepartmentTable";
import AllLocalTableList from '../../shared_components/AllLocalTableList/AllLocalTableList';

const secretariateExportHeaderStyle = {
  font: { sz: "12", bold: false, color: { rgb: "ffffff" } },
  fill: { patternType: "solid", fgColor: { rgb: "00B0F0" } },
  border: borderStyle,
  alignment: alignmentStyle,
};

export default function Dashboard(props) {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const classes = useStyles();
  const dispatch = useDispatch();
  const statisticsReducer = useSelector((state) => state.statisticsReducer);
  const menuReducer = useSelector((state) => state.menuReducer);
  // const [licensePenaltyList, setLicensePenaltyList] = useState([]);
  const [tunnelList, setTunnelList] = useState([]);
  const [directoryPenaltyList, setdirectoryPenaltyList] = useState([]);
  const [departmentPenaltyList, setdepartmentPenaltyList] = useState([]);
  const [secretariatsPenaltyList, setsecretariatsPenaltyList] = useState([]);
  const [searchFilterOne, setSearchFilterOne] = useState("");
  const [searchFilterTwo, setSearchFilterTwo] = useState("");
  const [searchFilterThree, setSearchFilterThree] = useState("");
  const [searchFilterFour, setSearchFilterFour] = useState("");
  const [filterPlakaList, setFilterPlakaList]=useState([])
  const [status, setStatus] = useState("all");
  const [status2, setStatus2] = useState("all");
  const [status3, setStatus3] = useState("all");
  const [status4, setStatus4] = useState("all");

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  // const [filteredLicensePenaltyList, setFilteredLicensePenaltyList] = useState(
  //   []
  // );
  const [filteredTunnelList, setFilteredTunnelList] = useState([]);
  const [filteredDirectoratePenaltyList, setfilteredDirectoratePenaltyList] =
    useState([]);
  const [filteredDepartmentPenaltyList, setfilteredDepartmentPenaltyList] =
    useState([]);
  const [filteredSecretariatsPenaltyList, setfilteredSecretariatsPenaltyList] =
    useState([]);

  const [selectedLicensePenalties, setSelectedLicensePenalties] = useState([]);
  const [selectedDirectoratePenalties, setSelectedDirectoratePenalties] =
    useState([]);
  const [selectedDepartmentPenalties, setSelectedDepartmentPenalties] =
    useState([]);
  const [selectedSecretariatsPenalties, setSelectedSecretariatsPenalties] =
    useState([]);

  const [licenseLoading, setLicenseLoading] = useState(false);
  const [directorateLoading, setDirectorateLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [secretariateLoading, setSecretariateLoading] = useState(false);

  const [selectedData, setSelectedData] = useState("");

  //has more data contains react infinite scroll component
  const [hasMore, setHasMore] = useState(true);

  const [checkDepartment, setCheckDepartment] = useState([]);
  const [checkDepartmentList, setCheckDepartmentList] = useState([]);

  const [searchText1, setSearchText1] = useState("");
  const [searchText4,setSearchText4]=useState("")
  const [takeAmount, setTakeAmount] = useState(0);
  const [sortedMaxAmounts, setSortedMaxAmounts] = useState([]);
  // const [year, setYear] = useState(0);
  const [availableYear, setAvailableYear] = useState([]);
  // const [allDirectorateList, setAllDirectorateList] = useState([]);
  const [plakaBazliData, setPlakaBazliData] = useState({
    month: 0,
    year: 0,
  });
  const [departmentData, setDepartmentData] = useState({
    month: 0,
    year: 0,
  });
  const [secretaryStatusData, setSecretaryStatusData] = useState({
    month: "",
    year: "",
  });
  const [filterDepartmentList, setDepartmentFilterList]=useState([]);
  

  const [plakaBazliList, setPlakaBazliList] = useState([]);
  const [filteredPlakaList,setFilteredPlakaList] = useState([]);
  const [notFound, setNotFound] = useState("");
  const [notFoundDepartment,setNotFoundDepartment] = useState("")
  const [filteredDepartment,setFilteredDepartment] = useState([]);
  const [unitLists,setUnitLists]=useState([]);
  const [checkUnit,setCheckUnit] = useState([]);
  const [locationStatus,setLocationStatus]=useState("all")
  const [totalPassCount, setTotalPassCount] = useState([])
  const [totalAmount,setTotalAmount] = useState("")
  const topAmounts = [0, 40, 50, 60, 70];


  let fDepartmentList=filteredDepartmentPenaltyList;
  const filterDepartment=async(e)=>{
    if(departmentData.year==="all"){
      setDepartmentData({
        month: " ",
        year:e.target.value,
      })
     }
   const result =await axios.post(`general-secretariats-department-heads`,departmentData);
   if(result.status===200 && departmentData.year > 0 &&
    departmentData.month > 0)
    {
       setDepartmentFilterList(result.data);
       setFilteredDepartment(result.data);  
       setNotFoundDepartment("");
   }
   else if (
    result.status === 204 &&
    departmentData.year > 0 &&
    departmentData.month > 0
  ) {
  
    setDepartmentFilterList([]);
    setFilteredDepartment([]);
    setNotFoundDepartment("Data not found !!!");
  } else if (result.status === 200 && departmentData.year === "all") {
    setDepartmentFilterList(fDepartmentList);
    setFilteredDepartment(fDepartmentList);
  }
 
  }
  let _directorateList=filteredDirectoratePenaltyList;
  const filterPlaka = async (e) => {
   if(plakaBazliData.year==="all"){
    setPlakaBazliData({
      month: " ",
      year:e.target.value,
    })
   }
    const result = await axios.post(
      "plate-wise-bridges-totalFee-filter",
      plakaBazliData
    );
    
    if (
      result.status === 200 &&
      plakaBazliData.year > 0 &&
      plakaBazliData.month > 0
    ) {
      setPlakaBazliList(result.data);
      setFilteredPlakaList(result.data);
      setNotFound("");
      
    } else if (
      result.status === 204 &&
      plakaBazliData.year > 0 &&
      plakaBazliData.month > 0
    ) {
    
      setPlakaBazliList([]);
      setFilteredPlakaList([]);

      setNotFound("Data not found !!!");
    } else if (result.status === 204 && plakaBazliData.year === "all") {
      setPlakaBazliList(_directorateList);
      setFilteredPlakaList(_directorateList);

    }
  };

  const loadingHandler = (fn, isLoading) => {
    fn(isLoading);
  };


  // all summary card items  get
  const summaryCardItems = SummaryCardItems.map((item) => {
    if (item.id === "vehicle") {
      const total = statisticsReducer.data.todayTotalVehicles;
      item.value = total ? total : 0;
      return item;
    } else if (item.id === "penalties") {
      const total = statisticsReducer.data.todayTotalPenalties;
      item.value = total ? total : 0;
      return item;
    } else if (item.id === "total_penalties") {
      const total = statisticsReducer.data.totalPenalties;
      item.value = total ? total : 0;
      return item;
    } else if (item.id === "total_vehicles") {
      const total = statisticsReducer.data.totalVehicles;
      item.value = total ? total : 0;
      return item;
    }
    return item;
  });

  //Chart data of Birim
  const getVehicleUnitGarageChartData = () => {
    const ___data = [];
    const labels = [];
    if ("vehicle_unit_garage_status" in statisticsReducer.data) {
      const unit_data = statisticsReducer.data.vehicle_unit_garage_status;
      for (const key in unit_data) {
        labels.push(key);
        ___data.push(unit_data[key]);
      }

      return {
        labels: labels,
        datasets: [
          {
            label: "Birim",
            backgroundColor: [
              "#00cc99",
              "#b3ffb3",
              "#000000",
              "#ff1a75",
              "#ff9966",
              "#0000ff",
              "rgba(75,192,192,1)",
              "#66b3ff",
              "#668cff",
              "#ff3300",
              "#ff9999",
            ],
            borderColor: [
              "#00cc99",
              "#b3ffb3",
              "#000000",
              "#ff1a75",
              "#ff9966",
              "#0000ff",
              "rgba(75,192,192,1)",
              "#66b3ff",
              "#668cff",
              "#ff3300",
              "#ff9999",
            ],
            borderWidth: 2,
            data: ___data,
          },
        ],
      };
    }

    return garage_status_state;
  };
  //chart data of Arac Sayisi
  const getvehicleTypeStats = () => {
    const ___data = [];
    const labels = [];

    if ("vehicle_type" in statisticsReducer.data) {
      const vehicle_type = statisticsReducer.data.vehicle_type;

      for (const key in vehicle_type) {
        labels.push(key);
        ___data.push(vehicle_type[key]);
      }

      return {
        labels: labels,
        datasets: [
          {
            label: "Arac Sayisi",
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#66b3ff",
              "#ff6666",
              "#0000ff",
              "#00cc99",
              "#00e600",
            ],
            borderColor: [
              "rgba(75,192,192,1)",
              "#66b3ff",
              "#ff6666",
              "#0000ff",
              "#00cc99",
              "#00e600",
            ],
            borderWidth: 2,
            data: ___data,
          },
        ],
      };
    }
  };

  //All data
  useEffect(() => {
    dispatch(getAllStatistics());
  }, []);
  useEffect(() => {
    async function loadYears() {
      const response = await axios.get(`getYearFromToll`);
      const result = response.data;
      setAvailableYear(result);
    }

    loadYears();
  }, []);

  useEffect(() => {
    filterLicensePenalties(searchText1, checkDepartment, takeAmount);
  }, [searchText1, checkDepartment, takeAmount]);

  // for InfiniteScroll
  // let fromIndex = 0;
  // let toIndex = 100;

  // get all data of Avrasya tunnelii
  useEffect(() => {
    const getFinesByLicensePlate = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.get("eurasia-tunnel");

      setTunnelList(result.data);
      setFilteredTunnelList(result.data);
    };

    getFinesByLicensePlate();
  }, []);
  // //get all data of Mudurlukler
  useEffect(() => {
    const getDirectoryFineList = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.get("plate-wise-bridges-totalFee");
   
      setdirectoryPenaltyList(result.data);
      setfilteredDirectoratePenaltyList(result.data);
    };

    getDirectoryFineList();
  }, []);


  //  get all data of department 3rd report
  useEffect(() => {
    const getDepartmentFineList = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.post("general-secretariats-department-heads");

      setdepartmentPenaltyList(result.data);
      setfilteredDepartmentPenaltyList(result.data);
     
    };

    getDepartmentFineList();
  }, []);


  // card Data
  useEffect(()=>{
  async function loadCardDatas(){
    const response =await axios.get(`card-toll-list`);
    const result= response.data;
    setTotalPassCount(result.bridge_data);
    setTotalAmount(result.total);

  }
  loadCardDatas()

  },[])

  // console.log("total pass count ",totalPassCount)
  // console.log("total amount",totalAmount)

  //   // secretarty get data s


  const filterSecretaryStatusData=async()=>{
    if (locationStatus==="all" && secretaryStatusData.year==="all"){
      setSecretaryStatusData({
      year:"",
      month:""

      });
      const result= await axios.get("local-toll-list?location_status="+locationStatus+"&year="+secretaryStatusData.year+"&month="+secretaryStatusData.month)
      setsecretariatsPenaltyList(result.data);
      setfilteredSecretariatsPenaltyList(result.data);
      filtereSecretariatsList(searchText4,checkUnit)
    }
    else{
    const result= await axios.get("local-toll-list?location_status="+locationStatus+"&year="+secretaryStatusData.year+"&month="+secretaryStatusData.month)
      setsecretariatsPenaltyList(result.data);
      setfilteredSecretariatsPenaltyList(result.data);
      filtereSecretariatsList(searchText4,checkUnit)
    }
  }
  useEffect(()=>{
     filterSecretaryStatusData()
  },[checkUnit, locationStatus,secretaryStatusData.year,secretaryStatusData.month])
  useEffect(()=>{
  const loadAllUnitLists=async()=>{
        const response =await axios.get(`unit-toll-list`);
        const result=response.data;
        setUnitLists(result)

   }
   loadAllUnitLists()
  },[])
  useEffect(() => {
    const getGeneralFineList = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.get("local-toll-list?location_status="+locationStatus+"&year="+secretaryStatusData.year+"&month="+secretaryStatusData.month);
  
      setsecretariatsPenaltyList(result.data);
      setfilteredSecretariatsPenaltyList(result.data);
    };

    getGeneralFineList();
  }, []);

  //all fitlers for the  all the report ............
  const handleFilter = (e) => {
    const getStatus = e.target.value;
    setStatus(getStatus);
    //setSelectedLicensePenalties([])
  };
  const handleFilter2 = (e) => {
    const getStatus = e.target.value;
    setStatus2(getStatus);
    //setSelectedDirectoratePenalties([])
  };
  const handleFilter3 = (e) => {
    const getStatus = e.target.value;
    setStatus3(getStatus);
    //setSelectedDepartmentPenalties([])
  };
  const handleFilter4 = (e) => {
    const getStatus = e.target.value;
    setStatus4(getStatus);
    //setSelectedSecretariatsPenalties([])
  };

  //filters of avrasya tunnelli
  const filterLicensePenalties = (
    searchText,
    departmentValues = [],
    sortedAmount = 0
  ) => {
    if (sortedAmount == 0 || !sortedAmount) {
      const filteredList = tunnelList.filter((item) => {
        if (searchText1 == "" && !departmentValues.length) {
          return item;
        }

        let _plate_number = item.plate_number.toLocaleLowerCase("tr-TR");
        let _department = item.department.toLocaleLowerCase("tr-TR");
        let _searchText1 = searchText1.toLocaleLowerCase("tr-TR");
        if (searchText1 !== "" && departmentValues.length > 0) {
          return (
            (item.plate_number.includes(searchText1) ||
              _department.includes(_searchText1)) &&
            departmentValues.some(
              (dept) => dept.toLocaleLowerCase("tr-TR") === _department
            )
          );
        } else if (searchText != "") {
          return (
            _plate_number.includes(_searchText1) ||
            _department.includes(_searchText1)
          );
        }
        // else if(selectStateValue !=""){
        //   return (
        //     _local.includes(selectStateValue.toLocaleLowerCase('tr-TR')) ||
        //     _upstate.includes(selectStateValue.toLocaleLowerCase("tr-TR"))

        //   )
        // }
        else {
          return departmentValues.some(
            (department) =>
              department.toLocaleLowerCase("tr-TR") === _department
          );
        }
      });

      setFilteredTunnelList(filteredList);
    } else if (sortedAmount > 0) {
      const _sortedMaxAmounts = tunnelList
        .sort((a, b) => b.total_count - a.total_count)
        .slice(0, sortedAmount);
      setFilteredTunnelList(_sortedMaxAmounts);
    }
   
  };

  // filters of mudurlukler .....
  const filteredDirectorateList = (searchText) => {
    const filteredList = directoryPenaltyList.filter((item) => {
      

      if (searchText == "") {
        return item;
      } else if (
        item.plate_number
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase())
      ) {
        return item;
      }
    });
    setfilteredDirectoratePenaltyList(filteredList);
    // fn(filteredList);
  
  };
  const _filteredPlakaList=(searchText)=>{
    const plakaFilter=plakaBazliList.filter((item)=>{
      if(searchText==""){
        return item
      }
      else if (
        item.plate_number
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase())
      ) {
        return item;
      }
    })
    setFilteredPlakaList(plakaFilter);

  }

  //filters of Bolum baskanlari........
  const filtereDepartmentList = (searchText) => {
    const filteredList=[];
    for (let item of departmentPenaltyList) {
      for (let unit of item.units) {
        if (
          unit.department
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          unit.unit
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())
        ) {
          let index = filteredList.findIndex(
            (listitem) => listitem.department === unit.department
          );
          if (index > -1) {
            filteredList[index].units.push(unit);
          } else {
            let newObj = {
              department: unit.department,
              units: [unit],
            };
            filteredList.push(newObj);
          }
        }
      }
    }
   
    setfilteredDepartmentPenaltyList(filteredList);
    // fn(filteredList);

  };

  const _filteredDepartmentList=(searchText)=>{
    const filteredList=[];
    for (let item of filterDepartmentList) {
      for (let unit of item.units) {
        if (
          unit.department
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()) ||
          unit.unit
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase())
        ) {
          let index = filteredList.findIndex(
            (listitem) => listitem.department === unit.department
          );
          if (index > -1) {
            filteredList[index].units.push(unit);
          } else {
            let newObj = {
              department: unit.department,
              units: [unit],
            };
            filteredList.push(newObj);
          }
        }
      }
    }
       setFilteredDepartment(filteredList);
  }

  //filters of  sehir ici ..............
  useEffect(()=>{
    filtereSecretariatsList(searchText4, checkUnit)
  },[searchText4,checkUnit])
  const filtereSecretariatsList = (searchText,unitValue=[]) => {
  
    const filteredList = secretariatsPenaltyList.filter((item) => {
      let _plate_number = item.plate_number.toLocaleLowerCase();
      // let _unit = item.unit.toLocaleLowerCase("tr-TR");
      let _unit = item.unit.toUpperCase();

      let _local =item.local.toLocaleLowerCase();
      let _upstate=item.upstate.toLocaleLowerCase();
     
      if (searchText === "" && !unitValue.length) {
        return item;
      }
      else if (searchText == "" && unitValue.length>0){
        return (
         ( _plate_number.includes(searchText.toLocaleLowerCase())|| _unit.includes(searchText.toUpperCase())||_local.includes(searchText.toLocaleLowerCase())) &&
          unitValue.some((unit)=>unit.toLocaleLowerCase("tr-TR") ===item.unit.toLocaleLowerCase("tr-TR"))

        )
      }
      else if (searchText !=""){
        return ( _plate_number.includes(searchText.toLocaleLowerCase())||_unit.includes(searchText.toUpperCase())||_local.includes(searchText.toLocaleLowerCase())||_upstate.includes(searchText.toLocaleLowerCase()))
      }
      else {
        return unitValue.some((unit)=> unit.toLocaleLowerCase("tr-TR")===item.unit.toLocaleUpperCase('tr-TR'))
      }
      
      // else if (
      //   item.plate_number
      //     .toLocaleLowerCase()
      //     .includes(searchText.toLocaleLowerCase()) ||
      //   item.local.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      // ) {
      //   return item;
      // }
    });

    setfilteredSecretariatsPenaltyList(filteredList);
  };

  const getLicensePenaltyData = () => {
    let titleColumn = [
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },

      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: "Avrasya Tüneli Geçiş Raporları",
        width: { wpx: 400 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
    ];
    let blankColumn = [
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
    ];

    let columns = [
      { title: "SIRA NO", width: { wpx: 60 }, style: exportCommonStyle },
      {
        title: "PLAKA NUMARASI",
        width: { wpx: 180 },
        style: exportCommonStyle,
      },
      { title: "DAİRE BAŞKANLIKLARI", width: { wpx: 280 }, style: exportCommonStyle },
      { title: "GEÇİŞ SAYISI", width: { wpx: 280 }, style: exportCommonStyle },
      {
        title: "KALAN BAKİYE",
        width: { wpx: 180 },
        style: exportCommonStyle,
      },
      {
        title: "KULLANILAN ÜCRET",
        width: { wpx: 180 },
        style: exportCommonStyle,
      },
    ];
    const data = [];
    const exportData = selectedLicensePenalties.length
      ? selectedLicensePenalties
      : filteredTunnelList;
    exportData.forEach((item, index) => {
      data.push([
        {
          value: index + 1,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.plate_number,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.department,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.total_count,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.balance} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.amount} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
      ]);
    });

    let dataExport = [
      {
        columns: [...titleColumn],
        data: [],
      },
      {
        columns: blankColumn,
        data: [],
      },

      {
        columns: columns,
        data: data,
      },
    ];

    return dataExport;
  };

  // data of Mudurlukler
  const getDirecoratePnaltyData = () => {
    let monthName;
    switch (plakaBazliData.month) {
      case "01":
        monthName = "Ocak";
        break;
      case "02":
        monthName = "Şubat";
        break;
      case "03":
        monthName = "Mart";
        break;
      case "04":
        monthName = "Nisan";
        break;
      case "05":
        monthName = "Mayıs";
        break;
      case "06":
        monthName = "Haziran";
        break;
      case "07":
        monthName = "Temmuz";
        break;
      case "08":
        monthName = "Ağustos";
        break;
      case "09":
        monthName = "Eylül";
        break;
      case "10":
        monthName = "Ekim";
        break;
      case "11":
        monthName = "Kasım";
        break;
      case "12":
        monthName = "Aralık";
        break;
      default:
        // eslint-disable-next-line no-unused-vars
        monthName = "";
    }
    // let yearCheck= plakaBazliData.year==="all" && ""
    let currentYear = monthName ? plakaBazliData.year : "";
    let titleColumn = [
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: `${monthName} ${currentYear} PLAKA BAZLI HGS RAPORU`,
        width: { wpx: 400 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },

      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },

      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },

    ];
    let blankColumn = [
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 280 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 180 },
        style: excelTitleStyle,
      },
    ];

    let columns = [
      { title: "SIRA NO", width: { wpx: 60 }, style: exportCommonStyle },
      { title: "PLAKA NUMARASI", width: { wpx: 180 }, style: exportCommonStyle },
      { title: "MÜDÜRLÜK", width: { wpx: 400 }, style: exportCommonStyle },
      { title: "GEÇİŞ SAYISI", width: { wpx: 180 }, style: exportCommonStyle }, 
      { title: "Marka", width: { wpx: 140 }, style: exportCommonStyle },
      { title: "Model", width: { wpx: 180 }, style: exportCommonStyle },
      {
        title: "ANKARA NİĞDE OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "AVRASYA TÜNELİ",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "GEBZE - ORHANGAZİ - İZMİR OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "İSTANBUL DENİZ OTOBÜSLERİ(İDO)",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KARAYOLLARI GENEL MÜDÜRLÜĞÜ",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KUZEY ÇEVRE OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KUZEY EGE OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KUZEY MARMARA OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      { title: "GENEL TOPLAM", width: { wpx: 180 }, style: exportCommonStyle },
    ];
    const data = [];

    const exportData = selectedDirectoratePenalties.length
      ? selectedDirectoratePenalties
      : filteredDirectoratePenaltyList.length && !filteredPlakaList.length
      ? filteredDirectoratePenaltyList
      : filteredPlakaList;

    exportData.forEach((item, index) => {
      data.push([
        {
          value: index + 1,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.plate_number,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.unit.toLocaleUpperCase("tr-TR"),
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.total_count,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
       
        {
          value: item.brand,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.model,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.ANKARA_NİĞDE_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.AVRASYA_TÜNELİ} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.GEBZE_ORHANGAZİ_İZMİR_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.İSTANBUL_DENİZ_OTOBÜSLERİ_İDO} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KARAYOLLARI_GENEL_MÜDÜRLÜĞÜ} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KUZEY_ÇEVRE_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KUZEY_EGE_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KUZEY_MARMARA_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.total} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
      ]);
    });

    let dataExport = [
      {
        columns: [...titleColumn],
        data: [],
      },
      {
        columns: blankColumn,
        data: [],
      },
      {
        columns: columns,
        data: data,
      },
    ];

    return dataExport;
  };



  useEffect(()=>{
    getDepartmentPenaltyData()
  },[selectedDepartmentPenalties,filterDepartmentList,filteredDepartmentPenaltyList]);

   const getDepartmentPenaltyData = () => {
    let monthName;
    switch (departmentData.month) {
      case "01":
        monthName = "Ocak";
        break;
      case "02":
        monthName = "Şubat";
        break;
      case "03":
        monthName = "Mart";
        break;
      case "04":
        monthName = "Nisan";
        break;
      case "05":
        monthName = "Mayıs";
        break;
      case "06":
        monthName = "Haziran";
        break;
      case "07":
        monthName = "Temmuz";
        break;
      case "08":
        monthName = "Ağustos";
        break;
      case "09":
        monthName = "Eylül";
        break;
      case "10":
        monthName = "Ekim";
        break;
      case "11":
        monthName = "Kasım";
        break;
      case "12":
        monthName = "Aralık";
        break;
      default:
        // eslint-disable-next-line no-unused-vars
        monthName = "";
    }
    let currentYear = monthName ? departmentData.year : "";
    let titleColumns=[
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: `${monthName} ${currentYear} DAİRE BAŞKANLIKLARI`,
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },{
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      

    ]
    let blankColumns=[
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },{
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      {
        title: "",
        width: { wpx: 420 },
        style: excelTitleStyle,
      },
      

    ]
    let columns = [
      {
        title: "DAİRE BAŞKANLIKLARI-MÜDÜRLÜK",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      { title: "GEÇİŞ SAYISI", width: { wpx: 120 }, style: exportCommonStyle },
      {
        title: "ANKARA NİĞDE OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "AVRASYA TÜNELİ",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "GEBZE - ORHANGAZİ - İZMİR OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "İSTANBUL DENİZ OTOBÜSLERİ(İDO)",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KARAYOLLARI GENEL MÜDÜRLÜĞÜ",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KUZEY ÇEVRE OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KUZEY EGE OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
      {
        title: "KUZEY MARMARA OTOYOLU",
        width: { wpx: 420 },
        style: exportCommonStyle,
      },
  
   
      { title: "GENEL TOPLAM", width: { wpx: 180 }, style: exportCommonStyle },   
    ];

    const data = [];

    let exportData = [];
    if(selectedDepartmentPenalties.length){     
      exportData=selectedDepartmentPenalties
    }
else if(filteredDepartment.length){
    for (let department of filteredDepartment) {
    exportData.push(...department.units);
  }
}

    else {
      for (let department of filteredDepartmentPenaltyList) {
        exportData.push(...department.units);
      }
    }

    let usedDepartment = new Set();
    // let useUnit = new Set();

    for (let item of exportData) {
      if (!usedDepartment.has(item.department)) {
        usedDepartment.add(item.department);
        data.push([
          {
            value: item.department,
            style: secretariateExportHeaderStyle,
          },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
          { value: "", style: secretariateExportHeaderStyle },
         
        ]);
      }
      // if (!useUnit.has(item.unit)) {
      //   useUnit.add(item.unit);
      //   data.push([
      //     {
      //       value: item.unit,
      //       style: secretariateExportHeaderStyle,
      //     },
      //   ]);
      // }

      data.push([
       
        {
          value: item.unit,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.total_count}`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.ANKARA_NİĞDE_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.AVRASYA_TÜNELİ} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.GEBZE_ORHANGAZİ_İZMİR_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.İSTANBUL_DENİZ_OTOBÜSLERİ_İDO} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KARAYOLLARI_GENEL_MÜDÜRLÜĞÜ} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KUZEY_ÇEVRE_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KUZEY_EGE_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.KUZEY_MARMARA_OTOYOLU} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.total} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
      ]);
    }

    let dataExport = [
      {
        columns: [...titleColumns],
        data: [],
      },
      {
        columns:blankColumns,
        data: [],
      },

      {
        columns: columns,
        data: data,
      },
    ];

    return dataExport;
  };

  //data of sehir ici.....
 
  const getSecretariatsPenaltyData = () => {
    let columns = [
      { title: "SIRA NO", width: { wpx: 60 }, style: exportCommonStyle },
      { title: "MÜDÜRLÜK", width: { wpx: 320 }, style: exportCommonStyle },
      {  title: "PLAKA NUMARASI	",  width: { wpx: 420 }, style: exportCommonStyle,}, 
      { title: "Şehir içi/Şehir Dışı", width: { wpx: 120 }, style: exportCommonStyle },
      { title: "TRAFİK CEZALARI",  width: { wpx: 180 },  style: exportCommonStyle, },
    ];

    const data = [];
    let exportData = selectedSecretariatsPenalties.length
      ? selectedSecretariatsPenalties
      : filteredSecretariatsPenaltyList;
    exportData.forEach((item, index) => {
      data.push([
        {
          value: index + 1,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value:item.unit.toLocaleUpperCase(),
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.plate_number,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: item.local,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
        {
          value: `${item.fee} TL`,
          style: {
            font: { sz: "12", bold: false },
            border: borderStyle,
            alignment: alignmentStyle,
          },
        },
      ]);
    });

    let dataExport = [
      {
        columns: columns,
        data: data,
      },
    ];

    return dataExport;
  };

  //export excel file components
  const ExportExcelFile = ({ data, fileName }) => {
    return (
      <>
        <ExcelFile
          filename={fileName}
          element={
            <Tooltip
              title="Excel Aktar"
              aria-label="Export Excel Data"
              placement="top"
            >
              <Button variant="contained" color="primary">
                EXCEL AKTAR
              </Button>
            </Tooltip>
          }
        >
          <ExcelSheet dataSet={data} name="Report" />
        </ExcelFile>
      </>
    );
  };

  //avrasya penalty excel file download
  const ExportPlatePenalty = () => {
    const _licensePenalties = getLicensePenaltyData();

    return (
      <ExportExcelFile
        data={_licensePenalties}
        fileName={"plaka_cezalar_report"}
      />
    );
  };

  // Mudurlukler excel file download

  const ExportDirectoratePenalty = () => {
    const _directoratePenalties = getDirecoratePnaltyData();
    return (
      <ExportExcelFile
        data={_directoratePenalties}
        fileName={"PLAKA_BAZLI_HGS"}
      />
    );
  };

  // Bolum Baskanlari excel file download
  const ExportDepartmentPenalty = () => {
    const _departmentPenalties = getDepartmentPenaltyData();
    return (
      <ExportExcelFile
        data={_departmentPenalties}
        fileName={"DAİRE BAŞKANLIKLARI_report"}
      />
    );
  };

  // sehir ici  excel file download
  const ExportSecretariatsPenalty = () => {
    const _secretariatsPenalties = getSecretariatsPenaltyData();
    return (
      <ExportExcelFile
        data={_secretariatsPenalties}
        fileName={"genel_sekreterlikler_report"}
      />
    );
  };

  // Toggle all select

  const toggleLicensePenaltySelection = (value) => {
    let list = selectedLicensePenalties.slice();
    let index = selectedLicensePenalties.findIndex(
      (item) =>
        item.plate_number === value.plate_number &&
        item.balance === value.balance
    );
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
   
    setSelectedLicensePenalties(list);
  };

  const toggleDirectoratePenaltySelection = (value) => {
    let list = selectedDirectoratePenalties.slice();
    let index = selectedDirectoratePenalties.findIndex(
      (item) => item.plate_number === value.plate_number
      // item.total_count === value.total_count &&
      // item.amount === value.amount
    );
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    setSelectedDirectoratePenalties(list);
  };

  const toggleDepartmentPenaltySelection = (value) => {
    let list = selectedDepartmentPenalties.slice();
    let index = selectedDepartmentPenalties.findIndex(
      (item) =>
        item.department === value.department &&
        item.total_count === value.total_count &&
        item.amount === value.amount
    );
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    setSelectedDepartmentPenalties(list);
  };

  

  const toggleSecretariatsPenaltySelection = (value) => {
    let list = selectedSecretariatsPenalties.slice();
    let index = selectedSecretariatsPenalties.findIndex(
      (item) =>
        item.plate_number === value.plate_number &&
        item.local === value.local &&
        item.fee === value.fee
    );
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    setSelectedSecretariatsPenalties(list);
  };

  const checkHandler = (e) => {
    const value = e.target.value;
   
    let duplicateRemoved = [...new Set(value)];

    // });
    setCheckDepartment(duplicateRemoved);
  };
  const checkUnitHandler = (e) => {
    const value = e.target.value;
   
    let duplicateRemoved = [...new Set(value)];

    // });
    setCheckUnit(duplicateRemoved);
  };

  let MenuProps = {
    PaperProps: {
      style: {
        // maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
        maxHeight:600,
        width: 600
      }
    }
  };

  const cardStyles=makeStyles(theme=>({
    root: {
      "& .MuiPaper-root": {
       "minHeight":"10rem"
      }
    },
    card:{
      "height":'21rem',
    },
    totalCenter:{
      // "margin":"3rem auto"
      "marginTop":"4.5rem",
      "marginBottom":"1rem"
      
    },
    totalFont:{
      "fontSize":"20px",
      "color":"white",
    }
  }))
  let tollCardStyles=cardStyles();
  let cardColors=["#00BB2D","#424632","#2E3A23","#6D6552","#464531","#252850","#86BA90","#4E5754"];
  
  return (
    <div>
      {statisticsReducer.loading ? (
        <ProgressSpinner />
      ) : (
        <>
          {/* Summary cards  */}
          <Grid container spacing={1}>
          <Grid item xs={12} md={9} style={{display: "flex",
                   flexWrap: "wrap",
                   rowGap: "10px"
    }}>
           {
           totalPassCount.map((item, index) => (
              <SummaryCards
                key={index}
                name="toll"
                show="false"
                tollCardStyles={tollCardStyles}
                color={cardColors[index]}
                title={item.bridge_name}
                value={`${item.total} TL`}
             
                // icon={item.icon}
              />
            ))}
          </Grid>
          <Grid item xs={12} md={3}>
            <SummaryCards
            
                icon="false"
                h2="h2"
                show="false"
                widthLength="12"
                totalCardStyle={tollCardStyles}
                title="GENEL TOPLAM"
                color="#412722"
                value={`${totalAmount} TL`}
            
              />
          </Grid>
           
          </Grid>

             {/* charts  */}
 <Grid container spacing={2} style={{ padding: "10px" }}>
            <Grid item xs={7} md={7}>
              <Paper style={{ margin: "15px 0" }}>
                <Typography className={classes.header}>Birim</Typography>
                <BarChart />
              </Paper>
            </Grid>
            <Grid item xs={5} md={5}>
              <Paper style={{ margin: "15px 0" }}>
                <Typography className={classes.header}>Pie Chart</Typography>
                <PieChart />
              </Paper>
            </Grid>
          </Grid>
          {/* 1st two reports   */}
          <Grid container spacing={2}>
            {/* view of Avrasya tunnelli report  */}
            <Grid item xs={12} md={6}>
              <Paper style={{ margin: "15px 0" }}>
                <Typography className={classes.header}>
                  Avrasya Tüneli
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                   
                    <TextField
                      id="searchOne"
                      onChange={(event) => {
                        setSearchText1(event.target.value);
                      }}
                      label="Ücret Plakası Cezalarını Arayın"
                      variant="outlined"
                      style={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FormControl fullWidth>
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-label"
                      >
                        Departman Seçin
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        input={<OutlinedInput label="Departman Seçin" />}
                        onChange={checkHandler}
                        multiple
                        renderValue={(selected) =>
                          selected.map((x) => x).join(", ")
                        }
                        style={{ width: "100%" }}
                        value={checkDepartment}
                        MenuProps={MenuProps}
                      >
                        {checkdepartments.map((dept) => (
                          <MenuItem key={dept.id} value={dept.name}>
                            <Checkbox
                              checked={
                                checkDepartment.findIndex(
                                  (item) => item === dept.name
                                ) >= 0
                              }
                            />
                            <ListItemText primary={dept.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2} style={{ textAlign: "right" }}>
                    <ExportPlatePenalty />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  {/* top amounts dropdown  */}
                  <Grid item xs={12} md={5} style={{ textAlign: "right" }}>
                    <FormControl fullWidth>
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-label"
                      >
                        Seç miktar
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={takeAmount}
                        onChange={(e) => setTakeAmount(e.target.value)}
                        input={<OutlinedInput label="Seç miktar" />}
                        style={{ width: "100%" }}
                      >
                        {/* <MenuItem value=0>None</MenuItem> */}
                        {topAmounts.map((amount) => (
                          <MenuItem value={amount} key={amount}>
                            {amount === 0 ? "none" : amount}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider style={{ margin: "15px 0" }} />
                

                <TableContainer style={{ maxHeight: "440px" }}>
                  {/* <InfiniteScroll  dataLength={filteredTunnelList.length}
                    next={fetchMoreTunnelData}
                    hasMore={hasMore}
                    loader={<h5>loading...</h5>}
                    height={400}
                    endMessage={
                      <p style={{textAlign:"center",color:"Red"}}>Hiç gördün mü</p>
                    }
                    > */}
                  {/* <h1>{tunnelList.length}</h1> */}
                  <Table stickyHeader aria-label="Plaka Geçiş Tablosu">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                          component="th"
                        >
                          seç
                          <Tooltip title="Clear Selection">
                            <IconButton
                              onClick={() => setSelectedLicensePenalties([])}
                              style={{ color: "#ff0000", cursor: "pointer" }}
                            >
                              <Refresh />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          PLAKA NUMARASI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          DAİRE BAŞKANLIKLARI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          GEÇİŞ SAYISI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KULLANILAN ÜCRET
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KALAN BAKİYE
                        </TableCell>
                       
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredTunnelList &&
                        filteredTunnelList.length &&
                        filteredTunnelList.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    value={item}
                                    checked={selectedLicensePenalties.some(
                                      (selItem) =>
                                        selItem.plate_number ===
                                          item.plate_number &&
                                        selItem.balance === item.balance
                                    )}
                                    onChange={(e) =>
                                      toggleLicensePenaltySelection(item)
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item.plate_number}
                            </TableCell>
                            <TableCell align="left">
                              {item.department.toLocaleUpperCase('tr-TR')}
                            </TableCell>
                            <TableCell align="right">
                              {item.total_count}
                            </TableCell>
                            <TableCell align="right">
                              {Number(item.amount).toLocaleString()} TL
                            </TableCell>
                            <TableCell align="right">
                              {Number(item.balance).toLocaleString()} TL
                            </TableCell>
                           
                          </TableRow>
                        ))}
                      {!filteredTunnelList.length && (
                        <TableRow>
                          <TableCell>Kayıt Bulunamadı</TableCell>
                        </TableRow>
                      )}
                    </TableBody>

                    {/* filteredList table   */}
                  </Table>
                  {/* </InfiniteScroll> */}
                </TableContainer>
              </Paper>
            </Grid>

            {/* view of Müdürlükler */}
            <Grid item xs={12} md={6}>
              <Paper style={{ margin: "15px 0" }}>
                <Typography className={classes.header}>
                  PLAKA BAZLI HGS
                </Typography>
                <Grid container spacing={2} columnSpacing={10}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      id="searchTwo"
                      onChange={(event) => {
                        filteredDirectorateList(event.target.value);
                        _filteredPlakaList(event.target.value);
                      }}
                      label="Plaka Numarası Arayın"
                      variant="outlined"
                      style={{ width: "100%" }}
                    />
                  </Grid>
                   <Grid item xs={1} md={5}></Grid>     
                  {/* Dropdown  */}
                  {/* <Grid item spacing={2} xs={12} md={5}> */}
                   
                  {/* </Grid> */}
                  <Grid item xs={12} md={2} style={{ textAlign: "right" }}>
                    <ExportDirectoratePenalty />

                   
                  </Grid>
                 
                </Grid>
                <Grid container spacing={2} columnSpacing={12}>
                
                <Grid item xs={12} md={10}>
                <DropdownComponent
                      availableMonths={Months}
                      data={plakaBazliData}
                      setData={setPlakaBazliData}
                      monthLabel="ayları seç"
                      label="yılları seçin"
                      availableYear={availableYear}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                <Button
                      fullWidth
                      // style={{ marginTop: "10px" }}
                      variant="contained"
                      color="secondary"
                      onClick={filterPlaka}
                    >
                      filtre
                    </Button>
                </Grid>
                
                </Grid>
               
                   

                <Divider style={{ margin: "15px 0" }} />
                <TableContainer style={{ maxHeight: "440px" }}>
                  {/* <InfiniteScroll dataLength={
                    filteredDirectoratePenaltyList.length
                  }
                  next={fetchMoreDirectoryPenaltyData}
                  loader={<h5>...loading</h5>}
                  hasMore={hasMore}
                  height={400}
                    endMessage={
                      <p style={{textAlign:"center",color:"Red"}}>Hiç gördün mü</p>
                    }
                  
                  > */}
                  <Table stickyHeader aria-label="Müdürlük Ceza Tablosu">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                          component="th"
                        >
                          seç
                          <Tooltip title="Clear Selection">
                            <IconButton
                              onClick={() =>
                                setSelectedDirectoratePenalties([])
                              }
                              style={{ color: "#ff0000", cursor: "pointer" }}
                            >
                              <Refresh />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                           PLAKA NUMARASI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          MÜDÜRLÜK
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          GEÇİŞ SAYISI
                        </TableCell>
                       
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          MARKA
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          MODEL
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          ANKARA NİĞDE OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          AVRASYA TÜNELİ
                        </TableCell>

                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          GEBZE - ORHANGAZİ - İZMİR OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          İSTANBUL DENİZ OTOBÜSLERİ(İDO)
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KARAYOLLARI GENEL MÜDÜRLÜĞÜ
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KUZEY ÇEVRE OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KUZEY EGE OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KUZEY MARMARA OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          GENEL TOPLAM
                         
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    {/* tablebody of plaka hazli hgs   */}
                    {
                    filteredPlakaList.length ? (
                      <FilterPlakaTable
                        filteredPlakaList={filteredPlakaList}
                        toggleDirectoratePenaltySelection={
                          toggleDirectoratePenaltySelection
                        }
                        searchFilterTwo={searchFilterTwo}
                        selectedDirectoratePenalties={
                          selectedDirectoratePenalties
                        }
                      />
                    ) : notFound.length && <TableBody>{notFound}</TableBody> ? (
                      <h5>{notFound}</h5>
                    ) : (
                      <TableBody>
                        {
                          filteredDirectoratePenaltyList &&
                          filteredDirectoratePenaltyList.length &&
                          filteredDirectoratePenaltyList
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
                                          toggleDirectoratePenaltySelection(
                                            item
                                          )
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
                                  {Number(
                                    item.ANKARA_NİĞDE_OTOYOLU
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(item.AVRASYA_TÜNELİ).toLocaleString()}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    item.GEBZE_ORHANGAZİ_İZMİR_OTOYOLU
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>

                                <TableCell align="right">
                                  {Number(
                                    item.İSTANBUL_DENİZ_OTOBÜSLERİ_İDO
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>

                                <TableCell align="right">
                                  {Number(
                                    item.KARAYOLLARI_GENEL_MÜDÜRLÜĞÜ
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    item.KUZEY_ÇEVRE_OTOYOLU
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    item.KUZEY_EGE_OTOYOLU
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(
                                    item.KUZEY_MARMARA_OTOYOLU
                                  ).toLocaleString()}{" "}
                                  TL
                                </TableCell>
                                <TableCell align="right">
                                  {Number(item.total).toLocaleString()} TL
                                </TableCell>
                              </TableRow>
                            ))}
                        {(!filteredDirectoratePenaltyList ||
                          !filteredDirectoratePenaltyList.length) && (
                          <TableRow>
                            <TableCell>Kayıt Bulunamadı</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    )
                    }

                  </Table>
                  {/* </InfiniteScroll> */}
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* last two reports  */}

          <Grid container spacing={2}>
            {/* view of Bolum Baskanlari   */}
            <Grid item xs={12} md={6}>
              <Paper style={{ margin: "15px 0" }}>
                <Typography className={classes.header}>
                DAİRE BAŞKANLIKLARI
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      id="searchThree"
                      onChange={(event) => {
                        filtereDepartmentList(event.target.value);
                        _filteredDepartmentList(event.target.value);
                      }}
                      label="Search"
                      variant="outlined"
                      style={{width:"100%"}}
                    />
                  </Grid>
                  
                  {/* <Grid item spacing={2} xs={12} md={5}>
                    {/* 3rd report  */}
                    {/* <DropdownComponent
                      availableMonths={Months}
                      data={departmentData}
                      setData={setDepartmentData}
                      monthLabel="ayları seç"
                      label="yılları seçin"
                      availableYear={availableYear}
                    /> */}
                  {/* </Grid> */}

                  <Grid item md={5}></Grid>
                  <Grid item xs={12} md={2} style={{ textAlign: "right" }}>
                    <ExportDepartmentPenalty />
                    {/* <Button
                      fullWidth
                      style={{ marginTop: "10px" }}
                      variant="contained"
                      color="secondary"
                      onClick={filterDepartment}
                    >
                      filtre
                    </Button> */}
                  </Grid>
                  
                </Grid>
                <Grid container spacing={2} columnSpacing={12}>
                
                <Grid item xs={12} md={10}>
                <DropdownComponent
                      availableMonths={Months}
                      data={departmentData}
                      setData={setDepartmentData}
                      monthLabel="ayları seç"
                      label="yılları seçin"
                      availableYear={availableYear}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                <Button
                      fullWidth
                      style={{ marginTop: "10px" }}
                      variant="contained"
                      color="secondary"
                      onClick={filterDepartment}
                    >
                      filtre
                    </Button>
                </Grid>
                
                </Grid>

                <Divider style={{ margin: "15px 0" }} />
                <TableContainer style={{ maxHeight: "440px" }}>
                  {/* <InfiniteScroll dataLength={filteredDepartmentPenaltyList.length}
                  loader={<h5>..loading more data</h5>}
                  height={400}
                  hasMore={hasMore}
                  next={fetchMoreDepartmentList}
                  endMessage={
                    <p style={{textAlign: 'center',color:"red"}}>
                      <b>Hiç gördün mü</b>
                    </p>
                  }

                  > */}
                  <Table stickyHeader aria-label="Plaka Ceza Tablosu">
                  
                
                    <TableHead>
                      <TableRow>
                      <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          DAİRE BAŞKANLIKLARI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                          component="th"
                        >
                          seç
                          <Tooltip title="Clear Selection">
                            <IconButton
                              onClick={() =>
                                setSelectedDepartmentPenalties([])
                              }
                              style={{ color: "#ff0000", cursor: "pointer" }}
                            >
                              <Refresh />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          DAİRE BAŞKANLIKLARI-MÜDÜRLÜK
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          GEÇİŞ SAYISI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          ANKARA NİĞDE OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          AVRASYA TÜNELİ
                        </TableCell>

                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          GEBZE - ORHANGAZİ - İZMİR OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          İSTANBUL DENİZ OTOBÜSLERİ(İDO)
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KARAYOLLARI GENEL MÜDÜRLÜĞÜ
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KUZEY ÇEVRE OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KUZEY EGE OTOYOLU
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KUZEY MARMARA OTOYOLU
                        </TableCell>
                        
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                         GENEL TOPLAM
                        </TableCell>
                     
                      </TableRow>
                    </TableHead>
                         
                   {
                   filteredDepartment.length ? 
                  ( <FilterDepartmentTable
                    filteredDepartment={filteredDepartment}
                    toggleDepartmentPenaltySelection={toggleDepartmentPenaltySelection}
                    searchFilterThree={searchFilterThree}
                    selectedDepartmentPenalties={selectedDepartmentPenalties}
                     
                  />):
                   notFoundDepartment.length && <TableBody>{notFoundDepartment}</TableBody>
                   ?
                   (<h5>{notFoundDepartment}</h5>):
                   ( <AllDepartmentTableList
                    filteredDepartmentPenaltyList={filteredDepartmentPenaltyList}
                    searchFilterThree={searchFilterThree}
                    selectedDepartmentPenalties={selectedDepartmentPenalties}
                    toggleDepartmentPenaltySelection={toggleDepartmentPenaltySelection}
                    
                    />)
                    }  
                   
                
                  </Table>
                  {/* </InfiniteScroll> */}
                </TableContainer>
              </Paper>
            </Grid>
            {/* view of Sehir ici/sehir disi   */}
            <Grid item xs={12} md={6}>
              <Paper style={{ margin: "15px 0" }}>
                <Typography className={classes.header}>
                  Şehir içi/Şehir Dışı
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      id="searchFour"
                      onChange={(event) => {
                        setSearchText4(event.target.value);
                      }}
                      label="Search"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FormControl fullWidth>
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-label"
                      >
                        Departman Seçin
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        input={<OutlinedInput label="Departman Seçin" />}
                        onChange={checkUnitHandler}
                        multiple
                        renderValue={(selected) =>
                          selected.map((x) => x).join(", ")
                        }
                        style={{ width: "100%" }}
                        value={checkUnit}
                        MenuProps={MenuProps}
                      >
                        {unitLists.map((unit) => (
                         
                          <MenuItem key={unit} value={unit}>
                            <Checkbox 
                              checked={
                                checkUnit.findIndex(
                                  (item) => item === unit
                                ) >= 0
                              }
                            />
                            <ListItemText
                            style={{width:"600px"}}  
                            primary={unit.toLocaleUpperCase('tr-TR')} />
                          </MenuItem>
                        
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2} style={{ textAlign: "right" }}>
                    <ExportSecretariatsPenalty />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                <Grid item xs={12} md={3} style={{ textAlign: "right" }}>
                    <FormControl fullWidth>
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-label"
                      >
                        Seç miktar
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={locationStatus}
                        onChange={(e) => setLocationStatus(e.target.value)}
                        input={<OutlinedInput label="Seç miktar" />}
                        style={{ width: "100%" }}
                      >
                        <MenuItem value="all">Tümü</MenuItem>
                        <MenuItem value="Şehir İçi">Şehir içi</MenuItem>
                        <MenuItem value="Şehir Dışı">Şehir Dışı</MenuItem>

                        
                        {/* <MenuItem value=0>None</MenuItem>
                        {topAmounts.map((amount) => (
                          <MenuItem value={amount} key={amount}>
                            {amount === 0 ? "none" : amount}
                          </MenuItem>
                        ))} */}
                      </Select>
                    </FormControl>
                  </Grid>
<Grid item xs={12} md={7} >
<DropdownComponent
                      availableMonths={Months}
                      data={secretaryStatusData}
                      setData={setSecretaryStatusData}
                      monthLabel="ayları seç"
                      label="yılları seçin"
                      availableYear={availableYear}
                    />
</Grid>
<Grid item xs={12} md={2}>
                <Button
                      fullWidth
                      // style={{ marginTop: "10px" }}
                      variant="contained"
                      color="secondary"
                      onClick={filterSecretaryStatusData}
                    >
                      filtre
                    </Button>
                </Grid>


                </Grid>

                <Divider style={{ margin: "15px 0" }} />
                <TableContainer style={{ maxHeight: "440px" }}>
                  <Table stickyHeader aria-label="Plaka Ceza Tablosu">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                          component="th"
                        >
                          seç
                          <Tooltip title="Clear Selection">
                            <IconButton
                              onClick={() =>
                                setSelectedSecretariatsPenalties([])
                              }
                              style={{ color: "#ff0000", cursor: "pointer" }}
                            >
                              <Refresh />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          MÜDÜRLÜK
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                        >
                          PLAKA NUMARASI
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          Şehir içi/Şehir Dışı
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                          component="th"
                          align="right"
                        >
                          KULLANILAN ÜCRET
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <AllLocalTableList 
                    filteredSecretariatsPenaltyList={filteredSecretariatsPenaltyList}
                    searchFilterFour={searchFilterFour}
                    selectedSecretariatsPenalties={selectedSecretariatsPenalties}
                    toggleSecretariatsPenaltySelection={toggleSecretariatsPenaltySelection}
                    >
                      </AllLocalTableList>  
                      
                                  
                  </Table>
                  {/* </InfiniteScroll> */}
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}
