import React from "react";

const ListGroup = (props) => {
  const { items, textProperty, valueProperty, onItemSelect, selectedItem } =
    props;

  return (
    <ul className="list-group setleft">
      <li
        className="list-group-item"
        style={{
          backgroundColor: "#02501e",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Select Approval Area
      </li>
      {items.length === 0 ? (
        <li className="list-group-item">{"No Data Found"}</li>
      ) : (
        ""
      )}
      {items.map((item) => (
        <li
          style={{
            cursor: "pointer",
          }}
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
          className={
            item.approvalAreaName === selectedItem.approvalAreaName
              ? "list-group-item list-group-item-action active"
              : "list-group-item list-group-item-action"
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "approvalAreaName",
  valueProperty: "_id",
};

export default ListGroup;
