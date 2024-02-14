import client from "./client";
import { catchError, getToken } from "../utils/helper";

export const uploadTrailer =async(formData,onUploadProgress)=>{
    const token = getToken();
    try{
        const {data} = await client.post('/movie/upload-trailer',formData,{
            headers:{
                authorization:'Bearer ' + token,
                'content-type':'multipart/form-data'
            },
            onUploadProgress:({loaded,total})=>{
                if(onUploadProgress) onUploadProgress(Math.floor((loaded/total)*100))
            }
        });
            return data;
        }
    catch(error){
            return catchError(error)
        }
}

export const uploadMovie =async(formData)=>{
    const token = getToken();
    try{
        const {data} = await client.post('/movie/create',formData,{
            headers:{
                authorization:'Bearer ' + token,
                'content-type':'multipart/form-data'
            },
        });
            return data;
        }
    catch(error){
            return catchError(error)
        }
}

export const getMovies =async(pageNo,limit)=>{
    const token = getToken();
    try{
        const {data} = await client.get(`/movie/movies?pageNo=${pageNo}&limit=${limit}`,{
            headers:{
                authorization:'Bearer ' + token,
                'content-type':'multipart/form-data'
            },
        });
            return data;
     }
    catch(error){
            return catchError(error)
    }
}