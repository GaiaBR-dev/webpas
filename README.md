# WebPAS
Software web para resolução do problema de alocação de salas

## TODO

#### Backend:
- Implementar modelo de "configuração", permintindo que usuários determinem alguns parametros de execução.
- Re-fazer lógica de modelagem e resolução do modelo para levar em conta as configurações determinadas pelo usuário.
- Garantir "assincronissidade" da resolução.
- Implementar login e autenticação. 
- Implementar uma função que verifica se todas as distâncias entre os prédios e departamentos estão cadastradas. Implementar trava para impedir execução do solver caso não estejam.
- Tirar o ATX do banco e implementar na lógica de programação do servidor, permitindo que a escolha de uso ou não do ATX seja um parametro definido pelo usuário.
- Implementar tratamento de resultados não ótimos.

#### Frontend
- Melhorar (terminar) view de Prédios.
- Melhorar view de Turmas.
- Implementar view de Distâncias.
- Implementar aviso sobre ausencia de cadastro de distâncias.
- Implementar view do Solver.
- Implementar view de Resultados. (Diferentes formas de agenda).
- Implementar view de configurações.
- Implementar login e autenticação.
- Ajeitar o handler de respostas do servidor
- Escrever textos da homepage e ajuda para cada página.
- Centralizar upload de arquivos (talvez)
- Terminar handler de arquivos
- Implementar filtro e tratamento de dados para UFSCar

more text
