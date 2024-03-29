import React from "react";
import { Table, Checkbox, Button, Icon } from "semantic-ui-react";

const AdminCategoriesRow = ({
  category,
  isItemSelected,
  handleSelect,
  setIsLoading,
  handleDeleted,
}) => {
  const handleDelete = () => {
    setIsLoading(true);

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("rcp_token") },
    };

    fetch("/api/categories/byname/" + category.name, requestOptions)
      .then((resp) => {
        resp.json();
      })
      .then((err) => {
        setIsLoading(false);
        handleDeleted();
        if (err && err.message) {
          console.log(err.message);
        }
      });
  };

  /* jshint ignore:start */
  return (
    <Table.Row key={category.id}>
      <Table.Cell width={2}>
        <Checkbox
          checked={isItemSelected(category.id)}
          onChange={() => handleSelect(category.id)}
        />
      </Table.Cell>
      <Table.Cell width={12}>{category.name}</Table.Cell>
      <Table.Cell width={2}>
        <Button
          icon
          circular
          color="red"
          style={{ margin: "0px 15px" }}
          onClick={handleDelete}
        >
          <Icon name="delete" />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
  /* jshint ignore:end */
};

export default AdminCategoriesRow;
