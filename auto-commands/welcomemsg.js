const Canvas = require('canvas');
const { registerFont, createCanvas } = require('canvas');
registerFont('./font/GenYoGothic-B.ttc', { family: 'GenYoGothic' });
registerFont('./font/Rubik-Bold.ttf', { family: 'Rubik' });
const { AttachmentBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        //排除機器人
        if (member.user.bot) {
            return
        };
        const guildID = member.guild.id;
        const admin = require('firebase-admin');
        const db = admin.firestore();
        const imgUrl = db.collection('Img').doc(guildID);
        const imgUrlr = imgUrl.get();

        if(imgUrlr.exists){
            const imgs = imgUrlr.data().WelcomeImg;
            const randomImg = imgs[Math.floor(Math.random() * imgs.length)];

            if(randomImg === undefined){
                return console.log(`The server ${guildID} has no welcome img data in the database.`)
            }

            //#region Canvas Setup
            const canvas = Canvas.createCanvas(700,250);
            const context  = canvas.getContext('2d');

            const background = await Canvas.loadImage(`${randomImg}`);

            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            context.strokeStyle = '#74037b';
            context.strokeRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = '#000000';
            context.font = '50px "Rubik",50px "GenYoGothic"';
            context.fillText(member.user.tag, canvas.width / 3.5, canvas.height / 2.3 , 450);

            context.fillStyle = '#000000';
            context.font = '35px "GenYoGothic"';
            context.fillText('歡迎加入', canvas.width / 2.2, canvas.height / 1.4);

            context.beginPath();
            context.arc(110, 125, 75, 0, Math.PI * 2, true);;
            context.closePath();
            context.clip();

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({extension: 'png'}));

            context.drawImage(avatar, 40, 50, 150, 150);
            //#endregion

            const WelcomeMsgCh = db.collection('RSBChannels').doc(guildID);
            const WelcomeMsgChr = WelcomeMsgCh.get();

            if(WelcomeMsgChr.exists){
                const channelID = WelcomeMsgChr.data().WelcomeCh;
                const channels = client.channels.cache.get(channelID);

                const user = member.user.id;
                const joinMessages = [`<@${user}>` + '游進來了！', `<@${user}>` + '從草叢裡跳了出來！' , `<@${user}>` + '~~是在~~哈囉！'];
                const randomMessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];
                const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-msg.png'});
                return channels.send({content: randomMessage, files: [attachment]});

            } else {
                return console.log(`Sever ${guildID} has no Welcome Msg channel`);
            };
        } else {
            return console.log('No Img data in the database.')
        };
    });
};