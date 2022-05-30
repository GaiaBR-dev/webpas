const handleServerResponses = (collection,response,setNotify) =>{
    if (response.status == 200){
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
            if (response.response.data.code == 1){
                setNotify({
                    isOpen:true,
                    message: response.response.data.msg,
                    type:'error'
                })
            }else if (response.response.data.code == 11000){
                let salaError = response.response.data.writeErrors[0].op.numeroSala
                let predioError = response.response.data.writeErrors[0].op.predio
                setNotify({
                    isOpen:true,
                    message: `A sala "${salaError}" do prédio "${predioError}" já está cadastrada no banco de dados.
                    As demais salas foram inseridas com sucesso`,
                    type:'warning'
                })
            }

        }else if (collection = 'distancias'){
            if (response.response.data.code == 1){
                setNotify({
                    isOpen:true,
                    message: response.response.data.msg,
                    type:'error'
                })
            }else if (response.response.data.code == 11000){
                let departamentoError = response.response.data.writeErrors[0].op.departamento
                let predioError = response.response.data.writeErrors[0].op.predio
                setNotify({
                    isOpen:true,
                    message: `A distância do prédio "${predioError}" para o departamento ${departamentoError} já está cadastrada no banco de dados.
                    As demais distâncias foram inseridas com sucesso`,
                    type:'warning'
                })
            }
        }
    }
}

export default handleServerResponses;