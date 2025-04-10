const Canvas = require('canvas');
const { registerFont, createCanvas } = require('canvas');
registerFont('./font/GenYoGothic-B.ttc', { family: 'GenYoGothic' });
registerFont('./font/Rubik-Bold.ttf', { family: 'Rubik' });
const { AttachmentBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberRemove', async(member) => {

        //排除機器人
        if (member.user.bot) {
            return;
        };

        try{
            const guildID = member.guild.id;

            const admin = require('firebase-admin');
            const db = admin.firestore();
            const leaveMsgCh = db.collection('RSBChannels').doc(guildID);
            const leaveMsgChr = leaveMsgCh.get();

            const imgUrl = db.collection('Img').doc(guildID);
            const imgUrlr = await imgUrl.get();

            if(imgUrlr.exists){

            //#region Canvas Setup
            const canvas = Canvas.createCanvas(700,250);
            const context  = canvas.getContext('2d');

            const imgs = imgUrlr.data().LeaveImg;
            const randomImg = imgs[Math.floor(Math.random() * imgs.length)];

            if(randomImg === undefined){
                return console.log(`The server ${guildID} has no leave img data in the database.`)
            }

            const background = await Canvas.loadImage(`${randomImg}`);

            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            context.strokeStyle = '#74037b';
            context.strokeRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = '#000000';
            context.font = '50px "Rubik",50px "GenYoGothic"';
            context.fillText(member.user.tag, canvas.width / 3.5, canvas.height / 2.3 , 450);

            context.fillStyle = '#000000';
            context.font = '35px "GenYoGothic"';
            context.fillText('掰掰！', canvas.width / 2.1, canvas.height / 1.4);

            context.beginPath();
            context.arc(110, 125, 75, 0, Math.PI * 2, true);;
            context.closePath();
            context.clip();

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({extension: 'png'}))

            context.drawImage(avatar, 40, 50, 150, 150)
            //#endregion


                if(leaveMsgChr.exists){
                    const channelID = leaveMsgChr.data().LeaveCh;
                    const channels = client.channels.cache.get(channelID);

                    const user = member.user.id;
                    const leaveMessages = [`<@${user}>` + '離開了。', '掰掰！' + `<@${user}>` , `<@${user}>` + '開啟了遠行的旅程，永遠地離開了。'];
                    const randomMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
                    const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'leave-msg.png'});

                    return channels.send({content: randomMessage, files: [attachment]});

                } else {
                    return console.log(`Sever ${guildID} has no Leave Msg channel`);
                };
            } else {
                return console.log('No Img data in the database.')
            };
        } catch(err) {
            return console.error('An error has occurred: ' + err);
        };
    });
};