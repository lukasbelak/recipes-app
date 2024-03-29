import React, { useState } from "react";
import { Button, Modal, Form } from "semantic-ui-react";

const DeleteRecipeModal = ({
  recipe,
  openDeleteRecipeModal,
  cancelDeleteRecipeModal,
  showMessage,
}) => {
  const [isInProgressDelete, setIsInProgressDelete] = useState("");
  const [isInProgressDeleteBool, setIsInProgressDeleteBool] = useState(false);

  const handleYesOption = () => {
    setIsInProgressDelete("loading");
    setIsInProgressDeleteBool(true);

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("rcp_token") },
    };

    fetch("/api/recipes/" + recipe._id, requestOptions)
      .then((resp) => {
        resp.json();
      })
      .then((err) => {
        if (err && err.message) {
          console.log(err.message);
          showMessage({
            header: "Error",
            text: err.message,
          });
        } else {
          showMessage({
            header: "Success",
            text: "Recipe '" + recipe.name + "' was deleted successfully.",
          });
        }

        setIsInProgressDelete("");
        setIsInProgressDeleteBool(false);
        cancelDeleteRecipeModal(true);
      });
  };

  const handleNoOption = () => {
    cancelDeleteRecipeModal(false);
  };

  return (
    <div>
      <Modal
        size="tiny"
        open={openDeleteRecipeModal}
        onClose={cancelDeleteRecipeModal}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        dimmer="blurring"
        centered
      >
        <Modal.Header>Vymazať recept</Modal.Header>
        <Modal.Content style={{fontSize:'18px'}}>
          <Form className={isInProgressDelete}>
            <Form.Field>
              <p>Ste si istý, že chete vymazať tento recept?</p>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={handleNoOption}
            disabled={isInProgressDeleteBool}
          >
            Nie
          </Button>
          <Button
            positive
            onClick={handleYesOption}
            disabled={isInProgressDeleteBool}
          >
            Áno
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default DeleteRecipeModal;
