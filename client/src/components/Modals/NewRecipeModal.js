import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, Input, Icon, Container } from "semantic-ui-react";
import SearchCategory from "../Home/SearchCategory";
import { youtubeParser, getRequestOptions, createTags } from "../../utils";
import NewCategoryModal from "./NewCategoryModal";
import Compress from "compress.js";
import SeasonList from "../Recipe/SeasonList";
import { Typeahead } from "react-bootstrap-typeahead";
import { useHistory } from "react-router-dom";

const compress = new Compress();
const breakpoint = 768;

const NewRecipeModal = ({
  user,
  openNewRecipeModal,
  createRecipe,
  cancelCreateRecipe,
  showMessage,
}) => {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState(0);
  const [youtube, setYoutube] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileContentType, setFileContentType] = useState("");
  const [isInProgressCreate, setIsInProgressCreate] = useState("");
  const [isInProgressCreateBool, setIsInProgressCreateBool] = useState(false);
  const [categoryError, setCategoryError] = useState(true);
  const [descriptionError, setDescriptionError] = useState(true);
  const [nameError, setNameError] = useState(true);
  const [formError, setFormError] = useState(true);
  const [openNewCategoryModal, setOpenNewCategoryModal] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(0);
  const typeaheadRef = useRef(null);
  const [selectedTag, setSelectedTag] = useState([]);
  const [tags, setTags] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const errorMessage = "Vyplňte všetky povinné polia, prosím.";

  let history = useHistory();

  useEffect(()=>{
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  },[]);

  useEffect(() => {
    const getTags = async () => {
      try {
        let data = [];

        const requestOptions = getRequestOptions("GET");

        const resp = await fetch("/api/tags", requestOptions);
        let result = await resp.json();

        result.forEach((tag) => {
          data.push({
            key: tag._id,
            label: tag.name,
            value: tag.name,
          });
        });
        setTags(data);
      } catch (err) {
        console.log(err.message);
        history.push("/login");
      }
    };

    getTags();
  }, [history]);

  const handleNewRecipe = (value) => {
    createRecipe(value);
  };

  const handleCreate = (value) => {
    createRecipeWithIngredients(value);
  };

  const createRecipeWithIngredients = async (value) => {
    if (formError) return;

    setIsInProgressCreate("loading");
    setIsInProgressCreateBool(true);

    var createdTags = await createTags(selectedTag);
    

    const recipe = {
      name: name,
      description: description,
      category: category,
      img: {
        data: fileData,
        contentType: fileContentType,
      },
      youtube: youtubeParser(youtube),
      userId: user._id,
      season: season,
      tags: JSON.stringify(createdTags),
    };

    let ings = [];
    ingredients.forEach((ing) => {
      if (
        ing.name !== undefined &&
        ing.name !== "" &&
        ing.quantity !== undefined &&
        ing.quantity !== "" &&
        ing.unit !== undefined &&
        ing.unit !== ""
      ) {
        ings.push(ing);
      }
    });
    recipe.ingredients = ings;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("rcp_token"),
      },
      body: JSON.stringify(recipe),
    };

    fetch("/api/recipes", requestOptions)
      .then((resp) => resp.json())
      .then((err) => {
        if (err.message) {
          console.log(err.message);
          showMessage({
            header: "Error",
            text: err.message,
          });
        } else {
          showMessage({
            header: "Success",
            text: "Recept '" + recipe.name + "' bol úspešne vytvorený.",
          });
        }

        resetForm();

        setIsInProgressCreateBool(false);
        setIsInProgressCreate("");
        createRecipe(value);
      })
      .catch((err) => {
        debugger;
      });
  };

  const checkFormError = (cat, nam, desc) => {
    if (cat !== "" && nam !== "" && desc !== "") {
      setFormError(false);
    } else {
      setFormError(true);
    }
  };

  const handleCancelCreate = () => {
    resetForm();

    cancelCreateRecipe();
  };

  const resetForm = () => {
    setIngredients([]);
    setName("");
    setDescription("");
    setCategory("");
    setYoutube("");
    setFileData("");
    setFileContentType("");
    setFileName("");
    setSeason(null);
    setSelectedTag([]);

    setNameError(true);
    setCategoryError(true);
    setDescriptionError(true);
    setFormError(true);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, {}]);
  };

  const handleRemoveIngredient = (index) => {
    ingredients.splice(index, 1);
    setIngredients([...ingredients]);
  };

  const handleAddIngredientName = (e, index) => {
    let value = e.target.value;
    ingredients[index].name = value;
    setIngredients(ingredients);
  };

  const handleAddIngredientQuantity = (e, index) => {
    let value = e.target.value;
    ingredients[index].quantity = value;
    setIngredients(ingredients);
  };

  const handleAddIngredientUnit = (e, index) => {
    let value = e.target.value;
    ingredients[index].unit = value;
    setIngredients(ingredients);
  };

  const updateYoutube = (e) => {
    setYoutube(e.target.value);
  };

  const updateName = (e) => {
    let nameValue = e.target.value;
    setName(nameValue);

    if (nameValue === "") {
      setNameError(true);
    } else {
      setNameError(false);
    }

    checkFormError(category, nameValue, description);
  };

  const updateDescription = (e) => {
    let descriptionValue = e.target.value;
    setDescription(descriptionValue);

    if (descriptionValue === "") {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }

    checkFormError(category, name, descriptionValue);
  };

  const getCategory = (value) => {
    let categoryValue = value;
    setCategory(categoryValue);

    if (categoryValue === "") {
      setCategoryError(true);
    } else {
      setCategoryError(false);
    }

    checkFormError(categoryValue, name, description);
  };

  const getSeason = (value) => {
    let seasonValue = value;
    setSeason(seasonValue);
  };

  const onUploadImageChange = (e) => {
    let file = e.target.files[0];
    if (file === undefined) return;
    if (!file.type.startsWith("image/")) return;

    setFileContentType(file.type);
    setFileName(file.name);

    compress
      .compress([...e.target.files], {
        size: 4,
        quality: 0.75,
        maxWidth: 1920,
        maxHeight: 1920,
        resize: true,
      })
      .then((data) => {
        setFileData(data[0].data);
      });
  };

  const onRemoveImage = (e) => {
    setFileData("");
    setFileName("");
    setFileContentType("");
  };

  const handleAddCategory = () => {
    setOpenNewCategoryModal(true);
  };

  const cancelNewCategoryModal = () => {
    setOpenNewCategoryModal(false);
  };

  const reloadCategories = () => {
    setIsNewCategory(isNewCategory + 1);
  };

  const tagOnChange = (value) => {
    setSelectedTag(value);
  };

  return (
    <Container fluid style={{ paddingTop:width>breakpoint?'0px':'10px'}}>
      <Modal
        open={openNewRecipeModal}
        dimmer="blurring"
        onClose={handleCancelCreate}
        closeOnDimmerClick={true}
        closeOnEscape={true}
        trigger={
          <Button
            className="green"
            style={{  margin: "0 10px", height: "38px" }}
            onClick={handleNewRecipe.bind(handleNewRecipe, true)}
          >
            Nový
          </Button>
        }
      >
        <Modal.Header>Nový recept</Modal.Header>
        <Modal.Content style={{fontSize:'18px'}}>
          <Modal.Description>
            <Form error={formError} className={isInProgressCreate}>
              <Form.Field>
                <label className="requiredField">Kategória</label>
                <SearchCategory
                  defaultValue={category}
                  getCategory={getCategory}
                  categoryError={categoryError}
                  isNewCategory={isNewCategory}
                />
                <Button
                  color="green"
                  circular
                  icon
                  style={{ margin: "0px 10px" }}
                  type="button"
                  title="Pridať novú kategóriu"
                  onClick={handleAddCategory}
                >
                  <Icon name="add" />
                </Button>
                <NewCategoryModal
                  openNewCategoryModal={openNewCategoryModal}
                  cancelNewCategoryModal={cancelNewCategoryModal}
                  getCategory={getCategory}
                  reloadCategories={reloadCategories}
                />
              </Form.Field>
              <Form.Field>
                <label>Obdobie</label>
                <SeasonList defaultValue={null} getSeason={getSeason} />
              </Form.Field>
              <Form.Field>
                <label className="requiredField">Názov</label>
                <Form.Input
                  required={true}
                  type="text"
                  value={name}
                  onChange={updateName}
                  placeholder="Názov"
                  error={nameError}
                />
              </Form.Field>
              <Form.Field>
                <label>Obrázok</label>
                <div style={{ display: "table" }}>
                  <Button
                    as="label"
                    htmlFor="file"
                    type="button"
                    style={{ width: "100px", float: "left" }}
                  >
                    Nahrať
                  </Button>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={onUploadImageChange}
                    accept=".png,.jpg,.jpeg"
                  />
                  <label
                    style={{ display: "table-cell", verticalAlign: "middle" }}
                  >
                    {fileName}
                  </label>
                  <Icon
                    style={
                      fileName === ""
                        ? { display: "none" }
                        : { display: "table-cell", verticalAlign: "middle" }
                    }
                    link
                    color="red"
                    name="close"
                    onClick={onRemoveImage}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label>Ingrediencie</label>
                {ingredients.map((ingredient, index) => {
                  return (
                    <div key={index} className="floatLeft">
                      <div className="floatLeft">
                        <Input
                          placeholder="názov"
                          onChange={(e) => handleAddIngredientName(e, index)}
                          value={ingredient.name}
                        />
                      </div>
                      <div className="floatLeft">
                        <Input
                          placeholder="množstvo"
                          onChange={(e) =>
                            handleAddIngredientQuantity(e, index)
                          }
                          value={ingredient.quantity}
                        />
                      </div>
                      <div className="floatLeft">
                        <Input
                          placeholder="jednotka"
                          onChange={(e) => handleAddIngredientUnit(e, index)}
                          value={ingredient.unit}
                        />
                      </div>
                      <div className="floatLeft">
                        <Button
                          color="red"
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          Odstrániť
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <Button
                  color="green"
                  type="button"
                  onClick={handleAddIngredient}
                >
                  Pridať
                </Button>
              </Form.Field>
              <Form.Field>
                <label>Youtube</label>
                <input type="text" value={youtube} onChange={updateYoutube} />
              </Form.Field>
              <Form.Field>
                <label>Tagy</label>
                <Typeahead
                  multiple
                  id="keep-menu-open"
                  onChange={tagOnChange}
                  options={tags}
                  placeholder="Vyberte tag..."
                  ref={typeaheadRef}
                  defaultSelected={selectedTag}
                  allowNew
                />
              </Form.Field>
              <Form.Field>
                <label className="requiredField">Popis</label>
                <Form.TextArea
                  rows="5"
                  value={description}
                  onChange={updateDescription}
                  placeholder="Popis"
                  required={true}
                  error={descriptionError}
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            color="blue"
            onClick={handleCreate.bind(handleCreate, false)}
            disabled={isInProgressCreateBool}
          >
            Uložiť
          </Button>
          <Button
            type="button"
            onClick={handleCancelCreate}
            disabled={isInProgressCreateBool}
          >
            Zrušiť
          </Button>
          {formError ? (
            <p style={{ color: "red", fontSize: "medium", float: "left" }}>
              {errorMessage}
            </p>
          ) : (
            <div></div>
          )}
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default NewRecipeModal;
