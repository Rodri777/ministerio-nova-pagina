/*
 * Agendamentos do Ministério Nova Página — dados da seção #agendamentos.
 *
 * whatsapp:      número da assessoria em formato internacional, só dígitos (ex.: 5566999999999).
 *                Enquanto for "[NUMERO_WHATSAPP]", o botão aparece desabilitado.
 * email:         e-mail de contato (linha de apoio).
 * tempoResposta: ex.: "24 horas úteis". Se tiver colchetes, a frase de resposta não aparece.
 * estatisticas:  faixa de números. Se algum valor ou rótulo tiver colchetes, a faixa inteira fica oculta.
 * tipos:         cada chip. "mensagem" é o texto pré-preenchido enviado no WhatsApp.
 * padrao:        id do tipo selecionado ao abrir a página.
 */
window.NP_AGENDA = {
  whatsapp: '[NUMERO_WHATSAPP]',
  email: 'novapaginagrupo@gmail.com',
  tempoResposta: '[X] horas úteis',
  estatisticas: [
    { valor: '[N]', rotulo: 'eventos' },
    { valor: '[N]', rotulo: 'cidades' },
    { valor: '[N]', rotulo: 'anos' }
  ],
  tipos: [
    { id: 'culto', rotulo: 'Culto', sujeitoTitulo: 'o seu culto', mensagem: 'Olá! Gostaria de agendar o Ministério Nova Página para um culto.' },
    { id: 'publico', rotulo: 'Evento público', sujeitoTitulo: 'o seu evento', mensagem: 'Olá! Gostaria de agendar o Ministério Nova Página para um evento público.' },
    { id: 'casamento', rotulo: 'Casamento', sujeitoTitulo: 'o seu casamento', mensagem: 'Olá! Gostaria de agendar o Ministério Nova Página para um casamento.' },
    { id: 'outro', rotulo: 'Outro', sujeitoTitulo: 'o seu evento', mensagem: 'Olá! Gostaria de conversar sobre um agendamento com o Ministério Nova Página.' }
  ],
  padrao: 'outro'
};
