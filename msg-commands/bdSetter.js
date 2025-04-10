module.exports = {
    prefix: "!-設定生日",
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
                            return;
                        };


                        const args = msg.content.split(' ');
                        if (!args[2]) {
                            msg.reply({ content: '指令格式錯誤，請重新輸入'})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        };

                        const date = args[2];
                        const dateargs = date.split('-');
                        const dbmonth = Number(dateargs[0]);
                        const dbday =  Number(dateargs[1]);

                        if (!dbday) {
                            msg.reply({ content: '日期格式錯誤，請重新輸入'})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        };

                        //#region Date Filter
                        const monthsWith31days = [1,3,5,7,8,10,12];
                        const monthsWith30days = [4,6,9,11];
                        
                        if(!Number.isInteger(dbmonth) || !Number.isInteger(dbday)){
                            return msg.reply({ content: '日期格式錯誤，月份跟日期應該是整數'})
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        }

                        else if (dbmonth <= 0 || dbmonth > 12){
                            return msg.reply({ content: '月份輸入錯誤，一年有幾個月來著？'})
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        } 

                        
                        else if (monthsWith31days.includes(dbmonth) && (dbday == 0 || dbday > 31)){
                            return msg.reply({ content: `日期輸入錯誤，你輸入的月份是 ${dbmonth} 月，要不要確定一下這個月有沒有這個日子？`})
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        }
                        
                        
                        else if (monthsWith30days.includes(dbmonth) && (dbday == 0 || dbday > 30)){
                            return msg.reply({ content: `日期輸入錯誤，你輸入的月份是 ${dbmonth} 月，要不要確定一下這個月有沒有這個日子？`})
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        }


                        else if (dbmonth == 2 && (dbday == 0 || dbday > 29)){
                            return msg.reply({ content: `日期輸入錯誤，你輸入的月份是 2 月，要不要確定一下2月有沒有超過你輸入的日子？`})
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        } 

                        //#endregion
                        
                        else {
                            const dbdocname = guildID;
                            const dbarrname = mentionMember.id
                            const bdrec = (`${dbmonth}-${dbday}`)
                            const birthdaydata = db.collection('BDdata').doc(dbdocname);

                            birthdaydata
                            .get()
                            .then(res => {
                                if(res.data() === undefined){
                                    birthdaydata.set({
                                        [dbarrname]:admin.firestore.FieldValue.arrayUnion(bdrec)
                                    });
                                    
                                    msg.reply({ content: `輸入 ${mentionMember} 的生日成功，日期為: ${dbmonth} 月 ${dbday} 日`})
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 1000 *10);
                                    })

                                    return
                                    
                                } else if (res.data()[dbarrname] === undefined){
                                    birthdaydata.update({
                                        [dbarrname]:admin.firestore.FieldValue.arrayUnion(bdrec)
                                    });

                                    msg.reply({ content: `輸入 ${mentionMember} 的生日成功，日期為: ${dbmonth} 月 ${dbday} 日`})
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 1000 *10);
                                    })

                                    return
                                } else {
                                    birthdaydata.update({
                                        [dbarrname]:admin.firestore.FieldValue.delete()
                                    })

                                    .then(
                                        birthdaydata.update({
                                           [dbarrname]:admin.firestore.FieldValue.arrayUnion(bdrec)
                                        })
                                    )
                                    
                                    msg.reply({content: `${mentionMember} 已經有生日紀錄，已重新登記，日期為 ${dbmonth} 月 ${dbday} 日`})
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 1000 *10);
                                        })
                                }
                            })   
                            return
                        };
                    };
                };
            });
        } catch (err) {
            console.error(err);
        };
    }
  };