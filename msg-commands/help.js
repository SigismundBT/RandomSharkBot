module.exports = {
    prefix: "!=help",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };
        
    
        try {
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

                msg.channel.send({
                    content: 
                    '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                    '__**指令列表（管理員用）**__： \n\n' +
                    '`!=SetWelcomeMsgCH` → 設定歡迎訊息頻道 \n' +
                    '`!=SetLeaveMsgCH` → 設定離開訊息頻道 \n' +
                    '`!=SetRoleClaimCH` → 設定取得身分組頻道 \n' +
                    '`!=SetBDSetCH` → 設定生日設定指令用頻道 \n' +
                    '`!=SetBDAlarmCH` → 設定生日訊息傳送頻道 \n' +
                    '`!=ChannelList` → 系統頻道列表\n' +
                    '-\n' +
                    '`!=SetJoinRole` → 設定加入時新增身分組 \n' +
                    '`!=RemoveJoinRole` → 移除加入時新增身分組 \n' +
                    '`!=JoinRoles` → 加入時新增身分組列表 \n' +
                    '-\n' +
                    '`!=SetClaimRole` → 設定取得身分組 \n' +
                    '`!=RemoveClaimRole` → 移除取得身分組 \n' +
                    '`!=ClaimRoles` → 取得身分組列表\n' +
                    '-\n' +
                    '`!=AddWelcomeImg` → 設定歡迎圖 \n' +
                    '`!=RemoveWelcomeImg` → 移除歡迎圖 \n' +
                    '`!=WelcomeImgList` → 歡迎圖列表\n' +
                    '-\n' +
                    '`!=AddLeaveImg` → 設定離開圖 \n' +
                    '`!=RemoveLeaveImg` → 移除離開圖 \n' +
                    '`!=LeaveImgList` → 離開圖列表\n' +
                    '-\n' +
                    '`!=RestartBot` → 重新啟動這個Bot \n' +
                    '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' 
                    
                })
            
            } else {
                return msg.channel.send({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            };
        } catch (err) {
            console.error(err);
        };
    }
};