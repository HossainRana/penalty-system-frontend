import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@material-ui/core";
import React from "react";

const DropdownComponent = ({
  availableMonths,
  availableYear,
  monthLabel,
  data,
  month,
  notShowAll,
  year,
  setData,
  label,
  selectStyle,
}) => {
  return (
    <div style={{display:"flex", rowGap:'2%', columnGap:'2%'}}>
      {/* year    */}
    
        <FormControl  style={{width:'49%'}}>
          <InputLabel variant="outlined" id="demo-simple-select-label">
            {label}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={year}
            value={data.year}
            onChange={(e) =>
              setData({
                ...data,
                year: e.target.value,
              })
            }
            input={<OutlinedInput label="yılları seçin" />}
            // style={{ width: "100%", marginTop: "2%" }}
          >

            {notShowAll? <></>: <MenuItem value="all">Tümü</MenuItem>}
           
            {availableYear.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
      {/* month */}

      {data.year > 0 && (
        <FormControl style={{width:'49%'}} >
          <InputLabel variant="outlined" id="demo-simple-select-label">
            {monthLabel}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={data.month}
            name={month}
            onChange={(e) =>
              setData({
                ...data,
                month: e.target.value,
              })
            }
            input={<OutlinedInput label="ayları seç" />}
            // style={{ width: "100%" }}
          >
            <MenuItem value="">None</MenuItem>
            {availableMonths.map((month) => (
              <MenuItem key={month.id} value={month.id}>
                {month.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default DropdownComponent;
