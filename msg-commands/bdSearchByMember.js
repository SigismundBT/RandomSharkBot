module.exports = {
    prefix: "!-生日查詢(成員)",
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
            
                        const dbdocname = guildID;
                        const dbarrname = mentionMember.id
                        const birthdaydata = db.collection('BDdata').doc(dbdocname);

                        birthdaydata
                        .get()
                        .then(res => {
                            if (!res.exists){
                                msg.reply({content: 
                                    '此伺服器沒有任何生日資料' 
                                })
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 1000 *10);
                                    });
                                return  
                            } else {
                                if(res.data()[dbarrname] === undefined){
                                    msg.reply({content: 
                                        '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' + 
                                        `沒有 ${mentionMember} 的生日紀錄`
                                    })
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 1000 *10);
                                        });
                                    return
                                } else if(res.data()[dbarrname].length <= 0){
                                    msg.reply({content: 
                                        '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' + 
                                        `沒有 ${mentionMember} 的生日紀錄`
                                    })
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 1000 *10);
                                        });
                                    return
                                } else {
                                    const daterec = `${res.data()[dbarrname]}`.split('-');
                                    const monthrec = daterec[0];
                                    const dayrec = daterec[1];
    
                                    msg.reply({content: (
                                        '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                                        `${mentionMember} 的生日是 ${monthrec} 月 ${dayrec} 日`   
                                    )})
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 1000 * 60 * 1);
                                        });
                                    return 
                                }
                            }
                        })

                        .catch((err) => {
                            console.error("An error has occurred: ", err);
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