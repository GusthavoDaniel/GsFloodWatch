# FloodWatch App

Aplicativo móvel para monitoramento e alerta de inundações.

## Funcionalidades Implementadas

### CRUD Completo de Alertas

O aplicativo agora possui um CRUD (Create, Read, Update, Delete) completo para gerenciamento de alertas de inundação:

1. **Create (Criar)**: Adição de novos alertas através da tela "Adicionar Alerta"
2. **Read (Ler)**: Visualização da lista de alertas e detalhes individuais
3. **Update (Atualizar)**: Edição de alertas existentes através da tela "Editar Alerta"
4. **Delete (Excluir)**: Remoção de alertas da lista

### Navegação Aprimorada

Implementamos uma navegação completa entre as telas:

- Navegação por abas para as principais seções do aplicativo
- Navegação em pilha para detalhes e edição de alertas
- Botões de voltar para facilitar a navegação

### Padronização de Cabeçalhos

Foi implementado um componente de cabeçalho padronizado (`Header.tsx`) para manter a consistência visual em todas as telas do aplicativo. O componente possui as seguintes características:

- Design com gradiente usando as cores primária e secundária do tema
- Suporte para botão de voltar (opcional)
- Suporte para ícone de ação à direita (opcional)
- Estilo consistente com a identidade visual do aplicativo
- Integração com a StatusBar para uma experiência visual coesa
- **Ajuste de Proporcionalidade para iOS**: O cabeçalho agora ajusta dinamicamente o `paddingTop` para respeitar a área segura do iOS, garantindo que o cabeçalho seja exibido corretamente em dispositivos iOS e Android.

## Telas Implementadas

1. **AlertListScreen**: Lista de alertas com filtros e gráfico de distribuição
2. **AddAlertScreen**: Formulário para adicionar novos alertas
3. **AlertDetailScreen**: Visualização detalhada de um alerta específico
4. **EditAlertScreen**: Formulário para editar alertas existentes
5. **MapScreen**: Visualização de mapa (placeholder)
6. **ProfileScreen**: Perfil do usuário
7. **SensorStatusScreen**: Status dos sensores de monitoramento
8. **RiskAnalysisScreen**: Análise de risco de inundações

## Como Usar o Aplicativo

### Visualizar Alertas
- A tela inicial mostra todos os alertas cadastrados
- Use os filtros para visualizar alertas por nível de risco
- Use a barra de pesquisa para encontrar alertas por localização ou descrição

### Adicionar um Alerta
1. Clique no botão "+" flutuante na tela de alertas
2. Preencha os campos obrigatórios (localização e nível de risco)
3. Adicione uma descrição e/ou foto (opcional)
4. Clique em "Enviar Alerta"

### Visualizar Detalhes de um Alerta
- Toque em qualquer alerta na lista para ver seus detalhes

### Editar um Alerta
1. Na tela de detalhes do alerta, clique no botão "Editar"
2. Modifique os campos desejados
3. Clique em "Salvar Alterações"

### Excluir um Alerta
- Na tela de lista, clique no ícone de lixeira no alerta
- Ou na tela de detalhes, clique no botão "Excluir" e confirme a ação

## Requisitos Atendidos da Global Solution

- ✅ Criação de no mínimo 5 telas com navegação entre elas
- ✅ Implementação de CRUD completo
- ✅ Estilização personalizada do aplicativo
- ✅ Arquitetura organizada com componentes reutilizáveis
- ✅ Documentação completa no README.md

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- Expo Vector Icons
- React Native Chart Kit
- Expo Image Picker
- Expo Linear Gradient
- Axios
- `react-native-safe-area-context` para ajuste de área segura

