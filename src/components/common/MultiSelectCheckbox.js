import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

const MultiSelectCheckbox = (props) => {
  return (
    <Select
      labelId={props.labelId}
      label={props.label}
      id={props.id}
      name={props.name}
      multiple
      value={props.value}
      onChange={props.onChange}
      renderValue={(selected) => {
        // console.log("selected : ", selected);
        // let arr = [];
        // for (let item of selected) {
        //   arr.push(item.name);
        // }
        //return arr.join(", ");
        return selected.join(", ");
      }}
      MenuProps={props.MenuProps}
    >
      {props.data.map((obj) => (
        <MenuItem key={obj._id} value={obj.name}>
          <Checkbox checked={props.value.indexOf(obj.name) > -1} />
          {/* <Checkbox
            checked={props.value.findIndex((o) => o.name === obj.name) > -1}
          /> */}
          <ListItemText primary={obj.name} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelectCheckbox;
