module.exports = {
    prefix: "!=ChannelList",
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
                const channeldata = db.collection('RSBChannels').doc(guildID);
                
                channeldata.get().then(res => {
                    if(res.exists){
                        const channels = res.data();

                        let welcomeCh = `<#${channels.WelcomeCh}>`;
                        let leaveCh = `<#${channels.LeaveCh}>`;
                        let roleClaimCh = `<#${channels.RoleClaimCh}>`;
                        let bdAlarmCh = `<#${channels.BDAlarmCh}>`;
                        let bdSettingCh = `<#${channels.BDSettingCh}>`;
                        
                        if (welcomeCh === '<#undefined>'){
                            welcomeCh = "尚未設定"
                        };

                        if (leaveCh === '<#undefined>'){
                            leaveCh = "尚未設定"
                        };

                        if (roleClaimCh === '<#undefined>'){
                            roleClaimCh = "尚未設定"
                        };

                        if (bdAlarmCh === '<#undefined>'){
                            bdAlarmCh = "尚未設定"
                        };

                        if (bdSettingCh === '<#undefined>'){
                            bdSettingCh = "尚未設定"
                        };

                        msg.reply({
                            content: 
                            `本伺服器的系統頻道如下： \n\n` + 
                            `**歡迎訊息頻道** **→** ${welcomeCh}\n` + 
                            `**離開訊息頻道** **→** ${leaveCh}\n` + 
                            `**身分組頻道** **→** ${roleClaimCh}\n` + 
                            `**生日通知頻道** **→** ${bdAlarmCh}\n` + 
                            `**生日設定頻道** **→** ${bdSettingCh}\n` 
                        });
                        return
                    } else {
                        msg.reply({
                            content: '本伺服器尚未設定任何頻道，或找不到資料' 
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