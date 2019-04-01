const fs = require('fs')

const extractImage = async (htmlString, replacementURL) => {
  const BASE64_STRING = /src="(data:image\/[^;]+;base64[^"]+)"/
  const images = htmlString.match(BASE64_STRING)
  return images
}


const saveImage = async (imageString, articleId, imageName) => {
  const testExpression = RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$')

  const extension = imageString.split(';')[0].match(/jpeg|png|gif/)[0]
  const image     = imageString.replace(/^data:image\/[^;]base64,/, "")

  console.log(image)

  const filePath = `${__basedir}/public/images/articles/${articleId}`
  const fileName = `${imageName}.${extension}`

  return fs.mkdir(filePath, (err) => {
    try {
      return fs.writeFile(`${filePath}/${fileName}`, image, 'base64', (err, result) => {
        if(err) {
          return err
        }
        return result       
      })
    } catch (error) {
      console.log('Failed.', error)
      return {
        error: {
          code: 'IOErrror',
          message: 'Failed to save image.',
          stack: error
        }
      }
    }
  })
}


module.exports = {
  extractImage,
  saveImage
}