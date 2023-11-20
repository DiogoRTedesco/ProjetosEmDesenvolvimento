import axios from 'axios';


export const api = axios.create({
    baseURL: process.env.REACT_APP_API,
})
/*return {
            user: { id: 3, name: 'Jose', email: 'jose@gmail.com', ValorPerfil: 5 }
        }*/
export const useApi = () => ({
    validadeToken: async (token) => {

        const response = await api.get('validate', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(error => {
            alert(`Failed to validate token: ${error}`);
        });

        return response.data;


    },
    signin: async (usuario, senha) => {
        /*return {
            user: { id: 3, name: 'Jose', email: 'jose@gmail.com', ValorPerfil: 5},
            token: '123456789'
        }*/
        const response = await api.post('/signin', { usuario, senha }).then().catch(err => { alert(err.response.data) });
        return response.data

    },
    logout: async () => {
        return { status: true }

        //const response = await api.post('/logout');
        //return response.data;
    }

})