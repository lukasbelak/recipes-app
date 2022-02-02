import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  Table,
  Checkbox,
  Button,
  Icon,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";
import AdminCategoriesRow from "./AdminCategoriesRow";
import withSelections from "react-item-select";
import NewCategoryModal from "./NewCategoryModal";
import { useHistory } from "react-router-dom";

const AdminCategories = ({
  areAnySelected,
  selectedCount,
  handleClearAll,
  areAllSelected,
  areAllIndeterminate,
  handleSelectAll,
  isItemSelected,
  handleSelect,
  selections,
}) => {
  const [column, setColumn] = useState("");
  const [data, setData] = useState([]);
  const [direction, setDirection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(0);
  const [openNewCategoryModal, setOpenNewCategoryModal] = useState(false);

  let history = useHistory();

  const segmentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      let categories = [];
      try {
        const requestOptions = {
          method: "GET",
          headers: { Authorization: localStorage.getItem("rcp_token") },
        };

        const resp = await fetch("/api/categories", requestOptions);
        let cats = await resp.json();
        cats.forEach((cat) => {
          categories.push({
            name: cat.name,
            id: cat._id,
          });
        });
        setData(categories);
        setIsLoading(false);
        console.log("categories: " + categories);
      } catch (err) {
        console.log(err.message);
        history.push("/login");
      }
    };

    getCategories();
  }, [isReload, history]);

  const cancelNewCategoryModal = () => {
    setOpenNewCategoryModal(false);
  };

  const handleDeleted = () => {
    setIsReload(isReload + 1);
    handleClearAll();
  };

  const handleSort = (clickedColumn) => () => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      setData(_.sortBy(data, [clickedColumn]));
      setDirection("ascending");

      return;
    }

    setData(data.reverse());
    setDirection(direction === "ascending" ? "descending" : "ascending");
  };

  const handleDelete = () => {
    let itemArray = Object.entries(selections);
    let items = [];
    itemArray.forEach((i) => {
      items.push(i[0]);
    });

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("rcp_token") },
    };

    items.forEach((item) => {
      setIsLoading(true);

      fetch("/api/categories/byid/" + item, requestOptions)
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
    });
  };

  const handleAddCategory = () => {
    setOpenNewCategoryModal(true);
  };

  const reloadCategories = () => {
    setIsReload(isReload + 1);
    handleClearAll();
  };

  return (
    <div style={{ margin: "auto", width: "700px" }}>
      <Dimmer active={isLoading} inverted>
        <Loader size="huge">Načítavanie...</Loader>
      </Dimmer>

      <Segment textAlign="left" style={segmentStyle}>
        {!areAnySelected && <span>Zvoľte položky v tabuľke</span>}
        <div style={{ visibility: areAnySelected ? "visible" : "hidden" }}>
          <span style={{ marginRight: "8px" }}>{selectedCount} selected</span>
          <Button basic onClick={handleClearAll}>
            Vymazať
          </Button>
        </div>
        <div>
          {data.length === 1 ? (
            <span>{data.length} Kategória</span>
          ) : (
            <span>{data.length} Kategórie</span>
          )}
        </div>
      </Segment>
      <Table sortable fixed celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>
              <Checkbox
                checked={areAllSelected(data)}
                indeterminate={areAllIndeterminate(data)}
                onChange={() => handleSelectAll(data)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell
              width={14}
              sorted={column === "name" ? direction : null}
              onClick={handleSort("name")}
            >
              Názov
            </Table.HeaderCell>
            <Table.HeaderCell width={1}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((category) => (
            <AdminCategoriesRow
              key={category.id}
              category={category}
              isItemSelected={isItemSelected}
              handleSelect={handleSelect}
              setIsLoading={setIsLoading}
              handleDeleted={handleDeleted}
            />
          ))}
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4">
              <Button
                floated="right"
                icon
                labelPosition="left"
                color="green"
                size="small"
                onClick={handleAddCategory}
              >
                <Icon name="add" />
                Nová kategória
              </Button>
              <NewCategoryModal
                openNewCategoryModal={openNewCategoryModal}
                cancelNewCategoryModal={cancelNewCategoryModal}
                reloadCategories={reloadCategories}
              />
              <Button
                size="small"
                color="red"
                disabled={!areAnySelected}
                onClick={handleDelete}
              >
                Vymazať
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
};

export default withSelections(AdminCategories);
