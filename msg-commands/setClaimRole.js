module.exports = {
    prefix: "!=SetClaimRole",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };

        const admin = require('firebase-admin');
    
        try {
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                if(msg.author.bot){
                    return
                }
                const guildID = msg.guild.id;
                const mentionRole = msg.mentions.roles.first();
                const mentionCH = msg.mentions.channels.first();
        
                const args = msg.content.split(" ");
                if (!args[1] || !args[2] || !args[3] ||!args[4] || args[5]) {
                    msg.reply({ content: '指令格式錯誤，標準格式為`!=SetClaimRole 表情符號 @身分組 #頻道 訊息ID`，請重新輸入'})
                    return
                };
                
                const emojiargs = args[1].split(':');
                const emoji = emojiargs[1];
                const messageID = args[4];
        
                if(!mentionRole) {
                    msg.reply({ content: '請@身分組' })
                        .then(msg => {
                            setTimeout(() => msg.delete(), 1000 *10);
                        });
                    return;
                };

                if(!mentionCH) {
                    msg.reply({ content: '請#頻道' })
                        .then(msg => {
                            setTimeout(() => msg.delete(), 1000 *10);
                        });
                    return;
                };

                const db = admin.firestore();
                const dbCollection = db.collection('ClaimRoles');
                const dbdoc = dbCollection.doc(guildID);
                const chdoc = dbdoc.collection('ReactionRoleCH').doc(mentionCH.id);
                const msgdoc = chdoc.collection('ReactionRoleMSG').doc(messageID);

                try {
                    const setclaimrole = async () => {
                        const guildres = await dbdoc.get();
                        const chres = await chdoc.get();
                        const msgres =  await msgdoc.get();
    
                        if (!guildres.exists){
                            if (emoji === undefined){
                                msgdoc.set({
                                    [args[1]]: mentionRole.id
                                });
                                dbdoc.set({dummy:'dummy'});
                                chdoc.set({dummy:'dummy'});
                            } else {
                                msgdoc.set({
                                    [emoji]: mentionRole.id
                                });
                                dbdoc.set({dummy:'dummy'});
                                chdoc.set({dummy:'dummy'});
                            };
                        }

                        if (guildres.exists && !chres.exists){
                            if(emoji === undefined){
                                msgdoc.set({
                                    [args[1]]: mentionRole.id
                                });
                                dbdoc.set({dummy:'dummy'});
                                chdoc.set({dummy:'dummy'});
                            } else {
                                msgdoc.set({
                                    [emoji]: mentionRole.id
                                });
                                dbdoc.set({dummy:'dummy'});
                                chdoc.set({dummy:'dummy'});
                            };
                        }

                        if(guildres.exists && chres.exists && !msgres.exists){
                            if(emoji === undefined){
                                msgdoc.set({
                                    [args[1]]: mentionRole.id
                                });
                            } else {
                                msgdoc.set({
                                    [emoji]: mentionRole.id
                                });
                            };
                        }
                        if(guildres.exists && chres.exists && msgres.exists){
                            if(emoji === undefined){
                                msgdoc.update({
                                    [args[1]]: mentionRole.id
                                });
                            } else {
                                msgdoc.update({
                                    [emoji]: mentionRole.id
                                });
                            };
                        };
                    }
                    setclaimrole();
                    msg.reply({ content: `新增取得身分組： ${mentionRole}` });
                    return

                }
                catch (err) {
                    console.error(`An error occurred when trying to add new role, at Guild:${msg.guild.name}, CH: ${mentionCH.name}, MSG:${messageID} \n Err: ${err}`)
                    msg.reply(`發生錯誤，位置在Guild:${msg.guild.name}, CH: ${mentionCH.name}, MSG:${messageID}`)

                };

            
            } else {
                return msg.reply({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            };   
        } catch (err) {
            console.error(err);
        };
    }
};