import React, { useEffect, useState } from "react";
import Table from "../../shared_components/table";
import tollTypes from "./tollTypes";

// import { PenaltyTableHeader, PenaltyData } from '../../data/PenaltyData'
import MainActionContainer from "../../shared_components/MainActionContainer";
import BreadCrumb from "../../shared_components/BreadCrump";
import Paginator from "../../shared_components/Paginator";
import Modal from "../../shared_components/modal";
import {
  formTypes,
  pageType,
  excelFileType,
  tollTextFields,
} from "../../../utils/constants";
import { getPlaceHolderName, getTurkishDate } from "../../../utils/functions";
import pdf_logo from "../../../images/pdf_logo.jpg";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Close, Delete, Edit, Info } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteToll,
  getAllTolls,
  deleteMultipleToll,
  setFilteredTollData,
  searchTollsData,
  filterTollData,
} from "../../../store/reducers/toll/toll.actions";
import ProgressBarSpinner from "../../shared_components/ProgressBarSpinner";
import Alert from "@material-ui/lab/Alert";
import EditDataModal from "../../shared_components/EditDataModal";
import MoreDetailsModal from "../../shared_components/MoreDetailsModal";
import ImageModal from "../../shared_components/ImageModal";
import { useSnackbar } from "notistack";
import PenaltyMenu from "./actionBtns";
import MenuItem from "@mui/material/MenuItem";
import TabPanel from "../../shared_components/TabPanel";
import ExcelFilePreview from "../../shared_components/ExcelFilePreview";
import { FormControl, Select } from "@mui/material";
import { SET_PENALTY_DATA } from "../../../store/reducers/penalty/penalty.types";
import tollDepartmentTypes from "./tollDepartmentsTypes";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
//import { KeyboardDatePicker } from '@material-ui/pickers';
import axios from "axios";
import TimeComponent from "../../shared_components/TimeComponent/TimeComponent";

export default function Toll(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = React.useState(0);
  const [pdfOpen, setPdfOpen] = useState({
    open: false,
    pdf: null,
  });
  const [selectedData, setSelectedData] = useState("");
  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.authReducer);
  const currentUser = authReducer.data;
  const penaltyReducer = useSelector((state) => state.penaltyReducer);
  const penaltyData = penaltyReducer.data;
  const tollReducer = useSelector((state) => state.tollReducer);
  const tollData = tollReducer.data;
  const [getZimmet, setGetZimmet] = useState();
  const [zimmetList, setZimmetList] = useState([]);
  const [aciklamaList, setAciklamaList] = useState([]);
  const [girisNoktasiList, setGirisNoktasiList] = useState([]);
  const [getAciklama, setGetAciklama] = useState();
  const [getGirisNoktasi, setGetgirisNoktasi] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [marka, setMarka] = useState("");
  const [secretariat, setSecretariat] = useState("");
  const [department, setDepartment] = useState("");
  const [directorate, setDirectorate] = useState("");
  const [zimmet, setZimmet] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [girisNoktasi, setGirisNoktasi] = useState("");
  const [transactionTimeFrom, setTransactionTimeFrom] = useState("");
  const [transactionTimeTo, setTransactionTimeTo] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [localSehir, setLocalSehir] = useState("");
  const [isShowTime, setIsShowTime]=useState(false);//toggle show time and hide time

  const [sortingValues, setSortingValues] = useState({
    sortBy: "created_at",
    limitEntries: 100,
    page: 1,
    payStatus: "all",
  });
  const [editModalOpen, setEditModalOpen] = useState({
    open: false,
    data: {},
  });

  function handleModalOpen(pdf) {
    setPdfOpen({
      pdf: pdf,
      // pdf: '/demo1.pdf',
      open: true,
    });
  }
  const handleModalClose = () => {
    setPdfOpen({
      ...pdfOpen,
      open: false,
    });
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleEditDataModalOpen = (data) => {
    setEditModalOpen({
      data: data,
      open: true,
    });
  };

  const handleEditDataModalClose = () => {
    setEditModalOpen({
      ...editModalOpen,
      open: false,
    });
  };

  //start time log
  // console.log("start time", startTime);
  // console.log("end time", endTime);
  useEffect(() => {
    if (searchQuery) {
      const formData = new FormData();
      formData.append("value", searchQuery.trim());
      dispatch(
        searchTollsData(
          formData,
          sortingValues.sortBy,
          sortingValues.page,
          sortingValues.limitEntries,
          sortingValues.payStatus
        )
      );
    } else {
      if (marka != "") {
        const formData = new FormData();
        if (department == "") {
          formData.append("value", marka);
        } else if (directorate == "") {
          formData.append("value", department);
        } else {
          formData.append("value", directorate);
        }
        dispatch(
          searchTollsData(
            formData,
            sortingValues.sortBy,
            sortingValues.page,
            sortingValues.limitEntries,
            sortingValues.payStatus
          )
        );
      } else {
        dispatch(
          getAllTolls(
            sortingValues.sortBy,
            sortingValues.page,
            sortingValues.limitEntries,
            sortingValues.payStatus
          )
        );
      }
    }
  }, [sortingValues]);

  useEffect(() => {
    if (searchQuery) {
      const formData = new FormData();
      formData.append("value", searchQuery.trim());
      dispatch(
        filterTollData(
          formData,
          sortingValues.sortBy,
          sortingValues.page,
          sortingValues.limitEntries,
          sortingValues.payStatus
        )
      );
    } else {
      if (marka != "") {
        const formData = new FormData();
        if (department == "") {
          formData.append("value", marka);
        } else if (directorate == "") {
          formData.append("value", department);
        } else {
          formData.append("value", directorate);
        }
        dispatch(
          filterTollData(
            formData,
            sortingValues.sortBy,
            sortingValues.page,
            sortingValues.limitEntries,
            sortingValues.payStatus
          )
        );
      } else {
        dispatch(
          getAllTolls(
            sortingValues.sortBy,
            sortingValues.page,
            sortingValues.limitEntries,
            sortingValues.payStatus
          )
        );
      }
    }
  }, [sortingValues]);

  useEffect(() => {
    handleEditDataModalClose();
  }, []);

  const handlePagination = (page) => {
    setSortingValues({
      ...sortingValues,
      page: page,
    });
  };

  const handleLimitEntriesChange = (event) => {
    setSortingValues({
      ...sortingValues,
      limitEntries: event.target.value,
    });
  };

  const handlePayFilterChange = async (event) => {
    event.preventDefault();
    await setSortingValues({
      ...sortingValues,
      payStatus: event.target.value,
    });
    const formData = new FormData();
    if (marka !== "") {
      if (department === "") {
        await formData.append("value", marka);
      } else if (directorate === "") {
        await formData.append("value", department);
      } else {
        await formData.append("value", directorate);
      }
      await dispatch(
        searchTollsData(
          formData,
          sortingValues.sortBy,
          sortingValues.page,
          sortingValues.limitEntries,
          event.target.value
        )
      );
    }
  };
  const handleSecretariatChange = (e) => {
    setSortingValues({
      ...sortingValues,
      marka: marka,
    });
  };
  const handleDepartmentChange = (e) => {
    setSortingValues({
      ...sortingValues,
      department: department,
    });
  };
  const handleDirectorateChange = (e) => {
    setSortingValues({
      ...sortingValues,
      directorate: directorate,
    });
  };

  const handleSortByChange = (event) => {
    setSortingValues({
      ...sortingValues,
      sortBy: event.target.value,
    });
  };

  const handleMultipleDelete = () => {
    showSnackBar("deleting data please wait..", "info");
    if ("id" in authReducer.data) {
      deleteMultipleToll(authReducer.data.id, selectedData)
        .then((data) => {
          showSnackBar("data deleted successfully", "success");
          if (sortingValues.limitEntries === "All") {
            window.location.reload(false);
          } else {
            let _toll = tollData.data.filter(
              (item) => !selectedData.includes(`${item.id}`)
            );
            tollData.data = _toll;
            dispatch(setFilteredTollData(tollData));
          }
          dispatch(
            getAllTolls(
              sortingValues.sortBy,
              sortingValues.page,
              sortingValues.limitEntries
            )
          );
          setSelectedData("");
        })
        .catch((err) => {
          showSnackBar("could not delete all data", "error");
        });
    }
  };

  function showSnackBar(msg, variant = "info") {
    enqueueSnackbar(msg, {
      variant: variant,
      action: (key) => (
        <IconButton
          style={{ color: "#fff" }}
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          <Close />
        </IconButton>
      ),
    });
  }

  const handleDelete = (toll_id) => {
    if ("id" in authReducer.data) {
      dispatch(deleteToll(authReducer.data.id, toll_id));
    }
  };

  const links = [
    {
      url: "/ana-sayfa",
      name: "Anasayfa",
    },
    {
      url: "/gecis-ucre",
      name: "Gecis-ucre",
    },
  ];

  const handleRefreshPage = () => {
    dispatch(getAllTolls());
  };
  const handleSearching = (data) => {
    if (data.query !== "") {
      setSearchQuery(data.query.trim());
      const formData = new FormData();
      formData.append("value", data.query.trim());

      dispatch(
        searchTollsData(
          formData,
          sortingValues.sortBy,
          sortingValues.page,
          sortingValues.limitEntries,
          sortingValues.payStatus
        )
      );
    } else {
      setSearchQuery("");
      handleRefreshPage();
    }
  };

  const toggleCheckingAllCheckboxes = () => {
    const selected_data = selectedData === "" ? [] : selectedData.split(",");
    if (selected_data.length === tollData.data.length) {
      setSelectedData([""].join());
    } else {
      const selected = tollData.data.map((item) => item.id);
      setSelectedData(selected.join());
    }
  };
  const handleCheckBoxChange = (e) => {
    const value = e.target.value;
    let selected = selectedData.split(",");
    selected = selected["0"] === "" ? [] : selected;

    if (checkIfDataExists(e.target.value)) {
      const index = selected.indexOf(value);
      if (index > -1) {
        selected.splice(index, 1);
      }
    } else {
      selected.push(value);
    }
    setSelectedData(selected.join());
  };

  function checkIfDataExists(data) {
    return selectedData.split(",").includes(data.toString());
  }
  function formatData(data, isTurkish = true, isTableData = false) {
    const allData = [];
    let formattedData = {};
    for (const key in data) {
      formattedData["seç"] = (
        <FormControlLabel
          control={
            <Checkbox
              name={data[key].id}
              value={data[key].id}
              checked={checkIfDataExists(data[key].id)}
              onChange={handleCheckBoxChange}
            />
          }
        />
      );
      for (const header in data[key]) {
        if (header !== "id" && header !== "added_by") {
          if (header.trim() === "pdf_url") {
            const placeholder = isTurkish ? "pdf".toUpperCase() : "pdf";
            if (data[key][header] === "") {
              formattedData[placeholder] = "";
            } else {
              formattedData[placeholder] = (
                <IconButton onClick={() => handleModalOpen(data[key][header])}>
                  <Avatar alt="pdf logo" variant="square" src={pdf_logo} />
                </IconButton>
              );
            }
          } else if (header.trim() === "image_url") {
            const placeholder = isTurkish ? "Ö.MAKBUZ".toUpperCase() : "image";
            if (data[key][header] === "") {
              formattedData[placeholder] = "";
            } else {
              formattedData[placeholder] = (
                <ImageModal image={data[key][header]} />
              );
            }
          } else if (
            header.trim() === "created_at" ||
            header.trim() === "updated_at"
          ) {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = getTurkishDate(data[key][header]);
          } else if (header.trim() === "plate_number") {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = data[key][header];
          } else if (header.trim() === "brand") {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = data[key][header];
          } else if (header.trim() === "debit") {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = data[key][header];
          } else if (header.trim() === "transaction_date") {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = data[key][header];
          } else if (header.trim() === "entry_point") {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = data[key][header];
          } else if (header.trim() === "explanation") {
            const placeholder = isTurkish
              ? getPlaceHolderName(header, tollTextFields)
              : header;
            formattedData[placeholder] = data[key][header];
          }

          //sehir ici column
          //  else if (header.trim() === "local") {
          //   const placeholder = isTurkish
          //     ? getPlaceHolderName(header, tollTextFields)
          //     : header;
          //   formattedData[placeholder] = data[key][header];
          // }

          //start Time field 
          else if(header.trim()==="startTime"){
            const placeholder=isTurkish?getPlaceHolderName(header,tollTextFields):header;
            formattedData[placeholder] =data[key][header];
          }
            //end time field 
            else if(header.trim()==="endTime"){
              const placeholder=isTurkish?getPlaceHolderName(header,tollTextFields):header;
              formattedData[placeholder] =data[key][header];
            }  
          //sehir disi column
          // else if (header.trim() === "upstate") {
          //   const placeholder = isTurkish
          //     ? getPlaceHolderName(header, tollTextFields)
          //     : header;
          //   formattedData[placeholder] = data[key][header];
          // } 
          
          else {
            if (!isTableData) {
              const placeholder = isTurkish
                ? getPlaceHolderName(header, tollTextFields)
                : header;
              formattedData[placeholder] = data[key][header];
            }
          }
        }
      }
      //added by

      // const placeholder1 = isTurkish
      //   ? "Tarafından eklendi".toUpperCase()
      //   : "added_by";
      // formattedData[placeholder1] =
      //   data[key]["added_by"]["name"] + " " + data[key]["added_by"]["surname"];

      const placeholder = isTurkish ? "AKSİYON".toUpperCase() : "action";
      formattedData[placeholder] = (
        <>
          <PenaltyMenu>
            <MenuItem>
              <MoreDetailsModal data={data[key]} textfields={tollTextFields} />
            </MenuItem>
            {currentUser && currentUser.role != "USER" && (
              <>
                <MenuItem>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditDataModalOpen(data[key])}
                  >
                    {" "}
                    <Edit />{" "}
                  </IconButton>
                </MenuItem>
                <MenuItem>
                  <IconButton
                    style={{ color: "#ff0000" }}
                    onClick={() => handleDelete(data[key].id)}
                  >
                    {" "}
                    <Delete />{" "}
                  </IconButton>
                </MenuItem>
              </>
            )}
          </PenaltyMenu>
        </>
      );
      allData.push(formattedData);
      formattedData = {};
    }

    return allData;
  }

  function getTableHeaders(data) {
    const tableHeaders = [];
    for (const key in data) {
      for (const header in data[key]) {
        tableHeaders.push(header);
      }
      break;
    }

    tableHeaders.splice(1, 0, "#");

    return tableHeaders;
  }

  const formatMoreData = () => {
    const headers = getTableHeaders(formatData(tollData.data, false));
    // removing unwanted cols
    if (headers.includes("#")) {
      const index = headers.indexOf("#");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }
    if (headers.includes("pdf")) {
      const index = headers.indexOf("pdf");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }
    if (headers.includes("penalty_date")) {
      const index = headers.indexOf("penalty_date");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }
    if (headers.includes("payment_date")) {
      const index = headers.indexOf("payment_date");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }
    if (headers.includes("action")) {
      const index = headers.indexOf("action");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }
    if (headers.includes("select")) {
      const index = headers.indexOf("select");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }
    if (headers.includes("seç")) {
      const index = headers.indexOf("seç");
      if (index > -1) {
        headers.splice(index, 1);
      }
    }

    return headers;
  };
  const formatMainActionData = (data) => {
    data.sortByOptions = formatMoreData();

    return data;
  };

  const formatExcelData = (data) => {
    const selected = selectedData.split(",");
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => selected.includes(item.id.toString()));
  };

  const getExcelFileType = (data) => {
    //data

    if (data === pageType.vehicle) {
      return excelFileType.vehicle;
    } else if (data === pageType.penalty) {
      return excelFileType.penalty;
    } else if (data === pageType.toll) {
      return excelFileType.toll;
    } else {
      return data.type.toLowerCase();
    }
  };

  const handleFilter = async (e, newValue) => {
    e.preventDefault();

    const formData = new FormData();

    if (marka !== "") {
      formData.append("marka_value", marka);
    }
    if (department !== "") {
      formData.append("department_value", department);
    }
    if (directorate !== "") {
      formData.append("directorate_value", directorate);
    }
    if (zimmet !== "") {
      formData.append("zimmet_value", zimmet);
    }
    if (aciklama !== "") {
      formData.append("aciklama_value", aciklama);
    }
    if (girisNoktasi !== "") {
      formData.append("girisNoktasi_value", girisNoktasi);
    }
    if (transactionTimeFrom !== "") {
      formData.append("transactionTimeFrom_value", transactionTimeFrom);
    }
    if (transactionTimeTo !== "") {
      formData.append("transactionTimeTo_value", transactionTimeTo);
    }
    if (startTime !== "") {
      formData.append("startTime_value", startTime);
    }
    if (endTime !== "") {
      formData.append("endTime_value", endTime);
    }
    if (localSehir !== "") {
      formData.append("local_value", localSehir);
    }

    dispatch(
      filterTollData(
        formData,
        sortingValues.sortBy,
        sortingValues.page,
        sortingValues.limitEntries,
        sortingValues.payStatus
      )
    );
    console.log(formData);
  };

  useEffect(() => {
    const zimmet = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.get("toll-debit");
      setZimmetList(result.data || []);
    };
    zimmet();
  }, []);

  useEffect(() => {
    const aciklama = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.get("toll-explanation");
      setAciklamaList(result.data || []);
    };
    aciklama();
  }, [getAciklama]);

  useEffect(() => {
    const girisNoktasi = async () => {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token") != ""
      ) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("access_token");
      }

      let result = await axios.get("toll-entry-point");
      console.log("result", result.data);
      setGirisNoktasiList(result.data || []);
    };
    girisNoktasi();
  }, [getGirisNoktasi]);
  
  // console.log("Aciklama",getAciklama)
  // console.log("transaction time ,,",transactionTimeFrom);

  return (
    <div id="test123">
      {/* <PdfViewerComponent document={'MA82085522.pdf'} /> */}
      <BreadCrumb links={links} />
      <MainActionContainer
        data={formatMainActionData(pageType.toll)}
        dataSet={formatData(formatExcelData(tollData.data))}
        dataSetHeaders={getTableHeaders(formatData(tollData.data))}
        sortingValues={sortingValues}
        handleSearching={handleSearching}
        handleRefreshPage={handleRefreshPage}
        handleLimitEntriesChange={handleLimitEntriesChange}
        handlePayFilterChange={handlePayFilterChange}
        handleSortByChange={handleSortByChange}
        toggleCheckingAllCheckboxes={toggleCheckingAllCheckboxes}
        handleMultipleDelete={handleMultipleDelete}
        handleTabChange={handleTabChange}
        tabValue={tabValue}
      />

      <form onSubmit={handleFilter}>
        <FormControl
          variant="filled"
          style={{ display: "flex", alignItems: "center" }}
        >
          {/* marka section   */}
          <Grid container spacing={2} style={{ marginBottom: "1.5rem" }}>
            <Grid item xs={4}>
              <InputLabel id="sec">Select Marka</InputLabel>
              <Select
                onChange={(e) => setMarka(e.target.value)}
                id="sec"
                name="brand"
                style={{
                  minWidth: "250px",
                  marginLeft: "7px",
                  width: "calc(100% - 20px)",
                }}
              >
                <MenuItem value="" style={{ color: "gray" }}>
                  Select Marka
                </MenuItem>
                {tollTypes.map((filter) => (
                  <MenuItem value={filter.marka}>{filter.marka}</MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Daire Başkanlığını seçiniz  */}
            <Grid item xs={8} style={{ display: "flex" }}>
              <Grid xs={6}>
                <InputLabel htmlFor="dep">
                  Daire Başkanlığını seçiniz
                </InputLabel>
                <Select
                  onChange={(e) => setDepartment(e.target.value)}
                  id="dep"
                  name="department"
                  style={{
                    minWidth: "250px",
                    marginLeft: "7px",
                    width: "calc(100% - 20px)",
                  }}
                >
                  <MenuItem value="" style={{ color: "gray" }}>
                    Daire Başkanlığını seçiniz
                  </MenuItem>
                  {tollDepartmentTypes.map((filter) =>
                    filter.departments.map((depart) => (
                      <MenuItem value={depart.department}>
                        {depart.department}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </Grid>

              {department != "" && (
                <Grid xs={6}>
                  <InputLabel htmlFor="dir">
                    Şube Müdürlüğünü seçiniz
                  </InputLabel>
                  <Select
                    onChange={(e) => setDirectorate(e.target.value)}
                    id="dir"
                    name="directorate"
                    style={{
                      minWidth: "250px",
                      marginLeft: "7px",
                      width: "100%",
                    }}
                  >
                    <MenuItem value="" style={{ color: "gray" }}>
                      Şube Müdürlüğünü seçiniz
                    </MenuItem>
                    {tollDepartmentTypes.map((filter) =>
                      filter.departments.map(
                        (depart) =>
                          depart.department === department &&
                          depart.subunits.map((sub) => (
                            <MenuItem value={sub}>{sub}</MenuItem>
                          ))
                      )
                    )}
                  </Select>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            xs={12}
            spacing={3}
            style={{ marginBottom: "1.5rem", textAlign: "center" }}
          >
            {/* Zimmet section   */}
            <Grid item xs={4}>
              <Autocomplete
                id="all-zimmet"
                value={zimmet}
                onChange={(event, newValue) => {
                  setZimmet(newValue);
                }}
                options={zimmetList}
                getOptionLabel={(option) => option}
                style={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Zimmet" variant="outlined" />
                )}
              />
            </Grid>

            {/* Aciklama section  */}
            <Grid item xs={4}>
              <Autocomplete
                id="all-aciklama"
                value={aciklama}
                onChange={(event, newValue) => {
                  setAciklama(newValue);
                }}
                options={aciklamaList}
                getOptionLabel={(option) => option}
                style={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Aciklama" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                id="all-girisNoktasi"
                value={girisNoktasi}
                onChange={(event, newValue) => {
                  setGirisNoktasi(newValue);
                }}
                options={girisNoktasiList}
                getOptionLabel={(option) => option}
                style={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Giris Noktasi"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* calendar section  */}
          <Grid
            container
            xs={12}
            spacing={4}
            style={{
              alignItems: "center",
            }}
          >
            {/* 1st item    */}
            <Grid item container xs={4} spacing={2}>
              {/* calender  */}             
                <TimeComponent
                  id="date"
                  label="Tarihten itibaren işlem"
                  type="date"         
                  name={transactionTimeFrom}
                  value={transactionTimeFrom}
                  onChange={(e) => setTransactionTimeFrom(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

              {/*start time  */}

             { transactionTimeFrom && !isShowTime?  <TimeComponent
                label="Başlangıç ​​saati"
                id="time"
                type="time"
                // style={{ width: "5%" }}
                min="09:00"
                name={startTime}
                max="18:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />:
              <></>
            
            }
            </Grid>

            {/* 2nd Item   */}
            <Grid item xs={4}>
              {/* calender  */}

              <TimeComponent
                id="date2"
                label="Bugüne kadarki işlem"
                type="date"
                name={transactionTimeTo}
                value={transactionTimeTo}
                onChange={(e) => setTransactionTimeTo(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/*  end time  */}
              {transactionTimeTo && !isShowTime?
                <TimeComponent
                label="Bitiş zamanı"
                id="time"
                type="time"
                name={endTime}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min="09:00"
                max="18:00"
                InputLabelProps={{
                  shrink: true,
                }}
              />:
              <>
              </>
            }
            </Grid>

            {/* 3rd item
             radio section sehir ici  */}
            {/* <Grid item container xs={4} spacing={1}>
              <FormLabel component="legend">Şehir İçi</FormLabel>
              <RadioGroup
                aria-label="Şehir İçi"
                name="local"
                value={localSehir}
                onChange={(e) => setLocalSehir(e.target.value)}
                style={{ display: "flex", flexFlow: "row", width: "100%" }}
              >
                <FormControlLabel
                  value="Şehir İçi"
                  control={<Radio />}
                  label="Şehir İçi"
                />
                <FormControlLabel
                  value="Şehir Dışı"
                  control={<Radio />}
                  label="Sehir dışı "
                />
              </RadioGroup>
            </Grid> */}
          </Grid>
        </FormControl>

        {/* filter button   */}
        <Button
          variant="contained"
          type="submit"
          value="Filter"
          style={{ float: "right", marginTop: "14px", marginBottom: "20px" }}
        >
          Filter
        </Button>
      </form>

      <TabPanel value={tabValue} index={0}>
        {tollReducer.loading ? (
          <ProgressBarSpinner />
        ) : "data" in tollData ? (
          <>
            <Table
              rows={formatData(tollData.data, true, true)}
              tableHeader={getTableHeaders(
                formatData(tollData.data, true, true)
              )}
            />
            {sortingValues.limitEntries === "All" ? (
              <div />
            ) : (
              <Paginator
                paginationCount={tollData.last_page}
                handlePagination={handlePagination}
                page={tollData.current_page}
              />
            )}
          </>
        ) : (
          <Alert severity="info">0 results found</Alert>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ExcelFilePreview
          counter={tabValue}
          excelFileType={getExcelFileType(formatMainActionData(pageType.toll))}
        />
      </TabPanel>

      <Modal
        handleClose={handleModalClose}
        open={pdfOpen.open}
        pdf={pdfOpen.pdf}
      />
      <EditDataModal
        editModalOpen={editModalOpen}
        handleEditDataModalClose={handleEditDataModalClose}
        formType={formTypes.newToll}
      />
    </div>
  );
}
