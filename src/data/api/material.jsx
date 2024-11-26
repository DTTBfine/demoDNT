import axios from '../../../axiosConfig';
import axiosConfig from '../../../axiosConfig'

export const apiGetMaterialList = async (payload) => {
    console.log(payload)
    const response = await axiosConfig(
        {
            method: 'post',
            url: `/it5023e/get_material_list`,
            data: {
                token: payload.token,
                class_id: payload.class_id
            }
        });
    return response;
}

export const apiGetMaterialInfo = async (payload) => {
    console.log(payload)
    const response = await axiosConfig(
        {
            method: 'post',
            url: `/it5023e/get_material_info`,
            data: {
                token: payload.token,
                material_id: payload.material_id
            }
        });
    return response;
}

export const apiUploadMaterial = async (payload) => {
    var bodyFormData = new FormData();
    for (const key in payload) {
        if (payload[key]) {
            bodyFormData.append(key, payload[key])
        }
    }
    console.log("body: " + JSON.stringify(bodyFormData))
    try {
        const response = await axiosConfig(
            {
                method: 'post',
                url: '/it5023e/upload_material',
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }
        )
        console.log("response: " + JSON.stringify(response.data))
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("error uploading material: " + error)
        }
        return error.response
    }
}

export const apiEditMaterial = async (payload) => {
    console.log(payload)
    //như upload
}

export const apiDeleteMaterial = async (payload) => {
    try {
        const response = await axiosConfig(
            {
                method: 'post',
                url: `/it5023e/delete_material`,
                data: {
                    token: payload.token,
                    material_id: payload.material_id
                }
            });
        return response;
    } catch (error) {
        if (!error.response) {
            return console.error("delete material failed: " + error)
        }
        return error.response
    }
    
}