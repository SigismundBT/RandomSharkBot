module.exports = {
    prefix: "!=RemoveJoinRole",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };

        const admin = require('firebase-admin');
    
        try {
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const guildID = msg.guild.id;
                let mentionRole = msg.mentions.roles.first();

                const args = msg.content.split(" ");
                if (!args[1]) return msg.reply({ content: '指令格式錯誤，此指令格式為`!=RemoveJoinRole @身分組`，請重新輸入'});

                if(!mentionRole) {
                    msg.reply({ content: '請@身分組' });
                    return;
                };

                const db = admin.firestore();
                const roleIDdata = db.collection('GiveRole').doc(guildID);

                roleIDdata.get().then(res => {
                    if(!res.exists){
                        msg.reply({content:'資料庫中找不到相關紀錄，可能是紀錄尚未建立'});
                        console.log(`No document ${guildID} in the database.`);
                        return
                    };

                    if(res.exists){
                        roleIDdata.update({
                            JoinRoles:admin.firestore.FieldValue.arrayRemove(mentionRole.id)
                        })
        
                        .then( 
                            msg.reply({ content: `已刪除加入後分發身分組： ${mentionRole}` }),
                            console.log("Delete Auto Give ID success: " + mentionRole.id)
                        );
                    };
                    return
                })
                .catch((err) => {
                    console.error("An error has occurred: ", err);
                });
            } else {
                return msg.reply({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            };
        } catch (err) {
            console.error(err);
        };
    }
};