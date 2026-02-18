import React, { Component } from "react";
import L from "leaflet";

import { Map, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  MAP_ZOOM,
  MAP_MAX_ZOOM,
  MAP_CENTER_COORDINATES,
} from "../../views/constants";

import { Row, Col, Card, CardBody, Form, CardHeader } from "reactstrap";

class LocationMap extends Component {
  state = {
    location: {
      lat: -10.81881,
      lng: 70.16596,
    },
    haveUsersLocation: false,
    zoom: 3,
    userMessage: {
      name: "",
      serialno: "",
    },

    messages: [],
    Latitude: "",
    Longitude: "",
  };

  componentDidMount() {
    const { Latitude, Longitude } = this.props;
    console.log("map Latitude , Longitude : ", Latitude, Longitude);
    const map = this.leafletMap.leafletElement;

    let bounds = new L.LatLngBounds();
    let latLng = new L.latLng(Latitude, Longitude);
    bounds.extend(latLng);
    map.fitBounds(bounds);
    /*
    map.on("click", (e) => {
      geocoder.reverse(
        e.latlng,
        map.options.crs.scale(map.getZoom()),
        (results) => {
          var r = results[0];
          console.log("r : ", r);

          if (r) {
            // if (marker) {
            //   marker
            //     .setLatLng(r.center)
            //     .setPopupContent(r.html || r.name)
            //     .openPopup();
            // } else
            {
              marker = L.marker(r.center)
                .bindPopup(r.name)
                .addTo(map)
                .openPopup();
            }
          }
        }
      );
    });
*/
    this.addMarker();
  }

  addMarker() {
    const { Latitude, Longitude } = this.props;
    const map = this.leafletMap.leafletElement;
    const geocoder = L.Control.Geocoder.nominatim();
    let marker;
    let achenSvgString;
    let myIconUrl;
    var mySVGIcon;
    achenSvgString =
      "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0px' y='0px' viewBox='0 0 54.6 51.6' style='enable - background: new 0 0 54.6 51.6;'><path stroke='black' stroke-width='2'  fill='#FF0000' d='M2.2,25.8c0,13.9,11.3,25.1,25.1,25.1s25.1-11.3,25.1-25.1S41.2,0.7,27.3,0.7S2.2,11.9,2.2,25.8'/></svg>";
    myIconUrl = encodeURI("data:image/svg+xml," + achenSvgString).replace(
      "#",
      "%23"
    );

    mySVGIcon = L.icon({
      iconUrl: myIconUrl,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    let latLng = new L.latLng(Latitude, Longitude);

    geocoder.reverse(
      latLng,
      map.options.crs.scale(map.getZoom()),
      (results) => {
        var r = results[0];
        if (r) {
          if (
            Latitude !== "0" &&
            Longitude !== "0" &&
            Latitude !== "0.0" &&
            Longitude !== "0.0" &&
            Latitude &&
            Longitude
          ) {
            marker = L.marker(new L.LatLng(Latitude, Longitude), {
              draggable: false,
              icon: mySVGIcon,
            })
              .bindPopup(r.name)
              .addTo(map)
              .openPopup();
          } else {
            marker = L.marker(new L.LatLng(Latitude, Longitude), {
              draggable: false,
              icon: mySVGIcon,
            })
              .bindPopup("Location Not Available")
              .addTo(map)
              .openPopup();
          }
        }
      }
    );
  }

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    // const position = [this.state.location.lat, this.state.location.lng];

    // const { Latitude, Longitude } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col sm={12} md={12} style={{ flexBasis: "auto" }}>
            <Card>
              <CardHeader>
                <strong>{this.props.mapHeader}</strong>
                <span
                  className="close-icon fa fa-times"
                  onClick={this.handleCancel.bind(this)}
                />
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <div
                    className="text-center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Map
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: window.innerHeight - 177,
                      }}
                      attributionControl={false}
                      worldCopyJump={false}
                      center={MAP_CENTER_COORDINATES}
                      zoom={MAP_ZOOM}
                      maxZoom={MAP_MAX_ZOOM}
                      ref={(m) => {
                        this.leafletMap = m;
                      }}
                    >
                      <TileLayer
                        // attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors and Chat location by Iconika from the Noun Project"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* <Marker
                        position={[Latitude, Longitude]}
                        icon={messageIcon}
                      ></Marker> */}
                    </Map>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LocationMap;
