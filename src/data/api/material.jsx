import axios from '../../../axiosConfig';
import axiosConfig from '../../../axiosConfig'

export const apiGetMaterialList = async (payload) => {
    console.log(payload)
    const response = await axiosConfig(
        {
            method: 'post',
            url: '/it5023e/get_material_list',
            data: {
                token: payload.token,
                class_id: payload.class_id
            }
        });
    return response;
}

export const apiUploadMaterial = async (payload) => {
    var bodyFormData = new FormData();
    bodyFormData.append('file', payload.file)
    bodyFormData.append('token', payload.token)
    bodyFormData.append('classId', payload.classId)
    bodyFormData.append('title', payload.title)
    bodyFormData.append('description', payload.description)
    bodyFormData.append('materialType', payload.materialType)
    try {
        return await axiosConfig(
            {
                method: 'post',
                url: '/it5023e/upload_material',
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }
        )
    } catch (error) {
        if (!error.response) {
            return console.error("error uploading material: " + error)
        }
        return error.response
    }
}