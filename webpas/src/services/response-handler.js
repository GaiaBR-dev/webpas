const handleServerResponses = (type,response,setNotify) =>{
    if (response.status == 200){
        if (type == 'add' || type =='update' || type == 'delete'){
            setNotify({
                isOpen:true,
                message: response.data,
                type:'success'
            })
        }else if(type =='error'){
            console.log(response)
            setNotify({
                isOpen:true,
                message: response?.response?.data,
                type:'error'
            })
        }
    }else{
        console.log(response.response)
        setNotify({
            isOpen:true,
            message: response?.response?.data,
            type:'error'
        })
    }
}

export default handleServerResponses;