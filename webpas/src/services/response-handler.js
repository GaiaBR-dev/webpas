const handleServerResponses = (collection,response,setNotify) =>{
    if (response.status == 200){
        console.log(response)
        setNotify({
            isOpen:true,
            message: response.data,
            type:'success'
        })
    }else{
        if(collection === 'turmas'){
            if (response.response.data.code == 11000){
                let turmaError = response.response.data.writeErrors[0].op.turma
                let disciplinaError = response.response.data.writeErrors[0].op.nomeDisciplina
                setNotify({
                    isOpen:true,
                    message: `A turma "${turmaError}" da disciplina "${disciplinaError}" já está cadastrada no banco de dados.
                    As demais turmas foram inseridas com sucesso`,
                    type:'warning'
                })
            }else if (response.response.data.code == 3){
                setNotify({
                    isOpen:true,
                    message: response.response.data.msg,
                    type:'error'
                })
            }
            else{
            setNotify({
                isOpen:true,
                message: response?.response?.data.code,
                type:'error'
            })}
        }else if (collection === 'salas'){

        }
    }
}

export default handleServerResponses;