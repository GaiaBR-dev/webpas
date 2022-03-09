const handleServerResponses = (type,response,setNotify) =>{
    if (response.status == 200){
        if (type == 'add' || type =='update' || type == 'delete'){
            setNotify({
                isOpen:true,
                message: response.data,
                type:'success'
            })
        }else if(type =='err'){
            console.log(response)
            setNotify({
                isOpen:true,
                message: 'erro bizarro',
                type:'error'
            })
        }
    }else{
        console.log(response)
        setNotify({
            isOpen:true,
            message: 'erro bizarro',
            type:'error'
        })
    }
}

export default handleServerResponses;