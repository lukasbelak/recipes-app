import React from "react";
import { Table, Checkbox, Button, Icon, Popup } from "semantic-ui-react";
import Moment from "react-moment";
import { textEllipsis } from "../../utils";

const AdminRecipesRow = ({
  recipe,
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

    fetch("/api/recipes/" + recipe.id, requestOptions)
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
    <Table.Row key={recipe.id}>
      <Table.Cell>
        <Checkbox
          checked={isItemSelected(recipe.id)}
          onChange={() => handleSelect(recipe.id)}
        />
      </Table.Cell>
      <Table.Cell>{recipe.name}</Table.Cell>
      <Table.Cell>{recipe.category}</Table.Cell>
      <Table.Cell>
        {recipe.youtube !== ""
          ? "https://www.youtube.com/watch?v=" + recipe.youtube
          : ""}
      </Table.Cell>
      <Popup
        flowing
        content={recipe.description !== "" ? recipe.description : ""}
        trigger={
          <Table.Cell>
            {recipe.description !== ""
              ? textEllipsis(recipe.description, 15)
              : ""}
          </Table.Cell>
        }
      />

      <Table.Cell>
        <Moment format="DD/MM/YYYY hh:mm:ss">{recipe.createdOn}</Moment>
      </Table.Cell>
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

export default AdminRecipesRow;
