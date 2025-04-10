module.exports = {
    prefix: "!=RemoveClaimRole",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };

        const admin = require('firebase-admin');
    
        try {
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const guildID = msg.guild.id;
                const mentionCH = msg.mentions.channels.first();
                const mentionRole = msg.mentions.roles.first();
        
                const args = msg.content.split(" ");
                const emojiargs = args[1].split(':');
                const emoji = emojiargs[1];
                const messageID = args[3];

                if(!args[1] || !args[2] || !args[3] || args[4]) {
                    msg.reply({ content: '指令格式錯誤，標準格式為`!=RemoveClaimRole 表情符號 #頻道 訊息ID`，請重新輸入'})
                    return
                };

                if(mentionRole != undefined){
                    msg.reply({ content: '指令格式錯誤，此指令不需要使用身分組，請重新輸入'})
                        .then(msg => {
                            setTimeout(() => msg.delete(), 1000 *10);
                        });
                        return
                };

                if(!mentionCH) {
                    msg.reply({ content: '請#頻道' })
                        .then(msg => {
                            setTimeout(() => msg.delete(), 1000 *10);
                        });
                    return
                };

                const db = admin.firestore();
                const dbCollection = db.collection('ClaimRoles');
                const dbdoc = dbCollection.doc(guildID);
                const chcollection = dbdoc.collection('ReactionRoleCH');
                const chdoc = chcollection.doc(mentionCH.id);
                const msgcollection = chdoc.collection('ReactionRoleMSG');
                const msgdoc = msgcollection.doc(messageID);

                try{
                    const msgremover = async () => {
                        const msgdocres = await msgdoc.get();

                        if(!msgdocres.exists){
                            return console.log(`There is no such Reaction Role data.(Channel) Emoji name: ${emoji}, at channel name:${mentionCH.name}, CH ID:${mentionCH.id}`);
                        };
    
                        if(msgdocres.exists){
                            const emojiargs = args[1].split(':');
                            const emoji = emojiargs[1];
    
                            if(emoji === undefined){
                                const handledelete1 = async () => {
                                    const roleID = msgdocres.data()[args[1]]
                                    if(roleID === undefined){
                                        return msg.reply({ content: `找不到相關的身分組資料。 Emoji name: ${emoji}, at channel name:${mentionCH.name}, CH ID:${mentionCH.id}` });
                                    } else {
                                        await msgdoc.update({
                                            [args[1]]: admin.firestore.FieldValue.delete()
                                        }); 
                                        
                                        await msg.reply({ content: `成功從取得身分組列表中刪除身分組資料： <@&${roleID}> \n Emoji: :${emoji}:  \n channel name: ${mentionCH.name} \n CH ID: ${mentionCH.id}` })
                                        
                                        .catch((err) => {
                                            console.log('no doc')
                                        });
                                        
                                        const msgdocsize = Object.keys(msgdocres.data()).length;
                                    
                                        if(msgdocsize <= 1){
                                            await msgdoc.delete();
                                        };
                                        
                                        const msgcres = await msgcollection.get();
                                        const msgcollectionsize = (msgcres._size)
                                        if (msgcollectionsize <= 0){
                                            await chdoc.delete();
                                        };

                                        const chcres = await chcollection.get();
                                        const chcollectiosize = (chcres._size)
                                        if (chcollectiosize <= 0){
                                            await dbdoc.delete();
                                        };
                                    };
                                }
                                handledelete1();
    
                            } else {
                                const handledelete2 = async () => {
                                    const roleID = msgdocres.data()[emoji]
                                    if(roleID === undefined){
                                        return msg.reply({ content: `找不到相關的身分組資料。 Emoji name: ${emoji}, at channel name:${mentionCH.name}, CH ID:${mentionCH.id}` });
                                    } else {
                                        await msgdoc.update({
                                            [emoji]: admin.firestore.FieldValue.delete()
                                        })
                                        
                                        await msg.reply({ content: `成功從取得身分組列表中刪除身分組資料： <@&${roleID}> \n Emoji: :${emoji}:  \n channel name: ${mentionCH.name} \n CH ID: ${mentionCH.id}` })
                                        
                                        .catch((err) => {
                                            console.log('no doc')
                                        });
                                        
                                        const msgdocsize = Object.keys(msgdocres.data()).length;
                                    
                                        if(msgdocsize <= 1){
                                            await msgdoc.delete();
                                        };
                                        
                                        const msgcres = await msgcollection.get();
                                        const msgcollectionsize = (msgcres._size)
                                        if (msgcollectionsize <= 0){
                                            await chdoc.delete();
                                        };

                                        const chcres = await chcollection.get();
                                        const chcollectiosize = (chcres._size)
                                        if (chcollectiosize <= 0){
                                            await dbdoc.delete();
                                        };
                                    };
                                }
                                handledelete2();
                            };
                            return
                        };
                    }
                    msgremover();
                }
                catch (err) {
                    console.error(`An error has occurred: ${err}`)
                }
            } else {
                return msg.reply({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            };
        } catch (err) {
            console.error(err);
        };
    }
};