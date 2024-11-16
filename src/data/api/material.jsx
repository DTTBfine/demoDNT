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