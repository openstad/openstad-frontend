const rp = require('request-promise');
const eventEmitter = require('../../../../events').emitter;
const multer = require('multer');
const fs = require('fs');
const fetch = require('node-fetch');
const createHash = require('crypto').createHash;
const fileType = require('file-type');
const upload = multer();

module.exports = async function (self, options) {
  // Almost identical  to proxy,
  // Server side validation is done by the API
  // In future form can probably talk directly with api proxy,
  // Only images need to be refactored
  self.route(
    'post',
    'submit',
    upload.any('docFilePond'),
    async function (req, res) {
      const sessionSecret = process.env.SESSION_SECRET;
      res.setHeader('Content-Type', 'application/json');

      eventEmitter.emit('resourceCrud');
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
      const siteId = req.data.global.siteId;

      const postUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint}`;

      /**
       * Format headerr
       */
      const httpHeaders = {
        Accept: 'application/json',
      };

      if (req.session.jwt) {
        httpHeaders['X-Authorization'] = `Bearer ${req.session.jwt}`;
      }
      const data = req.body;
      data.extraData = data.extraData ? data.extraData : {};

      const appendFilesToResource = async (resourceId) => {
        const getUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint}/${resourceId}`;

        if (req.files) {
          const promises = [];
          req.files.forEach((file, i) => {
            const attachmentsPath =
              'public/uploads/attachments/resource-form-uploads/' + resourceId;
  
            const nameHash = createHash('sha256')
              .update(sessionSecret + Date.now().toString(), 'utf8')
              .digest('hex');
  
            const path = `${attachmentsPath}/${nameHash}`;
  
            if (fs.existsSync(attachmentsPath) === false) {
              fs.mkdirSync(attachmentsPath, { recursive: true });
            }
  
            promises.push(
              new Promise((resolve, reject) => {
                const fileCopy = { name: file.originalname, url: path };
                // existing files are ignored; it  is more then likely the same file
                fs.access(path, fs.constants.F_OK, (err) => {
                  if (!err) {
                    return resolve(fileCopy);
                  }
  
                  fileType
                    .fromBuffer(file.buffer)
                    .then((type) => {
                      const isAllowed = [
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.ms-excel',
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        '.docx',
                        '.doc',
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        '.ppt',
                        '.pptx'
                      ].includes(type.mime);
  
                      if (isAllowed) {
                        console.log('Create file', file.originalname);
                        fs.writeFile(path, file.buffer, (err) => {
                          err ? reject(err) : resolve(fileCopy);
                        });
                      } else {
                        reject(new Error('File type not allowed'));
                      }
                    })
                    .catch(() => reject(new Error('File type not allowed')));
                });
              })
            );
          });
  
          try {
            const results = await Promise.all(promises);
            let files = results.map((file) =>
              Object.assign(
                {},
                {
                  ...file,
                  url: file.url.replace('public', siteUrl),
                  date: Date.now(),
                  username: data.username,
                }
              )
            );
  
            const httpHeaders = {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            };
  
            if (req.session.jwt) {
              httpHeaders['X-Authorization'] = `Bearer ${req.session.jwt}`;
            }
  
            if (resourceId) {
              const response = await fetch(getUrl, {
                headers: httpHeaders,
              });
  
              if (response.ok) {
                const idea = await response.json();
  
                if (idea.extraData && idea.extraData.budgetDocuments) {
                  try {
                    const existingIdeaBudgets = JSON.parse(
                      idea.extraData.budgetDocuments
                    );
                    files = files.concat(existingIdeaBudgets);
                  } catch (e) {}
                }
              }
            }
            try {
              data.extraData.budgetDocuments = JSON.stringify(files);
            } catch (e) {
              console.error('Budget documenten konden niet worden geupload');
            }
          } catch (error) {
            return res.status(400).send(
              JSON.stringify({
                msg: error.message,
              })
            );
          }
        }  
      }

   
      //format image
      if (data.image) {
        // when only one image filepondjs sadly just returns object, not array with one file,
        // to make it consistent we turn it into an array
        let images =
          data.image && typeof data.image === 'string'
            ? [data.image]
            : data.image;

        // format images
        images = images
          ? images.map(function (image) {
              image = JSON.parse(image);
              return image ? image.url : '';
            })
          : [];

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

      if(req.body.resourceId) {
        await appendFilesToResource(req.body.resourceId);
      }

      const options = (resourceId) => ({
        method: resourceId ? 'PUT' : 'POST',
        uri: resourceId
          ? `${postUrl}/${resourceId}`
          : postUrl,
        headers: httpHeaders,
        body: data,
        json: true, // Automatically parses the JSON string in the response
      });

      rp(options(req.body.resourceId))
        .then(async function (response) {
          if(!req.body.resourceId) {
            try {
              await appendFilesToResource(response.id);
              rp(options(response.id));
            } catch (err) {
              console.log("Something went wrong while uploading the files")
            }
          }
          res.end(
            JSON.stringify({
              id: response.id,
            })
          );
        })
        .catch(function (err) {
          console.error('err', err);
          let message = '';
          let statusCode = 500;

          if (err.hasOwnProperty('error') && !Array.isArray(err.error)) {
            message = err.error.message;
            statusCode = err.statusCode;
          } else if (err.hasOwnProperty('error')) {
            message = err.error[0];
          }

          res.status(statusCode).end(
            JSON.stringify({
              msg: message,
            })
          );
        });
    }
  );
};
