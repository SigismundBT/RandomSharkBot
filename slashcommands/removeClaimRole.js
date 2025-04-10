const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeclaimrole')
        .setDescription('刪除Reaction Role')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option.setName('表情符號')
                .setDescription('選擇ReactionRole的表情符號')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('頻道')
                .setDescription('ReactionRole使用的訊息頻道')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('訊息id')
                .setDescription('ReactionRole使用的訊息ID')
                .setRequired(true)),
                
    async execute(interaction) {
        const options = interaction.options;
        const guild = interaction.guild;
        const guildID = guild.id;

        const emojiinput = options.getString('表情符號');
        const emojiargs = emojiinput.split(':');
        const emoji = emojiargs[1];
        
        const channel = options.getChannel('頻道')
        const channelID = channel.id;
        const channelname = channel.name
        const msgID = options.getString('訊息id') ;

        const admin = require('firebase-admin');
        const db = admin.firestore();
        const dbCollection = db.collection('ClaimRoles');
        const dbdoc = dbCollection.doc(guildID);
        const chcollection = dbdoc.collection('ReactionRoleCH');
        const chdoc = chcollection.doc(channelID);
        const msgcollection = chdoc.collection('ReactionRoleMSG');
        const msgdoc = msgcollection.doc(msgID);
        
        try{
            const msgcheck = channel.messages.fetch(msgID)
            await Promise.all([msgcheck])
            
            const guildemojichecker = guild.emojis.cache.find(e => e.name === emoji) 
            if(guildemojichecker === undefined){
                const emojiRegex = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu;
                const unicodeemojitest = emojiRegex.test(emojiinput)
                if(unicodeemojitest === false )
                return interaction.reply({
                    content:`表情符號有誤，請重新確認。 \n\n表情符號: ${emojiinput} \n頻道：${channel} \n頻道ID： ${channelID} \n訊息ID：${msgID}`,
                    ephemeral: true,
                });
            };


            const msgremover = async () => {
                const msgdocres = await msgdoc.get();

                if(!msgdocres.exists){
                    return console.log(`There is no such Reaction Role data.(Channel) Emoji: ${emojiargs}, at channel name:${channelname}, CH ID:${channelID}`);
                };

                if(msgdocres.exists){
                    if(emoji === undefined){
                        const handledelete1 = async () => {
                            const roleID = msgdocres.data()[emojiinput]
                            if(roleID === undefined){
                                return interaction.reply({ 
                                    content: `找不到相關的身分組資料。 \n\n表情符號: ${emojiinput} \n身分組：<@&${roleID}> \n頻道：${channelname} \n頻道:${channel} \n訊息ID：${msgID}`,
                                    ephemeral: true,
                                });
                            } else {
                                await msgdoc.update({
                                    [emojiinput]: admin.firestore.FieldValue.delete()
                                }); 
                                
                                await interaction.reply({ 
                                    content: `成功從取得身分組列表中刪除身分組資料。 \n\n表情符號: ${emojiinput} \n身分組：<@&${roleID}> \n頻道：${channel} \n訊息ID：${msgID}`,
                                    ephemeral: true,
                                })
                                
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
                                return interaction.reply({ 
                                    content: `找不到相關的身分組資料。 \n\n表情符號: ${emojiinput} \n身分組：<@&${roleID}> \n頻道：${channel} \n訊息ID：${msgID}`,
                                    ephemeral: true,
                                });
                            } else {
                                await msgdoc.update({
                                    [emoji]: admin.firestore.FieldValue.delete()
                                })
                                
                                await interaction.reply({ 
                                    content: `成功從取得身分組列表中刪除身分組資料。 \n\n表情符號: ${emojiinput} \n身分組：<@&${roleID}> \n頻道：${channel} \n訊息ID：${msgID}`,
                                    ephemeral: true,
                                })
                                
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
            await msgremover();
        }
        catch (err) {
            if(err.code == 10008){
                return interaction.reply({
                    content:`訊息不存在。 \n\n訊息ID: ${msgID} \n嘗試呼叫頻道: ${channel}`,
                    ephemeral: true,
                });
            } else if (err.code == 50035){
                return interaction.reply({
                    content:`訊息ID必須要是數字。 \n\n訊息ID: ${msgID} \n嘗試呼叫頻道: ${channel}`,
                    ephemeral: true,
                });
            } else {
                return console.error('An Error occurred when trying to remove a Reaction Role: ' + err);
            }
        }
    },
};