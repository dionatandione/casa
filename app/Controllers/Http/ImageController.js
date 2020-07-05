'use strict'

const Helpers = use('Helpers')
const Property = use('App/Models/Property')

class ImageController{

  async show({params, response}){
    return response.download(Helpers.tmpPath(`imagens/${params.path}`))
  }

  async store({params, request}){
    const property = await Property.findOrFail(params.id)

    const images = request.file('image',{
      types:['image'],
      size:'5mb' 
    })

    await images.moveAll(Helpers.tmpPath('imagens'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.movedAll()) {
      return images.errors()
    }

    await Promise.all(
      images
        .movedList()
        .map(image => property.images().create({ path: image.fileName }))
    )
  }
}

module.exports = ImageController