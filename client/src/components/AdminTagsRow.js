import React from "react";
import { Table, Checkbox, Button, Icon } from "semantic-ui-react";

const AdminTagsRow = ({
  tag,
  isItemSelected,
  handleSelect,
  setIsLoading,
  handleDeleted,
}) => {
  const handleDelete = () => {
    debugger;
    setIsLoading(true);

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("rcp_token") },
    };

    fetch("/api/tags/byname/" + tag.name, requestOptions)
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

  return (
    <Table.Row key={tag.id}>
      <Table.Cell>
        <Checkbox
          checked={isItemSelected(tag.id)}
          onChange={() => handleSelect(tag.id)}
        />
      </Table.Cell>
      <Table.Cell>{tag.name}</Table.Cell>
      <Table.Cell>
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
};

export default AdminTagsRow;
