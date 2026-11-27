/*
 * Agenda pública do Ministério Nova Página (Google Calendar, leitura via chave de API).
 *
 * calendarId: ID da agenda pública (Configurações da agenda → Integrar agenda).
 * apiKey:     chave de API do Google Cloud. Em sites estáticos ela fica visível no navegador,
 *             por isso deve estar restrita por referenciador HTTP (somente os domínios do site)
 *             e restrita à Google Calendar API.
 * timeZone:   fuso usado para formatar os horários (fuso da própria agenda).
 * pageSize:   quantidade de eventos buscados na API (a seção mostra 6 e "Ver agenda completa" expande o restante).
 */
window.NP_CALENDARIO = {
  calendarId: '63ca1a8ad37ae0a5acaaa79f5c067a439ffdc11daafe1db7b57cf3db661000fe@group.calendar.google.com',
  apiKey: 'AIzaSyAaynch2BP7Zj1mv_nPBc_-HbYHez3uixw',
  timeZone: 'America/Campo_Grande',
  pageSize: 20
};
