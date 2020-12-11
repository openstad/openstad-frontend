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
          console.log('fileItem', fileItem)
          const file = fileItem.file;
          const url = fileItem.serverId && fileItem.serverId.url ? fileItem.serverId.url : fileItem.serverId;

          console.log('fileItem.id', url)
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
