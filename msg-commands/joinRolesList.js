module.exports = {
    prefix: "!=JoinRoles",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };
        const admin = require('firebase-admin');
    
        try {
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const guildID = msg.guild.id;

                const db = admin.firestore();
                const roleIDdata = db.collection('GiveRole').doc(guildID);
                
                roleIDdata.get().then(res => {
                    if(res.exists){
                        const roles = res.data().JoinRoles;
                        msg.reply({
                            content: 
                            `本伺服器的加入身分組如下： \n\n` + 
                            roles.map(r => `<@&${r}>` , {split: true}).join('\n')
                        });
                        return
                    } else {
                        msg.reply({
                            content: '本伺服器尚未設定加入身分組，或找不到資料' 
                        });
                        return
                    };
                })

                .catch((err) => {
                    console.error("An error has occurred when trying to fetch data: ", err);
                });
            
            } else {
                return msg.channel.send({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            };
        } catch (err) {
            console.error(err);
        };
    }
};