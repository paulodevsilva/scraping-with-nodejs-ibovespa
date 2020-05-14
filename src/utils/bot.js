const telegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const { format } = require('date-fns');

const { db } = require('../services/firebase');

const telegram = new telegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


const rules = new schedule.RecurrenceRule()
rules.hour = 08
rules.minute = 02





const messageTemplate = async (text, botMsg) => {
    const {fundName, quotaDate, quotaValue, profitability: {onDay, inMonth, previousMonth}} = botMsg
    if (text == '/all') {
        const msg = 
`
 Nome do Fundo:  ${fundName}
 Data da Cota: ${quotaDate}
 Valor da Cota: ${quotaValue}\n
 Rentabilidade
 Neste dia: ${onDay}
 Neste mês: ${inMonth}
 No mês anterior: ${previousMonth}
`
    return msg
    } else if (text == '/onDay') {
        const msg = 
        `Rentalidade
         Hoje: ${onDay}
        `

        return msg
    } else if (text == '/inMonth') {
        const msg = 
        `Rentabilidade
         Neste mês: ${inMonth}
        `

        return msg
    } else if (text == '/previousMonth') {
        const msg = 
        `Rentabilidade
         no mês anterior: ${previousMonth}
        `

        return msg
    } else if (text = '/list') {
        const msg = 
        `
Lista de comandos\n
/all : Retorna todas as informações
/onDay : Retorna o valor da rentablidade referente a dia atual.
/inMonth : Retorna o valor da rentablidade referente ao mês atual.
/previousMonth : Retorna o valor da rentablidade referente ao mês anterior.
        `

        return msg
    } 

    return msg
}



const currentMessage = async () => {
    let currentDate = new Date();
    currentDate = format(currentDate, 'dd/MM/yyyy');

    const fundRef = db.collection('actionsFund');
    const getData = await fundRef.where('askDate', '==', currentDate).get();
    const body = getData.docs.map(doc => {
        const data = doc.data()
        return data
    })   

    const {fundName, quotaDate, quotaValue, profitability: {onDay, inMonth, previousMonth}} = body[0]
    const botMsg = 
`
 Nome do Fundo: ${fundName}
 Data da Cota: ${quotaDate}
 Valor da Cota: ${quotaValue}

 Rentabilidade
 No dia: ${onDay}
 No mês: ${inMonth}
 No mês anterior: ${previousMonth}
`
   
    return {botMsg, msgData: body[0]}
}



telegram.on('polling_error', function(err) {
    console.log(err)
});



const verifyExistClient = async (clientData) => {
    const clientRef = db.collection('Clients');
     try {
       const verifyClient = await clientRef.where('chatId', '==', clientData.chatId).get();
       let clientExists = verifyClient.docs.map(doc => {
        const {chatId} = doc.data();

        return chatId
    })
        let chatId = clientExists.toString();

        if (chatId == clientData.chatId) {
            let verify 
            return verify = false
        } else {
            return verify = true
        }
     }
     catch(err) {
         console.log(err)
     }

 }


const saveClientToDB = async (clientData, verifyClient) => {
    const clientRef = db.collection('Clients');
   console.log(verifyClient)
    try {
        if (verifyClient == true) {
            console.log('novo usuario')

            clientRef.add(clientData)

        } else {
            console.log('usuario existente')

        }

    } 
    catch(err) {
        console.log(err)
    }
   
}

const scheduledMsg = async (botMsg) => {
    const job = schedule.scheduleJob(rules, async () => {
        try {
            const userRef =  db.collection('Clients');
            const getClients = await userRef.get();
    
            const clients =  getClients.docs.map(doc => {
            const {chatId} = doc.data()
    
            return chatId
    
            })
    
            const data = clients
            data.map(chatId => {
            
            telegram.sendMessage(chatId, botMsg)
    
            })
    
    
        }
         catch(err) {
             return err
         }  
    });
   
      
}


const start = async () => {
    const msgAndData = await  currentMessage()
    const { botMsg, msgData } = msgAndData
    const schedule = await scheduledMsg(botMsg)
    
    
    telegram.on('message', async msg => {
        const chatId = msg.chat.id;
        const firstName = msg.chat.first_name;
        
        const { text } = msg

        const clientData = {
            name: firstName,
            chatId
        }
        
        const msgs = await messageTemplate(text, msgData)
        const verifyClient = await verifyExistClient(clientData)
        const saveClient = await saveClientToDB(clientData,verifyClient)
    
        console.log(msg)

    
        telegram.sendMessage(chatId, msgs);
    });

}

start()
 


    