module.exports = {
    prefix: "!-生日登記網址",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };
        const admin = require('firebase-admin');
        const db = admin.firestore();

        try {
            setTimeout(() => msg.delete(), 1000 * 7);

            const guildID = msg.guild.id;
            const getChannel = db.collection('RSBChannels').doc(guildID);

            getChannel.get().then(res => {
                if(!res.exists){
                    return
                };

                if(res.exists){
                    const channelID = res.data().BDSettingCh;

                    if (msg.channel.id !== channelID){
                        msg.reply(`此指令不允許使用在此頻道`)
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        return
                    } else {
                        let mentionMember = msg.mentions.users.first();

                        if(!mentionMember) {
                            msg.reply({ content: '請@成員' })
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        };

                        const args = msg.content.split(' ');
                        if (!args[1]) {
                            msg.reply({ content: '指令格式錯誤，請重新輸入'})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        };

                        const userID = mentionMember.id;
                        const url = `https://randomsharkbot.herokuapp.com/bd/${guildID}/${userID}`;

                        msg.reply({
                            content: 
                            '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                            `成員 <@${userID}> 的登記器網址如下： \n` +
                            `<${url}>\n\n`+
                            '此訊息將在10秒後自動銷毀，請盡速使用' 
                        })

                        .then(msg => {
                            setTimeout(() => msg.delete(), 1000 * 10);
                        });
                        return
                    };
                };
            });
        } catch (err) {
            console.error(err);
        };
    }
};