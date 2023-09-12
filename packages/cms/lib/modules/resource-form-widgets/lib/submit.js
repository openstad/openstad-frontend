const rp = require('request-promise');
const eventEmitter  = require('../../../../events').emitter;
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = async function(self, options) {


  // Almost identical  to proxy,
  // Server side validation is done by the API
  // In future form can probably talk directly with api proxy,
  // Only images need to be refactored
  self.route('post', 'submit', upload.any('docFilePond'), async function(req, res) {
    // emit event
    eventEmitter.emit('resourceCrud');

    /**
     * Format API Url
     */
    const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
    const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
    const siteId = req.data.global.siteId;
    
    const postUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint}`;
    const getUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint}/${req.body.resourceId}`;

    /**
     * Format headerr
     */
    const httpHeaders = {
        'Accept': 'application/json',
    };

    if (req.session.jwt) {
      httpHeaders['X-Authorization'] = `Bearer ${req.session.jwt}`;
    }
    const data = req.body;
    data.extraData = data.extraData ? data.extraData : {};


    if(req.files) {
      console.log({files: req.files});
      const promises = [];
      req.files.forEach((file, i) => {
        const attachmentsPath = 'public/uploads/attachments/resource-form-uploads/' + req.body.resourceId;
        const path = `${attachmentsPath}/${file.originalname}`;
  
          if(fs.existsSync(attachmentsPath) === false) {
              fs.mkdirSync(attachmentsPath, { recursive: true });
          }
  
          promises.push(
              new Promise( (resolve,reject) => {
                  const fileCopy = {name: file.originalname, url: path}
                  // existing files are ignored; it  is more then likely the same file
                  fs.access(path, fs.constants.F_OK, (err) => {
                  if (!err) {
                      return resolve(fileCopy)
                  };
                  console.log('Create file', file.originalname);
                  fs.writeFile(path, file.buffer, err => {
                      err ? reject(err) : resolve(fileCopy)
                  });
                  });
              })
          );
      });

      const results = await Promise.all(promises);


      const httpHeaders = {
        'Accept': 'application/json',            
        'Content-Type': 'application/json',
      };

      if (req.session.jwt) {
        httpHeaders['X-Authorization'] = `Bearer ${req.session.jwt}`;
      }
  
    const response = await fetch(getUrl, {
        headers: httpHeaders
    });

    if(response.ok) {
        const idea = await response.json();
        try {
            let files = results.map(file => 
              Object.assign({}, {...file, url: file.url.replace("public", siteUrl)}));

            if(idea.extraData && idea.extraData.budgetDocuments) {
              try {
                const existingIdeaBudgets = JSON.parse(idea.extraData.budgetDocuments);
                files = files.concat(existingIdeaBudgets);
              } catch(e) {
                
              }
            }
        
        data.extraData.budgetDocuments = JSON.stringify(files);
      }catch(e) {
        console.error("Budget documenten konden niet worden geupload");
      }
    } 
   }

    //format image
    if (data.image) {
      // when only one image filepondjs sadly just returns object, not array with one file,
      // to make it consistent we turn it into an array
      let images = data.image && typeof data.image === 'string' ? [data.image] : data.image;

      // format images
      images = images ? images.map(function(image) {
        image = JSON.parse(image);
        return image ? image.url : '';
      }) : [];

      // add the formatted images
      data.extraData.images = images;

      //clean up data object
      delete data.image;
   } else {
     data.extraData.images = [];
   }

    if (req.body.resourceType === 'submission') {
      data.submittedData = data.extraData;
      delete data.extraData;
    }

    const options = {
        method: req.body.resourceId ? 'PUT' : 'POST',
        uri: req.body.resourceId ? `${postUrl}/${req.body.resourceId}` : postUrl,
        headers: httpHeaders,
        body: data,
        json: true // Automatically parses the JSON string in the response
    };

    rp(options)
    .then(function (response) {
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify({
         id: response.id
       }));
    })
    .catch(function (err) {
      console.error('err', err);
      let message = '';
      let statusCode = 500;

      if(err.hasOwnProperty("error") && !Array.isArray(err.error)) {
        message = err.error.message;
        statusCode = err.statusCode;
      } else if(err.hasOwnProperty("error")) {
        message = err.error[0];
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode).end(JSON.stringify({
        msg: message
      }));
    });
  });
}
