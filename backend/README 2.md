# inova-cnj

Micro serviço para processamento automatico de rotinas no

![](header.png)

## Tecnologias

* Java 8 ou superior
* Wildfly 19
* Docker
* Maven 3


## Desenvolvimento

Build da imagem docker:

```sh
docker build -t wildfly-inova-cnj .
```

Execução do servidor:

```sh
docker run -it -p 8080:8080 -p 8443:8443 -p 8787:8787 -p 9990:9990 wildfly-inova-cnj
```

Deploy da aplicação:

```sh
mvn wildfly:deploy
```

## URL de acesso ao Webservice

O webservice será disponibilizado na seguinte URL

[http://localhost:8080/inova-cnj/servico-intercomunicacao-2.2.2?WSDL](http://localhost:8080/inova-cnj/servico-intercomunicacao-2.2.2?WSDL)

## Validações realizadas

Abaixo estão as validações realizadas na entrega da manifestação:

* Validações para todoas as classes processuais
    * Verificação de CEP inválido
        * O CEP informados nos dados das partes é verificado on-line no serviço Via CEP a fim de garantir que não sejam informados CEPs inválidos.

* Validações específicas por Classe Procesual
    * Execução Fiscal (1116)
        * Validação de CDA duplicada
            ```
             Verifica se já existe processo ajuizado no PJ-e com a CDA informada na manifestação.
            ```

## Histórico de releases

* 1.0.0
    * Versão inicial