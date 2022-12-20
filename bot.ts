import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import requestDataFromEns from "./request";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN  as string);
const helpMessage = `📄 Here is a list of useful commands  
    /help - for help
    /start - to start the bot
    /ens  <ENS NAME> - to get the data of ens domain
        (Name should be without .ens)
`;

bot.start((ctx)=>{
    ctx.reply("Welcome to ENS Resolver Bot: " + ctx.message.from.username)
    ctx.reply(helpMessage);
})

bot.command(['ens', "ENS", "Ens", "eNs"],async (ctx)=>{
    const textArray = ctx.message.text.split(" ");
    const command = textArray.shift();
    const ensName = textArray.join(" ") || null;

    if(ensName && textArray.length === 1){
        if(ensName.includes('.')){
            ctx.reply("invalid name");
        }
        const record = await requestDataFromEns(ensName);

        if(!record?.transaction_hash){
            return ctx.reply("No record with given Ens");
        }

        const messageToSend =
            `<i>Details For Ens Name:</i> <b>${ensName}</b>\n<b>Name</b> - ${record!.name}\n<b>Contract Address</b> - <a href='https://etherscan.io/address/${record.contract_address}'>${record!.contract_address}</a>\n<b>Owner</b> - <a href='https://etherscan.io/address/${record.contract_address}'>${record!.owner}</a>\n<b>Label</b> - ${record!.label}\n<b>event</b> - ${record!.event}\n<b>Cost</b> - ${record!.cost}\n<b>Expires</b> - ${record!.expires}\n<b>Block Number</b> - ${record!.block_number}\n<b>transaction_hash</b> - <a href='https://etherscan.io/tx/${record.transaction_hash}'>${record!.transaction_hash}</a>
            `
        ctx.replyWithHTML(messageToSend,{disable_web_page_preview: true})

    }else{
        ctx.reply("Invalid Command! Try again");
    }
})

bot.help((ctx)=>{
    ctx.reply(helpMessage);
})

bot.launch();
