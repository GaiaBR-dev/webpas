const GLPK = require('glpk.js');
const glpk = GLPK();

async function resolve(modelo,delta) {

    const turmasF1 = modelo.turmasf1 
    const turmasF12 = modelo.turmasf12
    const turmasF2 =  modelo.turmasf2
    const salas = modelo.salas
    const delta1 = delta

    const turmas = new Array().concat(turmasF1, turmasF12, turmasF2)

    const indiceDistancias = modelo.distancias.reduce((acc, cur) => {
        acc[cur.predio] = acc[cur.predio] ? acc[cur.predio] : {}
        acc[cur.predio] = {
            ...acc[cur.predio],
            [cur.departamento]: cur.valorDist
        }
        return acc
    }, {})

    const distanciasCalculadas = turmas.map((turma) => {
        return salas.map((sala) => {

            let departamentoUsado = turma.departamentoOferta
            if (turma.creditoAula == 2 && turma.departamentoTurma){
                departamentoUsado = turma.departamentoTurma
            }

            return  indiceDistancias[sala.predio][departamentoUsado]
 
        })
    })

    const options = {
        msglev: glpk.GLP_MSG_ALL,
        presol: true,
        cb: {
            call: progress => console.log(progress),
            each: 1
        }
    }

    function getVariables() {
        let result = new Array
        let indiceResult = 0

        for (let i = 0; i < turmasF1.length + turmasF12.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = { name: `t${i + 1}s${j + 1}h1`, coef: distanciasCalculadas[i][j] }
                indiceResult++
            }
        }
        for (let i = turmasF1.length; i < turmas.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = { name: `t${i + 1}s${j + 1}h2`, coef: distanciasCalculadas[i][j] }
                indiceResult++
            }
        }
        return result
    }

    function getConstraints() {
        let result = new Array
        let indiceResult = 0

        for (let i = 0; i < turmasF1.length + turmasF12.length; i++) {
            let varsSoma = new Array
            indiceVars = 0
            for (let j = 0; j < salas.length; j++) {
                varsSoma[indiceVars] = { name: `t${i + 1}s${j + 1}h1`, coef: 1 }
                indiceVars++
            }
            result[indiceResult] = {
                name: `travaTurma${i + 1}VariaSalaH1`,
                vars: varsSoma,
                bnds: { type: glpk.GLP_FX, ub: 1.0, lb: 1.0 }
            }
            indiceResult++
        }
        for (let i = turmasF1.length; i < turmas.length; i++) {
            let varsSoma = new Array
            indiceVars = 0
            for (let j = 0; j < salas.length; j++) {
                varsSoma[indiceVars] = { name: `t${i + 1}s${j + 1}h2`, coef: 1 }
                indiceVars++
            }
            result[indiceResult] = {
                name: `travaTurma${i + 1}VariaSalaH2`,
                vars: varsSoma,
                bnds: { type: glpk.GLP_FX, ub: 1.0, lb: 1.0 }
            }
            indiceResult++
        }
        for (let j = 0; j < salas.length; j++) {
            let varsSomaH1 = new Array
            let varsSomaH2 = new Array
            indiceVarsH1 = 0
            indiceVarsH2 = 0

            for (let i = 0; i < turmasF1.length + turmasF12.length; i++) {
                varsSomaH1[indiceVarsH1] = { name: `t${i + 1}s${j + 1}h1`, coef: 1 }
                indiceVarsH1++
            }
            result[indiceResult] = {
                name: `variaTurmaTravaSala${j + 1}H1`,
                vars: varsSomaH1,
                bnds: { type: glpk.GLP_UP, ub: 1.0, lb: 0.0 }
            }
            indiceResult++

            for (let i = turmasF1.length; i < turmas.length; i++) {
                varsSomaH2[indiceVarsH2] = { name: `t${i + 1}s${j + 1}h2`, coef: 1 }
                indiceVarsH2++
            }
            result[indiceResult] = {
                name: `variaTurmaTravaSala${j + 1}H2`,
                vars: varsSomaH2,
                bnds: { type: glpk.GLP_UP, ub: 1.0, lb: 0.0 }
            }
            indiceResult++
        }
        for (let i = turmasF1.length; i < turmasF1.length + turmasF12.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = {
                    name: `t${i + 1}s${j + 1}h1-t${i + 1}s${j + 1}h2`,
                    vars: [
                        { name: `t${i + 1}s${j + 1}h1`, coef: 1 },
                        { name: `t${i + 1}s${j + 1}h2`, coef: -1 }
                    ],
                    bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 }
                }
                indiceResult++
            }
        }
        for (let i = 0; i < turmasF1.length + turmasF12.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = {
                    name: `capacidade-t${i + 1}s${j + 1}h1`,
                    vars: [
                        { name: `t${i + 1}s${j + 1}h1`, coef: turmas[i].totalTurma - salas[j].capacidade + delta1}
                    ],
                    bnds: { type: glpk.GLP_UP, ub: 0.0, lb: 0.0 }
                }
                indiceResult++
            }
        }
        for (let i = turmasF1.length; i < turmas.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = {
                    name: `capacidade-t${i + 1}s${j + 1}h2`,
                    vars: [
                        { name: `t${i + 1}s${j + 1}h2`, coef: turmas[i].totalTurma - salas[j].capacidade + delta1 }
                    ],
                    bnds: { type: glpk.GLP_UP, ub: 0.0, lb: 0.0 }
                }
                indiceResult++
            }
        }

        return result
    }

    function getBinaries() {
        let result = new Array
        let indiceResult = 0
        for (let i = 0; i < turmasF1.length + turmasF12.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = `t${i + 1}s${j + 1}h1`
                indiceResult++
            }
        }
        for (let i = turmasF1.length; i < turmas.length; i++) {
            for (let j = 0; j < salas.length; j++) {
                result[indiceResult] = `t${i + 1}s${j + 1}h2`
                indiceResult++
            }
        }
        return result
    }

    function generateModel() {
        varsPAS = getVariables()
        constraintsPAS = getConstraints()
        binariesPAS = getBinaries()
        console.log(varsPAS)

        result = {
            name: 'ModeloPAS',
            objective: {
                direction: glpk.GLP_MIN,
                name: 'obj',
                vars: varsPAS
            },
            subjectTo: constraintsPAS,
            binaries: binariesPAS
        }
        return result
    }


    modeloPAS = generateModel()
    const res = glpk.solve(modeloPAS, options)

    function removeZeros(obj) {
        for (var property in obj.result.vars) {
            if (obj.result.vars[property] == 0) {
                delete obj.result.vars[property];
            }
        }
    }

    removeZeros(res)
    return res

}

exports.resolve = resolve