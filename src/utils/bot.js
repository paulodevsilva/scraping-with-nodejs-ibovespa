const telegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const { format } = require('date-fns');

const { db } = require('../services/firebase');

const telegram = new telegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


const rules = new schedule.RecurrenceRule()
rules.hour = 08
rules.minute = 02



const messageBody = async () => {
    let currentDate = new Date();
    currentDate = format(currentDate, 'dd/MM/yyyy');

    const fundRef = db.collection('actionsFund');
    const getData = await fundRef.where('askDate', '==', '11/05/2020').get();
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
   
    return botMsg
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
    const botMsg = await  messageBody()
    const schedule = await scheduledMsg(botMsg)


    telegram.on('message', async msg => {
        const chatId = msg.chat.id;
        const firstName = msg.chat.first_name;
        
        const clientData = {
            name: firstName,
            chatId
        }

        const verifyClient = await verifyExistClient(clientData)
        const saveClient = await saveClientToDB(clientData,verifyClient)
    
        console.log(msg)
    
        telegram.sendMessage(chatId, botMsg);
    });

}

start()
 


    