module.exports = {
    prefix: "!=RestartBot",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };
    
        try {
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

                msg.channel.send({
                    content: 
                    'This bot will be restarted.'                    
                })
                .then(() => {
                    process.exit(1);
                })
            
            } else {
                return msg.channel.send({ content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用' });
            };
        } catch (err) {
            console.error(err);
        };
    }
};