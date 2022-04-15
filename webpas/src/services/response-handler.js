const handleServerResponses = (response,setNotify) =>{
    if (response.status == 200){
        setNotify({
            isOpen:true,
            message: response.data,
            type:'success'
        })
    }else{
        setNotify({
            isOpen:true,
            message: response?.response?.data,
            type:'error'
        })
    }
}

export default handleServerResponses;