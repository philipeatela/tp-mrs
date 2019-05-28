# TRABALHO PRÁTICO DE MRS - ANÁLISE DO PROCESSO DE INTEGRAÇÃO CONTÍNUA DOS REPOSITÓRIOS

## Aluno: Philipe Pinheiro Atela

## Professor: André Hora

Grande parte dos sistemas desenvolvidos e mantidos atualmente possuem uma pipeline de integração contínua configurada, de forma a executar um processo de build sempre que for adicionado código novo nas branches principais, ou em outras situações como abertura de uma pull request. O processo de build envolve vários passos como a instalação de dependências, deploy em servidores, testes automatizados e configuração de sistemas de log.

O objetivo deste trabalho é analisar em alto nível o processo de integração contínua e a estabilidade de sistemas existentes, inicialmente com foco no contexto de uma pequena fábrica de software, mas com possibilidade de aplicação em quaisquer sistemas que utilizem a plataforma do Bitbucket Pipelines para realizar o processo.

As métricas a serem calculadas seriam:

* Dado um projeto, qual a porcentagem dos commits dados em master/develop quebram o build da aplicação?
* Quais as palavras chaves mais comuns nestes commits? (fix, feature…)
* Durante qual porcentagem do tempo a aplicação permaneceu online desde o primeiro build bem sucedido?
* Recorde de tempo que o sistema ficou estável
* Qual o passo do processo de build mais propenso a dar erro? (Testes, dependências, deploy…)
* Com qual frequência o código dos arquivos relacionados ao build são alterados? Quais arquivos são alterados junto com este?
Qual o tempo médio de build do projeto? Como este variou ao longo do tempo?
