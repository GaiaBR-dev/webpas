const excelToJson = require('convert-excel-to-json');

function xlstojson(){
    'use strict';
    
    const result = excelToJson({
        sourceFile: 'Pasta1.xlsx',
        sheets:[{
            name: 'Info',
            header:{
                rows: 1
            },
            columnToKey: {
                A: 'idTurma', 
                B: 'campus', 
                C: 'departamentoTurma', 
                D: 'codDisciplina',
                E: 'turma',
                F: 'nomeDisciplina',
                H: 'totalTurma',
                I: 'departamentoOferta',
                J: 'diaDaSemana',
                K: 'horarioInicio',
                L: 'horarioFim',
                M: 'alocadoChefia',
                N: 'creditoAula',
                O: 'creditoPratico',
                Q: 'docente'
            }
        },{
            name: 'Salas',
            header:{
                rows: 1
            },
            columnToKey: {
                A: 'predio',
                B: 'numeroSala',
                C: 'capacidade',
                D: 'disponivelManha',
                E: 'disponivelTarde',
                F: 'disponivelNoite'
            }
        },{
            name: 'Distancia',
            header:{
                rows: 1
            },
            columnToKey: {
                A: 'predio',
                B: 'departamento',
                C: 'valorDist'
            }
        }]
    });

    return result

}

exports.xlstojson = xlstojson