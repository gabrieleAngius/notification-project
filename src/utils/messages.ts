import { AllMessages, Messages } from "../interfaces/MessagesInterface";



const messagesToLog: AllMessages = {
    
    channelNotFound: 'Il canale {} non esiste! Inserisci il nome corretto oppure crea un nuovo canale',
    channelAlreadyExist: 'Il canale {} è già stato aggiunto.',
        
    alreadySubscribed: 'Già sottoscritto al canale {}',
    notSubscribed: 'Non sei sottoscritto al canale {}',
    subscriberSetted: 'Subscriber impostati correttamente sul canale {}',
    subscriberCalled: 'Sto chiamando i subscriber sul canale {}', 
        
    senderSetted: 'Sender impostato come {}',
    senderAlreadyExist: 'Sender già impostato. Per sovrascriverlo aggiungi il parametro "force".',
        
    notificationNotFound: "La notifica con id {} non è stata trovata",
    notificationAlreadyRead: "La notifica con id {} è già stata letta",
    notificationListEmpty: 'Nessuna notifica sul canale {}',
    notificationListNotEmpty: 'Hai già delle notifiche sul canale {}"',
        
    getDone: 'GET eseguito correttamente dal canale {}',
    getFailed: 'GET fallita sul canale {}',
    refreshDone: 'Dati aggiornati correttamente dal canale {}',
    postDone: 'POST eseguito correttamente sul canale {}',
    postFailed: 'POST fallita sul canale {}',
    patchDone: 'PATCH eseguita correttamente sul canale {}',
    patchFailed: 'PATCH fallita sul canale {}'
}
      
// const isProd = process.env.NODE_ENV === "production";

export const logMessages: Messages = {
    error: (message, element) => {

        // if(isProd) {return};

        const finalMessage = messagesToLog[message].replace("{}", `<< ${element} >>`);
        console.error(finalMessage);
    },

    warn: (message, element) => {
  
        // if(isProd) {return};

        const finalMessage = messagesToLog[message].replace("{}", `<< ${element} >>`);
        console.warn(finalMessage);
    },

    info: (message, element) => {
        
        // if(isProd) {return};

        const finalMessage = messagesToLog[message].replace("{}", `<< ${element} >>`);
        console.info(finalMessage);
    }
};