module.exports = {
    prefix: "!=WelcomeImgList",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };

        const admin = require('firebase-admin');

        try{
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                
                const db = admin.firestore();

                const guildID = msg.guild.id;
                const welcomeImgUrl = db.collection('Img').doc(guildID);
                
                welcomeImgUrl.get().then(res => {
                    if(res.exists){
                        const imgs = res.data().WelcomeImg
                        return msg.reply({
                            content:
                            `本伺服器的歡迎圖列表如下： \n\n` + 
                            imgs.map(r => r, {split: true}).join('\n')
                        })
                    } else {
                        return msg.reply({ content: '本伺服器尚未加入歡迎圖，或找不到資料' })
                    };
                })

                .catch((err) => {
                    console.error("An error has occurred when trying to fetch data: ", err);
                });

            } else {
                msg.channel.send({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' })

                return
            };
        } catch (err){
            console.error(err);
        };
    }
}