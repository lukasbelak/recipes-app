import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Embed,
  Image,
  Label,
  Grid,
  Container,
  Icon,
} from "semantic-ui-react";
import { getImageUrl, parseTags } from "../../utils";
import UpdateRecipeModal from "./UpdateRecipeModal";
import DeleteRecipeModal from "./DeleteRecipeModal";
import { Typeahead } from "react-bootstrap-typeahead";
import { useHistory } from "react-router-dom";

const breakpoint = 768;

const ViewRecipeModal = ({
  width,
  recipe,
  user,
  openViewRecipeModal,
  cancelViewRecipeModal,
  reloadList,
  showMessage,
}) => {
  const [openUpdateRecipeModal, setOpenUpdateRecipeModal] = useState(false);
  const [viewRecipe, setViewRecipe] = useState(recipe);
  const [openDeleteRecipeModal, setOpenDeleteRecipeModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState([]);
  const typeaheadRef = useRef(null);

  let history = useHistory();

  useEffect(() => {
    setSelectedTag(parseTags(viewRecipe.tags));
  }, [history, viewRecipe]);

  const handleUpdateRecipe = () => {
    setOpenUpdateRecipeModal(true);
  };

  const cancelUpdateRecipeModal = () => {
    setOpenUpdateRecipeModal(false);
  };

  const handleCancelView = () => {
    cancelViewRecipeModal(true);
  };

  const setUpdatedRecipe = (value) => {
    setViewRecipe(value);
  };

  const handleDeleteRecipe = () => {
    setOpenDeleteRecipeModal(true);
  };

  const cancelDeleteRecipeModal = (isDeleted) => {
    setOpenDeleteRecipeModal(false);
    if (isDeleted) {
      cancelViewRecipeModal(true);
      reloadList();
    }
  };

  const getHeaderColor = () => {
    switch (viewRecipe.season) {
      case 1:
        return { backgroundColor: "#52d178" };
      case 2:
        return { backgroundColor: "#ffff5d" };
      case 3:
        return { backgroundColor: "#ff582c" };
      case 4:
        return { backgroundColor: "#2dcfff" };
      default:
        break;
    }
  };

  let video;
  if (viewRecipe.youtube !== "") {
    video = (
      <div>
        <label style={{ fontWeight: "700" }}>Video</label>
        <Embed id={viewRecipe.youtube} source="youtube" />
      </div>
    );
  }

  let createdByUser = viewRecipe.users != null ? viewRecipe.users[0] : null;
  let createdBy =
    createdByUser != null
      ? createdByUser.firstName + " " + createdByUser.lastName
      : null;

  return (
    <Container>
      <Modal
        open={openViewRecipeModal}
        dimmer="blurring"
        closeOnDimmerClick={true}
        closeOnEscape={true}
        onClose={handleCancelView}
      >
        <Modal.Header style={getHeaderColor()}>
          <Container fluid>
            {width > breakpoint ? (
              <Grid columns={4} stackable>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Label
                      as="a"
                      color="brown"
                      style={{ fontSize: "22px", float: "left" }}
                      horizontal
                    >
                      {" "}
                      {recipe.category}{" "}
                    </Label>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <p
                      style={{
                        top: "50%",
                        position: "absolute",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {viewRecipe.name}
                    </p>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button
                      type="button"
                      color="blue"
                      onClick={handleUpdateRecipe}
                    >
                      Zmeniť
                    </Button>
                    <Button
                      type="button"
                      color="red"
                      onClick={handleDeleteRecipe}
                    >
                      Vymazať
                    </Button>
                    <DeleteRecipeModal
                      recipe={recipe}
                      openDeleteRecipeModal={openDeleteRecipeModal}
                      cancelDeleteRecipeModal={cancelDeleteRecipeModal}
                      showMessage={showMessage}
                    />
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <Icon link name="close" onClick={handleCancelView} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ) : (
              <Grid columns={3} stackable>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <Grid columns={2}>
                      <Grid.Row>
                        <Grid.Column width={14}>
                          <Label
                            as="a"
                            color="brown"
                            style={{ fontSize: "22px", float: "left" }}
                            horizontal
                          >
                            {recipe.category}
                          </Label>
                        </Grid.Column>
                        <Grid.Column width={2}>
                          <Icon link name="close" onClick={handleCancelView} style={{textAlign:'right'}}  />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <p
                      style={{
                        top: "50%",
                        position: "absolute",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {viewRecipe.name}
                    </p>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button
                      type="button"
                      color="blue"
                      onClick={handleUpdateRecipe}
                    >
                      Zmeniť
                    </Button>
                    <Button
                      type="button"
                      color="red"
                      onClick={handleDeleteRecipe}
                    >
                      Vymazať
                    </Button>
                    <DeleteRecipeModal
                      recipe={recipe}
                      openDeleteRecipeModal={openDeleteRecipeModal}
                      cancelDeleteRecipeModal={cancelDeleteRecipeModal}
                      showMessage={showMessage}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Container>
        </Modal.Header>
        <Modal.Content style={{ fontSize: "18px" }}>
          <Modal.Description>
            <Grid stackable columns={2}>
              <Grid.Row stretched>
                <Grid.Column>
                  <Container>
                    <label>Ingrediencie</label>
                    <ul>
                      {viewRecipe.ingredients.map((i) => (
                        <li key={i.name}>
                          {i.name} {i.quantity > 0 ? i.quantity : null} {i.unit}
                        </li>
                      ))}
                    </ul>
                  </Container>
                </Grid.Column>
                <Grid.Column>
                  <Container>
                    <Image
                      src={getImageUrl(viewRecipe.img)}
                      alt=""
                      style={{ width: "100%" }}
                    />
                  </Container>
                  {viewRecipe.tags.length > 2 ? (
                    <Container>
                      <label></label>
                      <Typeahead
                        multiple
                        id="keep-menu-open"
                        ref={typeaheadRef}
                        defaultSelected={selectedTag}
                        disabled={true}
                      />
                    </Container>
                  ) : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Container>
                    <label>Popis</label>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {viewRecipe.description}
                    </p>
                  </Container>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Container>{video}</Container>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Container>
                    <p style={{ textAlign: "center" }}>
                      Vytvorené dňa:{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      }).format(new Date(viewRecipe.date))}
                    </p>
                    <p style={{ textAlign: "center" }}>
                      Vytvoril: <b>{createdBy}</b>
                    </p>
                  </Container>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button type="button" onClick={handleCancelView}>
            Zrušiť
          </Button>
          <UpdateRecipeModal
            width={width}
            recipe={viewRecipe}
            openUpdateRecipeModal={openUpdateRecipeModal}
            cancelUpdateRecipeModal={cancelUpdateRecipeModal}
            setUpdatedRecipe={setUpdatedRecipe}
          />
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default ViewRecipeModal;
