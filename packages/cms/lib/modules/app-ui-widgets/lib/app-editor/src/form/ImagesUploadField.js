import React, { Component } from 'react';
import "leaflet/dist/leaflet.css";
import { FilePond, registerPlugin } from 'react-filepond';
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';



registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFilePoster, FilePondPluginFileValidateType)

class ImageUploadField extends Component {
    constructor(props) {
      super(props);

      this.state = {
        images: []
      };
    }

    handleInit() {
      const currentImages = this.props.images ? this.props.images.map(function (image) {
        return {
          source: {url: image},
          options: {
            type: "local",
            file: {
                name: image,
           //		 size: 3001025,
             //	 type: 'image/png'
           },
            metadata: {
              poster: image,
            }
          },
        }
      }) : false;

      this.setState({
        images: currentImages
      })
    }

    updateImages(images, newImage) {
      if (images) {
      images = images
        .filter(function (fileItem) {
          return fileItem.serverId;
        })
        .map(function (fileItem) {
          const file = fileItem.file;
          const url = fileItem.serverId && fileItem.serverId.url ? fileItem.serverId.url : fileItem.serverId;
          return url;
        });

        if (newImage) {
          images = [newImage].concat(images);
        }

        this.props.update(images);
      }
    }

    render () {
      console.log('this.state.images', this.state.images);

      return (
        <div>
          <FilePond
            ref={ref => (this.pond = ref)}
            onupdatefiles={fileItems => {
              // Set currently active file objects to this.state
              this.setState({
                images: fileItems.map(fileItem => fileItem.file)
              });
            }}
            files={this.state.images}
            acceptedFileTypes={['image/png', 'image/jpeg']}
            allowMultiple={true}
            allowReorder={true}
            maxFiles={10}
            oninit={() => this.handleInit()}
            server={{
              process: {
                url: '/image',
                onload: (response) => { // Once response is received, pushed new value to Final Form value variable, and populate through the onChange handler.
                  const file = JSON.parse(response);
                  this.updateImages(this.pond.getFiles(), file);
                  return JSON.parse(response).url;
                },
                onerror: (response) => {
                  return false;
                }
              }
            }}
            onremovefile={(error, file) => {
              this.updateImages(this.pond.getFiles());
            }}
            onreorderfiles={(files, origin, target) => {
              this.updateImages(this.pond.getFiles());
            }}
            maxTotalFileSize="10MB"
            imagePreviewMinHeight={22}
            imagePreviewMaxHeight={100}
            name="image"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      );
  }
}

export default ImageUploadField;

