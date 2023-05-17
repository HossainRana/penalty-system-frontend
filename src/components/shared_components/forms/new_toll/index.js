import {
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DropzoneArea } from 'material-ui-dropzone';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNewPenalty, updatePenalty } from '../../../../store/reducers/penalty/penalty.actions';
import { setNewToll, updateToll } from '../../../../store/reducers/toll/toll.actions';
// import { CLEAR_PENALTY_ERROR, CLEAR_PENALTY_MESSAGE } from '../../../../store/reducers/penalty/penalty.types';
import { CLEAR_TOLL_ERROR, CLEAR_TOLL_MESSAGE } from '../../../../store/reducers/toll/toll.types';
import { getAllVehiclesPlateNumber } from '../../../../store/reducers/vehicle/vehicle.actions';
import {
    accessSecurity,
    departments, paymentStatus, penaltyArticleAmounts, penaltyTextFields,
    penaltyTextFields1,
    penaltyTextFields2, units
} from '../../../../utils/constants';
import {tollTextFields} from '../../../../utils/constants'
import { handleUpdateData, removeNulls } from '../../../../utils/functions';
import BreadCrumb from '../../BreadCrump';
import ProgressSpinner from '../../ProgressBarSpinner';
import { useStyles } from './style';

export default function NewTollForm(props) {
     
    const {isUpdate, data} = props;
    const [formData, setFormData] = useState(isUpdate ? data : {});
    const authState = useSelector((state) => state.authReducer)
    const currentUser = authState.data;
    const [penaltyAmountList, setPenaltyAmountList] = useState(penaltyArticleAmounts);
    const [paymentArticles, setPaymentArticles] = useState(penaltyArticleAmounts.map(payment => payment.code));
    const [hasValue, setValue] = useState(false);

    const classes = useStyles();
    
    const defaultInputData = (data !== null && data !== undefined) ? data : {}
    const [formInputData, setFormInputData] = useState({})
    
    const [plateNumber, setPlateNumber] = useState(
        ("vehicle" in defaultInputData) ? {
            id: defaultInputData.vehicle.id,
            plate_number: defaultInputData.vehicle.plate_number
        } : {}
    );
    const [fileError, setFileError] = useState('')
    const [uploadedPdf, setUploadedPdf] = useState(null)
    const [penaltyImage, setPenaltyImage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const tollReducer = useSelector((state) => state.tollReducer)
    const authReducer = useSelector((state) => state.authReducer)
    const vehicleReducer = useSelector((state) => state.vehicleReducer)
    const textFields = tollTextFields
    const textFields1 = penaltyTextFields1
    const textFields2 = penaltyTextFields2
    const[departmentList, setDepartmentList] = useState([])
    const[unitList, setUnitList] = useState([])
    const [secretariateList, setSecretariateList] = useState([])
    const [currentSecretariate, setCurrentSecretariate] = useState({})

    useEffect(() => {
        setFormData(data);
        dispatch(getAllVehiclesPlateNumber())
    }, [data, isUpdate])

    const links = [
        {
            url: "/hgs-birim",
            name: "Anasayfa"
        },
        {
            url: "/gecis-ucre",
            name: "Geçiş ücreti"
        },
        {
            url: "/yeni-ücret-ekle",
            name: "Yeni Geçiş Ücreti Ekle"
        }

    ]

    const handleInputChangeForText = (e, inputName, inputValue) => {
        const data = formInputData
        data[inputName] = inputValue
        setFormInputData(data)
        
    }

    // const handleInputChange = (inputName, inputValue) => {        
    //     // console.log('handle-input-change:', inputName, inputValue);
    //     const data = formInputData
    //     data[inputName] = inputValue
    //     // console.log('data formInputData', data, formInputData);
    //     // setFormInputData(data)
    //     setFormInputData((prevState) => ({ ...prevState, [inputName]: inputValue}))
        
    // }

    const handleInputChange = (inputName, inputValue) => {
        const data = formInputData
        data[inputName] = inputValue
        setFormInputData((prevState) => ({ ...prevState, [inputName]: inputValue}))
        setFormData((prevState) => ({ ...prevState, [inputName]: inputValue}))
    }


    const onSubmit = (e) => {
        e.preventDefault()
        let data = formInputData
        if (data === {} && defaultInputData !== {}) {
            showSnackBar("No data has been editted", "info")
            return
        } else if (data !== {} && defaultInputData !== {}) {
            //if the state is not empty and there are default values,
            //then add un-updated-default-values to data
            const __defaultInputData = handleUpdateData(defaultInputData)
            for (const key in __defaultInputData) {

                if (!(key in data)) {
                    data[key] = __defaultInputData[key]
                }

            }
        } else if (data === {} && defaultInputData === {}) {
            showSnackBar("Cannot add empty data", "error")
            return
        }

        if (plateNumber === '') {
            showSnackBar("Plate Number is required", "error")
            return
        }


        const formData = new FormData()
        const __data = removeNulls(data)
        for (const key in __data) {
            formData.append(key, __data[key])
        }


        if ('id' in authReducer.data) {
            if (isUpdate) {
                dispatch(updateToll((formData), authReducer.data.id, defaultInputData.id))
            } else {
                dispatch(setNewToll(formData, authReducer.data.id, navigate))
            }
        }
    }

    if (tollReducer.message) {
        showSnackBar(tollReducer.message, 'success');
        dispatch({type: CLEAR_TOLL_MESSAGE})
    }

    if (tollReducer.error) {

        if ("errors" in tollReducer.error) {
            for (const key in tollReducer.error.errors) {

                showSnackBar(tollReducer.error.errors[key]["0"], 'error');

            }
        } else if ("error" in tollReducer.error) {

            showSnackBar(tollReducer.error.error, 'error');
        }


        dispatch({type: CLEAR_TOLL_ERROR})
    }

    function showSnackBar(msg, variant = 'info') {
        enqueueSnackbar(msg, {
            variant: variant,
            action: (key) => (
                <IconButton style={{color: '#fff'}} size="small" onClick={() => closeSnackbar(key)}>
                    <Close/>
                </IconButton>
            ),
        })
    }

    const handlePaymentArticleChange = (value) => {
        let article = penaltyArticleAmounts.find(item => item.code === value);
        if (article) {
            //handleInputChange('payment_amount', article.amount);
            setFormInputData((prevState) => ({ ...prevState, ['penalty']: article.penalty + ' TL' }))

            setFormInputData((prevState) => ({ ...prevState, ['payment_amount']: article.amount + ' TL' }))
            
        }
    }



    const getTextInputValue = (name) => {
        return (formData !== null && formData !== undefined) ? formData[name] : ''
    }

    return (

        <>

            {
                isUpdate ?
                    <></>
                    :
                    <BreadCrumb links={links}/>
            }
            <Paper className={isUpdate ? classes.root1 : classes.root}>
                <form onSubmit={onSubmit}>
                    <Typography className={classes.header}>YENI ÜCRET EKLE</Typography>
                    <Grid
                        container
                        spacing={2}
                    >


                        {
                            textFields.map((item, index) => {
                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        key={`tf1_ + ${index}`}
                                    >
                                        <TextField
                                            InputLabelProps={ isUpdate ? { shrink: formData[item.name] ? true : false } : {shrink: formInputData[item.name] ? true : false}}   
                                            label={item.placeholder}
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            className={classes.textfield}
                                            fullWidth
                                            // value={formInputData[item.name]}
                                            value={isUpdate ? formData[item.name] : formInputData[item.name] }
                                            onChange={(e) => handleInputChange(item.name, e.target.value)}
                                            //onChange={(e) => isUpdate ? setFormData({...formData, [item.name]: e.target.value}) : setFormInputData({...formInputData, [item.name]: e.target.value})}
                                            // {...register(item.name, { required: true })}
                                        />          
                                        {/* {errors[item.name] && <span>This field is required</span>} */}
                                    </Grid>
                                )
                            })
                        }
                    </Grid>

                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={8}>
                            {
                                currentUser && currentUser.role != 'USER' && 
                                (
                                    <Button type="submit" variant="contained" color="primary" className={classes.submitBtn}>
                                        {tollReducer.loading ? <ProgressSpinner/> : "Kaydet"}
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>

                </form>
            </Paper>
        </>
    );


}
