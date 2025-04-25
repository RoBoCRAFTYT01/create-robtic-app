import { Bot, db } from "robtic-discord-startup"

const bot = new Bot(); // make new Bot


bot.start(); // run the bot
db.connect(); // run the database ( using mongoDB )


/* entry point file you can edit it or add anythings */