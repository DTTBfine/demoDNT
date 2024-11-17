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
    const response = await axiosConfig(
        {
            method: 'post',
            url: '/it5023e/upload_material',
            data: {
                file: payload.file,
                token: payload.token,
                classId: payload.classId,
                title: payload.title,
                description: payload.description,
                materialType: payload.materialType
            }
        }
    )
    return response
}