import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
// core components
import auth from "./../../auth";
import { ApiEndPoints } from "../../config";
import CustomInput from "./../../components/CustomInput/CustomInput.js";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardAvatar from "./../../components/Card/CardAvatar.js";
import CardBody from "./../../components/Card/CardBody.js";
import CardFooter from "./../../components/Card/CardFooter.js";
import TopNavbar from "../../components/Header/top.navbar";
import Footer from "../../components/Footer/footer";
import avatar from "./../../assets/images/demo/users/face1.jpg";
import Button from "../../components/CustomButtons/Button.js";
import { siteConfig } from "../../config";

// const imagePathUrl = "https://tdapwebapi.azurewebsites.net/images/" + "users/";
// const imagePathUrl = "http://localhost:5008/images/" + "users/";

const imagePathUrl = siteConfig.userImagesPath;

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",

    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const initialUserState = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    userName: "",
    imageName: "",
    imageUrl: "",
    postalCode: "",
    city: "",
    country: "",
  };
  const [User, setUser] = useState(initialUserState);
  const [hasError, setErrors] = useState(false);

  const updateUser = (rUser) => {
    setUser({
      firstName: rUser.result.firstName,
      lastName: rUser.result.lastName,
      phone: rUser.result.phone,
      email: rUser.result.email,
      userName: rUser.result.userName,
      imageName: rUser.result.imageName,
      imageUrl: imagePathUrl + rUser.result.imageName,
      postalCode: "Private Bag X11219, Mbombela, 1200",
      city: "Mbombela",
      country: "South Africa",
    });
  };

  async function fetchData() {
    const res = await fetch(
      ApiEndPoints.user + "/" + auth.getCurrentUser()._id,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    );
    res
      .json()
      .then((res) => updateUser(res))
      .catch((err) => setErrors(err));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {};
  const handleChange = (e) => {
    e.preventDefault();
  };
  const onCropImage = (e) => {};
  return (
    <div className="card">
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
            <h4 className="cardCategoryWhite cardTitleWhite">User Profile</h4>
              {/* <p className={classes.cardCategoryWhite}>Card</p> */}
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    value={User.firstName || ""}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    type="text"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    value={User.lastName || ""}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    type="text"
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                {/* <GridItem xs={12} sm={12} md={4}>
                              <CustomInput
                                labelText="Username"
                                id="username"
                                value={User.userName || ''}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                type="text"
                              />
                            </GridItem> */}
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    value={User.email || ""}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    type="text"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Phone"
                    id="phone"
                    value={User.phone || ""}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    type="text"
                  />
                </GridItem>
              </GridContainer>
              {/* <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                              <CustomInput
                                labelText="City"
                                id="city"
                                value={User.city || ''}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                type="text"
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                              <CustomInput
                                labelText="Country"
                                id="country"
                                value={User.country || ''}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                type="text"
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                              <CustomInput
                                labelText="Postal Code"
                                id="postal-code"
                                value={User.postalCode || ''}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                type="text"
                              />
                            </GridItem>
                          </GridContainer> */}
            </CardBody>
            <CardFooter>
              {/* <Button color="primary">Update Profile</Button> */}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                {/* <img src={avatar} alt="..." /> */}
                <img src={User.imageUrl} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardCategory}>
                {auth.getCurrentUser().role}
              </h4>
              {/* <h4 className={classes.cardTitle}>
                {User.firstName} {User.lastName}
              </h4> */}
              <p className={classes.description}>
                {/*  The key to being the best person you can actually become is to
                start loving yourself more. You deserved to be loved just like
                anyone else in this universe that we are living in, God bless
                you.
               Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is... */}
              </p>
              {/* <Button color="primary" >
                            Edit
              </Button> */}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
