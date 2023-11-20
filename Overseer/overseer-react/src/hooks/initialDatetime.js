import { format, zonedTimeToUtc } from 'date-fns-tz';

export const InitialDatetime = ()=> {
  const brazilTimeZone = 'America/Sao_Paulo';

  // Obtenha a data e hora atual no fuso horário do Brasil
  const currentDateTimeInBrazil = zonedTimeToUtc(new Date(), brazilTimeZone);

  // Formate a data e hora no formato 'YYYY-MM-DDTHH:mm:ss'
  const initialDateTime = format(currentDateTimeInBrazil, 'yyyy-MM-dd HH:mm:ss', {
    timeZone: brazilTimeZone,
  });
  const formatDateTime = (dateTime) => {
    // Utilize uma expressão regular com grupos de captura para separar a data e a hora
    const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/;
  
    // Verifique se a data e hora correspondem ao formato esperado
    if (regex.test(dateTime)) {
      // Use a função replace para formatar a data e hora e remover o 'T'
      return dateTime.replace(regex, '$1 $2:00:00').replace('T', ' ');
    } else {
      // Se o formato não corresponder, retorne o valor original
      return dateTime;
    }
  };
  return formatDateTime(initialDateTime)
} 