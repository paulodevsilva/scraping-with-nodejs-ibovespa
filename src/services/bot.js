const telegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const { format } = require('date-fns');

const { db } = require('../db/firebase');

const telegram = new telegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


const rules = new schedule.RecurrenceRule()
rules.hour = 09
rules.minute = 10

telegram.on('polling_error', function(err) {
    console.log(err)
});

const messageTemplate = async (text, clientData, botMsg) => {
    const {fundName, quotaDate, quotaValue, profitability: {onDay, inMonth, previousMonth}} = botMsg
    const { name, chatId } = clientData
    try {
        if (text == '/all') {
            const msg = 
            `
            Nome do Fundo:  ${fundName}\nData da Cotação: ${quotaDate}\nValor da Cotação: ${quotaValue}\n\nRentabilidade\n\nNeste dia: ${onDay}\nNeste mês: ${inMonth}\nNo mês anterior: ${previousMonth}
            `
            return msg
        } else if (text == '/onDay') {
            const msg = 
            `*Rentabilidade*\nHoje: ${onDay}
            `
    
            return msg
        } else if (text == '/inMonth') {
            const msg = 
            `Rentabilidade*\nNeste mês: ${inMonth}
            `
    
            return msg
        } else if (text == '/previousMonth') {
            const msg = 
            `*Rentabilidade*\nNo mês anterior: ${previousMonth}
            `
    
            return msg
        } else if (text == '/kill') {
            await deleteClient(chatId)
            const msg = 
            `
             ${name}, não se preocupe você já foi removido da nossa base de dados, se desejar receber as informações novamente, é só mandar uma mensagem.😉
            `
            return msg
        }  else if (text = '/list') {
            const msg = 
            `
            Lista de comandos\n\n/all : Retorna todas as informações\n/onDay : Retorna o valor da rentablidade referente a dia atual.\n/inMonth : Retorna o valor da rentablidade referente ao mês atual.\n/previousMonth : Retorna o valor da rentablidade referente ao mês anterior.\n/kill : Não receber mais mensagens diariamente.  
    
            `
    
            return msg
        }

        console.log(`> [messageTemplate] : ok`)
        return msg

    } catch(err) {
        console.err(`> [messageTemplate] : ${err}`)
    }

}


const currentMessage = async () => {
    let currentDate = new Date();
    currentDate = format(currentDate, 'dd/MM/yyyy');
    console.log(`> [currentMessage] : Date ${currentDate}`)

    try {
        const fundRef = db.collection('actionsFund');
        const getData = await fundRef.where('askDate', '==', currentDate).get();
        const body = getData.docs.map(doc => {
            const data = doc.data()
            return data
        })   
    
        const {fundName, quotaDate, quotaValue, profitability: {onDay, inMonth, previousMonth}} = body[0]
        const botMsg = 
        `
        Nome do Fundo:  ${fundName}\nData da Cota: ${quotaDate}\nValor da Cota: ${quotaValue}\n\nRentabilidade\nNeste dia: ${onDay}\nNeste mês: ${inMonth}\nNo mês anterior: ${previousMonth}
        `
        console.log(`> [currentMessage] : ok`)

        return {botMsg, msgData: body[0]}
        
    } catch(err) {
        console.error(`> [currentMessage] : ${err}`)
    }
}  

const deleteClient = async (chatId) => {
   try {
    const clientRef = db.collection('Clients')
    const clientData = await clientRef.where('chatId', '==', chatId).get();
    const client = clientData.docs.map(doc => {
            return doc.id
    })
       console.log(`> [deleteClient] : ok`)

    await clientRef.doc(client.toString()).delete()
   } catch(err) {
       console.error(`> [deleteClient] : ${err}`)
   }
}

const verifyExistClient = async (clientData) => {
    const clientRef = db.collection('Clients');
     try {
        const verifyClient = await clientRef.where('chatId', '==', clientData.chatId).get();
        const clientExists = verifyClient.docs.map(doc => {
        const {chatId} = doc.data();
            return chatId
    })
        const chatId = clientExists.toString()

        console.log(`> [verifyExistsClient] : ok`)

        if (chatId == clientData.chatId) {
            let verify 
            return verify = false
        } else {
            return verify = true
        }

     }
     catch(err) {
         console.err(`> [verifyExistsClient] : ${err}`)
     }

 }


const saveClientToDB = async (clientData, verifyClient) => {
    const clientRef = db.collection('Clients');
    console.log(`> [saveClientToDB] : ${verifyClient}`)
    try {
        if (verifyClient) {
            console.log(`> [saveClientToDB] : New user`)
            clientRef.add(clientData)

        } else {
            console.log(`> [saveClientToDB] : Existing user`)
        }

    } 
    catch(err) {
        console.err(`> [saveClientToDB] : ${err}`)
    }
   
}

const scheduledMsg = async (botMsg) => {
    const job = schedule.scheduleJob(rules, async () => {
        try {
            const userRef =  db.collection('Clients');
            const getClients = await userRef.get();
    
            const data = getClients.docs.map(doc => {
             const {chatId} = doc.data()
    
                return chatId
    
            })
    
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
    const msgAndData = await currentMessage()
    const { botMsg, msgData } = msgAndData
    const schedule = await scheduledMsg(botMsg)
    
    
    telegram.on('message', async msg => {
        const { text, chat: { id: chatId, first_name: firstName}  } = msg
        const clientData = { name: firstName,  chatId }
         
        const messages = await messageTemplate(text, clientData, msgData)
        const verifyClient = await verifyExistClient(clientData)
        const saveClient = await saveClientToDB(clientData, verifyClient)
    
        telegram.sendMessage(chatId, messages);
    });

}

start()
 
