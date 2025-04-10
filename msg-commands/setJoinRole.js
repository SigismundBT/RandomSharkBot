module.exports = {
    prefix: "!=SetJoinRole",
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
                if (!args[1]) return msg.reply({ content: '指令格式錯誤，此指令格式為`!=SetJoinRole @身分組`，請重新輸入'});
    
                if(!mentionRole) {
                    msg.reply({ content: '請@身分組' });
                    return;
                }

                const db = admin.firestore();
                const roleIDdata = db.collection('GiveRole').doc(guildID);

                roleIDdata.get().then(res => {
                    if(!res.exists){
                        roleIDdata.set({
                            JoinRoles:admin.firestore.FieldValue.arrayUnion(mentionRole.id)
                        })

                        .then(
                            console.log("Set New Doc and Auto Give ID success: " + mentionRole.id)
                        );
                    };

                    if(res.exists){
                        roleIDdata.update({
                            JoinRoles:admin.firestore.FieldValue.arrayUnion(mentionRole.id)
                        })

                        .then(
                            console.log("Set Auto Give ID success: " + mentionRole.id)
                        );
                    };
                })
                .catch((err) => {
                    console.error("An error has occurred: ", err);
                });
        
                return msg.reply({ content: `新增加入後分發身分組： ${mentionRole}` });
            
            } else {
                return msg.reply({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            }   
        } catch (err) {
            console.error(err);
        };
    }
};