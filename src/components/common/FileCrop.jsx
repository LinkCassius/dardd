import React from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import AvatarEditor from "react-avatar-editor";
import CardAvatar from "./../../components/Card/CardAvatar.js";

class FileCrop extends React.Component {
  state = {
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg: this.props.defaultLogoUrl,
    file: null,
  };

  _handleZoomSlider = (e) => {
    const zoom = parseFloat(e.target.value);
    this.setState({ zoom });
  };
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  handleFileChange = (e) => {
    window.URL = window.URL || window.webkitURL;
    const file = e.target.files[0];
    let url = window.URL.createObjectURL(e.target.files[0]);
    ReactDom.findDOMNode(this.refs.in).value = "";
    let state = this.state;
    state.img = url;
    state.cropperOpen = true;
    state.file = file;
    this.cropFlag = true;
    this.setState(state);
  };
  _handleSave = (e) => {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      const crpImage = this.dataURLtoFile(croppedImg, this.state.file.name);
      let state = this.state;
      state.img = null;
      state.cropperOpen = false;
      state.croppedImg = croppedImg;
      state.file = crpImage;
      this.setState(state);
      this.props.onCropImage(crpImage);
    }
  };
  _handleCancel = () => {
    let state = this.state;
    state.cropperOpen = false;
    this.setState(state);
  };

  _setEditorRef = (editor) => {
    this.editor = editor;
  };
  render() {
    const imageUrl = this.cropFlag
      ? this.state.croppedImg
      : this.props.defaultLogoUrl;
    return (
      <div style={{ padding: 10 }}>
        <div
          className="avatar-photo"
          style={{
            height: this.props.avatarHeight,
            width: this.props.avatarWidth,
            // borderRadius: this.props.borderRadius
          }}
        >
          <input
            ref="in"
            type="file"
            accept="image/*"
            onChange={this.handleFileChange}
          />
          <div className="avatar-edit">
            {/* <span>Click to Pick Logo</span> */}
            {/* <i className="fa fa-camera" /> */}
          </div>
          {/* <img src={imageUrl} /> */}
          <CardAvatar profile>
            <a href="#pablo" onClick={(e) => e.preventDefault()}>
              {/* <img src={avatar} alt="..." /> */}
              <img src={imageUrl} alt="..." />
            </a>
          </CardAvatar>
        </div>
        {this.state.cropperOpen && (
          <div
            className="cropper-wrapper"
            style={{
              position: "fixed",
              top: 50,
              width: "300px",
              height: "300px",
              background: "rgba(200,200,200,.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 4,
            }}
          >
            <AvatarEditor
              ref={this._setEditorRef}
              image={this.state.img}
              height={this.props.croppedHeight}
              width={this.props.croppedWidth}
              borderRadius={this.props.croppedBorderRadius}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.state.zoom}
              rotate={0}
              border={this.props.croppedBoarder}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  marginRight: 10,
                  paddingBottom: 22,
                  fontWeight: 600,
                }}
              >
                Zoom
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.01"
                value={this.state.zoom}
                onChange={this._handleZoomSlider}
                style={{ width: 200 }}
              />
            </div>
            <div>
              <button
                className="btn btn-danger btn-sm"
                onClick={this._handleCancel}
              >
                Cancel
              </button>{" "}
              <button
                className="btn btn-primary btn-sm"
                onClick={this._handleSave}
              >
                Crop
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
FileCrop.propTypes = {
  onCropImage: PropTypes.func.isRequired,
  defaultLogoUrl: PropTypes.string.isRequired,
  avatarHeight: PropTypes.string.isRequired,
  avatarWidth: PropTypes.string.isRequired,
  croppedHeight: PropTypes.number.isRequired,
  croppedWidth: PropTypes.number.isRequired,
  croppedBoarder: PropTypes.number.isRequired,
  croppedBorderRadius: PropTypes.number.isRequired,
};
export default FileCrop;
