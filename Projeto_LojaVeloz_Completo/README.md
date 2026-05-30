# Loja Veloz - Plataforma de Pedidos em Microsserviços

Este repositório contém o MVP da modernização da infraestrutura da Loja Veloz, migrando de um modelo manual para uma arquitetura cloud-native com Docker, Kubernetes e CI/CD.

## Estrutura do Projeto
- `api-gateway/`: Ponto de entrada das requisições.
- `pedidos-service/`: Gerenciamento de pedidos (Node.js).
- `pagamentos-service/`: Processamento de pagamentos (Python).
- `estoque-service/`: Controle de inventário (Go).
- `k8s/`: Manifestos Kubernetes.
- `terraform/`: Esqueleto de infraestrutura como código.
- `.github/workflows/`: Pipelines de CI/CD.

## Como Executar Localmente
```bash
docker-compose up --build
```


## 🐳 Conteinerização e Versionamento

Cada microsserviço possui seu próprio `Dockerfile` bem estruturado, utilizando multi-stage builds para otimizar o tamanho das imagens e garantir a segurança (execução como usuário não-root).

Exemplo de `Dockerfile` (serviço de pedidos):

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

# Final stage
FROM alpine:3.18
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

As imagens são versionadas com tags (`v1.0.0`, `v1.0.1`, etc.) e o hash do commit (`${{ github.sha }}`) para rastreabilidade.

## ☸️ Kubernetes – Produção Mínima

Para o ambiente de produção, a aplicação é orquestrada pelo Kubernetes. Os manifestos estão localizados no diretório `k8s/`.

- **Deployments:** Gerenciam as réplicas dos microsserviços.
- **Services:** Expondo os microsserviços internamente no cluster.
- **ConfigMaps:** Armazenam configurações não sensíveis (ex: `DB_HOST`).
- **Secrets:** Armazenam informações sensíveis (ex: `DB_USER`, `DB_PASS`) de forma segura.
- **HPA (Horizontal Pod Autoscaler):** Configurado para escalar o serviço de pedidos com base na utilização da CPU.

### Como Implantar no Kubernetes

1. Certifique-se de ter um cluster Kubernetes configurado e o `kubectl` apontando para ele.
2. Aplique os manifestos:
   ```bash
   kubectl apply -f k8s/
   ```


Um pipeline de CI/CD foi implementado usando GitHub Actions para automatizar o processo de build, teste e deploy. O arquivo de configuração está em `cicd/pipeline.yaml`.

O pipeline inclui as seguintes etapas:

1. **Build:** Compilação do código.
2. **Testes:** Execução de testes unitários.
3. **Scan de Segurança:** Análise de vulnerabilidades na imagem Docker com Trivy.
4. **Publicação:** Push da imagem Docker para um registry.
5. **Deploy:** Atualização do Deployment no Kubernetes com a nova imagem.



### Observabilidade

A estratégia de observabilidade proposta inclui:

- **Métricas:** Coleta de métricas com Prometheus e visualização com Grafana.
- **Logs:** Centralização de logs para análise.
- **Traces:** Rastreamento distribuído com OpenTelemetry para monitorar o fluxo de requisições entre os microsserviços.
### Estratégia de Deploy
Adotamos a estratégia de **Rolling Update**, que é o padrão do Kubernetes. Novas versões dos Pods são gradualmente substituídas pelas antigas, garantindo zero downtime durante as atualizações.
### Escalabilidade
O **Horizontal Pod Autoscaler (HPA)** é utilizado para escalar automaticamente o número de réplicas do serviço de pedidos com base na utilização da CPU, garantindo que a aplicação possa lidar com picos de tráfego.

## Infraestrutura como Código (IaC)

Um esqueleto de Terraform (`terraform/main.tf`) é fornecido para demonstrar como a infraestrutura (ex: cluster EKS na AWS) pode ser provisionada e gerenciada de forma automatizada e versionada.

## Vídeo Pitch

https://www.youtube.com/watch?v=Wz7c8ia-K-g

---
